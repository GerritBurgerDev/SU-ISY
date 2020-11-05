<template>
  <div>
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="item in this.list(this.payload)"
        :key="item"
        :readonly="!isNaN(payload[item]) || payload[item] === 'text'"
      >
        <div v-if="isNaN(payload[item]) && payload[item] !== 'text'">
          <v-expansion-panel-header
            :class="'ume-content-' + item.replace(/\s+/g, '-').toLowerCase()"
            @contextmenu.prevent="
              $refs.list.open($event, {
                key: item,
                year_key: year,
                prev_key: prevKey,
                type: 'List'
              })
            "
          >
            {{ item }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <UndergradModulesEditor
              v-if="depth === 0"
              :payload="payload[item]"
              :depth="depth + 1"
              :year="item"
              :prev-key="item"
            />
            <UndergradModulesEditor
              v-else
              :payload="payload[item]"
              :depth="depth + 1"
              :year="year"
              :prev-key="item"
            />
          </v-expansion-panel-content>
        </div>
        <div v-else>
          <v-expansion-panel-header
            v-if="item[0] === '(' && item[item.length - 1] === ')'"
            hide-actions
            @contextmenu.prevent="
              $refs.entry.open($event, {
                key: item,
                year_key: year,
                prev_key: prevKey,
                type: 'Credits'
              })
            "
          >
            <div style="display: flex">
              <div>{{ item }}</div>
              <v-spacer />
              <div>credits</div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-header
            v-else-if="!isNaN(payload[item])"
            hide-actions
            @contextmenu.prevent="
              $refs.entry.open($event, {
                key: item,
                year_key: year,
                prev_key: prevKey,
                type: 'Module',
                value: payload[item]
              })
            "
          >
            <div style="display: flex">
              <div>{{ item }}</div>
              <v-spacer />
              <div>{{ payload[item] }}</div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-header
            v-else
            hide-actions
            @contextmenu.prevent="
              $refs.entry.open($event, {
                key: item,
                year_key: year,
                prev_key: prevKey,
                type: 'Alert'
              })
            "
          >
            <div style="display: flex">
              <div>{{ item }}</div>
              <v-spacer />
              <div>info</div>
            </div>
          </v-expansion-panel-header>
        </div>
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
          <a @click.prevent="addList(data.key, data.year_key, data.prev_key)">
            Add List
          </a>
        </li>
        <li v-if="data.year_key !== ''">
          <a @click.prevent="addModule(data.key, data.year_key, data.prev_key)">
            Add Module
          </a>
        </li>
        <li v-if="data.year_key !== ''">
          <a
            @click.prevent="addCredits(data.key, data.year_key, data.prev_key)"
          >
            Add Credits
          </a>
        </li>
        <li>
          <a @click.prevent="addAlert(data.key, data.year_key, data.prev_key)">
            Add Info Alert
          </a>
        </li>
        <li>
          <a
            @click.prevent="
              editItem(data.key, data.year_key, data.prev_key, data.type)
            "
          >
            Edit
          </a>
        </li>
        <li>
          <a
            @click.prevent="deleteItem(data.key, data.year_key, data.prev_key)"
          >
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
          <a
            @click.prevent="
              editItem(
                data.key,
                data.year_key,
                data.prev_key,
                data.type,
                data.value
              )
            "
          >
            Edit
          </a>
        </li>
        <li>
          <a
            @click.prevent="deleteItem(data.key, data.year_key, data.prev_key)"
          >
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
  name: "UndergradModulesEditor",

  props: ["depth", "payload", "year", "prevKey"],

  components: {
    VueContext
  },

  methods: {
    addList(key, year, prev) {
      EventBus.$emit("peUMEAddList", {
        key: key,
        year: year,
        prev: prev
      });
    },
    addModule(key, year, prev) {
      EventBus.$emit("peUMEAddModule", {
        key: key,
        year: year,
        prev: prev
      });
    },
    addCredits(key, year, prev) {
      EventBus.$emit("peUMEAddCredits", {
        key: key,
        year: year,
        prev: prev
      });
    },
    addAlert(key, year, prev) {
      EventBus.$emit("peUMEAddAlert", {
        key: key,
        year: year,
        prev: prev
      });
    },
    editItem(key, year, prev, type, value) {
      EventBus.$emit("peUMEEditItem", {
        key: key,
        year: year,
        prev: prev,
        type: type,
        value: value
      });
    },
    deleteItem(key, year, prev) {
      EventBus.$emit("peUMEDeleteItem", {
        key: key,
        year: year,
        prev: prev
      });
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
    EventBus.$on("reloadUME", res => {
      this.temp = res;
      this.$forceUpdate();
    });
  }
};
</script>

<style scoped></style>
