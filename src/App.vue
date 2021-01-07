<template>
  <v-fade-transition>
    <v-app id="inspire">
      <v-app-bar clipped-left fixed app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-switch v-model="$vuetify.theme.dark" inset class="mt-6"></v-switch>
        <v-spacer />
        <v-card
          id="search-card-app-bar"
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          width="500"
          :class="`elevation-${searchSelected ? 5 : 0} ml-n4`"
        >
          <v-app-bar height="56" class="elevation-0">
            <v-text-field
              v-model="searchKey"
              class="elevation-0 lighten-3 ml-2"
              rounded
              hide-details
              :label="$t('Search')"
              @focus="searchSelected = true"
            >
              <template v-slot:prepend-inner class="mr-n2">
                <v-icon class="ml-n4">mdi-magnify</v-icon>
              </template>
            </v-text-field>
          </v-app-bar>
          <v-container v-if="searchSelected">
            <v-row class="mx-auto font-weight-black">
              {{ $t('Home.SearchResult') }}
            </v-row>
            {{ $t('Home.SearchNoResult') }}
          </v-container>
        </v-card>
        <v-spacer />
        <v-btn
          v-if="currentUser"
          icon
          small
          :to="{ name: 'user-url', params: { url: currentUser.url } }"
          class="mr-4"
        >
          <v-avatar size="30">
            <img :src="currentUser.profile_photo_path" />
          </v-avatar>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        clipped
        width="22rem"
        mini-variant-width="5rem"
        fixed
        app
      >
        <template v-if="currentUser" v-slot:prepend>
          <v-sheet class="pt-4 text-center">
            <v-avatar :size="miniVariant ? 35 : 64">
              <v-img :src="currentUser.profile_photo_path" />
            </v-avatar>
            <div v-show="!miniVariant" class="font-weight-bold">
              {{ currentUser.name }}
            </div>
            <v-row class="mx-auto my-4" justify="center">
              <v-btn
                class="mx-1"
                width="40"
                height="40"
                text
                to="/"
                icon
                outlined
              >
                <v-icon>mdi-home</v-icon>
              </v-btn>
              <button-message />
              <button-notification />
              <button-setting />
            </v-row>
          </v-sheet>
        </template>
        <v-skeleton-loader
          v-if="loading"
          type="list-item-avatar, list-item@5, divider, list-item-avatar@3"
        />
        <div v-else>
          <v-list nav dense>
            <v-list-group :value="true" prepend-icon="mdi-account">
              <template v-slot:activator>
                <v-list-item-title v-text="$t('Contact')"></v-list-item-title>
              </template>
              <v-list-item
                v-for="friend in friends"
                :key="`friend-id-${friend.id}`"
                link
                two-line
              >
                <v-list-item-icon>
                  <v-badge
                    v-if="friend.user_friend.online_status.status"
                    bordered
                    bottom
                    color="deep-purple accent-4"
                    dot
                    offset-x="10"
                    offset-y="-10"
                  >
                    <v-avatar size="45" class="avatar-outlined">
                      <v-img
                        :src="friend.user_friend.profile_photo_path"
                      ></v-img>
                    </v-avatar>
                  </v-badge>
                  <v-avatar v-else size="45" class="avatar-outlined">
                    <v-img :src="friend.user_friend.profile_photo_path" />
                  </v-avatar>
                </v-list-item-icon>
                <v-list-item-title
                  class="text-capitalize font-weight-bold"
                  v-text="friend.user_friend.name"
                ></v-list-item-title>
              </v-list-item>
            </v-list-group>

            <v-list-group :value="false" prepend-icon="mdi-account-group">
              <template v-slot:activator>
                <v-list-item-title v-text="$t('Groups')"></v-list-item-title>
              </template>
            </v-list-group>
          </v-list>
        </div>
      </v-navigation-drawer>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </v-fade-transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateButton from '@/components/Button/CreateButton'
import MessageButton from '@/components/Button/MessageButton'
import NotificationButton from '@/components/Button/NotificationButton'
import SettingButton from '@/components/Button/SettingButton'
import ShowTabButton from '@/components/Button/ShowTabButton'
export default {
  name: 'App',
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
  mounted() {
    if (!this.friends.length) this.fetchData()
  },
  computed: {
    ...mapGetters('user', ['currentUser', 'friends', 'isLoggedIn']),
    ...mapGetters('socket', ['socket'])
  },
  watch: {
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
#inspire {
  font-family: 'Times New Roman', Times, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

#search-card-app-bar {
  position: fixed;
  top: 0px;
  left: 50%;
  z-index: 9999;
  transform: translateX(-50%);
}
</style>
