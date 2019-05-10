import axios from '../utils/api-axios'

export default {
  state: {
    categories: [],
    errorMassage: '',
  },
  mutations: {
    GET_CATEGORIES_SUCCESS (state, resp) {
      state.categories = resp.data
    },
    ERROR(state, err) {
      state.errorMassage = err
    }
  },
  actions: {
    'GET_CATEGORIES': ({ commit }) => new Promise((resolve) => {
      axios({
        url: 'categories',
        method: 'GET',
      })
          .then((resp) => {
            resolve(resp)
            commit('GET_CATEGORIES_SUCCESS', resp.data)
          })
          .catch((err) => {
            commit('ERROR', err)
          })
    }),
    'GET_CITIES': ({ commit }, requestData) => new Promise((resolve) => {
      axios({
        url: `cities?${requestData}`,
        method: 'GET',
      })
          .then((resp) => {
            resolve(resp)
            commit('GET_CATEGORIES_SUCCESS', resp.data)
          })
          .catch((err) => {
            commit('ERROR', err)
          })
    }),
    'GET_COLLECTIONS': ({ commit } , requestData) => new Promise((resolve) => {
      axios({
        url: `/collections?${requestData}`,
        method: 'GET',
      })
          .then((resp) => {
            resolve(resp)
            commit('GET_CATEGORIES_SUCCESS', resp.data)
          })
          .catch((err) => {
            commit('ERROR', err)
          })
    }),
    'GET_RESTAURANT': ({ commit }) => new Promise((resolve) => {
      axios({
        url: 'restaurant',
        method: 'GET',
      })
          .then((resp) => {
            resolve(resp)
            commit('GET_CATEGORIES_SUCCESS', resp.data)
          })
          .catch((err) => {
            commit('ERROR', err)
          })
    }),
    'SEARCH': ({ commit }, requestData) => new Promise((resolve) => {
      axios({
        url: `search?${requestData}`,
        method: 'GET',
      })
          .then((resp) => {
            resolve(resp)
            commit('GET_CATEGORIES_SUCCESS', resp.data)
          })
          .catch((err) => {
            commit('ERROR', err)
          })
    }),
  }
}
