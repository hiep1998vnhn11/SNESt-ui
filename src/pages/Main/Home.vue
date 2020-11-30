<template>
  <div>
    <home-nav :loading="loading"></home-nav>
    <main-feed :loading_user="loading"></main-feed>
  </div>
</template>

<script>
import AppBar from '@/components/Layout/AppBar'
import LoginFooter from '@/components/Layout/LoginFooter'
import { mapActions, mapGetters } from 'vuex'
import HomeNav from '@/components/Layout/HomeNav'
import Feed from '@/components/Main/Feed'
export default {
  components: {
    'app-bar': AppBar,
    'app-footer': LoginFooter,
    'home-nav': HomeNav,
    'main-feed': Feed
  },
  computed: mapGetters('user', ['currentUser']),
  props: ['loading'],
  data() {
    return {
      tabs: null,
      drawer: true
    }
  },
  methods: {
    ...mapActions('user', ['getUser'])
  }
}
</script>

<style></style>
