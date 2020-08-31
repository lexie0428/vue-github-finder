<template>
  <div class="wrapper-content wrapper-content--fixed">
    <section>
      <div class="container">
        <!-- erorrs -->
        <div class="error" v-if="error" style="margin-bottom: 20px;">
          <p>{{ error }}</p>
        </div>

        <!-- search -->
        <search :value="search" placeholder="Type username..." @search="search = $event" />

        <!-- buttons -->
        <button v-if="!repos" class="btn btnPrimary" @click="getInfo">Search!</button>
        <button v-else class="btn btnPrimary" @click="getInfo">Search Again!</button>

        <!-- wrapper -->
        <div class="user__wrapper" v-if="user">
          <!-- item -->
          <div class="user-info">
            <div class="user-main">
              <img :src="user.avatar_url" alt="avatar" style="width:70px; height:70px" />
              <a class="link" target="_blank" :href="user.html_url">{{ user.name }}</a>
            </div>
            <span>Number of repositories: {{ user.public_repos }}</span>
          </div>
        </div>

        <div class="repos__wrapper" v-if="repos">
          <!-- item -->
          <div class="sort">
            <span @click="sort('name')">Name &#8595;</span>
            <span @click="sort('stargazers_count')">Stars &#8595;</span>
          </div>
          <div class="repos-item" v-for="repo in reposSort" :key="repo.id">
            <div class="repos-info">
              <a class="link" target="_blank" :href="repo.html_url">{{ repo.name }}</a>
              <span>{{ repo.stargazers_count }} ⭐</span>
            </div>
          </div>

          <!-- //buttons -->
          <section>
            <div class="container">
              <div class="button-list">
                <div class="btn btnPrimary" @click="prevPage">&#8592;</div>
                <div class="btn btnPrimary" @click="nextPage">&#8594;</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import search from "@/components/Search.vue";
import axios from "axios";
export default {
  components: { search },
  data() {
    return {
      search: "",
      error: null,
      repos: null,
      user: null,
      currentSort: null,
      currentSortDir: null,
      page: {
        current: 1,
        length: 5
      }
    };
  },
  computed: {
    reposSort() {
      return this.repos.sort((a, b) => {
        let mod = 1;
        if (this.currentSortDir === "desc") mod = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * mod;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * mod;
        return 0;
      })
      .filter((row, index) => {
        let start = (this.page.current - 1) * this.page.length;
        let end = this.page.current * this.page.length;
        if (index >= start && index < end) return true;
      });
    }
  },
  methods: {
    getInfo() {
      Promise.all([this.getUser(), this.getRepos()]);
    },
    getUser() {
      axios
        .get(`https://api.github.com/users/${this.search}`)
        .then(res => {
          // console.log(res.data);
          this.user = res.data;
        })
        .catch(err => {
          console.log(err);
          this.user = null;
        });
    },
    getRepos() {
      axios
        .get(`https://api.github.com/users/${this.search}/repos`)
        .then(res => {
          this.error = null;
          this.repos = res.data;
        })
        .catch(err => {
          console.log(err);
          this.repos = null;
          this.error = "Can`t find this user";
        });
    },
    sort(e) {
      if (e === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = e;
    },
    //Pagination
    prevPage() {
      if (this.page.current > 1) this.page.current -= 1;
    },
    nextPage() {
      if (this.page.current * this.page.length < this.repos.length) this.page.current += 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
}
button {
  margin-top: 40px;
}
.sort {
  display: flex;
  justify-content: space-between;
  width: 400px;
  & span:hover {
    color: rgb(62, 83, 175);
  }
}
.repos__wrapper {
  width: 400px;
  margin: 30px 0;
}
.repos-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #dbdbdb;
}
.user__wrapper {
  margin-top: 35px;
}
.user-info {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 400px;
  align-items: center;
  & span {
    margin-top: 15px;
  }
}
.user-main {
  display: flex;
  justify-content: space-around;
  width: 400px;
  text-align: center;
}
.button-list div {
  margin: 0 15px;
}
</style>
