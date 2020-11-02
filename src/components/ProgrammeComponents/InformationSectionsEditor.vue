<template>
  <div>
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="item in this.list(this.payload)"
        :key="item"
        :readonly="payload[item] === 'text'"
      >
        <div v-if="payload[item] !== 'text'">
          <v-expansion-panel-header
            @contextmenu.prevent="$refs.list.open($event, { key: item })"
          >
            {{ item }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <InformationSectionsEditor
              :payload="payload[item]"
              :depth="depth + 1"
            />
          </v-expansion-panel-content>
        </div>
        <v-expansion-panel-header
          v-else
          hide-actions
          @contextmenu.prevent="$refs.entry.open($event, { key: item })"
        >
          <div style="display: flex">
            <div>{{ item }}</div>
          </div>
        </v-expansion-panel-header>
      </v-expansion-panel>
    </v-expansion-panels>

    <vue-context
      ref="list"
      v-slot="{ data }"
      :close-on-click="true"
      class="pa-0"
    >
      <template v-if="data">
        <li>
          <a @click.prevent="addItem(data.key)">
            Add item
          </a>
        </li>
        <li>
          <a @click.prevent="editItem(data.key)">
            Edit
          </a>
        </li>
        <li>
          <a @click.prevent="deleteEntry(data.key)">
            Delete
          </a>
        </li>
      </template>
    </vue-context>

    <vue-context
      ref="entry"
      v-slot="{ data }"
      :close-on-click="true"
      class="pa-0"
    >
      <template v-if="data">
        <li>
          <a @click.prevent="editItem(data.key)">
            Edit
          </a>
        </li>
        <li>
          <a @click.prevent="deleteEntry(data.key)">
            Delete
          </a>
        </li>
      </template>
    </vue-context>
  </div>
</template>

<script>
import { EventBus } from "@/event-bus.js";

import VueContext from "vue-context";
import "vue-context/src/sass/vue-context.scss";

export default {
  name: "InformationSectionsEditor",

  props: ["payload", "depth"],

  components: {
    VueContext
  },

  methods: {
    addItem(key) {
      EventBus.$emit("peISEAddItem", key);
    },
    editItem(key) {
      EventBus.$emit("peISEEditItem", key);
    },
    deleteEntry(key) {
      EventBus.$emit("peISEDeleteEntry", key);
    },
    type: function(payload) {
      if (typeof payload === "string" || typeof payload === "number") {
        return "value";
      }
      return "obj";
    },
    list: function(payload) {
      if (this.type(payload) === "obj") {
        return Object.keys(this.payload);
      }
      return undefined;
    }
  },

  computed: {},

  mounted() {
    EventBus.$on("reloadISE", res => {
      console.log(res);
      this.$forceUpdate();
    });
  }
};
</script>

<style scoped></style>
