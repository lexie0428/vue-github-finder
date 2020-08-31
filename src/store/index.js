import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: 'hello vuex'
  },
  mutations: {
    setMessage(state, message) {
      state.message = message
    }
  },
  actions: {
    setMessage({commit}, payload) {
      commit('setMessage', payload)
    }
  },
  getters: {
    getMessage(state) {
      return state.message
    }
  }
})
