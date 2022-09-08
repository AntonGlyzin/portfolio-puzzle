import { createRouter, createWebHistory } from 'vue-router'
import PortfolioDetail from '@/views/PortfolioDetail.vue'
import UserCard from '@/views/userCard'
import PortfolioListView from '@/views/PortfolioListView.vue'
import EventsView from '@/views/EventsView.vue'

const routes = [
  {
    path: '/follow/posts/events',
    name: 'events-main-follow',
    component: EventsView,
    meta: { view: 'events' },
    props: true
  },
  {
    path: '/follow/posts/blog',
    name: 'blog-main-follow',
    component: PortfolioListView,
    props: true,
    meta: { view: 'PortfolioListView' }
  },
  {
    path: '/follow/posts/portfolio',
    name: 'portfolio-main-follow',
    component: PortfolioListView,
    props: true,
    meta: { view: 'PortfolioListView' }
  },
  {
    path: '/portfolio',
    name: 'portfolio-main',
    component: PortfolioListView,
    props: true,
    meta: { view: 'PortfolioListView' }
  },
  {
    path: '/blog',
    name: 'blog-main',
    component: PortfolioListView,
    props: true,
    meta: { view: 'PortfolioListView' }
  },
  {
    path: '/card/user/:users',
    name: 'user-card',
    component: UserCard,
    props: true
  },
  {
    path: '/events',
    name: 'events-main',
    component: EventsView,
    meta: { view: 'events' },
    props: true
  },
  {
    path: '/:prefix/post/:slug',
    name: 'post-Detail',
    component: PortfolioDetail,
    meta: { view: 'PortfolioDetail' },
    props: true
  },
  {
    path: '/aboutme',
    name: 'about-me',
    component: () => import('@/views/AboutView.vue'),
    meta: { view: 'AboutView' },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
