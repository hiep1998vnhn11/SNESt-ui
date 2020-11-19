<template>
  <div>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

    <v-navigation-drawer
      fixed
      class="grey lighten-3 mt-16 index-3"
      width="250"
      height="90%"
      v-model="drawer"
    >
      <v-skeleton-loader
        v-if="loading"
        type="list-item-avatar@8, divider, list-item-avatar@3"
      ></v-skeleton-loader>
      <v-list v-else dense nav>
        <base-user-button
          v-for="n in 20"
          :key="n"
          :src="currentUser.profile_photo_path"
          :name="currentUser.name"
          avatar_outlined
          x_large
        />
        <v-divider></v-divider>
        <v-container class="font-weight-black grey--text text--darken-2">
          {{ $t('Group chat') }}
        </v-container>
        <base-user-button
          v-for="n in 5"
          :key="n + 100"
          :src="currentUser.profile_photo_path"
          name="Group name"
          avatar_outlined
          x_large
        />
        <base-user-button
          icon
          avatar_class="grey lighten-1"
          icon_name="mdi-plus"
          :name="$t('Create a new group')"
          avatar_outlined
          x_large
        />
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Footer from './LoginFooter'
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters('user', ['currentUser']),
  props: ['loading'],
  data() {
    return {
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' }
      ],
      right: null,
      drawer: true
    }
  },
  components: {
    'nav-left-footer': Footer
  }
}
</script>

<style>
.index-3 {
  z-index: 3;
}
</style>
