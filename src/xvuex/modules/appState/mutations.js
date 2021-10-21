const MutationTypes = {
    APP_BUSY : 'app_state_busy',
    APP_NOT_BUSY : 'app_state_not_busy'
}

const mutations = {
    [MutationTypes.APP_BUSY]: (state) => {
        state.busy = true
    },
    [MutationTypes.APP_NOT_BUSY]: (state) => {
        state.busy = false
    },
}

export {mutations, MutationTypes}