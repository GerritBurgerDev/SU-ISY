<template>
  <v-footer color="#a80000" padless fixed>
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="{ title, icon, path } in links"
        :key="title"
        :to="path"
        color="white"
        text
        class="footer-button-text my-1"
      >
        <v-icon class="mr-1 footer-icon" medium>{{ icon }}</v-icon>
        <div class="footer-icon-text">
          {{ title }}
        </div>
      </v-btn>
      <v-col class="sub-foot py-1 text-center white--text" cols="12">
        {{ new Date().getFullYear() }} - <strong>ISY</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",

  data() {
    return {
      links: [{ title: "HOME", icon: "home", path: "/" }]
    };
  },
  methods: {}
};
</script>

<style scoped>
@media only screen and (max-width: 5000px) {
  .sub-foot {
    background-color: #7c0800 !important;
  }

  .footer-button-text {
    background-color: rgba(0, 0, 0, 0) !important;
    font-size: medium;
    font-weight: bold;
  }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
  .footer-icon {
    font-size: 20px !important;
  }

  .footer-icon-text {
    display: none;
  }
}
</style>
