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
        data: {},
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
    'GET_LOCATION': ({ commit }, requestData) => new Promise((resolve) => {
      axios({
        url: 'locations',
        data: requestData,
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
