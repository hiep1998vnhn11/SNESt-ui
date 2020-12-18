import axios from 'axios'

const state = {
  threshes: [],
  page: 1
}

const getters = {
  threshes: state => state.threshes
}

const actions = {
  async getThreshes({ commit, state }) {
    const url = '/v1/user/thresh/store'
    let params = {
      params: {
        page: state.page
      }
    }
    const response = await axios.get(url, params)
    if (response.data.data.data.length) {
      commit('SET_THRESHES', response.data.data.data)
    }
  },
  setThreshPage({ commit }) {
    commit('SET_THRESH_PAGE')
  }
}

const mutations = {
  SET_THRESHES: function(state, threshes) {
    state.page += 1
    state.threshes = [...state.threshes, ...threshes]
  },
  SET_THRESH_PAGE: function(state) {
    state.page = 1
    state.threshes = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
