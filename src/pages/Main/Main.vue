<template>
  <v-main class="grey lighten-3">
    <app-bar :loading="loading" :error="error"></app-bar>
    <v-container>
      <router-view :loading="loading" />
    </v-container>
  </v-main>
</template>

<script>
import AppBar from '@/components/Layout/AppBar'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'app-bar': AppBar
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
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
</style>
