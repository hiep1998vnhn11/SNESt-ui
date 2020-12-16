<template>
  <v-fade-transition mode="out-in">
    <v-app id="inspire" class="home-navbar-right">
      <router-view />
    </v-app>
  </v-fade-transition>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'inherit', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.home-navbar-right::-webkit-scrollbar {
  width: 0.25rem;
}

.home-navbar-right::-webkit-scrollbar-track {
  background: white;
}

.home-navbar-right::-webkit-scrollbar-thumb {
  background: #0077ff;
}
</style>
