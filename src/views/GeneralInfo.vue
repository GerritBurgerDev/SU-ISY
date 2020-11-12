<template>
  <div class="home">
    <v-card style="height: 100%">
      <v-tabs
        mobile-break-point="100"
        show-arrows
        class="tabs"
        v-model="model"
        centered
        grow
        color="red darken-4"
      >
        <v-tab v-for="key in this.tabs" :key="key">
          {{ key }}
        </v-tab>

        <v-tabs-items v-model="model">
          <v-tab-item
            class="section"
            v-for="key in this.getKeysOnly(this.info)"
            :key="key"
          >
            <div
              class="pl-8 pr-8"
              v-html="info[key]"
              v-if="Object.keys(user).length === 0 || !user['admin']"
            ></div>
            <ejs-richtexteditor
              v-model="info[key]"
              :toolbarSettings="toolbarSettings"
              v-else
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card>

    <v-speed-dial
      v-if="user['admin']"
      style="right: 9%; bottom: 4%"
      v-model="fab"
      bottom
      right
      absolute
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="red darken-2"
          class="changes-settings"
          fab
          bottom
          right
        >
          <v-icon color="white" v-if="fab">
            close
          </v-icon>
          <v-icon color="white" v-else>
            settings
          </v-icon>
        </v-btn>
      </template>
      <v-btn fab small color="green">
        <v-icon color="white" @click="saveChanges">save</v-icon>
      </v-btn>
      <v-btn fab small color="blue lighten-1">
        <v-icon color="white" @click="resetChanges">undo</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
</template>

<style scoped>
@import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-lists/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-richtexteditor/styles/material.css";

@media only screen and (max-width: 5000px) {
  .home {
    margin-top: -10px;
    margin-left: 8% !important;
    margin-right: 8% !important;
    height: 84vh;
    overflow-y: scroll;
    -ms-overflow-style: none;
  }

  .home::-webkit-scrollbar {
    display: none;
  }

  .section-contents {
    padding-left: 2%;
    padding-right: 2%;
  }

  hr {
    border-top: 1px solid #a80000;
  }

  .list-item {
    list-style-type: disc;
  }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
  .home {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-left: 2%;
    padding-right: 2%;
    height: 78vh;
  }
}
</style>

<script>
// import {EventBus} from "@/event-bus.js";
import {
  Toolbar,
  Link,
  Image,
  Count,
  HtmlEditor,
  QuickToolbar,
  Table
} from "@syncfusion/ej2-vue-richtexteditor";
import axios from "axios";

export default {
  name: "Home",

  provide: {
    richtexteditor: [
      Toolbar,
      Link,
      Image,
      Count,
      HtmlEditor,
      QuickToolbar,
      Table
    ]
  },

  data() {
    return {
      toolbarSettings: {
        type: "MultiRow",
        items: [
          "Bold",
          "Italic",
          "Underline",
          "StrikeThrough",
          "FontSize",
          "FontColor",
          "BackgroundColor",
          "LowerCase",
          "UpperCase",
          "|",
          "Formats",
          "Alignments",
          "OrderedList",
          "UnorderedList",
          "Outdent",
          "Indent",
          "|",
          "CreateLink",
          "|",
          "ClearFormat",
          "CreateTable",
          "FullScreen",
          "|",
          "SourceCode",
          "Undo",
          "Redo"
        ]
      },
      model: true,
      info: {},
      tabs: [
        "Examination, Promotion and Faculty provisions",
        "History",
        "Faculty Contact Details",
        "University Contact Details",
        "Language",
        "Qualifications",
        "Dean's Examination"
      ],
      backup: {},
      fab: false,
      user: {}
    };
  },
  methods: {
    getGeneralInfo() {
      const path = "http://127.0.0.1:5000/getGeneralInfo";
      axios
        .get(path)
        .then(res => {
          const info = res.data.information;
          this.info = info;
          this.backup = this.deepCopy(info);
        })
        .catch(error => {
          console.error(error);
        });
    },
    getKeysOnly: function(obj) {
      let keys = [];

      for (let key in obj) {
        if (!key.includes("_")) {
          keys.push(key);
        }
      }

      return keys;
    },
    deepCopy: function(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    saveChanges() {
      const path = "http://127.0.0.1:5000/saveGeneralInfo";
      axios
        .post(path, { general_info: this.info })
        .then(res => {
          this.temp = res.data.status
          this.getGeneralInfo();
        })
        .catch(error => {
          console.error(error);
        });
    },
    resetChanges() {
      this.info = this.backup;
    }
  },
  computed: {},
  mounted() {
    this.getGeneralInfo();

    if (sessionStorage.user) {
      this.user = JSON.parse(sessionStorage.getItem("user"));
    }
  }
};
</script>
