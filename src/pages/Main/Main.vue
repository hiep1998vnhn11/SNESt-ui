<template>
  <div>
    <v-container>
      <router-view :loading="loading" />
    </v-container>
    <div v-if="!$route.name.includes('messages')">
      <message-card v-if="thresh" />
      <v-btn
        class="button-navigation elevation-20"
        x-large
        outlined
        icon
        text
        @click="onOpenMessage()"
      >
        <v-icon v-text="messageIcon"></v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import AppBar from '@/components/Layout/AppBar'
import { mapActions, mapGetters } from 'vuex'
import NewMessage from '@/components/Message/NewMessage'
import MessageCard from '@/components/Message/MessageCard'
import axios from 'axios'

export default {
  components: {
    'app-bar': AppBar,
    NewMessage,
    MessageCard
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('socket', ['socket']),
    ...mapGetters('message', ['thresh']),
    messageIcon() {
      return this.$route.name === 'Home'
        ? 'mdi-pencil-circle-outline'
        : 'mdi-account-multiple-outline'
    },
    ...mapGetters('message', ['messageCards'])
  },
  data() {
    return {
      loading: false,
      error: null,
      loadingMessageCard: false
    }
  },
  methods: {
    ...mapActions('user', ['getUser']),
    ...mapActions('message', [
      'closeMessageCard',
      'newMessage',
      'setThreshCard'
    ]),
    ...mapActions('socket', ['connectSocket']),
    async fetchUser() {
      this.error = null
      this.loading = true
      try {
        await this.getUser()
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    },
    async onOpenMessage(user) {
      this.loadingMessageCard = true
      try {
        const response = await axios.post(`/v1/user/thresh/${user.id}/get`)
        if (response.data.data) {
          this.thresh = response.data.data
        } else {
          this.thresh = { user_with: user }
        }
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loadingMessageCard = false
    }
  },
  async created() {
    if (!this.currentUser) await this.fetchUser()
    if (!this.socket || this.socket.disconnected) this.connectSocket()
  }
}
</script>

<style scoped>
.card-dialog {
  position: absolute;
  z-index: 100;
}

.button-navigation {
  position: fixed;
  z-index: 9999;
  bottom: 15px;
  right: 15px;
}

.message-card_0 {
  right: 80px;
}

.message-card_1 {
  right: 425px;
}

.message-card_2 {
  right: 770px;
}

.home-navbar-right::-webkit-scrollbar {
  width: 0.25rem;
}

.home-navbar-right::-webkit-scrollbar-track {
  background: white;
}

.home-navbar-right::-webkit-scrollbar-thumb {
  background: #0077ff;
}
</style>
