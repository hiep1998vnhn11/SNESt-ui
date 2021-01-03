<template>
  <v-hover v-slot="{ hover }">
    <v-btn block text x-large :to="{ name: 'Home' }">
      hello
      <v-expand-transition>
        <v-btn
          v-if="hover"
          absolute
          color="orange"
          class="white--text"
          fab
          large
          right
          top
        >
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </v-expand-transition>
    </v-btn>
  </v-hover>
</template>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
