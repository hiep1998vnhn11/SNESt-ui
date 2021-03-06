<template>
  <v-container>
    <v-row class="pa-16">
      <v-col cols="12" md="6" lg="7" sm="12" align-self="center"></v-col>
      <v-col cols="12" md="6" lg="5" sm="12" class="text-center">
        <v-card class="rounded-lg" :loading="loading">
          <v-container>
            <v-alert
              :value="registerSuccess"
              transition="scale-transition"
              type="success"
              height="50"
            >
              Register Successfully! Please login
            </v-alert>
            <v-alert
              v-if="error"
              :value="loginError"
              transition="scale-transition"
              type="error"
              height="50"
            >
              {{ error.data.message }}
            </v-alert>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                :label="$t('Email')"
                required
                @keyup.enter="onLogin"
              ></v-text-field>
              <v-text-field
                v-model="password"
                type="password"
                :rules="passwordRules"
                :label="$t('Password')"
                required
                @keyup.enter="onLogin"
              ></v-text-field>
            </v-form>
          </v-container>
          <v-row class="mx-auto">
            <v-col cols="6">
              <v-btn
                color="primary"
                class="text-h6 text-capitalize"
                block
                large
                @click="onLogin"
              >
                {{ $t('common.login') }}
              </v-btn>
            </v-col>
            <v-col cols="6">
              <register-component
                @success="registerSuccess = true"
                class="mx-auto"
              />
            </v-col>
            <v-col no-gutters>
              {{ $t('common.forgotPassword') }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-footer absolute>
      <login-footer></login-footer>
    </v-footer>
  </v-container>
</template>
<script>
import LoginFooter from '@/components/Layout/LoginFooter'
import RegisterComponent from '@/components/Auth/Register'
import { mapGetters } from 'vuex'
export default {
  components: {
    'login-footer': LoginFooter,
    'register-component': RegisterComponent
  },
  data() {
    const _this = this
    return {
      valid: true,
      email: null,
      password: null,
      emailRules: [
        v => !!v || _this.$t('Rule.EmailRequired'),
        v => /.+@.+/.test(v) || _this.$t('Rule.EmailNotValid')
      ],
      passwordRules: [v => !!v || _this.$t('Rule.PasswordRequired')],
      registerSuccess: false,
      loading: false,
      error: null,
      loginError: false
    }
  },
  computed: mapGetters('user', ['isLoggedIn']),

  methods: {
    async onLogin() {
      if (!this.password || !this.email) {
        this.$refs.form.validate()
        return
      }
      if (!this.valid) return
      this.loading = true
      this.error = null
      try {
        await this.$store.dispatch(
          'user/login',
          {
            email: this.email,
            password: this.password
          },
          { root: true }
        )
        this.$router.push({ name: 'Home' })
      } catch (err) {
        this.error = err.response
        this.loginError = true
      }
      this.loading = false
    }
  },
  watch: {
    registerSuccess: function() {
      if (this.registerSuccess === true) {
        const vm = this
        setTimeout(function() {
          vm.registerSuccess = false
        }, 2000)
      }
    },
    loginError: function() {
      if (this.loginError === true) {
        const vm = this
        setTimeout(function() {
          vm.registerSuccess = false
        }, 2000)
      }
    }
  }
}
</script>
