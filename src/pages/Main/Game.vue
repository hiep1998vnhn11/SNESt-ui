<template>
  <div>
    Game Page
    <vue-avatar
      :width="250"
      :height="250"
      :rotation="rotation"
      :borderRadius="125"
      :scale="scale"
      ref="vueavatar"
      @vue-avatar-editor:image-ready="onImageReady"
    >
    </vue-avatar>
    <br />
    <label>
      Zoom : {{ scale }}x
      <br />
      <input type="range" min="1" max="3" step="0.02" v-model="scale" />
    </label>
    <br />
    <label>
      Rotation : {{ rotation }}°
      <br />
      <input type="range" min="0" max="360" step="1" v-model="rotation" />
    </label>
    <br />
    <button v-on:click="saveClicked">Get image</button>
    <br />
    <img ref="image" />
    <v-file-input
      v-model="file"
      accept="image/png, image/jpeg, image/bmp"
      label="File input"
      outlined
      dense
    ></v-file-input>
  </div>
</template>

<script>
import { VueAvatar } from 'vue-avatar-editor-improved'

export default {
  components: {
    VueAvatar
  },
  data: function data() {
    return {
      rotation: 0,
      scale: 1,
      file: null,
      test: null
    }
  },

  methods: {
    saveClicked: function saveClicked() {
      var img = this.$refs.vueavatar.getImageScaled()
      this.$refs.image.src = img.toDataURL()
      let test = new File([img], 'test1.png')
      console.log(test)
    },
    onImageReady: function onImageReady() {
      this.scale = 1
      this.rotation = 0
    }
  }
}
</script>

<style></style>
