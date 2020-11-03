<template>
  <div class="text-center">
    <v-menu open-on-click offset-y>
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <v-icon color="white">settings</v-icon>
        </v-btn>
      </template>

      <v-list v-if="loggedIn" dense flat>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>fas fa-sign-out-alt</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="list-title">
            Log Out
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else dense flat>
        <v-list-item href="https://isy-be.herokuapp.com/loginUser">
          <v-list-item-icon>
            <v-icon>fas fa-sign-in-alt</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="list-title">
            Log In
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style scoped>
@media only screen and (max-width: 5000px) {
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
}

a {
  color: #757575;
  text-decoration: none;
}

.list-title {
  position: relative;
  left: -10px;
}
</style>

<script>
import { EventBus } from "@/event-bus.js";

export default {
  name: "SettingsMenu",

  data() {
    return {
      userData: {},
      loggedIn: false
    };
  },

  created() {},

  methods: {
    logout() {
      sessionStorage.removeItem("user");
      this.loggedIn = false;
      window.location.href = "https://isy-be.herokuapp.com/logOutUser";
    }
  },
  mounted() {
    if (sessionStorage.user) {
      this.userData = JSON.parse(sessionStorage.getItem("user"));
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }

    EventBus.$on("sendIsLoggedIn", res => {
      const data = res;
      this.userData = data.user;
      this.loggedIn = data.logged;
    });
  }
};
</script>
