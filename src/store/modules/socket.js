import { io } from 'socket.io-client'

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
    socket.on('receiptMessage', ({ userId, message }) => {
      console.log(`received an message: ${message} from ${userId}`)
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
