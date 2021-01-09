<template>
  <v-row>
    <v-col cols="12" md="8">
      <post-create :loading="loading_user"></post-create>
      <div class="mt-3" v-if="posts.length">
        <post-component
          class="mt-3"
          v-for="post in posts"
          :key="post.creadted"
          :post="post"
        ></post-component>
      </div>
      <observer @intersect="intersected"></observer>
      <v-skeleton-loader
        v-if="loading"
        class="mx-auto mt-3"
        type="card"
      ></v-skeleton-loader>
    </v-col>
    <v-col cols="12" md="4">
      card
    </v-col>
  </v-row>
</template>

<script>
import CreatePost from '@/components/Post/CreatePost'
import PostComponent from '@/components/Post/PostComponent'
import Observer from '@/components/Observer'

import { mapActions, mapGetters } from 'vuex'
export default {
  props: ['loading_user'],
  components: {
    'post-create': CreatePost,
    'post-component': PostComponent,
    Observer
  },
  computed: mapGetters('post', ['posts']),
  data() {
    return {
      loading: false,
      error: null
    }
  },
  methods: {
    ...mapActions('post', ['getPost', 'setFeedPage']),
    async fetchData() {
      this.error = null
      this.loading = true
      try {
        await this.getPost()
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    },
    intersected() {
      this.fetchData()
    }
  }
}
</script>

<style></style>
