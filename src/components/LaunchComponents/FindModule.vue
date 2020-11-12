<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="30%">
      <v-card class="popup">
        <v-card-title class="headline">Choose a module:</v-card-title>

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
          <h2 class="">Choose a department</h2>
          <v-autocomplete
            v-model="value"
            class="module-department"
            :items="departments"
            color="red darken-2"
            dense
            filled
            attach
            label="Departments"
            @change="getModules"
          ></v-autocomplete>

          <h2 class="">Choose a module</h2>
          <v-autocomplete
            v-model="moduleValue"
            :items="get_modules"
            class="module-choose"
            color="red darken-2"
            dense
            filled
            attach
            label="Modules"
          ></v-autocomplete>
        </v-card-text>

        <v-card-actions class="buttons">
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="red darken-1" text @click="goToModule(moduleValue)">
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
  name: "FindModule",

  data() {
    return {
      modules: {},
      get_module: {},
      departments: [],
      get_modules: [],
      dialog: false,
      value: null,
      moduleValue: null
    };
  },
  methods: {
    goToModule(name) {
      this.dialog = false;

      const getKey = name.replace(" ", "_");

      const path = "http://127.0.0.1:5000/getModule";

      const payload = { key: getKey };

      axios
        .post(path, payload)
        .then(res => {
          this.get_module = res.data.module;

          sessionStorage.setItem(
            "currentModule",
            JSON.stringify(this.get_module)
          );
          EventBus.$emit("sendModule", this.get_module);
          EventBus.$emit("updateModule", this.get_module);
        })
        .catch(error => {
          console.error(error);
        });

      this.departments = [];
      this.get_modules = [];
      this.value = null;
      this.moduleValue = null;

      if (this.$router.currentRoute.name !== "Module") {
        this.$router.push({ name: "Module" });
      }
    },
    getModules() {
      this.get_modules = [];

      for (var mod in this.modules[this.value]) {
        this.get_modules.push(this.modules[this.value][mod].name);
      }
    },
    openPickModule(val) {
      this.dialog = val;
    }
  },
  created() {},
  mounted() {
    if (sessionStorage.modules) {
      this.modules = JSON.parse(sessionStorage.getItem("modules"));
    } else {
      EventBus.$on("getModules", res => {
        this.modules = res;
      });
    }

    EventBus.$on("showPickModule", res => {
      for (const dep in this.modules) {
        this.departments.push(dep);
      }
      this.dialog = res;
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
    position: relative;
    bottom: -260px !important;
  }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
}
</style>
