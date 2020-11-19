<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          width="40"
          height="40"
          @click="expand = true"
          outlined
          icon
          text
          :class="`ml-2 ${classes}`"
        >
          <v-icon v-bind="attrs" v-on="on">mdi-bell</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.notification') }}</span>
    </v-tooltip>
    <div class="show-noti-app-bar">
      <v-expand-transition right>
        <v-card
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          v-show="expand"
          width="350"
          class="mx-auto"
        >
          <v-container>
            <base-user-button
              icon
              block
              icon_name="mdi-menu-open"
              name="activity diary"
            />
            <base-user-button
              icon
              block
              icon_name="mdi-account-settings"
              name="activity diary"
            />
          </v-container>
        </v-card>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onClickOutsideWithConditional() {
      this.expand = false
    },
    closeConditional(e) {
      return this.expand
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-4' : null
    }
  },
  data() {
    return {
      expand: false
    }
  }
}
</script>

<style>
.show-noti-app-bar {
  position: absolute;
  z-index: 100;
  top: 50px;
  right: 20px;
}
</style>
