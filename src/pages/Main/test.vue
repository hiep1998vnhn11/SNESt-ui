<template>
  <v-card height="350px">
    <v-card-title> hello </v-card-title>
    <v-spacer />
    <v-card-text>
      fgh
      <list-thresh :loading="false" />
    </v-card-text>
  </v-card>
</template>
<script>
import ListThresh from '@/components/Message/ListThresh.vue'
export default {
  components: { ListThresh },
  data() {
    return {
      items: [
        { title: 'Home', icon: 'mdi-home-city' },
        { title: 'My Account', icon: 'mdi-account' },
        { title: 'Users', icon: 'mdi-account-group-outline' }
      ]
    }
  }
}
</script>
<style scoped></style>
