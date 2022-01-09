import ApiService from '../classes/ApiService';

const state = {
    urlList : {
        'getSchemasList' : 'https://clarityapi.intelligo.ai/api/v1/schemas/list',
        'getSchemaByType' : 'https://clarityapi.intelligo.ai/api/v1/schemas/',
        'postForm' : 'https://clarityapi.intelligo.ai/api/v1/schemas/submit'

},
    schemaList : [],
    schema: null,
    change:false,
};
const actions = {

    async getSchema({ commit }, params) {
        try {
            let service = new ApiService(params.url);
            let res = await service.getRequest();
            if(!res.succeeded) {
                return {status: false}
            }
            commit('setSchema', res.result.scheme)
            return {status : true}

        } catch (err) {
            return {status: false}
        }
    },
    stateChange({ commit , state},param){
        commit('setChange', param)
    },
    async statePostForm({commit, state}, params) {
        try {
            let service = new ApiService(state.urlList.postForm);
            let res = await service.postRequest(params);
            if (!res.succeeded) {
                return {status: false}
            }
            return {status: true}

        } catch (err) {
            return {status: false}
        }
    },
    async getSchemasList({ commit }, params) {
        try {
            let service = new ApiService(params.url);
            let res = await service.getRequest();
            if(!res.succeeded) {
                return {status: false}
            }
            commit('setSchemaList', res.result.schemasList)
            return {status : true}

        } catch (err) {
            return {status: false}
        }
    },
};
const mutations = {
    setSchemaList(state, data) {
        state.schemaList = data
    },
    setSchema(state, data) {
        state.schema = data
    },
    setChange(state, data) {
        state.change = data
    },
};
const getters = {};



export const M_DynamicForm = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};