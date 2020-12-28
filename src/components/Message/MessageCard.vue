<template>
  <v-card
    :class="`message-card-component message-card_${location} rounded-lg`"
    v-click-outside="{
      handler: onClickOutsideWithConditional,
      closeConditional,
    }"
    :ripple="false"
    height="450"
    @keydown.esc="test"
    @click="clickCard"
    v-if="!!currentUser && user"
    :loading="loading"
  >
    <v-toolbar dense color="elevation-0">
      <v-btn text large class="ml-n3 text-none" v-if="user">
        <v-badge
          bordered
          bottom
          color="deep-purple accent-4"
          dot
          offset-x="10"
          offset-y="10"
          class="ml-n9"
          v-if="user.online_status.status"
        >
          <v-avatar size="40" class="avatar-outlined">
            <v-img :src="user.profile_photo_path"></v-img>
          </v-avatar>
        </v-badge>
        <v-avatar v-else size="40" class="avatar-outlined ml-n9">
          <v-img :src="user.profile_photo_path"></v-img>
        </v-avatar>
        <v-col class="mb-n1" cols="5">
          <div class="font-weight-bold mb-0">
            {{ user.name | onlyName }}
          </div>
          <span class="text-caption" v-if="user.online_status.status">
            Active now
          </span>
          <span class="text-caption" v-else>
            {{ user.online_status | relativeTime }}
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
      <v-btn icon small @click="closeMessageCard(location)">
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
          :user="user"
        />
      </div>
      <div v-else class="text-center">
        <div>
          <v-avatar class="avatar-outlined" size="100">
            <img :src="user.profile_photo_path" />
          </v-avatar>
        </div>
        <div class="font-weight-bold text-body-1">
          {{ user.name }}
        </div>
        <div class="text-body-2">
          {{ $t('FriendOnMessage') }}
        </div>
        <div>{{ $t('Write something with') }} {{ user.name | onlyName }}</div>
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
import Axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import MessageRow from './MessageRow'

export default {
  computed: {
    ...mapGetters('user', ['currentUser']),
    reverseMessages() {
      return this.messages.slice().reverse()
    }
  },
  components: {
    MessageRow
  },
  props: ['roomId', 'location'],
  data() {
    return {
      text: '',
      selected: false,
      active: true,
      loading: false,
      error: null,
      roomID: null,
      messages: [],
      user: null
    }
  },
  methods: {
    ...mapActions('message', ['getMessage', 'sendMessage', 'closeMessageCard']),
    onClickOutsideWithConditional() {
      this.selected = false
    },
    closeConditional(e) {
      return this.selected
    },
    async fetchData() {
      this.loading = true
      try {
        let user = await Axios.post(
          `/v1/user/thresh/${this.roomId}/participant/get`
        )
        this.user = user.data.data
        let response = await Axios.get(
          `/v1/user/thresh/${this.roomId}/message/get`,
          {
            params: {
              page: 1
            }
          }
        )
        this.messages = response.data.data.data
      } catch (err) {
        console.log(err.response.data.message)
      }
      this.loading = false
    },
    async onSendMessage() {
      if (this.text) {
        this.messages.unshift({
          id: Math.random(),
          thresh_id: this.roomId,
          user_id: this.currentUser.id,
          content: this.text
        })
        try {
          await Axios.post(`/v1/user/thresh/${this.roomId}/message/send`, {
            content: this.text
          })
          this.text = ''
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
  overflow-y: scroll;
  height: 350px;
}

.active-now-icon {
  position: fixed;
  left: -13px;
  top: 10px;
}
</style>
