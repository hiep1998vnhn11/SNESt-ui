<template>
  <div v-if="loading">
    <v-skeleton-loader> </v-skeleton-loader>
  </div>
  <div v-else>
    {{ messages }}
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  mounted() {
    this.fetchData()
  },
  methods: {
    ...mapActions('message', ['getMessage']),
    async fetchData() {
      this.loading = true
      try {
        await this.getMessage(this.$route.params.room_id)
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('message', ['messages'])
  },
  data() {
    return {
      loading: false,
      error: null
    }
  }
}
</script>

<style></style>
