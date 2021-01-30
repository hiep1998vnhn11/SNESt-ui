<template>
  <v-row>
    <v-col cols="10" md="8">
      <post-create :loading="loading_user"></post-create>
      <div class="mt-3" v-if="posts.length">
        <post-component
          class="mt-3"
          v-for="post in posts"
          :key="post.creadted"
          :post="post"
        ></post-component>
      </div>
      <div v-else>Not have</div>
      <observer @intersect="intersected"></observer>
      <v-skeleton-loader
        v-if="loading"
        class="mx-auto mt-3"
        type="card"
      ></v-skeleton-loader>
    </v-col>
    <v-col cols="2" md="4">
      <v-card class="rounded-lg" outlined>
        <v-container>
          <span class="font-weight-bold">{{ $t('Trending') }}</span>
          <div v-if="loadingTrending" class="text-center my-10">
            <v-progress-circular
              :size="50"
              :width="2"
              color="purple"
              indeterminate
            ></v-progress-circular>
          </div>
          <div v-else>
            <div
              v-for="value in Object.entries(trending)
                .slice()
                .reverse()"
              :key="value[0]"
            >
              {{ value[0] }}: {{ value[1] }}
            </div>
          </div>
        </v-container>
      </v-card>
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
  computed: {
    ...mapGetters('post', ['posts']),
    ...mapGetters('app', ['trending'])
  },
  data() {
    return {
      loading: false,
      error: null,
      loadingTrending: false,
      hiep: 'hiep'
    }
  },
  methods: {
    ...mapActions('post', ['getPost', 'setFeedPage']),
    ...mapActions('app', ['getTrending']),
    async fetTrending() {
      this.loadingTrending = true
      try {
        await this.getTrending()
      } catch (err) {
        this.error = err.response ? err.response.data.message : err.toString()
      }
      this.loadingTrending = false
    },
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
  },
  mounted() {
    this.fetTrending()
  }
}
</script>

<style></style>
