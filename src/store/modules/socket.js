import { io } from 'socket.io-client'
import app from '../../main'

const state = {
  socket: null
}

const getters = {
  socket: state => state.socket
}

const actions = {
  connectSocket({ commit, rootState }) {
    const socket = io(process.env.VUE_APP_SOCKET_URL)
    socket.emit('login', rootState.user.currentUser.id)
    socket.emit('join', { userId: rootState.user.currentUser.id, roomId: 1 })
    socket.on('receiptMessage', ({ userId, roomId, message }) => {
      commit('message/RECEIVED_MESSAGE', message, { root: true })
      if (app.$route.params.room_id === roomId) {
        commit('message/SEND_MESSAGE', message, { root: true })
      }
    })
    socket.on('responseAddFriend', data => {
      commit('notification/ADD_NOTIFICATION', data, { root: true })
    })
    socket.on('acceptFriendNotification', data => {
      console.log(data)
    })
    window.socket = socket
    commit('SET_SOCKET', socket)
  },
  disconnect({ commit }) {
    commit('DISCONNECT_SOCKET')
  }
}

const mutations = {
  SET_SOCKET: function(state, socket) {
    state.socket = socket
  },
  DISCONNECT_SOCKET: function(state) {
    state.socket = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
