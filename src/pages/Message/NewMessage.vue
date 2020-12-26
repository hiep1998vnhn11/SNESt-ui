<template>
  <div>
    <v-app-bar fixed :class="classes" flat height="64" outlined>
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="API"
        :label="$t('To:')"
        :placeholder="$t('SearchYourFriendToChatWithThem')"
        prepend-icon="mdi-account-search"
        return-object
        class="mt-7"
      ></v-autocomplete>
    </v-app-bar>
    <v-expand-transition v-if="model">
      <v-list v-if="model" class="red lighten-3">
        <v-list-item v-for="(field, i) in fields" :key="i">
          <v-list-item-content>
            <v-list-item-title v-text="field.value"></v-list-item-title>
            <v-list-item-subtitle v-text="field.key"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expand-transition>
    <v-card>
      {{ entries }}
      {{ items }}
      {{ model }}
    </v-card>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      convert: false,
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null
    }
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {
    classes() {
      return this.convert ? 'ml-350 mt-14 mr-300' : 'ml-80 mt-14'
    },
    fields() {
      if (!this.model) return []

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a'
        }
      })
    },
    items() {
      return this.entries.map(entry => {
        const Description = entry.user_friend.name
        return Object.assign({}, entry, { Description })
      })
    }
  },
  watch: {
    async search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoading) return
      this.isLoading = true
      // Lazily load input items
      try {
        const response = await axios.post('/v1/user/friend/get', {
          params: {
            search_key: this.search.toLowerCase()
          }
        })
        this.entries = response.data.data
      } catch (err) {
        this.err = err
      }
      this.isLoading = false
    }
  }
}
</script>
<style scoped>
</style>
