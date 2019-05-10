import axios from 'axios'

const configure = (axios) => {
  axios.defaults.baseURL = 'https://developers.zomato.com/api/v2.1';
  axios.interceptors.request.use((config) => {
    config.headers['user-key'] = '771f36c3d681549a3a577735cb81a977';
    return config
  });
  axios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response) {
        // eslint-disable-next-line
        console.log(error);
        return Promise.reject(error.response)

      }
    },
  );
  return axios
};
export default configure(axios)