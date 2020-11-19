<template>
  <v-card
    class="message-card-component"
    v-click-outside="{
      handler: onClickOutsideWithConditional,
      closeConditional
    }"
    :ripple="false"
    @keydown.esc="test"
    v-if="!!currentUser"
    :loading="loading"
  >
    <v-toolbar dense color="elevation-0">
      <v-badge
        bordered
        bottom
        color="deep-purple accent-4"
        dot
        offset-x="10"
        offset-y="10"
        class="ml-n2"
        v-if="active"
      >
        <v-avatar size="40">
          <v-img :src="currentUser.profile_photo_path"></v-img>
        </v-avatar>
      </v-badge>
      <v-avatar v-else size="40">
        <v-img :src="currentUser.profile_photo_path"></v-img>
      </v-avatar>
      <v-col class="mb-n1" cols="5">
        <div class="font-weight-bold mb-n2">
          {{ currentUser.name | onlyName }}
        </div>
        <span class="text-caption">Active now</span>
      </v-col>
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
      <v-btn icon small @click="$emit('on-close')">
        <v-icon :color="selected ? 'primary' : ''">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <v-card-text class="message-card-text-component" id="container">
      <message-row
        v-for="message in messages"
        :key="`message-${message.id}-${message.created_at}`"
        :message="message"
        :active="true"
      />
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
        <v-icon :color="selected ? 'primary' : ''">
          mdi-send
        </v-icon>
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
    ...mapGetters('message', ['messages'])
  },
  components: {
    MessageRow
  },
  props: ['roomId'],
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
    ...mapActions('message', ['getMessage', 'sendMessage']),
    onClickOutsideWithConditional() {
      this.selected = false
    },
    closeConditional(e) {
      return this.selected
    },
    fetchData() {
      this.loading = true
      try {
        this.getMessage(this.roomId)
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    },
    async onSendMessage() {
      if (this.text) {
        this.loading = true
        try {
          await this.sendMessage({
            roomId: this.roomId,
            content: this.text,
            user_id: this.currentUser.id
          })
          this.text = ''
        } catch (err) {
          this.error = err.toString()
        }
        this.loading = false
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
    this.scrollToBottom()
    this.fetchData()
  },
  updated() {
    this.scrollToBottom()
  }
}
</script>

<style>
.message-card-component {
  position: fixed;
  z-index: 3;
  bottom: 5px;
  right: 5px;
  width: 328px;
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
