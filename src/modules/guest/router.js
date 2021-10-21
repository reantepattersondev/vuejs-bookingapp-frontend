import GuestLayout from './layout';
import Signin from './components/signin'
import ResetPassword from './components/reset_password'
import ForgotPassword from './components/forgot_password'

const router = [{
    path: '/guest',
    component: GuestLayout,
    children: [{
            path: '',
            redirect: 'signin'
        },
        {
            path: 'signin',
            component: Signin
        },
        {
            path: 'forgot_password',
            component: ForgotPassword
        },
        {
            path: 'reset_password/:token',
            component: ResetPassword
        }
    ]
}];

export default router;