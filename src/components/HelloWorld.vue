<template>
  <b-container fluid>
    <b-row>
      <b-input-group class="mb-3">
        <b-form-input
            v-model="citiesName"
            placeholder="Sities"
            @keyup.enter="getCities()"
        >
        </b-form-input>
        <b-input-group-append>
          <b-button
              size="sm"
              text="Button"
              variant="success"
              @click="getCities()"
              @keyup.enter="getCities()"
          >Search city</b-button>
        </b-input-group-append>
      </b-input-group>

      <div v-for="city in cities.location_suggestions" :key="city.id">
        <div class="cities-box">{{ city.name }} </div>
        <div class="cities-box">{{ city.country_name }} </div>
        <img class="cities-box" :src="city.country_flag_url" alt="flag">
        <b-button variant="outline-primary" @click="getSearch(city.id)">Get restaurants</b-button>
      </div>
      <b-col md="12" v-if="cities.location_suggestions.length !== 0">
        <b-col md="6" class="my-1">
          <b-form-group label-cols-sm="3" label="Search cities" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filterCities" placeholder="Type to Search"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filterCities" @click="filterCities = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-table
              hover
              :items="cities.location_suggestions"
              :fields="citiesTable"
              id="cities"
              small
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              primary-key="a"
              :tbody-transition-props="transProps"
              bordered
              :filter="filterCities"
          >
            <template slot="country_name" slot-scope="data">
              <div class="cities-box">{{ data.item.country_name }}</div>
              <img class="cities-box" :src="data.item.country_flag_url" alt="flag">
            </template>
          </b-table>
        </b-col>
      </b-col>
      <b-table
          v-if="Object.entries(restaurants).length !== 0"
          hover
          :items="restaurants"
          :fields="restaurantsTable"
          id="restaurants"
          small
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          primary-key="a"
          :tbody-transition-props="transProps"
          bordered
      >
        <template slot="featured_image" slot-scope="data">
          <img class="cities-box" :src="data.item.featured_image" alt="">
        </template>
      </b-table>

      <!--    <b-form-select v-model="selected">-->
      <!--      <option :value="category.id" v-for="category in categories" :key="category.id">{{ category.name }}</option>-->
      <!--    </b-form-select>-->
    </b-row>
  </b-container>
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
        filterCities: '',
        sortDesc: false,
        loading: false,
        categories: [],
        cities: {
          location_suggestions: [],
        },
        restaurants: [],
        citiesName: '',
        selected: null,
        restaurantsTable: {
          featured_image: { label: 'featured_image', sortable: false },
          name: { label: 'name', sortable: true },
          cuisines: { label: 'cuisines', sortable: true },
        },
        citiesTable: {
          country_name: { label: 'Country name', sortable: true },
          // country_name: { label: 'country_name', sortable: true },
          name: { label: 'name', sortable: true },
        },
        transProps: {
          name: 'flip-list'
        },
      }
    },

    methods: {
      getCategories() {
        this.categories = [];
        this.$store.dispatch('GET_CATEGORIES')
          .then((resp) => {
            resp.data.categories.forEach((elem) => {
              this.categories.push(elem.categories)
            });
            if (this.categories[0].id) this.selected = this.categories[0].id
          })
      },
      getCities() {
        const dataParams = `q=${this.citiesName}&count=100`;
        this.$store.dispatch('GET_CITIES', dataParams)
          .then((resp) => {
            this.cities = resp.data;
          })
      },
      getSearch(cityId) {
        const dataParams = `entity_id=${cityId}&entity_type=city`;
        this.$store.dispatch('SEARCH', dataParams)
          .then((resp) => {
            resp.data.restaurants.forEach((elem) => {
              this.restaurants.push(elem.restaurant)
            })
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
