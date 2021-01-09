<template>
  <div>
    <message-card
      v-if="!!selectedMessage"
      :room-id="selectedMessage"
      @on-close="selectedMessage = null"
      :onlineStatus="rooms[0].user_with.online_status"
    />
  </div>
</template>

<script>
import Footer from './LoginFooter'
import { mapGetters, mapActions } from 'vuex'
import MessageCard from '@/components/Message/MessageCard'
import CreateButton from '@/components/Button/CreateButton'
import MessageButton from '@/components/Button/MessageButton'
import NotificationButton from '@/components/Button/NotificationButton'
import SettingButton from '@/components/Button/SettingButton'
import ShowTabButton from '@/components/Button/ShowTabButton'
export default {
  computed: {
    ...mapGetters('user', ['currentUser', 'friends']),
    ...mapGetters('message', ['rooms']),
    ...mapGetters('app', ['mini', 'drawer'])
  },
  props: ['loading'],
  data() {
    return {
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' }
      ],
      right: null,
      loadingFriend: false,
      error: null,
      selectedMessage: null
    }
  },
  components: {
    'nav-left-footer': Footer,
    MessageCard,
    'button-create': CreateButton,
    'button-message': MessageButton,
    'button-notification': NotificationButton,
    'button-setting': SettingButton,
    ShowTabButton
  },
  methods: {
    ...mapActions('user', ['getFriend']),
    ...mapActions('message', ['getRoom']),
    async fetchData() {
      this.loadingFriend = true
      this.error = null
      try {
        await this.getFriend()
        await this.getRoom()
      } catch (err) {
        this.error = err.toString()
      }
      this.loadingFriend = false
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style>
.index-3 {
  z-index: 3;
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
