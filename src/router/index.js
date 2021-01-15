import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main/Main'
import Test from '@/pages/Main/test'

import Home from '@/pages/Main/Home'
import Store from '@/pages/Main/Store'
import Watch from '@/pages/Main/Watch'
import Game from '@/pages/Main/Game'
import Group from '@/pages/Main/Group'

import Setting from '@/pages/Setting/Setting'
import InfoSetting from '@/pages/Setting/Information'
import AccountSetting from '@/pages/Setting/Account'
import PrivacySetting from '@/pages/Setting/Privacy'
import SecuritySetting from '@/pages/Setting/Security'

import login from '@/pages/login.vue'
import loginIndex from '@/pages/login/index.vue'
import loginIdentify from '@/pages/login/identify'

import messages from '@/pages/messages'
import messagesNew from '@/pages/messages/new'
import MessagesRoomId from '@/pages/messages/_room_id'

import Search from '@/pages/search'
import SearchTop from '@/pages/search/top'
import SearchPeople from '@/pages/search/people'
import SearchPost from '@/pages/search/posts'

import UserUrl from '@/pages/user/_url.vue'
import UserUrlIndex from '@/pages/user/_url/index.vue'
import UserUrlAbout from '@/pages/user/_url/about'
import UserUrlVideo from '@/pages/user/_url/video'
import UserUrlArchive from '@/pages/user/_url/archive'
import UserUrlFriend from '@/pages/user/_url/friend'
import UserUrlImage from '@/pages/user/_url/image'

import postPostId from '@/pages/post/_post_id'

import recover from '@/pages/recover'
import recoverInitiate from '@/pages/recover/initiate'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Main,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'Home',
          component: Home
        },
        {
          path: '/test',
          name: 'Test',
          component: Test
        },
        {
          path: 'user/:url',
          component: UserUrl,
          children: [
            {
              path: '',
              name: 'user-url',
              component: UserUrlIndex
            },
            {
              path: 'about',
              name: 'user-url-about',
              component: UserUrlAbout
            },
            {
              path: 'image',
              name: 'user-url-image',
              component: UserUrlImage
            },
            {
              path: 'video',
              name: 'user-url-video',
              component: UserUrlVideo
            },
            {
              path: 'archive',
              name: 'user-url-archive', // Luu tru
              component: UserUrlArchive
            },
            {
              path: 'friend',
              name: 'user-url-friend',
              component: UserUrlFriend
            }
          ]
        },
        {
          path: 'watch',
          name: 'Watch',
          component: Watch,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'store',
          name: 'Store',
          component: Store,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'game',
          name: 'Game',
          component: Game,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'group',
          name: 'Group',
          component: Group,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'settings',
          name: 'Setting',
          component: Setting,
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: 'account',
              name: 'AccountSetting',
              component: AccountSetting
            },
            {
              path: 'information',
              name: 'InfoSetting',
              component: InfoSetting
            },
            {
              path: 'privacy',
              name: 'PrivacySetting',
              component: PrivacySetting
            },
            {
              path: 'security',
              name: 'SecuritySetting',
              component: SecuritySetting
            }
          ]
        },
        {
          path: 'messages',
          component: messages,
          name: 'messages',
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: 'new',
              name: 'messages-new',
              component: messagesNew
            },
            {
              path: ':room_id',
              name: 'messages-room_id',
              component: MessagesRoomId
            }
          ]
        },
        {
          path: 'search',
          component: Search,
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: 'top',
              name: 'search-top',
              component: SearchTop
            },
            {
              path: 'people',
              name: 'search-people',
              component: SearchPeople
            },
            {
              path: 'posts',
              name: 'search-posts',
              component: SearchPost
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      component: login,
      meta: {
        requiresVisitor: true
      },
      children: [
        {
          path: '/',
          name: 'login',
          component: loginIndex
        },
        {
          path: 'identify',
          name: 'login-identify',
          component: loginIdentify
        }
      ]
    },
    {
      path: '/recover',
      component: recover,
      children: [
        {
          path: '/',
          name: 'recover'
        },
        {
          path: 'initiate',
          name: 'recover-initiate',
          component: recoverInitiate
        }
      ]
    },
    {
      path: '/post/:post_id',
      name: 'post-post_id',
      component: postPostId
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  mode: 'history'
})
