import axios from 'axios'
import app from '@/main'

const state = {
  rooms: [],
  messages: [],
  pageMessage: 1,
  messageCards: [],
  messageCard1: [],
  messageCard2: [],
  messageCard3: []
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
    const url = `/v1/user/thresh/${roomId}/message/get`
    const response = await axios.get(url, {
      params: {
        page: state.pageMessage,
        limit: 25
      }
    })
    const messages = response.data.data.data
    if (messages && messages.length) {
      commit('SET_MESSAGE', messages)
    }
  },
  async sendMessage({ commit }, message) {
    const url = `/v1/user/thresh/${message.thresh_id}/message/send`
    commit('SEND_MESSAGE', message)
    commit('thresh/SEND_MESSAGE', message, { root: true })
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
  },
  setDefaultMessage({ commit }) {
    commit('SET_DEFAULT_MESSAGE')
  },
  setMessagePage({ commit }) {
    commit('SET_PAGE_MESSAGE')
  }
}
const mutations = {
  SET_ROOM: function(state, rooms) {
    state.rooms = rooms
  },
  SET_MESSAGE: function(state, messages) {
    state.messages = [...state.messages, ...messages]
    state.pageMessage = state.pageMessage + 1
  },
  SET_PAGE_MESSAGE: function(state) {
    state.pageMessage = 1
    state.messages = []
  },
  SEND_MESSAGE: function(state, message) {
    state.messages.unshift(message)
  },
  PUSH_NEW_MESSAGE_CARD: function(state) {
    if (state.messageCards.length === 3) {
      state.messageCards.pop()
    }
    state.messageCards.unshift('new')
  },
  PUSH_USER_MESSAGE_CARD: function(state, room) {
    // console.log(card)
    const card = { type: 'room', room: room }
    // if (state.messageCards.find(card)) return
    if (state.messageCards.length === 3) {
      state.messageCards.pop()
    }
    state.messageCards.unshift(card)
  },
  CLOSE_MESSAGE_CARD: function(state, index) {
    state.messageCards.splice(index, 1)
  },
  SET_DEFAULT_MESSAGE: function(state) {
    state.messages = []
    state.pageMessage = 1
  },
  /*
    When user received an message on socket server,
    params:
      message:  Object {id, content, thresh_id, user_id}
  */
  RECEIVED_MESSAGE: function(state, message) {
    if (app.$route.params.room_id === message.thresh_id) {
      state.messages.unshift(message)
    }
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
