<template>
  <v-main class="grey lighten-3">
    <app-bar :loading="loading" :error="error"></app-bar>
    {{ error }}
    <v-container>
      <router-view :loading="loading" />
    </v-container>
    <div v-if="!$route.name.includes('Message')">
      <div v-for="(card, index) in messageCards" :key="`message-card-${index}`">
        <new-message
          v-if="card && card === 'new'"
          :location="index"
          @click-user="onOpenMessage"
        />
        <message-card
          v-else
          :location="index"
          :roomId="card.room.id"
          :user="card.room.user_with"
        />
      </div>
      <v-btn
        class="button-navigation white elevation-20"
        x-large
        icon
        text
        @click="openNewMessageCard"
      >
        <v-icon color="black" v-text="messageIcon"></v-icon>
      </v-btn>
    </div>
  </v-main>
</template>

<script>
import AppBar from '@/components/Layout/AppBar'
import { mapActions, mapGetters } from 'vuex'
import NewMessage from '@/components/Message/NewMessage'
import MessageCard from '@/components/Message/MessageCard'
import Axios from 'axios'

export default {
  components: {
    'app-bar': AppBar,
    NewMessage,
    MessageCard
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('socket', ['socket']),
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
    ...mapActions('message', ['closeMessageCard', 'newMessage']),
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
    openNewMessageCard() {
      if (this.messageCards.indexOf('new') === -1) {
        this.newMessage({ type: 'new' })
      }
    },
    async onOpenMessage(friend) {
      this.loadingMessageCard = true
      try {
        let response = await Axios.get(`/v1/user/room/${friend.friend_id}/get`)
        if (response.data.data) {
          this.newMessage({ room: response.data.data })
        } else {
          this.newMessage({
            room: {
              user_with: friend.user_friend
            }
          })
        }
      } catch (err) {
        this.error = err.toString()
      }
      this.loadingMessageCard = false
    },
    openNewRoomCard() {},
    openRoomCard() {}
  },
  async created() {
    if (!this.currentUser) await this.fetchUser()
    if (!this.socket) this.connectSocket()
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
