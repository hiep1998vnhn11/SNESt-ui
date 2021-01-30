<template>
  <v-fade-transition>
    <v-app id="inspire">
      <v-app-bar height="56" clipped-left fixed app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-switch v-model="$vuetify.theme.dark" inset class="mt-6"></v-switch>
        <v-spacer />
        <search-card />
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
        <button-setting v-if="currentUser" />
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        v-if="currentUser"
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
                active-class="primary--text"
              >
                <v-icon>mdi-home</v-icon>
              </v-btn>
              <button-message />
              <button-notification />
            </v-row>
          </v-sheet>
        </template>
        <v-skeleton-loader
          v-if="loading"
          type="list-item-avatar, list-item@5, divider, list-item-avatar@3"
        />
        <!-- Search temblade -->
        <v-container v-else-if="$route.name.includes('search')">
          <v-btn
            v-for="item in searchLink"
            :key="`search-link-${item.text}`"
            class="text-capitalize mt-1"
            large
            block
            text
            active-class="primary--text"
            :to="{ name: item.name, query: $route.query }"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-btn>
        </v-container>

        <!-- Default temblade -->
        <div v-else>
          <v-list nav dense>
            <!-- Contact Group -->
            <v-list-group :value="true" prepend-icon="mdi-account">
              <template v-slot:activator>
                <v-list-item-title v-text="$t('Contact')"></v-list-item-title>
              </template>

              <v-list-item
                v-for="friend in friends"
                :key="`friend-id-${friend.id}`"
                link
                two-line
                @click="onClickFriend(friend.user_friend)"
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

            <!-- Shortcut Group -->
            <v-list-group :value="false" prepend-icon="mdi-bookmark-multiple">
              <template v-slot:activator>
                <v-list-item-title v-text="$t('Shortcuts')"></v-list-item-title>
              </template>
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
import SearchCard from '@/components/Search/Search'

export default {
  name: 'App',
  components: {
    'button-create': CreateButton,
    'button-message': MessageButton,
    'button-notification': NotificationButton,
    'button-setting': SettingButton,
    ShowTabButton,
    SearchCard
  },
  data() {
    const _this = this
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
      searchLink: [
        {
          icon: 'mdi-dock-top',
          text: _this.$t('All'),
          name: 'search-top'
        },
        {
          icon: 'mdi-dock-top',
          text: _this.$t('Posts'),
          name: 'search-posts'
        },
        {
          icon: 'mdi-dock-top',
          text: _this.$t('People'),
          name: 'search-people'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      loading: false,
      error: null,
      mini: false
    }
  },
  mounted() {
    if (this.isloggedIn && !this.friends.length) this.fetchData()
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
    ...mapActions('message', ['setThreshCard']),
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
    async onClickFriend(user) {
      try {
        await this.setThreshCard(user)
      } catch (err) {
        console.log(err.response.data.message)
      }
    }
  }
}
</script>

<style>
#inspire {
  font-family: 'Nunito', Times, serif;
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

.row-divider-vertical {
  margin: 0 -0.5px;
}
</style>
