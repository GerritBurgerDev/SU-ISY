<template>
    <div>
        <v-expansion-panels accordion>
            <v-expansion-panel
                v-for="item in this.list(this.payload)"
                :key="item"
                :readonly="!isNaN(payload[item]) || payload[item] === 'text'"
            >
                <div
                    v-if="
                        isNaN(payload[item]) &&
                            payload[item] !== 'text' &&
                            !Array.isArray(payload[item])
                    "
                >
                    <v-expansion-panel-header
                        @contextmenu.prevent="
                            $refs.list.open($event, {
                                key: item,
                                prev_key: prevKey,
                                root_key: root,
                                type: 'List'
                            })
                        "
                    >
                        {{ item }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <PostgradCourseEditor
                            v-if="depth === 0"
                            :payload="payload[item]"
                            :root="item"
                            :depth="depth + 1"
                            :prev-key="item"
                        />
                        <PostgradCourseEditor
                            v-else
                            :payload="payload[item]"
                            :root="root"
                            :depth="depth + 1"
                            :prev-key="item"
                        />
                    </v-expansion-panel-content>
                </div>
                <div v-else>
                    <v-expansion-panel-header
                        v-if="payload[item] === 'text'"
                        hide-actions
                        @contextmenu.prevent="
                            $refs.entry.open($event, {
                                key: item,
                                prev_key: prevKey,
                                root_key: root,
                                type: 'Text'
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

            <v-row v-if="Object.keys(this.modulesTable).length !== 0">
                <v-col
                    class="pl-lg-10"
                    @contextmenu.prevent="
                        $refs.entry.open($event, {
                            key: '',
                            prev_key: prevKey,
                            root_key: root,
                            type: 'Table'
                        })
                    "
                >
                    <v-row class="red white--text">
                        <v-col cols="2"> Subject Number</v-col>
                        <v-col cols="1"> Semester</v-col>
                        <v-col cols="6"> Module Name</v-col>
                        <v-col cols="2"> Module Code</v-col>
                        <v-col cols="1"> Credits</v-col>
                    </v-row>

                    <v-row
                        v-for="i in this.modulesTable['Credits'].length"
                        :key="i"
                    >
                        <v-col cols="2">{{
                            modulesTable["Subject Number"][i - 1]
                        }}</v-col>
                        <v-col cols="1">{{
                            modulesTable["Semester"][i - 1]
                        }}</v-col>
                        <v-col cols="6">{{
                            modulesTable["Module Name"][i - 1]
                        }}</v-col>
                        <v-col cols="2">{{
                            modulesTable["Module Code"][i - 1]
                        }}</v-col>
                        <v-col cols="1">{{
                            modulesTable["Credits"][i - 1]
                        }}</v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-expansion-panels>

        <vue-context
            ref="list"
            v-slot="{ data }"
            :close-on-click="true"
            class="pa-0"
        >
            <template v-if="data">
                <li>
                    <a
                        @click.prevent="
                            addItem(data.key, data.prev_key, 'List')
                        "
                    >
                        Add List
                    </a>
                </li>
                <li>
                    <a
                        @click.prevent="
                            addItem(data.key, data.prev_key, 'Module')
                        "
                    >
                        Add Module
                    </a>
                </li>
                <li>
                    <a
                        @click.prevent="
                            addItem(data.key, data.prev_key, 'Credits')
                        "
                    >
                        Add Credits
                    </a>
                </li>
                <li>
                    <a
                        @click.prevent="
                            addItem(data.key, data.prev_key, 'Text')
                        "
                    >
                        Add Text Section
                    </a>
                </li>
                <li>
                    <a
                        @click.prevent="
                            editItem(
                                data.root_key,
                                data.key,
                                data.prev_key,
                                data.type
                            )
                        "
                    >
                        Edit
                    </a>
                </li>
                <li>
                    <a @click.prevent="deleteItem(data.key, data.prev_key)">
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
                                data.root_key,
                                data.key,
                                data.prev_key,
                                data.type
                            )
                        "
                        v-if="data.type === 'Table'"
                    >
                        Edit Table
                    </a>
                    <a
                        @click.prevent="
                            editItem(
                                data.root_key,
                                data.key,
                                data.prev_key,
                                data.type
                            )
                        "
                        v-else
                    >
                        Edit
                    </a>
                </li>
                <li>
                    <a
                        @click.prevent="deleteItem(data.key, data.prev_key)"
                        v-if="data.type === 'Table'"
                    >
                        Delete Table
                    </a>
                    <a
                        @click.prevent="deleteItem(data.key, data.prev_key)"
                        v-else
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
    name: "PostgradCourseEditor",

    props: ["depth", "payload", "root", "prevKey"],

    components: {
        VueContext
    },

    data() {
        return {
            modulesTable: {}
        };
    },

    methods: {
        getTable() {
            let temp = {};

            for (let item in this.payload) {
                if (Array.isArray(this.payload[item])) {
                    temp[item] = this.payload[item];
                }
            }

            let table = {};
            let keys = Object.keys(temp).reverse();

            for (let item in keys) {
                table[keys[item]] = temp[keys[item]];
            }

            this.modulesTable = table;
        },
        addItem(key, prev, type) {
            EventBus.$emit("pePCEAdd", { key: key, prev: prev, type: type });
        },
        editItem(root, key, prev, type) {
            EventBus.$emit("pePCEEditItem", {
                root: root,
                key: key,
                prev: prev,
                type: type
            });
        },
        deleteItem(key, prev) {
            EventBus.$emit("pePCEDeleteItem", { key: key, prev: prev });
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
        EventBus.$on("reloadPCE", res => {
            this.temp = res;
            this.$forceUpdate();
            this.getTable();
        });

        this.getTable();
    }
};
</script>

<style scoped></style>
