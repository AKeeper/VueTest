<template>
  <div class="hello">

<!--    <b-button variant="outline-primary" @click="getCategories()">GET_CATEGORIES</b-button>-->
<!--    <b-button variant="outline-primary" @click="getCities()">GET_CITIES</b-button>-->
<!--    <b-button variant="outline-primary" @click="getCollections()">GET_COLLECTIONS</b-button>-->
<!--    <b-button variant="outline-primary" @click="getSearch()">SEARCH</b-button>-->

    <b-input-group class="mb-3">
      <b-form-input v-model="citiesName" placeholder="Sities"></b-form-input>
      <b-input-group-append>
        <b-button size="sm" text="Button" variant="success" @click="getCities()">Search city</b-button>
      </b-input-group-append>
    </b-input-group>

    <div v-for="city in cities.location_suggestions" :key="city.id">
      <div class="cities-box">{{ city.name }} </div>
      <div class="cities-box">{{ city.country_name }} </div>
      <img class="cities-box" :src="city.country_flag_url" alt="flag">
      <b-button variant="outline-primary" @click="getSearch(city.id)">Get restaurants</b-button>
    </div>

    <b-table
        hover
        :items="restaurants"
        :fields="restaurantsTable"
        id="table-transition-example"
        striped
        small
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        primary-key="a"
        :tbody-transition-props="transProps"
    >
      <template slot="featured_image" slot-scope="data">
        <img class="cities-box" :src="data.item.featured_image" alt="">
      </template>
    </b-table>

<!--    <b-form-select v-model="selected">-->
<!--      <option :value="category.id" v-for="category in categories" :key="category.id">{{ category.name }}</option>-->
<!--    </b-form-select>-->
  </div>
</template>

<script>
  export default {

    name: 'HelloWorld',

    props: {
      msg: String
    },

    data() {
      return {
        sortBy: 'name',
        sortDesc: false,
        loading: false,
        categories: [],
        cities: {
          location_suggestions: [],
        },
        restaurants: [],
        citiesName: '',
        selected: null,
        restaurantsTable: ['name', 'featured_image', 'cuisines'],
        transProps: {
          name: 'flip-list'
        },
      }
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
            });
            if (this.categories[0].id) this.selected = this.categories[0].id
          })
          .catch((err) => {
            console.log(err)
          })
      },
      getCollections() {
        this.categories = []
        const city_id = 208
        const dataParams = `city_id=${city_id}`
        this.$store.dispatch('GET_COLLECTIONS', dataParams)
          .then((resp) => {
            console.log(resp.data)
          })
          .catch((err) => {
            console.log(err)
          })
      },
      getCities() {
        const dataParams = `q=${this.citiesName}`;
        this.$store.dispatch('GET_CITIES', dataParams)
          .then((resp) => {
            this.cities = resp.data;
            console.log(resp.data)
          })
          .catch((err) => {
            console.log(err)
          })
      },
      getSearch(cityId) {
        const dataParams = `entity_id=${cityId}&entity_type=city`;
        this.$store.dispatch('SEARCH', dataParams)
          .then((resp) => {
            resp.data.restaurants.forEach((elem) => {
              this.restaurants.push(elem.restaurant)
            });
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

  table#table-transition-example .flip-list-move {
    transition: transform 1s;
  }

  .cities-box{
    display: inline-block;
  }
  img{
    width: 40px;
  }
</style>
