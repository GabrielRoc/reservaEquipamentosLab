import Vue from 'vue'
import Router from 'vue-router'
import firebaseApp from '../firebase-controller.js'

import Home from '@/pages/home/Home'
import Login from '@/pages/Login'
import Perfil from '@/pages/perfil/Perfil.vue'
import Configuracoes from '@/pages/configuracoes/Configuracoes.vue'

import Equipamentos from '@/pages/equipamentos/Equipamentos'
import Locais from '@/pages/locais/Locais'

import Cursos from '@/pages/cursos/Cursos'
import Disciplinas from '@/pages/disciplinas/Disciplinas'
import Aulas from '@/pages/aulas/Aulas'
import Agendamento from '@/pages/aulas/AgendamentoAulas'
import Usuarios from '@/pages/usuarios/Usuarios'
import Habilitacao from '@/pages/habilitacao/ListagemUsuarios'
import naoHabilitado from '@/pages/habilitacao/naoHabilitado.vue'

import Reservas from '@/pages/reservas/Reservas'
import novaReserva from '@/pages/reservas/novaReserva'
import itemReserva from '@/pages/reservas/itemReserva'
import periodoReserva from '@/pages/reservas/periodoReserva'

import Cadastro from '@/pages/Cadastro'

import VerificarEmail from '@/pages/VerificarEmail'
import actionHandler from '@/components/actionHandler'
import RecuperarSenha from '@/pages/RecuperarSenha'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        menuKey: 'home',
        requiresAuth: true
      }
    }, {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        menuKey: '',
        login: true
      }
    }, {
      path: '/aulas',
      name: 'Aulas',
      component: Aulas,
      meta: {
        menuKey: 'aulas',
        requiresAuth: true
      }
    }, {
      path: '/agendamento',
      name: 'AgendamentoAulas',
      component: Agendamento,
      meta: {
        menuKey: 'aulas',
        requiresAuth: true
      }
    }, {
      path: '/cursos',
      name: 'Cursos',
      component: Cursos,
      meta: {
        menuKey: 'cursos',
        requiresAuth: true
      }
    }, {
      path: '/disciplinas',
      name: 'Disciplinas',
      component: Disciplinas,
      meta: {
        menuKey: 'disciplinas',
        requiresAuth: true
      }
    }, {
      path: '/perfil',
      name: 'Perfil',
      component: Perfil,
      meta: {
        menuKey: '',
        requiresAuth: true
      }
    }, {
      path: '/configuracoes',
      name: 'Configuracoes',
      component: Configuracoes,
      meta: {
        menuKey: '',
        requiresAuth: true
      }
    }, {
      path: '/equipamentos',
      name: 'Equipamentos',
      component: Equipamentos,
      meta: {
        menuKey: 'equipamentos',
        requiresAuth: true
      }
    }, {
      path: '/cadastro',
      name: 'Cadastro',
      component: Cadastro,
      meta: {
        menuKey: '',
        requiresAuth: false,
        cadastro: true
      }
    }, {
      path: '/verificar-email',
      name: 'VerificarEmail',
      component: VerificarEmail,
      meta: {
        menuKey: '',
        requiresAuth: true
      }
    }, {
      path: '/actionHandler',
      name: 'actionHandler',
      component: actionHandler,
      meta: {
        menuKey: '',
        requiresAuth: false
      }
    }, {
      path: '/RecuperarSenha',
      name: 'RecuperarSenha',
      component: RecuperarSenha,
      meta: {
        menuKey: '',
        requiresAuth: false
      }
    }, {
      path: '/locais',
      name: 'Locais',
      component: Locais,
      meta: {
        menuKey: 'locais',
        requiresAuth: true
      }
    }, {
      path: '/reservas',
      name: 'Reservas',
      component: Reservas,
      meta: {
        menuKey: 'reservas',
        requiresAuth: true
      }
    }, {
      path: '/reservar',
      component: novaReserva,
      meta: {
        menuKey: 'reservas',
        requiresAuth: true
      },
      children: [{
        path: '',
        name: 'itemReserva',
        component: itemReserva,
        meta: {
          menuKey: 'reservas',
          requiresAuth: true
        }
      }, {
        path: ':item/:valorItem',
        name: 'periodoReserva',
        component: periodoReserva,
        meta: {
          menuKey: 'reservas',
          requiresAuth: true
        }
      }]
    }, {
      path: '*',
      redirect: '/'
    }, {
      path: '/usuarios',
      name: 'Usuarios',
      component: Usuarios,
      meta: {
        menuKey: 'usuarios',
        requiresAuth: true
      }
    },
    {
      path: '/habilitar',
      name: 'habilitar',
      component: Habilitacao,
      meta: {
        menuKey: 'habilitacao',
        requiresAuth: true
      }
    }, {
      path: '/habilitacao',
      name: 'habilitacao',
      component: naoHabilitado,
      meta: {
        menuKey: 'naohabilitado',
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  let login = to.matched.some(record => record.meta.login)
  let cadastro = to.matched.some(record => record.meta.cadastro)

  firebaseApp.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebaseApp.database().ref('Usuarios/' + firebaseApp.auth().currentUser.uid + '/role').on('value', function (snapshot) {
        if (!user.emailVerified && cadastro) next('verificar-email')
        else if ((!requiresAuth && login) || (!requiresAuth && cadastro)) next('home')
        else if (!requiresAuth && !login) next()
        else if ((to.name === 'Aulas' || to.name === 'Cursos') && snapshot.val() === 'Comum') next('home')
        else if ((to.name === 'Usuarios' || to.name === 'Configuracaoes') && snapshot.val() !== 'admin') next('home')
        else next()
      })
    } else {
      if (requiresAuth) next('login')
      else next()
    }
  })
})

export default router
