<template>
  <div>
    <v-app-bar
      fixed
      :class="classes"
      flat
      height="64"
      outlined
      v-if="participant"
    >
      <v-badge
        bordered
        bottom
        color="deep-purple accent-4"
        dot
        :value="participant.onlineStatus.status"
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
            <span v-if="participant.onlineStatus.status">
              {{ $t('Active Now') }}
            </span>
            <span v-else>
              {{ $t('Active') }}
              {{ participant.onlineStatus.time | relativeTime }}
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
        @keydown.enter.exact="sendMessage"
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
      <v-list>
        <v-list-item v-for="n in 50" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
    <v-container id="messageContainer" v-else>
      <chat-row
        v-for="(message, index) in messages"
        :key="`chat-row-${message.id}`"
        :message="message"
        :same="
          messages[index + 1]
            ? message.user_id !== messages[index + 1].user_id
            : true
        "
        :user="participant"
      />
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChatRow from './ChatRow'

export default {
  async mounted() {
    await this.fetchData()
    this.scrollToBottom()
  },
  components: {
    ChatRow
  },
  methods: {
    ...mapActions('message', ['getMessage', 'setDefaultMessage']),
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
    convertInfo() {
      this.$emit('convert-info')
    },
    async sendMessage() {
      await console.log(this.text)
    },
    scrollToBottom() {
      var container = this.$el.querySelector('#messageContainer')
      container.scrollTop = container.scrollHeight
    },
    newLine() {
      this.text = this.text
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('message', ['messages']),
    ...mapGetters('thresh', ['participant']),
    classes() {
      return this.convert ? 'ml-350 mt-14 mr-300' : 'ml-80 mt-14'
    },
    classBottom() {
      return this.convert ? 'ml-350 mr-300' : 'ml-80 mr-0'
    },
    breakPoint() {
      return this.$vuetify.breakpoint.name
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      text: ''
    }
  },
  props: ['convert'],
  watch: {
    '$route.params': function() {
      this.setDefaultMessage()
      this.fetchData()
    }
  }
  // updated() {
  //   this.scrollToBottom()
  // }
}
</script>

<style></style>
