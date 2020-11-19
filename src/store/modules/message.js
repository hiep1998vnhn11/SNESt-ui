import axios from 'axios'
const state = {
  rooms: [],
  messages: [],
  pageMessage: 1
}
const getters = {
  rooms: state => state.rooms,
  messages: state => state.messages
}
const actions = {
  async getRoom({ commit }) {
    const url = '/v1/user/room/store'
    const response = await axios.get(url)
    commit('SET_ROOM', response.data.data)
  },
  async getMessage({ commit, state }, roomId) {
    const url = `/v1/user/room/${roomId}/message/get`
    const response = await axios.get(url, {
      params: {
        page: state.pageMessage
      }
    })
    const messages = response.data.data
    if (messages && messages.length) {
      commit('SET_MESSAGE', messages)
    }
  },
  async sendMessage({ commit }, message) {
    const url = `/v1/user/room/${message.roomId}/message/send`
    commit('SEND_MESSAGE', message)
    await axios.post(url, {
      content: message.content
    })
  }
}
const mutations = {
  SET_ROOM: function(state, rooms) {
    state.rooms = rooms
  },
  SET_MESSAGE: function(state, messages) {
    state.messages = messages
    state.pageMessage = state.pageMessage + 1
  },
  SET_PAGE_MESSAGE: function(state) {
    state.pageMessage = 1
    state.messages = []
  },
  SEND_MESSAGE: function(state, message) {
    state.messages.push(message)
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
