<template>
  <v-app id="inspire">
    <v-app-bar fixed :class="classes" flat height="56" outlined>
      <v-btn @click="drawer = !drawer">Test</v-btn>
      {{ breakPoint }}
      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field
          dense
          flat
          hide-details
          rounded
          solo-inverted
        ></v-text-field>
      </v-responsive>
    </v-app-bar>

    <v-app-bar bottom fixed :class="classBottom" flat height="56" outlined>
      <v-btn @click="drawer = !drawer">Test</v-btn>
      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field
          dense
          flat
          hide-details
          rounded
          solo-inverted
        ></v-text-field>
      </v-responsive>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      width="350"
      fixed
      class="mt-14"
      :mini-variant="breakPoint === 'xs'"
      mini-variant-width="80"
      disable-resize-watcher
    >
      <v-card-title class="font-weight-black navleft-header">
        Message
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined icon text class="mr-3">
              <v-icon v-bind="attrs" v-on="on">mdi-cog-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('common.setting') }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined icon text>
              <v-icon v-bind="attrs" v-on="on">
                mdi-pencil-circle-outline
              </v-icon>
            </v-btn>
          </template>
          <span>New message</span>
        </v-tooltip>
      </v-card-title>
      <v-divider></v-divider>

      <v-skeleton-loader
        v-if="loading"
        v-bind="attrs"
        type="list-item-avatar@3"
        class="mt-16"
      ></v-skeleton-loader>
      <v-list class="mt-13">
        <v-list-item
          v-for="room in rooms"
          :key="`room-${room.id}`"
          link
          :to="{ name: 'Room', params: { room_id: room.id } }"
          active-class="primary--text"
        >
          <v-list-item-icon>
            <v-avatar class="avatar-outlined">
              <v-img :src="room.user_with.profile_photo_path" />
            </v-avatar>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="font-weight-bold text-capitalize">{{
              room.user_with.name
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="drawer"
      fixed
      class="mt-112 index-3"
      width="300"
      right
    >
      <v-list>
        <v-list-item v-for="n in 50" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="grey">
      <v-container fluid>
        <v-row>
          <v-col cols="2" md="1" class="yellow">
            <v-card
              v-if="!drawer"
              width="70"
              height="80%"
              class="fixed-avatar-card mt-n10 scroll-avatar-card ml-n6"
              tile
            >
              <v-card-title class="fixed-avatar-card white lighten-3">
                <v-btn icon class="grey lighten-2">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="mt-14">
                hiep
                <a v-for="n in 45" :key="`asd-${n}`"> 123123 </a>
                <a>bottm</a>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="10" md="10" class="ml-6 mt-2">
            <v-card tile class="mt-n10">
              <router-view />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MessageNav from '@/components/Layout/MessageNav'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    'nav-bar': MessageNav
  },
  mounted() {
    if (!this.rooms.length) this.fetchRoom()
  },
  data() {
    return {
      cards: ['Today', 'Yesterday'],
      drawer: true,
      loading: false,
      error: null,
      links: []
    }
  },
  computed: {
    ...mapGetters('message', ['rooms', 'messages']),
    classes() {
      return this.drawer ? 'ml-350 mt-14' : 'ml-0 mt-14'
    },
    classBottom() {
      return this.drawer ? 'ml-350 mr-300' : 'ml-80 mr-0'
    },
    breakPoint() {
      return this.$vuetify.breakpoint.name
    }
  },
  methods: {
    ...mapActions('message', ['getRoom', 'getMessage']),
    async fetchRoom() {
      this.loading = true
      this.error = null
      try {
        await this.getRoom()
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    }
  }
}
</script>

<style>
.ml-350 {
  margin-left: 350px;
}

.mr-300 {
  margin-right: 300px;
}
.mt-112 {
  margin-top: 112px;
}
.ml-80 {
  margin-left: 70px;
}
.fixed-avatar-card {
  position: fixed;
  z-index: 3;
}
.index-100 {
  z-index: 100;
}
.scroll-avatar-card {
  overflow-y: scroll;
}

.navleft-header {
  position: fixed;
  width: 350px;
}
</style>
