import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { toast } from '../composables/useToast'

const Home = () => import('../pages/Home.vue')
const About = () => import('../pages/About.vue')
const Login = () => import('../pages/Login.vue')
const Register = () => import('../pages/Register.vue')
const Lawyers = () => import('../pages/Lawyers.vue')
const LawyerDetail = () => import('../pages/LawyerDetail.vue')
const ClientDashboard = () => import('../pages/ClientDashboard.vue')
const ConsultationForm = () => import('../pages/ConsultationForm.vue')
const Consultations = () => import('../pages/Consultations.vue')
const ConsultationDetails = () => import('../pages/ConsultationDetails.vue')
const LawyerDashboard = () => import('../pages/LawyerDashboard.vue')
const AdminDashboard = () => import('../pages/AdminDashboard.vue')
const UsersPage = () => import('../pages/UsersPage.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/lawyers',
    name: 'Lawyers',
    component: Lawyers,
  },
  {
    path: '/lawyers/:id',
    name: 'LawyerDetail',
    component: LawyerDetail,
  },
  {
    path: '/client-dashboard',
    name: 'ClientDashboard',
    component: ClientDashboard,
    meta: { requiresAuth: true, allowedRoles: ['client'] },
  },
  {
    path: '/consultation/new',
    name: 'ConsultationForm',
    component: ConsultationForm,
    meta: { requiresAuth: true, allowedRoles: ['client'] },
  },
  {
    path: '/consultations',
    name: 'Consultations',
    component: Consultations,
    meta: { requiresAuth: true, allowedRoles: ['client', 'lawyer'] },
  },
  {
    path: '/consultations/:id',
    name: 'ConsultationDetails',
    component: ConsultationDetails,
    meta: { requiresAuth: true, allowedRoles: ['client', 'lawyer'] },
  },
  {
    path: '/lawyer-dashboard',
    name: 'LawyerDashboard',
    component: LawyerDashboard,
    meta: { requiresAuth: true, allowedRoles: ['lawyer'] },
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersPage,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'instant' }
  },
})

router.beforeEach(async (to, from, next) => {
  const { user, loading, initializeAuth, isAuthenticated } = useAuth()

  if (loading.value) {
    await initializeAuth()
  }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      toast.info('Silakan masuk terlebih dahulu untuk mengakses fitur ini')
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    if (to.meta.allowedRoles && to.meta.allowedRoles.length > 0) {
      const userRole = user.value?.role?.toLowerCase()
      if (!to.meta.allowedRoles.includes(userRole)) {
        toast.error('Anda tidak memiliki otoritas untuk mengakses halaman tersebut')
        return next('/')
      }
    }
  }

  next()
})

export default router
