<template>
  <v-app id="inspire">
    <!-- <v-app-bar fixed :class="classes" flat height="56" outlined>
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
    </v-app-bar> -->
    <v-navigation-drawer
      v-model="drawer"
      width="350"
      fixed
      class="mt-14"
      :mini-variant="mini"
      mini-variant-width="80"
      disable-resize-watcher
    >
      <template v-slot:prepend>
        <v-toolbar class="font-weight-black elevation-0" v-if="!mini">
          Message
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined icon text class="mr-3" v-bind="attrs" v-on="on">
                <v-icon>mdi-cog-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('common.setting') }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined icon text v-bind="attrs" v-on="on">
                <v-icon>mdi-lead-pencil</v-icon>
              </v-btn>
            </template>
            <span>New message</span>
          </v-tooltip>
          <v-btn class="ml-3" icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar v-else>
          <v-btn x-large class="mx-auto" icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar class="elevation-0">
          <v-text-field
            v-model="search"
            rounded
            class="grey lighten-3"
            label="Search"
            single-line
            hide-details
            large
          >
            <template v-slot:prepend-inner>
              <v-icon class="ml-n4">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </v-toolbar>
        <v-divider />
      </template>
      <v-list v-if="currentUser && !loading">
        <template v-for="room in threshes">
          <v-hover v-slot:default="{ hover }" :key="`room-${room.id}`">
            <v-list-item
              link
              :to="{ name: 'MessageRoom', params: { room_id: room.id } }"
              active-class="blue--text"
            >
              <template v-if="room.type === 'private'">
                <v-list-item-icon>
                  <v-avatar class="avatar-outlined">
                    <img :src="currentUser.profile_photo_path" />
                  </v-avatar>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold text-capitalize black--text"
                  >
                    {{ currentUser.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ currentUser.name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
              <template v-else-if="room.type === 'with'">
                <v-list-item-icon>
                  <v-avatar class="avatar-outlined">
                    <template v-for="participant in room.participants">
                      <img
                        :key="`avatar-${participant.id}`"
                        v-if="participant.user_id !== currentUser.id"
                        :src="participant.user.profile_photo_path"
                      />
                    </template>
                  </v-avatar>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold black--text"
                    v-for="participant in room.participants"
                    :key="`name-${participant.id}`"
                  >
                    <span v-if="participant.user_id !== currentUser.id">
                      {{ participant.user.name }}
                    </span>
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-btn
                icon
                text
                outlined
                v-show="hover"
                @click="onClickOption(room.id)"
                style="position: fixed; right: 10px; z-index: 100"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </v-list-item>
          </v-hover>
        </template>
      </v-list>
      <div v-else class="text-center">
        <v-progress-circular
          :size="70"
          :width="3"
          color="purple"
          indeterminate
          class="mt-10"
        ></v-progress-circular>
      </div>
      <observer @intersect="intersected"></observer>
    </v-navigation-drawer>

    <!-- <v-navigation-drawer
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
    </v-navigation-drawer> -->

    <v-main class="grey ml-n13">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MessageNav from '@/components/Layout/MessageNav'
import { mapActions, mapGetters } from 'vuex'
import Observer from '@/components/Observer'

export default {
  components: {
    'nav-bar': MessageNav,
    Observer
  },
  mounted() {
    if (!this.threshes.length) this.fetchThresh()
  },
  data() {
    return {
      cards: ['Today', 'Yesterday'],
      drawer: true,
      loading: false,
      error: null,
      links: [],
      search: '',
      loadingSearch: false,
      selectSearch: false,
      mini: false
    }
  },
  computed: {
    ...mapGetters('message', ['rooms', 'messages']),
    ...mapGetters('thresh', ['threshes']),
    ...mapGetters('user', ['currentUser']),
    classes() {
      return this.mini ? 'ml-0 mt-14' : 'ml-350 mt-14'
    },
    classBottom() {
      return this.mini ? 'ml-80 mr-0' : 'ml-350 mr-300'
    },
    breakPoint() {
      return this.$vuetify.breakpoint.name
    },
    avatarUrl(participants) {
      return participants.forEach(
        participant => participant.user_id !== this.currentUser.id
      ).user.profile_photo_path
    }
  },
  methods: {
    ...mapActions('message', ['getRoom', 'getMessage']),
    ...mapActions('thresh', ['getThreshes', 'setThreshPage']),
    async fetchThresh() {
      this.loading = true
      this.error = null
      try {
        await this.getThreshes()
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loading = false
    },
    onClickOption(roomId) {
      console.log(roomId)
    },
    intersected() {
      this.fetchThresh()
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
  z-index: 100;
}

.navleft-body {
  position: relative;
}

.navleft-body::-webkit-scrollbar {
  width: 0.25rem;
}

.navleft-body::-webkit-scrollbar-track {
  background: white;
}

.navleft-body::-webkit-scrollbar-thumb {
  background: #0077ff;
}
</style>
