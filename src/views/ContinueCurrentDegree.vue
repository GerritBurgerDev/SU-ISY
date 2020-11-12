<template>
  <div class="ccd">
    <v-card class="custom-card mx-auto">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline h1"
            >{{ this.user.name }} {{ this.user.surname }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ this.user._key }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
        <div>
          <h1 class="header">{{ this.user.programme }}</h1>
          <div class="sub-header">
            <div v-if="this.user.degree !== ''">
              <h2>Degree: {{ this.user.degree }}</h2>
            </div>
            <div v-if="this.user.stream !== ''">
              <h3>Stream: {{ this.user.stream }}</h3>
            </div>
            <div v-if="this.user.option !== ''">
              <h3>Option: {{ this.user.option }}</h3>
            </div>
          </div>

          <div class="undergrad">
            <h2 class="undergrad-heading">Undergraduate Modules</h2>
            <v-row no-gutters>
              <v-col v-for="(content, year) in this.module_info" :key="year">
                <h3 class="undergrad-subheading">{{ year }}</h3>
                <v-item-group
                  v-for="(modules, type) in content"
                  :key="type"
                  style="padding-bottom: 10px"
                >
                  <h4>{{ type }}</h4>
                  <div
                    v-if="
                      Object.keys(modules).length === 0 &&
                        type === 'Elective Modules'
                    "
                  >
                    No elective modules to display
                  </div>

                  <v-item v-for="(grade, module) in modules" :key="module">
                    <div v-if="grade >= 50">
                      <v-icon color="green">check</v-icon>
                      {{ module }}
                    </div>
                    <div v-else-if="grade === 0">
                      <v-icon color="orange">access_time</v-icon>
                      {{ module }}
                    </div>
                    <div v-else>
                      <v-icon color="red">clear</v-icon>
                      {{ module }}
                    </div>
                  </v-item>
                </v-item-group>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          class="possibilities-button"
          text
          color="red darken-1"
          @click="showDialog"
        >
          What are my possibilities?
        </v-btn>
      </v-card-actions>
    </v-card>

    <possibilities />
  </div>
</template>

<script>
import { EventBus } from "@/event-bus.js";
import possibilities from "@/components/CCDComponents/UP.vue";
import axios from "axios";

export default {
  name: "ContinueCurrentDegree",

  components: {
    possibilities
  },

  data() {
    return {
      user: {},
      module_info: {}
    };
  },

  methods: {
    showDialog() {
      const path = "http://127.0.0.1:5000/CCD";

      axios
        .post(path, { user_info: this.user })
        .then(res => {
          const data = { result: res.data.result, show: true };
          EventBus.$emit("showPossibilities", data);
        })
        .catch(error => {
          console.error(error);
        });
    },
    buildProgrammeDetailsDictionary(dic, key, build, comp, elec) {
      if (typeof dic[key] === "object") {
        for (let item in dic[key]) {
          if (key === "Compulsory Modules") {
            this.buildProgrammeDetailsDictionary(
              dic[key],
              item,
              build,
              true,
              false
            );
          } else if (key === "Elective Modules") {
            this.buildProgrammeDetailsDictionary(
              dic[key],
              item,
              build,
              false,
              true
            );
          } else {
            this.buildProgrammeDetailsDictionary(
              dic[key],
              item,
              build,
              comp,
              elec
            );
          }
        }
      } else if (Number.isInteger(dic[key])) {
        if (comp) build["Compulsory Modules"][key] = dic[key];
        else if (elec) build["Elective Modules"][key] = dic[key];
      }
    },
    getProgrammeDetails() {
      const temp = {};

      for (const year in this.user["undergrad"]) {
        temp[year] = {
          "Compulsory Modules": {},
          "Elective Modules": {}
        };
        this.buildProgrammeDetailsDictionary(
          this.user["undergrad"],
          year,
          temp[year],
          false,
          false
        );
      }

      this.module_info = temp;
    }
  },

  created() {},

  mounted() {
    if (sessionStorage.user) {
      this.user = JSON.parse(sessionStorage.getItem("user"));
      this.getProgrammeDetails();
    }
  }
};
</script>

<style scoped>
@media only screen and (max-width: 5000px) {
  .ccd {
    margin-left: 8%;
    margin-right: 8%;
    margin-top: -10px;
  }

  .custom-card {
    padding-left: 2%;
    padding-right: 2%;
    overflow-y: scroll;
    height: 84vh;
    -ms-overflow-style: none;
  }

  .custom-card::-webkit-scrollbar {
    display: none;
  }

  .header {
    margin-bottom: 15px;
  }

  .sub-header {
    margin-bottom: 30px;
  }

  .undergrad-heading {
    margin-bottom: 10px;
  }

  .undergrad-subheading {
    margin-bottom: 10px;
  }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
}
</style>
