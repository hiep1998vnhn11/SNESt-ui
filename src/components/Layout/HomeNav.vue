<template>
  <div>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

    <v-navigation-drawer
      fixed
      class="grey lighten-3 mx-auto mt-14 index-3"
      width="250"
      height="90%"
      v-model="drawer"
    >
      <v-skeleton-loader
        v-if="loading"
        type="list-item-avatar, list-item@5, divider, list-item-avatar@3"
      ></v-skeleton-loader>
      <v-list v-else dense nav>
        <base-user-button
          :src="currentUser.profile_photo_path"
          :name="currentUser.name"
          avatar_outlined
          x_large
        />
        <base-user-button
          icon
          icon_name="mdi-account-multiple"
          :name="$t('common.friend')"
          icon_color="blue darken-1"
          x_large
        />
        <base-user-button
          icon
          icon_name="mdi-youtube-tv"
          name="Watch"
          icon_color="blue darken-1"
          x_large
        />
        <base-user-button
          icon
          icon_name="mdi-account-group"
          name="Group"
          icon_color="blue darken-1"
          x_large
        />
        <base-user-button
          icon
          icon_name="mdi-storefront"
          name="Store"
          icon_color="blue darken-1"
          x_large
        />
        <base-user-button
          avatar_class="grey lighten-2"
          icon
          icon_name="mdi-chevron-down"
          :name="$t('common.more')"
          x_large
        />
        <v-divider></v-divider>
        <v-card disabled class="mt-2 grey lighten-3"> Your linked </v-card>
      </v-list>
      <v-footer
        absolute
        class="grey grey--text text--darken-2 lighten-3 text-caption"
      >
        Privacys . Clauses . Advertising . More about SNESt
      </v-footer>
    </v-navigation-drawer>
    <v-navigation-drawer
      fixed
      class="grey lighten-3 mt-14 index-3"
      right
      width="250"
      height="90%"
      v-model="drawer"
    >
      <v-skeleton-loader
        v-if="loading"
        type="list-item-avatar@8, divider, list-item-avatar@3"
      ></v-skeleton-loader>
      <v-skeleton-loader
        v-else-if="loadingFriend"
        type="list-item-avatar@8, divider, list-item-avatar@3"
      ></v-skeleton-loader>
      <v-list v-else dense nav>
        <v-card-title>
          Your friend
          <v-spacer />
          <v-btn class="grey lighten-3" icon small>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-card-title>
        <v-btn
          v-for="friend in friends"
          :key="`friend id ${friend.id}`"
          x-large
          block
          text
          class="rounded-md text-capitalize text-body-2 font-weight-bold"
          @click="$emit('click')"
        >
          <v-badge
            bordered
            bottom
            :color="friend.user_friend.onlineStatus.status ? 'green' : 'grey'"
            dot
            offset-x="20"
            offset-y="10"
          >
            <v-avatar size="40" class="avatar-outlined ml-n3 mr-3">
              <img :src="friend.user_friend.profile_photo_path" />
            </v-avatar>
          </v-badge>
          <span>
            {{ friend.user_friend.name }}
          </span>
          <v-spacer></v-spacer>
        </v-btn>
        <v-divider />
        <v-container class="font-weight-black grey--text text--darken-2">
          {{ $t('Chat') }}
        </v-container>
        <v-btn
          v-for="room in rooms"
          :key="`room id ${room.id}`"
          x-large
          block
          text
          class="rounded-md text-capitalize text-body-2 font-weight-bold"
          @click="selectedMessage = room.id"
        >
          <v-badge
            bordered
            bottom
            :color="room.user_with.onlineStatus.status ? 'green' : 'grey'"
            dot
            offset-x="20"
            offset-y="10"
          >
            <v-avatar size="40" class="avatar-outlined ml-n3 mr-3">
              <img :src="room.user_with.profile_photo_path" />
            </v-avatar>
          </v-badge>
          <span>
            {{ room.user_with.name }}
          </span>
          <v-spacer></v-spacer>
        </v-btn>
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
    <message-card
      v-if="!!selectedMessage"
      :room-id="selectedMessage"
      @on-close="selectedMessage = null"
      :onlineStatus="rooms[0].user_with.onlineStatus"
    />
  </div>
</template>

<script>
import Footer from './LoginFooter'
import { mapGetters, mapActions } from 'vuex'
import MessageCard from '@/components/Message/MessageCard'

export default {
  computed: {
    ...mapGetters('user', ['currentUser', 'friends']),
    ...mapGetters('message', ['rooms'])
  },
  props: ['loading'],
  data() {
    return {
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' }
      ],
      right: null,
      drawer: true,
      loadingFriend: false,
      error: null,
      selectedMessage: null
    }
  },
  components: {
    'nav-left-footer': Footer,
    MessageCard
  },
  methods: {
    ...mapActions('user', ['getFriend']),
    ...mapActions('message', ['getRoom']),
    async fetchData() {
      this.loadingFriend = true
      this.error = null
      try {
        await this.getFriend()
        await this.getRoom()
      } catch (err) {
        this.error = err.toString()
      }
      this.loadingFriend = false
    }
  },
  mounted() {
    setInterval(async function() {
      await this.fetchData
    }, 180000)
  }
}
</script>

<style>
.index-3 {
  z-index: 3;
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
</style>
