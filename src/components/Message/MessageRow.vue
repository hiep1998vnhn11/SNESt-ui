<template>
  <v-row v-if="Number(message.user_id) !== currentUser.id && !message.removed">
    <v-col cols="1" class="mt-n2">
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
    </v-col>
    <v-card
      max-width="200"
      class="rounded-lg ml-6 mb-3 mt-2 pa-2 grey lighten-2"
    >
      {{ message.content }}
    </v-card>
    <v-spacer />
    <v-col cols="2" class="mt-n2">
      <v-btn icon small>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col cols="2" class="mt-n2">
      <v-btn icon small class="ml-n3">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-col>
    <v-spacer />
    <v-card
      max-width="200"
      class="rounded-lg mr-5 mb-3 mt-2 pa-2 grey lighten-2 primary"
    >
      {{ message.content }}
    </v-card>
    <v-col cols="1" class="mt-n2">
      <v-badge
        bordered
        bottom
        color="deep-purple accent-4"
        dot
        offset-x="10"
        offset-y="10"
        class="ml-n7"
        v-if="active"
      >
        <v-avatar size="40">
          <v-img :src="currentUser.profile_photo_path"></v-img>
        </v-avatar>
      </v-badge>
      <v-avatar v-else size="40">
        <v-img :src="currentUser.profile_photo_path"></v-img>
      </v-avatar>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    userId: Number,
    active: Boolean,
    message: Object
  },
  computed: mapGetters('user', ['currentUser'])
}
</script>

<style></style>
