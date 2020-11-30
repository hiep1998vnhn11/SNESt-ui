<template>
  <div>
    <v-app-bar height="56" app class="elevation-1 hidden-xs-only">
      <v-card
        width="300"
        :class="`elevation-${searchSelected ? 5 : 0} ml-n4`"
        style="position: absolute; top: 0px; z-index: 100"
        v-click-outside="{
          handler: onClickOutsideWithConditional,
          closeConditional,
        }"
      >
        <v-app-bar height="56" class="elevation-0">
          <router-link to="/" v-if="!searchSelected">
            <img src="@/assets/logo.png" width="40" height="40" />
          </router-link>
          <v-btn icon v-else @click="searchSelected = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-text-field
            class="elevation-0 grey lighten-3 ml-2"
            rounded
            hide-details
            :label="$t('Search')"
            v-model="searchKey"
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
      <v-card width="300"></v-card>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            x-large
            :to="{ name: 'Home' }"
            v-bind="attrs"
            v-on="on"
            active-class="primary--text"
            class="mr-2"
            exact
          >
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            x-large
            :to="{ name: 'Watch' }"
            v-bind="attrs"
            v-on="on"
            active-class="primary--text"
            class="mr-2"
          >
            <v-icon>mdi-youtube-tv</v-icon>
          </v-btn>
        </template>
        <span>Watch</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            x-large
            :to="{ name: 'Game' }"
            v-bind="attrs"
            v-on="on"
            active-class="primary--text"
            class="mr-2"
          >
            <v-icon>mdi-facebook-gaming</v-icon>
          </v-btn>
        </template>
        <span>Game</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            x-large
            :to="{ name: 'Store' }"
            v-bind="attrs"
            v-on="on"
            active-class="primary--text"
            class="mr-2"
          >
            <v-icon>mdi-storefront</v-icon>
          </v-btn>
        </template>
        <span>Store</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            x-large
            :to="{ name: 'Group' }"
            v-bind="attrs"
            v-on="on"
            active-class="primary--text"
            class="mr-2"
          >
            <v-icon>mdi-account-group</v-icon>
          </v-btn>
        </template>
        <span>Group</span>
      </v-tooltip>
      <v-spacer />
      <v-tooltip bottom v-if="!loading">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :to="{ name: 'MainProfile', params: { url: currentUser.url } }"
            class="rounded-pill text-capitalize font-weight-bold"
            v-bind="attrs"
            v-on="on"
            active-class="primary--text light-blue lighten-5"
            height="32"
            elevation="0"
          >
            <v-avatar size="30" class="avatar-button mr-n3">
              <img :src="currentUser.profile_photo_path" />
            </v-avatar>
            <span class="mr-n1">
              {{ currentUser.name | onlyName }}
            </span>
          </v-btn>
        </template>
        <span>{{ currentUser.name }}</span>
      </v-tooltip>

      <create-button />
      <message-button />
      <notification-button />
      <setting-button />
    </v-app-bar>

    <v-app-bar height="56" app class="elevation-1 hidden-sm-and-up">
      <v-spacer />
      <create-button />
      <message-button />
      <notification-button />
      <setting-button />
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateButton from '@/components/Button/CreateButton'
import MessageButton from '@/components/Button/MessageButton'
import NotificationButton from '@/components/Button/NotificationButton'
import SettingButton from '@/components/Button/SettingButton'

export default {
  components: {
    'create-button': CreateButton,
    MessageButton,
    NotificationButton,
    SettingButton
  },
  props: ['loading', 'error'],
  data() {
    return {
      langs: [
        {
          text: 'Tiếng Việt',
          value: 'vi'
        },
        {
          text: 'English',
          value: 'en'
        },
        {
          text: '日本語',
          value: 'ja'
        }
      ],
      searchKey: '',
      searchSelected: false,
      menu: false
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'currentUser'])
  },
  methods: {
    ...mapActions('user', ['logout']),
    onClickOutsideWithConditional() {
      this.searchSelected = false
    },
    closeConditional(e) {
      return this.searchSelected
    }
  }
}
</script>

<style scoped>
.avatar-button {
  left: -14px;
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}

.nav-icon {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
  margin-left: 10px;
}
</style>
