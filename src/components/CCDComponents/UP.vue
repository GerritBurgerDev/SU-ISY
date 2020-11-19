<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            width="80%"
            :fullscreen="$vuetify.breakpoint.xsOnly"
        >
            <v-card class="popup-box">
                <v-card-title class="headline"
                    >Your continued study possibilities are:
                </v-card-title>

                <hr style="padding-left: 0" />

                <v-alert
                    class="info-alert"
                    border="top"
                    colored-border
                    color="red darken-2"
                    type="info"
                    elevation="2"
                >
                    Please note: You must pass all compulsory modules. <br />
                    Also note: This calculation only shows modules you can take
                    based on your current module choices.
                </v-alert>

                <v-card-text>
                    <h1 class="padd-left padd-top padd-bottom">
                        Undergraduate
                    </h1>

                    <v-row no-gutters>
                        <v-col
                            v-for="(year, key) in this.possibilities"
                            :key="year"
                            cols="12"
                            lg="4"
                        >
                            <div class="flex-line">
                                <h2 class="ccd-year padd-left">{{ key }}</h2>
                                <v-progress-circular
                                    :rotate="270"
                                    :size="20"
                                    :width="3"
                                    :value="getProgress(year)"
                                    :color="
                                        getProgressColor(getProgress(year)) +
                                        ' darken-5'
                                    "
                                    class="year-progress-bar"
                                    v-if="year['credits'] > 0"
                                >
                                    {{ value }}
                                </v-progress-circular>

                                <v-spacer></v-spacer>

                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <h2 v-on="on" class="padd-right">
                                            {{ year["credits"] }}
                                        </h2>
                                    </template>
                                    <span
                                        >The amount of credits needed to finnish
                                        {{ key }}</span
                                    >
                                </v-tooltip>
                            </div>

                            <div v-if="year['credits'] > 0">
                                <v-item-group
                                    v-for="(type, key) in getModulesOnly(year)"
                                    :key="type"
                                >
                                    <div
                                        class="padd-bottom"
                                        v-if="
                                            key !== 'credits' &&
                                            Object.keys(year['Options'])
                                                .length === 0
                                        "
                                    >
                                        <h3 class="padd-left">{{ key }}</h3>
                                        <div
                                            class="padd-left"
                                            v-if="
                                                Object.keys(type).length ===
                                                    0 &&
                                                key === 'Elective Modules'
                                            "
                                        >
                                            No elective modules to display
                                        </div>
                                        <div
                                            class="padd-left"
                                            v-if="
                                                Object.keys(type).length ===
                                                    0 &&
                                                key === 'Compulsory Modules'
                                            "
                                        >
                                            No compulsory modules to display
                                        </div>

                                        <v-item-group
                                            v-for="(credits, module) in type"
                                            :key="credits"
                                        >
                                            <div class="flex-line">
                                                <div class="padd-left">
                                                    {{ module }}
                                                </div>
                                                <v-spacer></v-spacer>
                                                <div class="padd-right">
                                                    {{ credits }}
                                                </div>
                                            </div>
                                        </v-item-group>
                                    </div>
                                </v-item-group>
                                <v-item-group
                                    v-if="
                                        Object.keys(year['Options']).length !==
                                        0
                                    "
                                >
                                    <v-expansion-panels accordion>
                                        <v-expansion-panel
                                            v-for="(item, key) in year[
                                                'Options'
                                            ]"
                                            :key="key"
                                        >
                                            <v-expansion-panel-header
                                                ><h4>
                                                    {{ key }}
                                                </h4></v-expansion-panel-header
                                            >
                                            <!---->
                                            <v-expansion-panel-content>
                                                <v-row
                                                    no-gutters
                                                    class="user-progess-table-header"
                                                >
                                                    <v-col cols="8"
                                                        >Module</v-col
                                                    >
                                                    <v-col
                                                        cols="2"
                                                        class="user-progess-table-col"
                                                        align="center"
                                                        >Credits
                                                    </v-col>
                                                </v-row>
                                                <v-row
                                                    v-for="(credits,
                                                    mod) in item"
                                                    :key="mod"
                                                    no-gutters
                                                    class="user-progess-table-row"
                                                >
                                                    <v-col cols="8">{{
                                                        mod
                                                    }}</v-col>
                                                    <v-col
                                                        cols="2"
                                                        class="user-progess-table-col"
                                                        align="center"
                                                    >
                                                        {{ credits }}
                                                    </v-col>
                                                </v-row>
                                                <div
                                                    v-for="(content,
                                                    name) in item"
                                                    :key="name"
                                                >
                                                    <div
                                                        v-if="
                                                            containsTable(
                                                                content
                                                            )
                                                        "
                                                    >
                                                        <h4>{{ name }}</h4>
                                                        <!---->
                                                        <v-expansion-panels
                                                            accordion
                                                        >
                                                            <v-expansion-panel
                                                                v-for="(inner,
                                                                key) in getTablesOnly(
                                                                    content
                                                                )"
                                                                :key="key"
                                                            >
                                                                <v-expansion-panel-header>
                                                                    {{ key }}
                                                                </v-expansion-panel-header>
                                                                <!---->
                                                                <v-expansion-panel-content>
                                                                    <div
                                                                        v-if="
                                                                            Object.keys(
                                                                                inner
                                                                            )
                                                                                .length ===
                                                                            0
                                                                        "
                                                                    >
                                                                        You can
                                                                        not take
                                                                        any of
                                                                        these
                                                                        modules
                                                                    </div>
                                                                    <div v-else>
                                                                        <v-row
                                                                            no-gutters
                                                                            class="user-progess-table-header"
                                                                        >
                                                                            <v-col
                                                                                cols="8"
                                                                                >Module</v-col
                                                                            >
                                                                            <v-col
                                                                                cols="2"
                                                                                class="user-progess-table-col"
                                                                                align="center"
                                                                                >Credits
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!---->
                                                                        <v-row
                                                                            v-for="(credits,
                                                                            mod) in inner"
                                                                            :key="
                                                                                mod
                                                                            "
                                                                            no-gutters
                                                                            class="user-progess-table-row"
                                                                        >
                                                                            <v-col
                                                                                cols="8"
                                                                                >{{
                                                                                    mod
                                                                                }}</v-col
                                                                            >
                                                                            <v-col
                                                                                cols="2"
                                                                                class="user-progess-table-col"
                                                                                align="center"
                                                                            >
                                                                                {{
                                                                                    credits
                                                                                }}
                                                                            </v-col>
                                                                        </v-row>
                                                                    </div>
                                                                </v-expansion-panel-content>
                                                            </v-expansion-panel>
                                                        </v-expansion-panels>
                                                        <!---->
                                                        <div
                                                            v-if="
                                                                Object.keys(
                                                                    getModulesFromTables(
                                                                        content
                                                                    )
                                                                ).length !== 0
                                                            "
                                                        >
                                                            <v-row
                                                                style="
                                                                    padding-top: 5%;
                                                                "
                                                                no-gutters
                                                                class="user-progess-table-header"
                                                            >
                                                                <v-col cols="8"
                                                                    >Module</v-col
                                                                >
                                                                <v-col
                                                                    cols="2"
                                                                    class="user-progess-table-col"
                                                                    align="center"
                                                                    >Credits
                                                                </v-col>
                                                            </v-row>
                                                            <!---->
                                                            <v-row
                                                                v-for="(credits,
                                                                mod) in getModulesFromTables(
                                                                    content
                                                                )"
                                                                :key="mod"
                                                                no-gutters
                                                                class="user-progess-table-row"
                                                            >
                                                                <v-col
                                                                    cols="8"
                                                                    >{{
                                                                        mod
                                                                    }}</v-col
                                                                >
                                                                <v-col
                                                                    cols="2"
                                                                    class="user-progess-table-col"
                                                                    align="center"
                                                                >
                                                                    {{
                                                                        credits
                                                                    }}
                                                                </v-col>
                                                            </v-row>
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </v-item-group>
                            </div>
                            <v-row
                                no-gutters
                                justify="center"
                                v-else-if="
                                    year['credits'] === 0 &&
                                    isFollowingYear(key)
                                "
                            >
                                <v-col align="center">
                                    <v-progress-circular
                                        :rotate="270"
                                        :size="200"
                                        :width="10"
                                        :value="100"
                                        color="green darken-1"
                                        class="year-completed-progress-bar"
                                    >
                                        <div
                                            class="year-completed-progress-bar-content"
                                        >
                                            <v-icon
                                                color="green"
                                                class="year-completed-progress-bar-icon"
                                            >
                                                done
                                            </v-icon>
                                            <span
                                                class="year-completed-progress-bar-text"
                                                style=""
                                            >
                                                Completed</span
                                            >
                                        </div>
                                    </v-progress-circular>
                                </v-col>
                            </v-row>
                            <v-row
                                no-gutters
                                justify="center"
                                v-else-if="
                                    year['credits'] === 0 &&
                                    !isFollowingYear(key)
                                "
                            >
                                <v-col align="center">
                                    <v-progress-circular
                                        :rotate="270"
                                        :size="200"
                                        :width="10"
                                        :value="100"
                                        color="yellow darken-1"
                                        class="year-completed-progress-bar"
                                    >
                                        <div
                                            class="year-completed-progress-bar-content"
                                        >
                                            <v-icon
                                                color="yellow darken-1"
                                                class="year-todo-progress-bar-icon"
                                            >
                                                access_time
                                            </v-icon>
                                        </div>
                                    </v-progress-circular>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        class="up-ok-button"
                        color="red darken-1"
                        text
                        @click="dialog = false"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { EventBus } from "@/event-bus.js";

