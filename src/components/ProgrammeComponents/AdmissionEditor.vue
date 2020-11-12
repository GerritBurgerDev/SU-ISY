<template>
    <div>
        <v-expansion-panels accordion>
            <v-expansion-panel
                v-for="item in this.list(this.payload)"
                :key="item"
                :readonly="typeof payload[item] !== 'object'"
            >
                <div v-if="typeof payload[item] === 'object'">
                    <v-expansion-panel-header
                        @contextmenu.prevent="
                            $refs.aelist.open($event, { key: item, prev: prevKey })
                        "
                    >
                        {{ item }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <AdmissionEditor
                            :payload="payload[item]"
                            :depth="depth + 1"
                            :prev-key="item"
                        />
                    </v-expansion-panel-content>
                </div>
                <v-expansion-panel-header
                    v-else-if="!item.includes('_')"
                    hide-actions
                    @contextmenu.prevent="
                        $refs.aeentry.open($event, { key: item, prev: prevKey, val: payload[item] })
                    "
                >
                    <div style="display: flex">
                        <div>{{ item }}</div>
                        <v-spacer />
                        <div>{{ payload[item] }}</div>
                    </div>
                </v-expansion-panel-header>
            </v-expansion-panel>
        </v-expansion-panels>

        <vue-context
            ref="aelist"
            v-slot="{ data }"
            :close-on-click="true"
            class="pa-0 ar-click-list"
        >
            <template v-if="data">
                <li>
                    <a @click.prevent="addList(data.key, data.prev)">
                        Add List
                    </a>
                </li>
                <li>
                    <a @click.prevent="addItem(data.key, data.prev)">
                        Add Item
                    </a>
                </li>
                <li>
                    <a @click.prevent="editList(data.key, data.prev)">
                        Edit
                    </a>
                </li>
                <li>
                    <a @click.prevent="deleteEntry(data.key, data.prev)">
                        Delete
                    </a>
                </li>
            </template>
        </vue-context>

        <vue-context
            ref="aeentry"
            v-slot="{ data }"
            :close-on-click="true"
            class="pa-0 ar-click-item"
        >
            <template v-if="data">
                <li>
                    <a @click.prevent="editItem(data.key, data.prev, data.val)">
                        Edit
                    </a>
                </li>
                <li>
                    <a @click.prevent="deleteEntry(data.key, data.prev)">
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
    name: "AdmissionEditor",

    props: ["payload", "depth", "prevKey"],

    components: {
        VueContext
    },

    methods: {
        addList(key, prev) {
            EventBus.$emit("aeAddList", {key: key, prev: prev});
        },
        addItem(key, prev) {
            EventBus.$emit("aeAddItem", {key: key, prev: prev});
        },
        editList(key, prev) {
            EventBus.$emit("aeEditList", {key: key, prev: prev});
        },
        editItem(key, prev, val) {
            EventBus.$emit("aeEditItem", {key: key, prev: prev, val: val});
        },
        deleteEntry(key, prev) {
            EventBus.$emit("aeDeleteItem", {key: key, prev: prev});
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
        EventBus.$on("reloadAE", res => {
            this.temp = res;
            this.$forceUpdate();
        });
    }
};
</script>

<style scoped></style>
