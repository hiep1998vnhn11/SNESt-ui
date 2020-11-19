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
          exact
          :class="`ml-2 ${classes}`"
        >
          <v-icon v-bind="attrs" v-on="on">mdi-facebook-messenger</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.message') }}</span>
    </v-tooltip>
    <div class="show-message-app-bar">
      <v-expand-transition bottom>
        <v-card
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          v-show="expand"
          width="350"
          height="500"
          class="mx-auto scroll-y"
        >
          <v-toolbar
            width="350"
            tile
            class="elevation-0 title-message-expand font-weight-black text-h5"
          >
            Message
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  small
                  @click="optionExpand = !optionExpand"
                >
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('common.option') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  small
                  class="ml-3"
                  @click="cancelExpand"
                  :to="{ name: 'Message' }"
                >
                  <v-icon>mdi-arrow-expand-all</v-icon>
                </v-btn>
              </template>
              <span>Open all in message page</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon small class="ml-3 mr-1">
                  <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
              </template>
              <span>New message</span>
            </v-tooltip>
          </v-toolbar>
          <v-divider />
          <v-card-text class="mt-12">
            <base-user-button
              icon
              block
              icon_name="mdi-menu-open"
              name="activity diary"
              v-for="n in 50"
              :key="n"
            />
            <base-user-button
              icon
              block
              icon_name="mdi-account-settings"
              name="activity diary"
            />
          </v-card-text>
        </v-card>
      </v-expand-transition>
      <div class="show-message-option">
        <v-expand-transition>
          <v-card v-show="optionExpand" width="350">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  Setting chat
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Customize your messenger experience and display
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-container>
              <v-divider />

              <v-btn text block class="text-capitalize mt-2" large>
                <v-icon class="ml-n2 mr-2">mdi-phone-incoming-outline</v-icon>
                incoming call audio
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>

              <v-btn text block class="text-capitalize" large>
                <v-icon class="ml-n2 mr-2">mdi-volume-low</v-icon>
                message notification sound
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>
              <v-btn text block class="text-capitalize" large>
                <v-icon class="ml-n2 mr-2">
                  mdi-checkbox-multiple-blank-circle-outline
                </v-icon>
                <div class="text-left">
                  Post
                  <div class="text-caption">
                    Create a post to your feed
                  </div>
                </div>
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>
              <v-divider />
              <v-btn text block class="text-capitalize" large>
                <v-icon class="ml-n2 mr-2">mdi-vector-circle-variant</v-icon>
                turn off active status
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>
              <v-btn text block class="text-capitalize" large>
                <v-icon class="ml-n2 mr-2">mdi-alert-circle-outline</v-icon>
                blocking setting
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>
            </v-container>
          </v-card>
        </v-expand-transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onClickOutsideWithConditional() {
      this.expand = false
      this.optionExpand = false
    },
    closeConditional(e) {
      return this.expand
    },
    cancelExpand() {
      this.expand = false
      this.optionExpand = false
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-4' : null
    }
  },
  data() {
    return {
      expand: false,
      optionExpand: false
    }
  }
}
</script>

<style>
.show-message-app-bar {
  position: absolute;
  z-index: 900;
  right: 20px;
  top: 50px;
}

.title-message-expand {
  position: fixed;
  z-index: 100;
}

.show-message-option {
  position: absolute;
  z-index: 101;
  top: 70px;
  right: 100px;
}

.scroll-y {
  overflow-y: scroll;
  z-index: 100;
}
</style>
