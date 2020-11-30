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
          <v-icon v-bind="attrs" v-on="on">mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.option') }}</span>
    </v-tooltip>
    <v-dialog persistent v-model="dialog" width="600">
      <v-card>
        <div v-if="error">
          <v-card-title class="font-weight-bold">
            <v-btn icon large class="grey lighten-3" @click="error = false">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer />
            Have an error?
            <v-spacer />
            <v-btn icon large class="grey lighten-3" @click="closeError">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-container> Hello </v-container>
        </div>

        <div v-else-if="feedback">
          <v-card-title class="font-weight-bold">
            <v-btn icon large class="grey lighten-3" @click="feedback = false">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer />
            Contribute to the new version
            <v-spacer />
            <v-btn icon large class="grey lighten-3" @click="closeFeedback">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
        </div>
        <div v-else>
          <v-card-title class="font-weight-bold">
            <v-spacer />
            Send a feedback to SNESt
            <v-spacer />
            <v-btn icon large class="grey lighten-3" @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />

          <v-container>
            <v-btn
              text
              class="text-capitalize text-body font-weight-bold rounded-md"
              height="75"
              block
              active-class="blue lighten-3"
              @click="feedback = true"
            >
              <v-avatar
                outlined
                icon
                class="grey lighten-3 avatar-outlined left-8"
              >
                <v-icon>mdi-message-alert</v-icon>
              </v-avatar>
              <div class="text-left">
                Contribute to the new version
                <div class="text-caption">
                  Contribute to the new version of this application
                </div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
            <v-btn
              text
              class="text-capitalize text-body font-weight-bold rounded-md mt-2"
              height="75"
              block
              active-class="blue lighten-3"
              @click="error = true"
            >
              <v-avatar
                outlined
                icon
                class="grey lighten-3 avatar-outlined left-8"
              >
                <v-icon>mdi-message-alert</v-icon>
              </v-avatar>
              <div class="text-left">
                Have an error?
                <div class="text-caption">Please tell us about this error</div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
          </v-container>
        </div>
      </v-card>
    </v-dialog>
    <div class="show-setting-app-bar">
      <v-expand-transition right>
        <v-card
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional,
          }"
          v-show="expand"
          width="350"
          class="mx-auto"
        >
          <v-container>
            <v-btn
              text
              class="text-capitalize text-h6 font-weight-bold rounded-md mb-2"
              height="75"
              block
              active-class="blue lighten-3"
              :to="{
                name: 'MainProfile',
                params: { url: currentUser.url },
              }"
              v-if="!!currentUser"
            >
              <v-avatar class="left-8 avatar-outlined" size="60">
                <img :src="currentUser.profile_photo_path" />
              </v-avatar>
              <div class="text-left">
                {{ currentUser.name }}
                <div class="text-caption">Go to your profile</div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
            <v-divider></v-divider>
            <v-btn
              text
              class="text-capitalize text-body font-weight-bold rounded-md mt-2 mb-2"
              large
              block
              active-class="blue lighten-3"
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-message-alert</v-icon>
              </v-avatar>
              <div class="text-left">
                Send a feedback
                <div class="text-caption">
                  contribute to improving this application
                </div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              exact
              active-class="blue lighten-3"
              :to="{ name: 'AccountSetting' }"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-cog</v-icon>
              </v-avatar>
              Setting and privacy
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              active-class="blue lighten-3"
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-progress-question</v-icon>
              </v-avatar>
              help and support
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              active-class="blue lighten-3"
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-moon-waning-crescent</v-icon>
              </v-avatar>
              Display <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              @click="onLogout"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-logout</v-icon>
              </v-avatar>
              Logout
              <v-spacer></v-spacer>
            </v-btn>
          </v-container>
        </v-card>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('user', ['logout', 'getUser']),
    onClickOutsideWithConditional() {
      this.expand = false
    },
    closeConditional(e) {
      return this.expand
    },
    closeFeedback() {
      this.dialog = false
      this.feedback = false
    },
    closeError() {
      this.dialog = false
      this.feedback = false
    },
    async onLogout() {
      await this.logout()
      this.$router.push({ name: 'Login' })
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-4' : null
    },
    ...mapGetters('user', ['currentUser'])
  },
  data() {
    return {
      expand: false,
      dialog: false,
      error: false,
      feedback: false
    }
  }
}
</script>

<style>
.show-setting-app-bar {
  position: absolute;
  z-index: 100;
  top: 50px;
  right: 20px;
}

.left-8 {
  left: -8px;
}
.left-15 {
  left: -15px;
}
</style>
