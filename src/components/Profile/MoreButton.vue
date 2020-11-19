<template>
  <v-btn
    large
    text
    class="text-capitalize mt-3"
    active-class="primary--text"
    @click="expand = !expand"
  >
    more
    <v-icon>mdi-menu-down</v-icon>
    <div class="show-more">
      <v-expand-transition>
        <v-card
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          v-show="expand"
          height="320"
          width="250"
          class="mx-auto index-100"
        >
          <v-container>
            <v-btn
              :to="{ name: 'ImageProfile' }"
              text
              class="text-capitalize mb-2"
              block
              active-class="primary--text"
            >
              Image
              <v-spacer />
            </v-btn>
            <v-btn
              :to="{ name: 'VideoProfile' }"
              text
              class="text-capitalize mb-2"
              block
              active-class="primary--text"
            >
              Video
              <v-spacer />
            </v-btn>
            <v-btn
              :to="{ name: 'ArchiveProfile' }"
              text
              class="text-capitalize mb-2"
              block
              active-class="primary--text"
            >
              Archive
              <v-spacer />
            </v-btn>
            <v-btn text class="text-capitalize mb-2" block>
              Hello
              <v-spacer />
            </v-btn>
            <v-btn text class="text-capitalize mb-2" block>
              Hello
              <v-spacer />
            </v-btn>
            <v-btn text class="text-capitalize mb-2" block>
              Hello
              <v-spacer />
            </v-btn>
            <v-btn text class="text-capitalize mb-2" block>
              Hello
              <v-spacer />
            </v-btn>
          </v-container>
        </v-card>
      </v-expand-transition>
    </div>
  </v-btn>
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
      return this.expand ? 'primary--text blue lighten-5' : null
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
.show-more {
  position: absolute;
  top: 30px;
  z-index: 1;
}
</style>
