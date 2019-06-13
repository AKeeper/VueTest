<template>
  <b-container fluid>
    <b-row class="justify-content-md-center">
      <b-col cols="12" md="auto">
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
            >Search city
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
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
        <b-col cols="12" md="auto">
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
              <img class="cities-box" :src="data.item.country_flag_url" alt="flag">
              <div class="cities-box">{{ data.item.country_name }}</div>
            </template>
            <template slot="name" slot-scope="data">
              <div>{{ data.item.name }}</div>
              <b-button
                  variant="outline-primary"
                  @click="cityId = data.item.id, restaurants = [], showRestaurants = true, getSearch()">
                Get restaurants
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-col>
    </b-row>
    <b-row v-if="showRestaurants" class="justify-content-md-center">
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Per page" class="mb-0">
          <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label-cols-sm="3" label="Search cuisines" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filterRes" placeholder="Type to Search"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filterRes" @click="filterRes = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="12" md="auto" :key="restaurantsKey">
        <b-table
            hover
            :items="restaurants"
            :fields="restaurantsTable"
            id="restaurants"
            :current-page="currentPage"
            :per-page="perPage"
            small
            :sort-by.sync="sortByR"
            :sort-desc.sync="sortDescR"
            :sort-direction="sortDirectionR"
            primary-key="a"
            :tbody-transition-props="transProps"
            bordered
            :filter="filterRes"
        >
          <template slot="featured_image" slot-scope="data">
            <b-card
                :title="data.item.name.toUpperCase()"
                :img-src="data.item.featured_image"
                img-alt="Image"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mb-2"
            >
              <b-card-text>
                <span :style="'color: #' + data.item.user_rating.rating_color + ';'">
                  Rating: {{ data.item.user_rating.aggregate_rating }}
                </span> <br>
                Votes: {{data.item.user_rating.votes}}<br>
                {{ data.item.location.address }}
              </b-card-text>
              <b-button :href="data.item.events_url" target="blank" variant="primary">Detail</b-button>
            </b-card>
          </template>
          <template slot="cuisines" slot-scope="data">
            cuisines: {{ data.item.cuisines }}
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row v-if="showRestaurants" class="justify-content-md-center">
      <b-col md="6" class="my-1">
        <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            class="my-0"
            @click="getSearch()"
        ></b-pagination>
      </b-col>
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
        currentPage: 1,
        restaurantsKey: 0,
        perPage: 20,
        totalRows: null,
        sortBy: 'name',
        sortByR: 'cuisines',
        sortDescR: false,
        sortDirectionR: 'asc',
        filterCities: '',
        filterRes: '',
        cityId: '',
        sortDesc: false,
        loading: false,
        showRestaurants: false,
        categories: [],
        pageOptions: [10, 20, 30],
        checkArray: [],
        cities: {
          location_suggestions: [],
        },
        restaurants: [],
        citiesName: '',
        selected: null,
        restaurantsTable: {
          featured_image: {label: 'Restaurant', sortable: false},
          cuisines: {label: 'cuisines', sortable: false},
        },
        citiesTable: {
          country_name: {label: 'Country', sortable: true},
          // country_name: { label: 'country_name', sortable: true },
          name: {label: 'City', sortable: true},
        },
        transProps: {
          name: 'flip-list'
        },
      }
    },
    watch: {
      currentPage() {
        this.getSearch()
      }
    },
    methods: {
      getCities() {
        const dataParams = `q=${this.citiesName}&count=100`;
        this.$store.dispatch('GET_CITIES', dataParams)
          .then((resp) => {
            this.cities = resp.data;
          })
      },
      getSearch() {
        const startPage = `&start=${this.currentPage * this.perPage}`;
        const dataParams = `entity_id=${this.cityId}&entity_type=city${startPage}&count=${this.perPage}`;
        if (!this.checkArray.includes(this.currentPage)) {
          this.checkArray.push(this.currentPage);
          this.$store.dispatch('SEARCH', dataParams)
            .then((resp) => {
              this.totalRows = resp.data.results_found;
              resp.data.restaurants.forEach((elem) => {
                this.restaurants.push(elem.restaurant);
              });
              this.restaurantsKey += 1;
            });
        }
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

  .cities-box {
    display: inline-block;
  }

  img.cities-box {
    width: 40px;
  }
</style>
