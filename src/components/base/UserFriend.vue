<template>
  <v-card class="rounded-lg mt-3">
    <v-card-title class="font-weight-bold">
      Friends
      <v-card-subtitle>{{ user.friends_count }} friends</v-card-subtitle>
      <v-spacer></v-spacer>
      <v-btn text class="primary--text text-capitalize">
        More
      </v-btn>
    </v-card-title>
    <v-container class="mt-n10">
      <v-row>
        <v-col
          v-for="friend in user.friends"
          :key="`friend-${friend.friend_id}`"
        >
          <v-card width="93" class="rounded-lg">
            <v-img
              width="93"
              :src="friend.user_friend.profile_photo_path"
            ></v-img>
          </v-card>
          {{ friend.user_friend.name }}
        </v-col>
      </v-row>
      {{ user }}
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: ['user']
}
</script>

<style></style>
