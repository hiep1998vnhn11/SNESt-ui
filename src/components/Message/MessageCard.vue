<template>
  <v-card
    class="message-card-component message-card_0 rounded-lg"
    v-click-outside="{
      handler: onClickOutsideWithConditional,
      closeConditional
    }"
    :ripple="false"
    height="450"
    @keydown.esc="test"
    @click="clickCard"
    v-if="currentUser"
    :loading="loading"
  >
    <v-toolbar dense color="elevation-0">
      <v-btn text large class="ml-n3 text-none" v-if="thresh.participants">
        <v-badge
          bordered
          bottom
          color="deep-purple accent-4"
          dot
          offset-x="10"
          offset-y="10"
          class="ml-n9"
          v-if="thresh.participants.online_status.status"
        >
          <v-avatar size="40" class="avatar-outlined">
            <v-img :src="thresh.participants.profile_photo_path"></v-img>
          </v-avatar>
        </v-badge>
        <v-avatar v-else size="40" class="avatar-outlined ml-n9">
          <v-img :src="thresh.participants.profile_photo_path"></v-img>
        </v-avatar>
        <v-col class="mb-n1" cols="5">
          <div class="font-weight-bold mb-0">
            {{ thresh.participants.name | onlyName }}
          </div>
          <span
            class="text-caption"
            v-if="thresh.participants.online_status.status"
          >
            Active now
          </span>
          <span class="text-caption" v-else>
            {{ thresh.participants.online_status | relativeTime }}
          </span>
        </v-col>
      </v-btn>

      <v-spacer />
      <v-btn icon small class="mr-2">
        <v-icon :color="selected ? 'primary' : ''">mdi-video</v-icon>
      </v-btn>
      <v-btn icon small class="mr-2">
        <v-icon :color="selected ? 'primary' : ''">mdi-phone</v-icon>
      </v-btn>
      <v-btn icon small class="mr-2">
        <v-icon :color="selected ? 'primary' : ''">mdi-minus</v-icon>
      </v-btn>
      <v-btn icon small @click="setThreshCard(null)">
        <v-icon :color="selected ? 'primary' : ''">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <v-card-text
      class="message-card-text-component text--primary"
      id="container"
    >
      <v-container v-if="loading" class="text-center">
        <v-progress-circular
          :size="40"
          :width="2"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </v-container>
      <div v-else-if="messages.length">
        <message-row
          v-for="(message, index) in reverseMessages"
          :key="`message-${message.id}-${message.created_at}`"
          :message="message"
          :same="
            messages[index + 1]
              ? message.user_id !== messages[index + 1].user_id
              : true
          "
          :user="thresh.participants"
        />
      </div>
      <div v-else class="text-center">
        <div>
          <v-avatar class="avatar-outlined" size="100">
            <img :src="thresh.participants.profile_photo_path" />
          </v-avatar>
        </div>
        <div class="font-weight-bold text-body-1">
          {{ thresh.participants.name }}
        </div>
        <div class="text-body-2">
          {{ $t('FriendOnMessage') }}
        </div>
        <div>
          {{ $t('Write something with') }}
          {{ thresh.participants.name | onlyName }}
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn icon small>
        <v-icon :color="selected ? 'primary' : ''">
          mdi-plus-circle-outline
        </v-icon>
      </v-btn>
      <v-btn icon small v-if="!text">
        <v-icon :color="selected ? 'primary' : ''">
          mdi-folder-multiple-image
        </v-icon>
      </v-btn>
      <v-textarea
        label="Write anything ..."
        auto-grow
        rows="1"
        solo
        rounded
        dense
        full-width
        class="mb-n7 ml-2 mr-2"
        v-model="text"
        ref="textInput"
        @keydown.enter.exact.prevent
        @keydown.enter.exact="onSendMessage"
        @keydown.enter.shift.exact="newLine"
      ></v-textarea>
      <v-btn icon small @click="onSendMessage">
        <v-icon :color="selected ? 'primary' : ''"> mdi-send </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MessageRow from './MessageRow'

export default {
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('socket', ['socket']),
    ...mapGetters('message', ['thresh', 'messages']),
    reverseMessages() {
      return this.messages.slice().reverse()
    }
  },
  components: {
    MessageRow
  },
  data() {
    return {
      text: '',
      selected: false,
      active: true,
      loading: false,
      error: null
    }
  },
  methods: {
    ...mapActions('message', ['getMessage', 'sendMessage', 'setThreshCard']),
    onClickOutsideWithConditional() {
      this.selected = false
    },
    closeConditional(e) {
      return this.selected
    },
    async fetchData() {
      this.loading = true
      try {
        await this.getMessage(this.thresh.room.id)
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loading = false
    },
    async onSendMessage() {
      if (this.text) {
        const message = {
          id: Math.random(),
          thresh_id: this.roomId,
          user_id: this.currentUser.id,
          content: this.text
        }
        if (this.thresh.participants.id !== this.currentUser.id) {
          this.socket.emit('sendToUser', {
            userId: this.thresh.participants.id,
            roomId: this.roomId,
            message: message,
            userName: this.thresh.participants.name
          })
        }
        this.text = ''
        try {
          await this.sendMessage(message)
        } catch (err) {
          this.error = err.response.data.message
        }
      }
    },
    scrollToBottom() {
      var container = this.$el.querySelector('#container')
      container.scrollTop = container.scrollHeight
    },
    newLine() {
      this.text = this.text
    },
    clickCard() {
      this.selected = true
      this.$refs.textInput.focus()
    }
  },
  mounted() {
    this.fetchData()
  },
  updated() {
    if (!this.loading) this.scrollToBottom()
  }
}
</script>

<style>
.message-card-component {
  position: fixed;
  z-index: 3;
  bottom: 5px;
  width: 330px;
}

.message-card-text-component {
  overflow-y: hidden;
  height: 350px;
}

.message-card-text-component:hover {
  overflow-y: auto;
}

.message-card-text-component::-webkit-scrollbar {
  width: 0.35rem;
}

.message-card-text-component::-webkit-scrollbar-track {
  background: white;
  -webkit-border-radius: 10px;
  border-radius: 25px;
  padding: 10px;
}

.message-card-text-component::-webkit-scrollbar-thumb {
  background: #9c27b0;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

.active-now-icon {
  position: fixed;
  left: -13px;
  top: 10px;
}
</style>
