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
                    <v-expansion-panel-header>
                        {{ item }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <PostgradCourseInfo
                            v-if="depth === 0"
                            :payload="payload[item]"
                            :root="item"
                            :depth="depth + 1"
                            :prev-key="item"
                        />
                        <PostgradCourseInfo
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
                    >
                        <div style="display: flex">
                            <v-alert
                                border="left"
                                colored-border
                                type="info"
                                elevation="2"
                            >
                                {{ item }}
                            </v-alert>
                        </div>
                    </v-expansion-panel-header>
                </div>
            </v-expansion-panel>

            <v-row v-if="Object.keys(this.modulesTable).length !== 0">
                <v-col class="pl-lg-10">
                    <v-row class="red" style="color: white;">
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
    </div>
</template>

<script>
export default {
    name: "PostgradCourseInfo",

    props: ["depth", "payload", "root", "prevKey"],

    components: {},

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
        this.getTable();
    }
};
</script>

<style scoped></style>
