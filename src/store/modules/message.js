import axios from 'axios'
const state = {
  rooms: [],
  messages: [],
  pageMessage: 1,
  messageCards: []
}

const getters = {
  rooms: state => state.rooms,
  messages: state => state.messages,
  messageCards: state => state.messageCards
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
  },
  newMessage({ commit, state }, payload) {
    if (payload.type === 'new') {
      commit('PUSH_NEW_MESSAGE_CARD')
    } else {
      commit('PUSH_USER_MESSAGE_CARD', payload.room)
    }
  },
  closeMessageCard({ commit }, index) {
    commit('CLOSE_MESSAGE_CARD', index)
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
  },
  PUSH_NEW_MESSAGE_CARD: function(state) {
    if (state.messageCards.length === 3) {
      state.messageCards.pop()
    }
    state.messageCards.unshift('new')
  },
  PUSH_USER_MESSAGE_CARD: function(state, room) {
    if (state.messageCards.length === 3) {
      state.messageCards.pop()
    }
    state.messageCards.unshift({
      type: 'room',
      room: room
    })
  },
  CLOSE_MESSAGE_CARD: function(state, index) {
    state.messageCards.splice(index, 1)
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
