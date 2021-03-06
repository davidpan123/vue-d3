import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: { name: 'chart' }
    },
    {
      path: '/chart',
      name: 'chart',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Chart.vue')
    },
    {
      path: '/tree',
      name: 'tree',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "tree" */ './views/tree.vue')
    },
    {
      path: '/orchestrator',
      name: 'orchestrator',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/orchestrator.vue')
    },
    {
      path: '/learn',
      name: 'learn',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "learn" */ './views/learn.vue')
    },
    {
      path: '/force',
      name: 'force',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "force" */ './views/Force.vue')
    },
    {
      path: '/relation',
      name: 'relation',
      // route level code-splitting
      // this generates a separate chunk (relation.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "relation" */ './views/Relation.vue')
    },
    {
      path: '/scatter',
      name: 'scatter',
      // route level code-splitting
      // this generates a separate chunk (relation.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "relation" */ './views/scatter.vue')
    }
  ]
})
