<template>
  <div>
    <v-app-bar height="56" app fixed v-if="loading">
      <v-skeleton-loader
        max-height="56"
        width="100%"
        type="table-row"
      ></v-skeleton-loader>
    </v-app-bar>
    <v-app-bar height="56" app v-else>
      <v-col cols="3">
        <v-text-field
          flat
          clearable
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
          v-model="searchKey"
        />
      </v-col>
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
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :to="{ name: 'MainProfile', params: { url: currentUser.url } }"
            class="rounded-pill text-capitalize font-weight-bold"
            v-bind="attrs"
            v-on="on"
            active-class="primary--text light-blue lighten-5"
            height="32"
          >
            <v-avatar size="30" class="avatar-button">
              <img :src="currentUser.profile_photo_path" />
            </v-avatar>
            {{ currentUser.name }}
          </v-btn>
        </template>
        <span>{{ currentUser.name }}</span>
      </v-tooltip>

      <create-button />
      <message-button />
      <notification-button />
      <setting-button />
    </v-app-bar>
    <v-divider />
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
      menu: false
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'currentUser'])
  },
  methods: {
    ...mapActions('user', ['logout'])
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
