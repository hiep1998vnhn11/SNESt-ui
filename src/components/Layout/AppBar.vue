<template>
  <div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateButton from '@/components/Button/CreateButton'
import MessageButton from '@/components/Button/MessageButton'
import NotificationButton from '@/components/Button/NotificationButton'
import SettingButton from '@/components/Button/SettingButton'
import ShowTabButton from '@/components/Button/ShowTabButton'
export default {
  components: {
    'button-create': CreateButton,
    'button-message': MessageButton,
    'button-notification': NotificationButton,
    'button-setting': SettingButton,
    ShowTabButton
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      loading: false,
      error: null,
      searchKey: '',
      searchSelected: false,
      mini: false
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser', 'friends', 'isLoggedIn']),
    ...mapGetters('socket', ['socket'])
  },
  watch: {
    miniVariant(value) {
      this.setMini(value)
    },
    drawer(value) {
      this.setDrawer(value)
    }
  },
  methods: {
    ...mapActions('user', ['getUser', 'getFriend']),
    ...mapActions('app', ['setMini', 'setDrawer']),
    ...mapActions('socket', ['connectSocket']),
    async fetchData() {
      this.loading = true
      this.error = null
      try {
        await this.getUser()
        await this.getFriend()
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loading = false
    },
    onClickOutsideWithConditional() {
      this.searchSelected = false
    },
    closeConditional(e) {
      return this.searchSelected
    }
  }
}
</script>

<style>
#app {
  font-family: 'Times New Roman', Times, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#search-card-app-bar {
  position: fixed;
  top: 0px;
  left: 50%;
  z-index: 9999;
  transform: translateX(-50%);
}

.avatar-outlined {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}
</style>
