<template>
  <v-row>
    <v-col cols="12" md="5">
      <base-user-info v-if="!!user && !!currentUser" :user="user" />
      <base-user-friend v-if="user" :user="user"></base-user-friend>
    </v-col>
    <v-col cols="12" md="7">
      <create-post
        v-if="!!user && !!currentUser && user.id === currentUser.id"
        class="mt-3"
      ></create-post>
      <post-component
        class="mt-3"
        v-for="post in userPost"
        :key="post.id"
        :post="post"
      ></post-component>
      <v-skeleton-loader
        v-if="loading"
        class="mx-auto mt-3"
        type="card"
      ></v-skeleton-loader>
      <observer @intersect="intersected"></observer>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PostComponent from '@/components/Post/PostComponent'
import CreatePost from '@/components/Post/CreatePost'
import Observer from '@/components/Observer'
export default {
  components: {
    PostComponent,
    CreatePost,
    Observer
  },
  props: ['user'],
  computed: {
    ...mapGetters('post', ['userPost']),
    ...mapGetters('user', ['currentUser'])
  },
  data() {
    return {
      loading: true,
      error: null,
      posts: null,
      observer: null,
      page: 1
    }
  },
  methods: {
    ...mapActions('post', ['getUserPost', 'setPage']),
    async fetchData() {
      const userUrl = this.$route.params.url
      let payload = {
        user_url: userUrl
      }
      this.error = null
      this.loading = true
      try {
        this.getUserPost(payload)
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    },
    intersected() {
      this.fetchData()
    }
  },
  watch: {
    '$route.params': function() {
      this.setPage()
    }
  }
}
</script>

<style scoped></style>