export default {
    name: "UP.vue",

    data() {
        return {
            user: {},
            possibilities: {},
            years: {},
            compulsaryRows: [],
            electiveRows: [],
            dialog: false,
        };
    },

    methods: {
        getProgress: function (year) {
            const orig = year["original credits"];
            const needed = year["credits"];

            const res = ((orig - needed) / orig) * 100;

            return res ? res : 0;
        },
        getProgressColor: function (value) {
            if (value <= 25) return "red";
            else if (value <= 50) return "orange";
            else if (value <= 75) return "yellow";
            else return "green";
        },
        getModulesOnly: function (year) {
            if (
                "Options" in year &&
                Object.keys(year["Options"]).length !== 0
            ) {
                return year["Options"];
            }

            return {
                "Compulsory Modules": year["Compulsory Modules"],
                "Elective Modules": year["Elective Modules"],
            };
        },
        containsTable: function (Content) {
            for (const item in Content) {
                if (typeof Content[item] === "object") {
                    return true;
                }
            }

            return false;
        },
        getTablesOnly: function (Content) {
            const temp = {};

            for (const item in Content) {
                if (typeof Content[item] === "object") {
                    temp[item] = Content[item];
                }
            }
            return temp;
        },
        getModulesFromTables: function (Content) {
            const temp = {};

            for (const item in Content) {
                if (typeof Content[item] !== "object") {
                    temp[item] = Content[item];
                }
            }

            return temp;
        },
        isFollowingYear: function (year) {
            let prev = "";

            for (const index in this.possibilities) {
                if (index === year) {
                    break;
                } else {
                    prev = index;
                }
            }

            try {
                if (this.possibilities[prev]["credits"] === 0) {
                    return true;
                }
            } catch {
                return true;
            }

            return false;
        },
    },

    mounted() {
        if (sessionStorage.user) {
            this.user = JSON.parse(sessionStorage.getItem("user"));
        }

        EventBus.$on("showPossibilities", (res) => {
            const temp = res.result;

            for (var year in temp) {
                this.years[year] = {
                    "remaining credits": temp[year]["credits"],
                    "original credits": temp[year]["original credits"],
                };
            }

            this.possibilities = res.result;
            this.dialog = res.show;
        });
    },
};
</script>

