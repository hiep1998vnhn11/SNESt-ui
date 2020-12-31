<template>
  <div v-if="participant">
    <v-app-bar fixed :class="`${classes} mt-14`" flat height="64" outlined>
      <v-badge
        bordered
        bottom
        color="deep-purple accent-4"
        dot
        :value="participant.online_status.status"
        offset-x="12"
        offset-y="12"
      >
        <v-avatar class="avatar-outlined">
          <v-img :src="participant.profile_photo_path"></v-img>
        </v-avatar>
      </v-badge>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold text-capitalize"
            v-text="participant.name"
          />
          <v-list-item-subtitle>
            <span v-if="participant.online_status.status">
              {{ $t('Active Now') }}
            </span>
            <span v-else>
              {{ $t('Active') }}
              {{ participant.online_status.time | relativeTime }}
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" v-on="on">
            <v-icon color="primary">mdi-phone</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('StartVoiceCall') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" v-on="on" class="ml-3">
            <v-icon color="primary">mdi-video</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('StartVideoCall') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            icon
            text
            v-bind="attrs"
            v-on="on"
            @click="$emit('onConvert')"
            class="ml-3 mr-1"
          >
            <v-icon color="primary">mdi-information-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('ConversationInformation') }}</span>
      </v-tooltip>
    </v-app-bar>

    <v-app-bar
      bottom
      fixed
      :class="`${classBottom} elevation-0`"
      flat
      height="56"
      outlined
    >
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" v-on="on" class="ml-n3">
            <v-icon color="primary">mdi-plus-circle</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('OpenMoreAction') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" v-on="on" class="ml-3">
            <v-icon color="primary">mdi-image-multiple</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('AttachPhotoVideo') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" v-on="on" class="ml-3 mr-3">
            <v-icon color="primary">mdi-sticker-emoji</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('ChooseSticker') }}</span>
      </v-tooltip>

      <v-text-field
        class="mt-6"
        dense
        flat
        rounded
        solo
        autofocus
        background-color="grey lighten-2"
        @keydown.enter.exact.prevent
        @keydown.enter.exact="onSendMessage"
        @keydown.enter.shift.exact="newLine"
        label="Aa"
        v-model="text"
      >
        <template v-slot:append>
          <v-btn icon text class="mr-n6" @click="$emit('onConvert')">
            <v-icon color="primary">mdi-emoticon</v-icon>
          </v-btn>
        </template>
      </v-text-field>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon text v-bind="attrs" v-on="on" class="ml-1">
            <v-icon color="primary">mdi-send</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('SendLike') }}</span>
      </v-tooltip>
    </v-app-bar>

    <v-navigation-drawer
      v-model="convert"
      fixed
      class="mt-56"
      width="22rem"
      right
    >
      <template v-slot:prepend>
        <div class="text-center mt-5">
          <v-avatar class="avatar-outlined" size="100">
            <img :src="participant.profile_photo_path" />
          </v-avatar>
          <div class="font-weight-bold text-capitalize mt-2">
            <router-link
              :to="{
                name: 'MainProfile',
                params: { url: participant.url },
              }"
              class="black--text text-decoration-none"
            >
              {{ participant.name }}
            </router-link>
          </div>
        </div>
      </template>
      <v-list nav dense>
        <v-list-group :value="false" prepend-icon="mdi-cog">
          <template v-slot:activator>
            <v-list-item-title v-text="$t('CustomizeChat')"></v-list-item-title>
          </template>
          <v-list-item link>
            <v-list-item-title v-text="$t('ChangeTheme')"></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title v-text="$t('ChangeEmoji')"></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-sticker-emoji</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <!-- Group only -->
        <!-- <v-list-group :value="false" prepend-icon="mdi-account-group">
          <template v-slot:activator>
            <v-list-item-title v-text="$t('Members')"></v-list-item-title>
          </template>
          members
        </v-list-group> -->

        <v-list-group :value="false" prepend-icon="mdi-lock-outline">
          <template v-slot:activator>
            <v-list-item-title
              v-text="$t('Privacy&Support')"
            ></v-list-item-title>
          </template>
          <v-list-item link>
            <v-list-item-title
              v-text="$t('MuteConversation')"
            ></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-bell</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title v-text="$t('IgnoreMessage')"></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-message-bulleted-off</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title v-text="$t('BlockUser')"></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-account-remove</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title
              v-text="$t('SomethingWentWrong')"
            ></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-exclamation</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group :value="false" prepend-icon="mdi-folder-image">
          <template v-slot:activator>
            <v-list-item-title v-text="$t('SharedPhoto')"></v-list-item-title>
          </template>
          hello
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <div v-if="loading" class="text-center">
      <v-progress-circular
        :size="70"
        :width="3"
        color="purple"
        indeterminate
        class="mt-10"
      ></v-progress-circular>
    </div>
    <div v-else id="messageContainer" :class="`${classMessage}`">
      <!-- <observer @intersect="intersected" /> -->
      <chat-row
        v-for="(message, index) in messageReverse"
        :key="`chat-row-${message.id}`"
        :message="message"
        :same="
          messages[index + 1]
            ? message.user_id !== messageReverse[index + 1].user_id
            : true
        "
        class="d-flex align-end"
        :user="participant"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChatRow from './ChatRow'
