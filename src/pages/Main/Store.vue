<template>
  <div>
    Store Page
    <v-btn>
      test
    </v-btn>
    <offline @detected-condition="handleConnectivityChange">
      <!-- Only renders when the device is online -->
      <div slot="online">
        <p>It looks like you're online! Here's all the things you can do...</p>
        ...
      </div>
      <!-- Only renders when the device is offline -->
      <div slot="offline">
        <p>You appear to be offline, that's okay, we can still do things...</p>
        ...
      </div>
    </offline>
  </div>
</template>

<script>
import io from 'socket.io-client'
import offline from 'v-offline'
window.io = io
export default {
  components: {
    offline
  },
  data() {
    return {}
  },
  created() {
    window.socket = io(process.env.VUE_APP_SOCKET_URL)
    window.socket.on('disconnect', () => {
      console.log('disconnected')
    })
  },
  methods: {
    handleConnectivityChange(status) {
      console.log(status)
    }
  }
}
</script>

<style></style>
