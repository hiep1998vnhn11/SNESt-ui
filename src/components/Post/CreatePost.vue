<template>
  <v-card class="rounded-lg pa-2" outlined tile v-if="currentUser">
    <v-skeleton-loader
      v-if="loading"
      type="list-item-avatar, divider, actions"
    ></v-skeleton-loader>
    <v-row v-else justify="space-around">
      <v-col cols="2" md="1">
        <v-avatar size="45" class="ml-1 avatar-outlined">
          <img :src="currentUser.profile_photo_path" :alt="currentUser.name" />
        </v-avatar>
      </v-col>
      <v-col class="ml-2 text-left">
        <v-btn
          class="text-capitalize mt-2"
          rounded
          block
          @click="dialog = true"
          elevation="0"
        >
          {{ $t('create_post.writeSt') }}
          <v-spacer></v-spacer>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider class="mx-4"></v-divider>
    <v-row class="">
      <v-col cols="6"> </v-col>
      <v-col cols="6">
        <v-btn class="text-capitalize" block rounded-lg text>
          <v-icon class="mr-2">mdi-image-multiple</v-icon>
          {{ $t('create_post.uploadImg') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="addImage" hide-overlay max-width="600px">
      <v-row>
        <v-container>
          <v-textarea
            clearable
            :label="$t('create_post.content')"
            v-model="imageUrl"
          ></v-textarea>
        </v-container>
      </v-row>
    </v-dialog>
    <create-post-dialog
      v-if="!loading"
      :dialog="dialog"
      @close-dialog="dialog = false"
    ></create-post-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import CreatePostDialog from './CreatePostDialog'
export default {
  props: ['loading'],
  components: {
    CreatePostDialog
  },
  computed: mapGetters('user', ['currentUser']),
  data() {
    return {
      writePost: false,
      tab: 'private',
      chooseVisible: false,
      visible: 'public',
      content: '',
      imageUrl: null,
      addImage: false,
      selectPrivacy: false,
      dialog: false
    }
  }
}
</script>

<style scoped>
.btn-toggle {
  flex-direction: column;
  width: 500px;
}
</style>
