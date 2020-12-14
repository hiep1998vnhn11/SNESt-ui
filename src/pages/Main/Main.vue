<template>
  <v-main class="grey lighten-3">
    <app-bar :loading="loading" :error="error"></app-bar>
    <v-container>
      <router-view :loading="loading" />
    </v-container>
    <new-message />
    <v-btn class="button-navigation white elevation-20" x-large icon text>
      <v-icon color="black" v-text="messageIcon"></v-icon>
    </v-btn>
  </v-main>
</template>

<script>
import AppBar from '@/components/Layout/AppBar'
import { mapActions, mapGetters } from 'vuex'
import NewMessage from '@/components/Message/NewMessage'

export default {
  components: {
    'app-bar': AppBar,
    NewMessage
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    messageIcon() {
      return this.$route.name === 'Home'
        ? 'mdi-pencil-circle-outline'
        : 'mdi-account-multiple-outline'
    }
  },
  data() {
    return {
      loading: false,
      error: null
    }
  },
  methods: {
    ...mapActions('user', ['getUser']),
    async fetchUser() {
      this.error = null
      this.loading = true
      try {
        await this.getUser()
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    }
  },
  created() {
    if (!this.currentUser) this.fetchUser()
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
</style>
