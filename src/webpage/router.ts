import { createRouter, createWebHashHistory } from 'vue-router';

let routes = [
  {
    path: '/icon',
    component: () => import('@/components/base/icon/Compon.vue'),
    children: [
      {
        path: '',
        component: () => import('@/components/base/icon/IconUse.vue'),
        meta: {
          title: 'Compon | Icon'
        }
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/form',
    component: () => import('@/views/form/Form.vue')
  },
  {
    path: '/criRecord',
    component: () => import('@/views/criminal/CriRecord.vue')
  },
  {
    path: '/statistic',
    component: () => import('@/views/statistic/Statistic.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue')
  }
];

let router = createRouter({
  history: createWebHashHistory(),
  routes
});

export { router };
