import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import p404 from '@/components/p404'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/p404',
      name: 'p404',
      component: p404
    },
    {
      path: '/*',
      redirect: '/p404'
    }
  ]
})
