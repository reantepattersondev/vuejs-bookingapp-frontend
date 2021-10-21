import AdminLayout from './layout'
import {RoomManageComponent, ScheduleManageComponent, UserManageComponent} from './components'

const router = [{
    path: 'admin',
    component: AdminLayout,
    children: [
        {
            path: 'room',
            component: RoomManageComponent
        },
        {
            path: 'schedule',
            component: ScheduleManageComponent
        },
        {
            path: 'user',
            component: UserManageComponent
        },
        {
            path: '',
            redirect: 'room'
        },
        {
            path: '*',
            redirect: 'room'
        }
    ],
    meta: { role: 'admin' }
}]

export default router