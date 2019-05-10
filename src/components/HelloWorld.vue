<template>
  <div class="hello">
    <button @click="getCategories()">GET_CATEGORIES</button>
    <button @click="getLocations()">GET_LOCATION</button>
<!--    <b-table striped hover :items="categories"></b-table>-->
    <b-form-select v-model="selected">
      <option :value="category.id" v-for="category in categories" :key="category.id">{{ category.name }}</option>
    </b-form-select>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        categories: [],
        selected: null,
      }
    },

    name: 'HelloWorld',

    props: {
      msg: String
    },

    created() {
      this.getCategories()
    },

    methods: {
      getCategories() {
        this.categories = []
        this.$store.dispatch('GET_CATEGORIES')
          .then((resp) => {
            resp.data.categories.forEach((elem) => {
              this.categories.push(elem.categories)
            })
            if (this.categories[0].id) this.selected = this.categories[0].id
          })
          .catch((err) => {
            console.log(err)
          })
      },
      getLocations() {
        this.categories = []
        const requestData = {
          res_id: 1,
        }
        this.$store.dispatch('GET_LOCATION', requestData)
          .then((resp) => {
            console.log(resp.data)
          })
          .catch((err) => {
            console.log(err)
          })
      },
    },
  }
</script>

<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
