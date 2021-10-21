import AdminRouter from './components/admin/router'
import AgentRouter from './components/agent/router'
const Layout = {
    template: `
      <div>
        <router-view></router-view>
      </div>
    `,
  }

const router = [{
    path: '/authenticated',
    component: Layout,
    children : [
      ...AdminRouter,
      ...AgentRouter
    ],
    meta: { requiresAuth: true }
}]

export default router