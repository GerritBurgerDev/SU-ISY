<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="40%">
      <v-card class="postgrad-possibilities">
        <v-row justify="center">
          <v-card-title>
            Your postgraduate possibilities are:
          </v-card-title>
        </v-row>

        <hr />

        <v-row
          v-for="(val, key) in this.possibilities"
          :key="key"
          justify="center"
          no-gutters
          class="postgrad-possibilities-dialog"
        >
          <v-col align="center">
            <v-btn dark class="mt-4" color="red darken-2" @click="goToPostgradProgramme(val)">
              {{ key }}
            </v-btn>
          </v-col>
        </v-row>

        <v-card-actions class="buttons">
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">
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
  name: "PostgradPossibilities",

  data() {
    return {
      possibilities: {},
      dialog: false
    };
  },

  methods: {
    getPossibilities(userData) {
      const path = "https://isy-be.herokuapp.com/getPostgradPossibilities";

      axios
        .post(path, userData)
        .then(res => {
          this.possibilities = res.data.result;
        })
        .catch(error => {
          console.error(error);
        });
    },
    goToPostgradProgramme(name) {
      const path = "https://isy-be.herokuapp.com/getPP";

      const payload = { key: name };

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

      this.dialog = false;

      if (this.$router.currentRoute.name !== "Programme") {
        this.$router.push({ name: "Programme" });
      }
    }
  },

  mounted() {
    EventBus.$on("showPostgradPossibilities", res => {
      this.getPossibilities(res);

      this.dialog = true;
    });
  }
};
</script>

<style scoped>
.postgrad-possibilities{
    overflow-x: hidden;
}

</style>
