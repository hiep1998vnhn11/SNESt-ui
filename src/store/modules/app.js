import axios from 'axios'
const state = {
  mini: false,
  drawer: true,
  searchResult: []
}

const getters = {
  mini: state => state.mini,
  drawer: state => state.drawer,
  searchResult: state => state.searchResult
}

const actions = {
  setMini({ commit, state }, mini) {
    if (state.mini !== mini) commit('SET_MINI', mini)
  },
  setDrawer({ commit }, drawer) {
    if (state.drawer !== drawer) commit('SET_DRAWER', drawer)
  },
  async search({ commit, state }, payload) {
    const response = await axios.post('/v1/user/search/get', payload)
    commit('SET_SEARCH_RESULT', response.data.data)
  }
}

const mutations = {
  SET_MINI(state, mini) {
    state.mini = mini
  },
  SET_DRAWER(state, drawer) {
    state.drawer = drawer
  },
  SET_SEARCH_RESULT(state, searchResult) {
    state.searchResult = searchResult
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
