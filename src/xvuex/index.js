import Vuex from 'vuex';
import AppStateModule from './modules/appState';

const createStore = () => {
    return new Vuex.Store({
        modules: {
            AppState: AppStateModule
        }
    })
}

export default createStore;