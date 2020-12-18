import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main/Main'
import Login from '@/pages/Auth/Login'
import Test from '@/pages/Main/test'

import Home from '@/pages/Main/Home'
import Store from '@/pages/Main/Store'
import Watch from '@/pages/Main/Watch'
import Game from '@/pages/Main/Game'
import Group from '@/pages/Main/Group'
import ParamPost from '@/pages/Post/ParamPost'
import Profile from '@/pages/Profile/Profile'
import UserAbout from '@/pages/Profile/About'
import UserFriend from '@/pages/Profile/Friend'
import UserMain from '@/pages/Profile/Main'
import UserImage from '@/pages/Profile/Image'
import UserVideo from '@/pages/Profile/Video'
import UserArchive from '@/pages/Profile/Archive'

import Setting from '@/pages/Setting/Setting'
import InfoSetting from '@/pages/Setting/Information'
import AccountSetting from '@/pages/Setting/Account'
import PrivacySetting from '@/pages/Setting/Privacy'
import SecuritySetting from '@/pages/Setting/Security'

import Message from '@/pages/Message/Message'
import Chat from '@/pages/Message/Chat'
import MainMessage from '@/pages/Message/Main'

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
          path: 'user/:url',
          component: Profile,
          children: [
            {
              path: '',
              name: 'MainProfile',
              component: UserMain
            },
            {
              path: 'about',
              name: 'AboutProfile',
              component: UserAbout
            },
            {
              path: 'image',
              name: 'ImageProfile',
              component: UserImage
            },
            {
              path: 'video',
              name: 'VideoProfile',
              component: UserVideo
            },
            {
              path: 'archive',
              name: 'ArchiveProfile', // Luu tru
              component: UserArchive
            },
            {
              path: 'friends',
              name: 'FriendProfile',
              component: UserFriend
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
          component: Message,
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              name: 'Message',
              component: MainMessage
            },
            {
              path: ':room_id',
              name: 'MessageRoom',
              component: Chat
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresVisitor: true
      }
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/post/:post_id',
      name: 'ParamPost',
      component: ParamPost
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  mode: 'history'
})
