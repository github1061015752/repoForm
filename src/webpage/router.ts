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
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
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
