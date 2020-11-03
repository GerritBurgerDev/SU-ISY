<template>
  <v-navigation-drawer
    v-model="drawerVal"
    app
    clipped
    temporary
    overlay-opacity="0"
    class="sidebar"
    :style="`margin-top: ${$vuetify.application.top}px`"
    :value="true"
  >
    <v-list dense flat>
      <v-list-item :to="{ path: '/general' }">
        <v-list-item-title>General Information</v-list-item-title>
      </v-list-item>

      <v-list-group>
        <template v-slot:activator>
          <v-list-item-title class="nav-drawer-programmes"
            >Programmes</v-list-item-title
          >
        </template>

        <v-list-item class="nav-drawer-undergrad" @click="pickUndergrad">
          <v-list-item-title>Undergraduate</v-list-item-title>
        </v-list-item>
        <v-list-item class="nav-drawer-postgrad" @click="pickPostgrad">
          <v-list-item-title>Postgraduate</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-item class="nav-drawer-modules" @click="pickModule">
        <v-list-item-title>Modules</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.mod-title {
  color: #5f5f5f;
}

@media only screen and (max-width: 5000px) {
  .sidebar {
    overflow-y: auto;
    padding-bottom: 3%;
    width: 23% !important;
  }
}

@media only screen and (max-width: 1700px) {
  .sidebar {
    width: 40% !important;
  }
}

@media only screen and (max-width: 1100px) {
  .sidebar {
    width: 55% !important;
  }
}

@media only screen and (max-width: 750px) {
  .sidebar {
    width: 100% !important;
  }
}
</style>

<script>
import { EventBus } from "@/event-bus.js";
import axios from "axios";

export default {
  name: "NavDrawer",
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    modules: {
      type: Object
    }
  },
  data() {
    return {
      get_module: {},
      drawerVal: false,
      showAlertVal: false,
      showAlertMsg: "",
      programme_titles: [{ title: "Undergraduate" }, { title: "Postgraduate" }]
    };
  },
  methods: {
    goToModule(name) {
      const path = "https://isy-be.herokuapp.com/getModule";

      const payload = { key: name };

      axios
        .post(path, payload)
        .then(res => {
          this.get_module = res.data.module;
          sessionStorage.setItem(
            "currentModule",
            JSON.stringify(this.get_module)
          );
          EventBus.$emit("sendModule", this.get_module);
        })
        .catch(error => {
          console.error(error);
        });
      this.drawerVal = false;

      EventBus.$emit("updateDrawer", this.drawerVal);
    },
    pickModule() {
      EventBus.$emit("showPickModule", true);
    },
    pickUndergrad() {
      EventBus.$emit("showUndergrad", true);
    },
    pickPostgrad() {
      EventBus.$emit("showPostgrad", true);
    }
  },
  created() {},
  mounted() {
    EventBus.$on("onDrawer", res => {
      this.drawerVal = res;
    });
  }
};
</script>
