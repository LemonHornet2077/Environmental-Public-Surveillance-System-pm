import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SubmitFeedbackView from '../views/SubmitFeedbackView.vue'
import FeedbackListView from '../views/FeedbackListView.vue'
import AQIInfoView from '../views/AQIInfoView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { requiresAuth: false }
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: { requiresAuth: false }
        },
        {
            path: '/submit-feedback',
            name: 'submit-feedback',
            component: SubmitFeedbackView,
            meta: { requiresAuth: true }
        },
        {
            path: '/feedback',
            name: 'feedback',
            component: FeedbackListView,
            meta: { requiresAuth: true }
        },
        {
            path: '/aqi-info',
            name: 'aqi-info',
            component: AQIInfoView,
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth !== false
    const isLoggedIn = !!localStorage.getItem('supervisor_token')

    if (requiresAuth && !isLoggedIn) {
        // 需要登录但未登录，重定向到登录页
        next({ name: 'login' })
    } else if (!requiresAuth && isLoggedIn && (to.name === 'login' || to.name === 'register')) {
        // 已登录但访问登录或注册页，重定向到首页
        next({ name: 'home' })
    } else {
        // 其他情况正常通过
        next()
    }
})

export default router
