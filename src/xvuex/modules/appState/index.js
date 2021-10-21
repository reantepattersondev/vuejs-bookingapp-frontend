// import actions from './actions'
import state from './state'
// import {login} from '@/common/service/authService'
import {mutations} from './mutations'
import actions from './actions'
const AppStateModule = {
    state: state,
    actions: actions,
    mutations: mutations
}

export default AppStateModule;