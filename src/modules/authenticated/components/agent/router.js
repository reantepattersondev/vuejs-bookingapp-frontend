import AgentLayout from './layout'
import BookingComponent from './components/booking'
import AgentScheduleComponent from './components/schedule'
const router = [
    {
        path: 'agent',
        component: AgentLayout,
        children: [
            {
                path: 'booking',
                component: BookingComponent
            },
            {
                path: 'schedule',
                component: AgentScheduleComponent
            },
            {
                path: '',
                redirect: 'booking'
            },
            {
                path: '*',
                redirect: 'booking'
            }
        ],
        meta: { role: 'agent' }
    }
]

export default router;