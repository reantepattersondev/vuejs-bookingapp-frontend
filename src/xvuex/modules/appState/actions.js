import {login, forgotPassword} from '@/common/service/authService'
import {MutationTypes} from './mutations'

const actions = {
    async AppStateLogin(context, payload) {
        let username = payload.username
        let password = payload.password
        let loginResult = await login({
            username: username,
            password: password
        })
        
        console.log('login result', loginResult);
    },
    AppStateBusy(context, busy) {
        if(busy) {
            context.commit(MutationTypes.APP_BUSY)
        } else {
            context.commit(MutationTypes.APP_NOT_BUSY)
        }
    },

    async APP_STATE_FORGOT_PSW(context, username) {
        context.commit(MutationTypes.APP_BUSY)
        let result = await forgotPassword(username)
        context.commit(MutationTypes.APP_NOT_BUSY)
        return result
    }
}

export default actions