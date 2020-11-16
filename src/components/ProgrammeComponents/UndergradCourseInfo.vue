<template>
    <div>
        <v-expansion-panels
            accordion
            v-if="this.getLength(modulesTable['Modules']) === 0"
        >
            <v-expansion-panel
                v-for="item in this.list(this.payload)"
                :key="item"
                :readonly="!isNaN(payload[item]) || payload[item] === 'text'"
            >
                <div v-if="isNaN(payload[item]) && payload[item] !== 'text'">
                    <v-expansion-panel-header
                        :class="
                            'ume-content-' +
                                item.replace(/\s+/g, '-').toLowerCase()
                        "
                    >
                        {{ item }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <UndergradModulesInfo
                            v-if="depth === 0"
                            :payload="payload[item]"
                            :depth="depth + 1"
                            :year="item"
                            :prev-key="item"
                        />
                        <UndergradModulesInfo
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
                    >
                        <div style="display: flex">
                            <div>{{ item }}</div>
                            <v-spacer />
                            <div>credits</div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-header v-else hide-actions>
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
        </v-expansion-panels>
        <div v-else>
            <v-row justify="center">
                <v-col cols="12" lg="5" class="pl-lg-10">
                    <v-row class="red" style="color: white;">
                        <v-col cols="9" lg="10"> Module</v-col>
                        <v-col cols="3" lg="2"> Credits</v-col>
                    </v-row>

                    <v-row
                        v-for="i in this.modulesTable['Credits'].length"
                        :key="i"
                    >
                        <v-col cols="10">{{
                            modulesTable["Modules"][i - 1]
                        }}</v-col>
                        <v-col cols="2">{{
                            modulesTable["Credits"][i - 1]
                        }}</v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
export default {
    name: "UndergradModulesInfo",

    props: ["depth", "payload", "year", "prevKey"],

    components: {},

    data() {
        return {
            modulesTable: {}
        };
    },

    methods: {
        getLength: function(arr) {
            let count = 0;

            for (const item in arr) {
                this.temp = item;
                count++;
            }

            return count;
        },
        isNumeric: function(str) {
            if (typeof str != "string") return false;
            return !isNaN(str) && !isNaN(parseInt(str));
        },
        containsModule: function(Obj) {
            for (const item in Obj) {
                if (this.isNumeric(Obj[item])) return true;
            }

            return false;
        },
        getModules: function(obj) {
            let table = { Modules: [], Credits: [] };

            for (let item in obj) {
                if (this.isNumeric(obj[item])) {
                    table["Modules"].push(item);
                    table["Credits"].push(obj[item]);
                }
            }

            return table;
        },
        getTable() {
            let table = {};

            if (
                typeof this.payload === "object" &&
                this.containsModule(this.payload)
            ) {
                table = this.getModules(this.payload);
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
