<template>
  <v-row justify="center" class="test">
    <v-dialog v-model="postgradDialog" max-width="30%">
      <v-card class="popup">
        <v-card-title class="headline">Choose a Programme:</v-card-title>

        <hr style="padding-left: 0" class="top-hr" />

        <v-alert
          border="top"
          colored-border
          color="red darken-2"
          type="info"
          elevation="2"
          class="info-banner"
        >
          The options are searchable
        </v-alert>

        <v-card-text>
          <h2 class="">Choose a Faculty</h2>
          <v-autocomplete
            v-model="faculty"
            :items="faculties"
            class="postgrad-faculty"
            color="red darken-2"
            dense
            filled
            attach
            label="Faculty"
            @change="getDepartments"
          ></v-autocomplete>

          <div v-if="this.faculty !== null">
            <h2 class="">Choose a Department</h2>
            <v-autocomplete
              v-model="department"
              :items="departments"
              class="postgrad-department"
              color="red darken-2"
              dense
              filled
              attach
              label="Department"
              @change="getProgrammes"
            ></v-autocomplete>
          </div>

          <div v-if="this.department !== null">
            <h2 class="">Choose a Programme</h2>
            <v-autocomplete
              v-model="programme"
              :items="programmes_only"
              class="postgrad-programme"
              color="red darken-2"
              dense
              filled
              attach
              label="Programme"
              @change="getDegrees"
            ></v-autocomplete>
          </div>

          <div v-if="this.programme !== null">
            <h2 class="">Choose an Degree</h2>
            <v-autocomplete
              v-model="degree"
              :items="degrees"
              class="postgrad-degree"
              color="red darken-2"
              dense
              filled
              attach
              label="Degree"
            ></v-autocomplete>
          </div>
        </v-card-text>

        <v-card-actions class="buttons">
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="postgradDialog = false">
            Cancel
          </v-btn>
          <v-btn color="red darken-1" text @click="goToProgramme">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { EventBus } from "@/event-bus.js";
import axios from "axios";

export default {
  name: "FindPostgrad",

  data() {
    return {
      postgradDialog: false,
      programmes: {},
      faculties: [],
      departments: [],
      programmes_only: [],
      degrees: [],
      faculty: null,
      department: null,
      programme: null,
      degree: null
    };
  },
  methods: {
    buildKey() {
      let key = this.programme + "_" + this.degree;
      return key.replace(" ", "_");
    },
    goToProgramme() {
      this.postgradDialog = false;

      const path = "http://isy-be.herokuapp.com/getPP";

      const getKey = this.buildKey();

      const payload = { key: getKey };

      axios
        .post(path, payload)
        .then(res => {
          const result = {
            type: "postgrad",
            data: res.data.programme
          };

          sessionStorage.setItem("currentProgramme", JSON.stringify(result));

          EventBus.$emit("sendProgramme", result);
          EventBus.$emit("updateProgramme", result);
        })
        .catch(error => {
          console.error(error);
        });

      this.faculty = null;
      this.department = null;
      this.programme = null;
      this.degree = null;
      this.faculties = [];
      this.departments = [];
      this.programmes_only = [];
      this.degrees = [];

      if (this.$router.currentRoute.name !== "Programme") {
        this.$router.push({ name: "Programme" });
      }
    },
    getDepartments() {
      this.department = null;
      this.programme = null;
      this.degree = null;
      this.departments = [];
      this.programmes_only = [];
      this.degrees = [];

      for (const department in this.programmes[this.faculty]) {
        this.departments.push(department);
      }
    },
    getProgrammes() {
      this.programme = null;
      this.degree = null;
      this.programmes_only = [];
      this.degrees = [];

      for (const prog in this.programmes[this.faculty][this.department]) {
        this.programmes_only.push(prog);
      }
    },
    getDegrees() {
      this.degree = null;
      this.degrees = [];

      for (const degree in this.programmes[this.faculty][this.department][
        this.programme
      ]) {
        this.degrees.push(degree);
      }
    },
    openPickProgramme(val) {
      this.postgradDialog = val;
    }
  },
  created() {},
  mounted() {
    if (sessionStorage.postgradProgrammes) {
      this.programmes = JSON.parse(
        sessionStorage.getItem("postgradProgrammes")
      );
    } else {
      EventBus.$on("getPP", res => {
        this.programmes = res;
      });
    }

    EventBus.$on("showPostgrad", res => {
      this.faculties = [];

      for (const faculty in this.programmes) {
        this.faculties.push(faculty);
      }

      this.postgradDialog = res;
    });
  }
};
</script>

<style scoped>
@media only screen and (max-width: 5000px) {
  .popup {
    height: 700px !important;
    overflow-y: scroll;
    -ms-overflow-style: none;
  }

  .popup::-webkit-scrollbar {
    display: none;
  }

  .top-hr {
    margin-bottom: 5%;
  }

  .info-banner {
    top: -10px;
    width: 80%;
    margin-left: 10%;
  }

  .buttons {
    position: absolute;
    left: 410px;
    bottom: 10px;
  }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
}
</style>
