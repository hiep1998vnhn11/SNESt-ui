<template>
  <v-card
    v-if="currentUser"
    id="search-card-app-bar"
    v-click-outside="{
      handler: onClickOutsideWithConditional,
      closeConditional
    }"
    width="500"
    :class="`elevation-${searchSelected ? 5 : 0} ml-n4`"
  >
    <v-app-bar height="56" class="elevation-0">
      <v-text-field
        v-model="searchKey"
        class="elevation-0 lighten-3 ml-2"
        rounded
        hide-details
        :label="$t('Search')"
        @focus="onFocusSearch"
      >
        <template v-slot:prepend-inner class="mr-n2">
          <v-icon class="ml-n4">mdi-magnify</v-icon>
        </template>
      </v-text-field>
    </v-app-bar>
    <v-container v-if="searchSelected">
      <!-- Error temblade -->
      <div v-if="error">
        {{ error }}
      </div>
      <!-- Loading temblade -->
      <div v-else-if="loading" class="text-center">
        <v-progress-circular
          :width="1"
          size="50"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </div>

      <!-- Search result temblade -->
      <div v-else-if="searchResult.length">
        {{ searchResult }}
      </div>

      <!-- Search history -->
      <div v-else-if="!searchKey">
        <div class="font-weight-bold text-subtitle-1">
          {{ $t('RecentSearches') }}
        </div>
        {{ searchHistory }}
      </div>

      <!-- Search result -->
      <div v-else>
        <v-btn large block text class="rounded-lg text-none primary--text">
          <v-btn width="35" height="35" icon class="primary mr-3 ml-n1">
            <v-icon color="white">mdi-magnify</v-icon>
          </v-btn>
          {{ $t('SearchFor') }} {{ searchKey }}
          <v-spacer />
        </v-btn>
      </div>
    </v-container>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      searchKey: '',
      searchSelected: false,
      searchHistory: [],
      searchResult: [],
      loading: false,
      error: null
    }
  },
  methods: {
    onClickOutsideWithConditional() {
      this.searchSelected = false
    },
    closeConditional(e) {
      return this.searchSelected
    },
    async onFocusSearch() {
      this.searchSelected = true
      const localSearchHistoryStorage = window.localStorage.getItem(
        '_SearchHistory'
      )
      if (JSON.parse(localSearchHistoryStorage)) {
        this.searchHistory = JSON.parse(localSearchHistoryStorage)
      } else {
        this.loading = true
        this.error = null
        try {
          const searchHistory = await axios.post('/v1/user/search/history')
          this.searchHistory = searchHistory.data.data
          window.localStorage.setItem(
            '_SearchHistory',
            JSON.stringify(searchHistory.data.data)
          )
        } catch (err) {
          this.error = err.response.data.message
        }
        this.loading = false
      }
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  watch: {
    async searchKey(value) {
      if (!value) return
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('v1/user/search/get', {
          search_key: value,
          history: false
        })
        this.searchResult = response.data.data
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loading = false
    }
  }
}
</script>
<style scoped></style>