<style scoped>
@media only screen and (max-width: 5000px) {
    .popup-box {
        height: 80vh;
        overflow-y: scroll;
        -ms-overflow-style: none;
    }

    .popup-box::-webkit-scrollbar {
        display: none;
    }

    .year-progress-bar {
        margin-left: 4%;
    }

    .year-completed-progress-bar {
        margin-top: 5%;
        /*position: relative;*/
        /*left: 25%;*/
    }

    .year-completed-progress-bar-content {
        position: relative;
        top: -10px;
    }

    .year-completed-progress-bar-icon {
        left: 5px;
        font-size: 75px;
        float: left;
    }

    .year-todo-progress-bar-icon {
        top: 10px;
        font-size: 120px;
        float: left;
    }

    .year-completed-progress-bar-text {
        clear: both;
        float: left;
        font-size: 18px;
    }

    .user-progess-table-header {
        border-bottom: solid 1px #a80000;
    }

    .user-progess-table-row {
        border-bottom: solid 1px black;
    }

    .user-progess-table-col {
        /*border-left: solid 1px black;*/
    }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
}

.ccd-year {
    margin-bottom: 10px;
}

.info-alert {
    margin-top: 10px;
    margin-left: 40px;
    margin-right: 40px;
}

hr {
    border-top: 1px solid #656565;
}

.flex-line {
    display: flex;
}

.padd-left {
    padding-left: 20px;
}

.padd-right {
    padding-right: 20px;
}

.padd-top {
    padding-top: 20px;
}

.padd-bottom {
    padding-bottom: 20px;
}
</style>