import Observer from '../../components/Observer'

export default {
  async mounted() {
    await this.fetchData()
    // this.scrollToBottom()
  },
  components: {
    ChatRow,
    Observer
  },
  methods: {
    ...mapActions('message', [
      'getMessage',
      'setDefaultMessage',
      'sendMessage'
    ]),
    ...mapActions('thresh', ['getParticipant']),
    async fetchData() {
      this.loading = true
      try {
        await this.getParticipant(this.$route.params.room_id)
        await this.getMessage(this.$route.params.room_id)
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    },
    async fetchMessage() {
      this.loading = true
      try {
        await this.getMessage(this.$route.params.room_id)
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
      this.load = true
    },
    convertInfo() {
      this.$emit('convert-info')
    },
    async onSendMessage() {
      if (!this.text.length) return
      let message = {
        id: Math.random(),
        thresh_id: this.$route.params.room_id,
        user_id: this.currentUser.id,
        content: this.text,
        user: {
          id: this.currentUser.id,
          name: this.currentUser.name
        }
      }
      if (this.participant.id !== this.currentUser.id) {
        this.socket.emit('sendToUser', {
          userId: this.participant.id,
          roomId: this.$route.params.room_id,
          message: message,
          userName: this.participant.name
        })
      }
      this.text = ''
      await this.sendMessage(message)
    },
    scrollToBottom() {
      var container = this.$el.querySelector('#messageContainer')
      container.scrollTop = container.scrollHeight
    },
    newLine() {
      this.text = this.text
    },
    intersected() {
      this.fetchMessage()
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('message', ['messages']),
    ...mapGetters('thresh', ['participant']),
    ...mapGetters('socket', ['socket']),
    classes() {
      return this.convert ? 'ml-350 mr-300' : 'ml-80'
    },
    classBottom() {
      return this.convert ? 'ml-350 mr-300' : 'ml-80 mr-0'
    },
    classMessage() {
      return this.convert ? 'right-300' : 'right-0'
    },
    breakPoint() {
      return this.$vuetify.breakpoint.name
    },
    messageReverse() {
      return this.messages.slice().reverse()
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      text: '',
      load: false
    }
  },
  props: ['convert'],
  watch: {
    '$route.params': function() {
      this.setDefaultMessage()
      this.fetchData()
    }
  },
  updated() {
    if (this.load) this.load = false
    else this.scrollToBottom()
    console.log('updated')
  }
}
</script>

<style>
#messageContainer {
  overflow-y: auto;
  overflow-x: hidden;
  bottom: 56px;
  top: 120px;
  padding: 5px;
  position: fixed;
}

.right-300 {
  right: 22rem;
  left: 22rem;
}

.right-0 {
  right: 0px;
  left: 5rem;
}

#messageContainer::-webkit-scrollbar {
  width: 0.25rem;
}

#messageContainer::-webkit-scrollbar-track {
  background: #eeeeee;
}

#messageContainer::-webkit-scrollbar-thumb {
  background: rgb(212, 0, 255);
}

.v-btn {
  letter-spacing: 0 !important;
}
</style>
