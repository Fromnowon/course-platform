import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/index',
      name: 'index',
      component: () => import('./views/Index.vue')
    },
    {
      path: "*",
      redirect: "/login"
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('./views/Upload.vue')
    }
  ]
})

//登录状态校验
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  //若未登录，跳转到login页面
  if (to.name == 'login') {
    //若已登录，则跳转到首页
    if (sessionStorage.getItem('userInfo') !== null) {
      next({
        name: 'index'
      });
    } else {
      next();
      return;
    }

  }
  if (sessionStorage.getItem('userInfo') === null) {
    next({
      name: 'login'
    });
  } else {
    next();
  }
})
export default router;