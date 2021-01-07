// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import '@/plugins/base'
import App from './App'
import router from './router'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import store from '@/store'
import i18n from '@/plugins/i18n'
import mixin from '@/utils/mixin'
import axios from 'axios'
import VueSweetAlert2 from 'vue-sweetalert2'
import Chat from 'vue-beautiful-chat'
import '@/utils/filter'

Vue.config.productionTip = false
Vue.mixin(mixin)
Vue.use(VueSweetAlert2)
Vue.use(Chat)
axios.defaults.baseURL = process.env.VUE_APP_SERVER_BASE_URL

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index]
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters)
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1)
    subsequentMiddleware({ ...context, next: nextMiddleware })
  }
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]
    const context = { from, next, router, store, to }
    const nextMiddleware = nextFactory(context, middleware, 1)
    return middleware[0]({ ...context, next: nextMiddleware })
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['user/isLoggedIn']) {
      next({
        name: 'login'
      })
    } else next()
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (store.getters['user/isLoggedIn']) {
      next({
        name: 'Main'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  vuetify,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})

export default app
