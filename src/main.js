import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import './index.css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import GuestRouter from './modules/guest/router';
import AuthenticatedRouter from './modules/authenticated/router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueCarousel from 'vue-carousel';
import VueApollo from 'vue-apollo';

//Vuex
import Vuex from 'vuex';

import CommonSpinner from './common/component/spiner.vue'
import TimeLine from './common/component/timeline.vue'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

import moment from 'moment-timezone'
import VueMoment from 'vue-moment'
import { isLogin, logout } from './common/service/auth'

import Vuelidate from 'vuelidate'
import apolloClient from './apollo'

import createStore from './xvuex';


Vue.prototype.$moment = moment

library.add(faUserSecret)
library.add(faUser)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('CommonSpinner', CommonSpinner)
Vue.component('TimeLine', TimeLine)
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
Vue.component('DatePicker', DatePicker)

Vue.config.productionTip = false

Vue.use(VueApollo)
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMaterial)
Vue.use(require('vue-moment'));
Vue.use(VueCarousel);
Vue.use(VueMoment, {
    moment,
})
Vue.use(Vuelidate)

const router = new VueRouter({
    mode: 'history',
    routes: [
        ...GuestRouter,
        ...AuthenticatedRouter,
        {
            path: '',
            redirect: 'guest'
        }
    ]
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
        $query: {
          fetchPolicy: 'cache-and-network'
        }
    },
    errorHandler (error) {
        // eslint-disable-next-line no-console
        console.log('default error log', error)
        console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
        logout()
        router.push('/')
    },
});

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        console.log('auth check')
        if(isLogin()) {
            next()
        } else {
            next({
                path: '/',
            })
        }
        
    } else {
        next()
    }
})

new Vue({
    render: h => h(App),
    apolloProvider,
    router: router,
    store: createStore()
}).$mount('#app')