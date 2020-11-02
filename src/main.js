import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VuePageTransition from "vue-page-transition";
import "simplemde/dist/simplemde.min.css";
import { RichTextEditorPlugin } from "@syncfusion/ej2-vue-richtexteditor";

Vue.use(VuePageTransition);
Vue.use(RichTextEditorPlugin);
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
