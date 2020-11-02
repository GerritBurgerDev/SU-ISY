<template>
    <nav>
        <v-app-bar app fixed clipped-left dense class="nav" elevation="5">
            <v-icon
                @click="changeBoolean"
                class="mr-4 menu-icon"
                medium
                style="color: white"
            >
                menu
            </v-icon>
            <v-toolbar-title class="mr-12 align-center">
                <span class="d-none d-lg-flex title" style="color: white"
                    >Faculty of Science</span
                >
            </v-toolbar-title>

            <v-spacer />
            <v-menu open-on-click bottom :offset-y="offset">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon class="search-btn">
                        <v-icon class="search-icon" style="color: white"
                            >filter_list</v-icon
                        >
                    </v-btn>
                </template>

                <v-list dense flat>
                    <v-list-item @click="filter('module')">
                        <v-list-item-title>Modules only</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="filter('postgrad')">
                        <v-list-item-title
                            >Postgraduate programmes only</v-list-item-title
                        >
                    </v-list-item>
                    <v-list-item @click="filter('undergrad')">
                        <v-list-item-title
                            >Undergraduate programmes only</v-list-item-title
                        >
                    </v-list-item>
                    <v-list-item @click="filter('None')">
                        <v-list-item-title>No filter</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-autocomplete
                v-model="searchVal"
                :items="this.searchBarItems"
                clearable
                hide-details
                item-text="name"
                item-value="symbol"
                label="Search for Modules or Programmes"
                color="red lighten-2"
                solo
                dense
                class="search-bar"
            >
                <template v-slot:item="data">
                    <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content
                            v-text="data.item"
                        ></v-list-item-content>
                    </template>
                    <template v-else>
                        <v-list-item-content
                            v-text="data.item.name"
                        ></v-list-item-content>
                    </template>
                </template>
            </v-autocomplete>
            <v-btn icon color="white" class="search-btn" @click="searchAction">
                <v-icon class="search-icon">search</v-icon>
            </v-btn>
            <v-spacer />

            <settings />
        </v-app-bar>

        <navdrawer :drawer="this.drawer" :modules="this.modules" />
    </nav>
</template>

<style scoped>
@media only screen and (max-width: 5000px) {
    .nav {
        background-color: #a80000 !important;
    }

    .search-bar {
        width: 10%;
        left: -5%;
    }

    .search-btn {
        left: -5%;
    }

    .search-icon {
        font-size: 30px !important;
    }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
    .menu-icon {
        font-size: 20px;
    }

    .search-bar {
        width: 100%;
    }
}
</style>

<script>
import { EventBus } from "@/event-bus.js";
import axios from "axios";
import navdrawer from "@/components/NavigationalComponents/NavDrawer.vue";
import settings from "@/components/NavigationalComponents/SettingsMenu.vue";

export default {
    name: "NavBar",
    components: {
        navdrawer,
        settings
    },
    data() {
        return {
            drawer: false,
            searchVal: null,
            searchItems: [],
            searchBarItems: [],
            test: [],
            offset: true,
            filterBy: "None",
            modules: {},
            undergrad: {},
            postgrad: {}
        };
    },
    methods: {
        changeBoolean() {
            this.drawer = !this.drawer;
            EventBus.$emit("onDrawer", this.drawer);
        },
        getSearchBarItems() {
            for (const item in this.searchItems) {
                if (item.includes("header")) {
                    this.searchBarItems.push({
                        header: this.searchItems[item]
                    });
                } else if (item.includes("divider")) {
                    this.searchBarItems.push({ divider: true });
                } else {
                    this.searchBarItems.push({ name: item });
                }
            }
        },
        searchAction() {
            if (this.searchVal !== null) {
                if (this.searchItems[this.searchVal]["type"] === "module") {
                    this.goToModule(this.searchItems[this.searchVal]["key"]);
                    this.searchVal = null;
                }
                if (this.searchItems[this.searchVal]["type"] === "undergrad") {
                    this.goToUndergardProgramme(
                        this.searchItems[this.searchVal]["key"]
                    );
                    this.searchVal = null;
                }
                if (this.searchItems[this.searchVal]["type"] === "postgrad") {
                    this.goToPostgradProgramme(
                        this.searchItems[this.searchVal]["key"]
                    );
                    this.searchVal = null;
                }
            }
        },
        goToPostgradProgramme(name) {
            const path = "http://127.0.0.1:5000/getPP";

            const payload = { key: name };

            axios
                .post(path, payload)
                .then(res => {
                    const result = {
                        type: "postgrad",
                        data: res.data.programme
                    };

                    sessionStorage.setItem(
                        "currentProgramme",
                        JSON.stringify(result)
                    );

                    EventBus.$emit("sendProgramme", result);
                    EventBus.$emit("updateProgramme", result);
                })
                .catch(error => {
                    console.error(error);
                });

            this.faculty = null;
            this.department = null;
            this.programme = null;
            this.degree = null;
            this.faculties = [];
            this.departments = [];
            this.programmes_only = [];
            this.degrees = [];

            if (this.$router.currentRoute.name !== "Programme") {
                this.$router.push({ name: "Programme" });
            }
        },
        goToModule(name) {
            const path = "http://127.0.0.1:5000/getModule";

            const payload = { key: name };

            axios
                .post(path, payload)
                .then(res => {
                    this.get_module = res.data.module;

                    sessionStorage.setItem(
                        "currentModule",
                        JSON.stringify(this.get_module)
                    );
                    EventBus.$emit("sendModule", this.get_module);
                    EventBus.$emit("updateModule", this.get_module);
                })
                .catch(error => {
                    console.error(error);
                });

            this.departments = [];
            this.get_modules = [];
            this.value = null;
            this.moduleValue = null;

            if (this.$router.currentRoute.name !== "Module") {
                this.$router.push({ name: "Module" });
            }
        },
        goToUndergardProgramme(name) {
            const path = "http://127.0.0.1:5000/getUP";

            const payload = { key: name };

            axios
                .post(path, payload)
                .then(res => {
                    const result = {
                        type: "undergrad",
                        data: res.data.programme
                    };

                    sessionStorage.setItem(
                        "currentProgramme",
                        JSON.stringify(result)
                    );

                    EventBus.$emit("sendProgramme", result);
                    EventBus.$emit("updateProgramme", result);
                })
                .catch(error => {
                    console.error(error);
                });

            this.programmes_only = [];
            this.degrees = [];
            this.streams = [];
            this.pOptions = [];
            this.programme = null;
            this.degree = null;
            this.stream = null;
            this.pOption = null;

            if (this.$router.currentRoute.name !== "Programme") {
                this.$router.push({ name: "Programme" });
            }
        },
        filter(type) {
            this.filterBy = type;
            this.searchBarItems = this.filteredData();
        },
        filteredData: function() {
            const temp = [];

            if (this.filterBy === "module") {
                temp.push({ header: "Modules" });
            }
            if (this.filterBy === "undergrad") {
                temp.push({ header: "Undergraduate Programmes" });
            }
            if (this.filterBy === "postgrad") {
                temp.push({ header: "Postgraduate Programmes" });
            }

            for (const item in this.searchItems) {
                if (this.filterBy !== "None") {
                    if (this.searchItems[item]["type"] === this.filterBy) {
                        temp.push(item);
                    }
                } else {
                    if (item.includes("header")) {
                        temp.push({ header: this.searchItems[item] });
                    } else if (item.includes("divider")) {
                        temp.push({ divider: true });
                    } else {
                        temp.push({ name: item });
                    }
                }
            }

            return temp;
        },
        getSearchData() {
            const items = {};

            items["header1"] = "Modules";
            for (const department in this.modules) {
                for (const index in this.modules[department]) {
                    items[this.modules[department][index].name] = {
                        key: this.modules[department][index]._key,
                        type: "module"
                    };
                }
            }
            items["divider1"] = true;

            items["header2"] = "Undergraduate Prorgammes";
            for (const programme in this.undergrad) {
                for (const stream in this.undergrad[programme]["streams"]) {
                    if (
                        this.undergrad[programme]["streams"][stream].length ===
                        0
                    ) {
                        const temp = programme + " " + stream;
                        items[stream] = {
                            key: temp.replace(/\s/g, "_"),
                            type: "undergrad"
                        };
                    } else {
                        for (const option in this.undergrad[programme][
                            "streams"
                        ][stream]) {
                            const temp =
                                programme +
                                " " +
                                stream +
                                " " +
                                this.undergrad[programme]["streams"][stream][
                                    option
                                ];
                            items[
                                this.undergrad[programme]["streams"][stream][
                                    option
                                ]
                            ] = {
                                key: temp.replace(/\s/g, "_"),
                                type: "undergrad"
                            };
                        }
                    }
                }

                for (const degree in this.undergrad[programme]["programmes"]) {
                    if (
                        Object.keys(
                            this.undergrad[programme]["programmes"][degree]
                        ).length === 0
                    ) {
                        const temp = programme + " " + degree;
                        items[degree] = {
                            key: temp.replace(/\s/g, "_"),
                            type: "undergrad"
                        };
                    } else {
                        for (const stream in this.undergrad[programme][
                            "programmes"
                        ][degree]) {
                            if (
                                this.undergrad[programme]["programmes"][degree][
                                    stream
                                ].length === 0
                            ) {
                                const temp =
                                    programme + " " + degree + " " + stream;
                                items[stream] = {
                                    key: temp.replace(/\s/g, "_"),
                                    type: "undergrad"
                                };
                            } else {
                                for (const option in this.undergrad[programme][
                                    "programmes"
                                ][degree][stream]) {
                                    const temp =
                                        programme +
                                        " " +
                                        degree +
                                        " " +
                                        stream +
                                        " " +
                                        option;
                                    items[option] = {
                                        key: temp.replace(/\s/g, "_"),
                                        type: "undergrad"
                                    };
                                }
                            }
                        }
                    }
                }
            }
            items["divider2"] = true;

            items["header3"] = "Postgraduate Programmes";
            for (const faculty in this.postgrad) {
                for (const department in this.postgrad[faculty]) {
                    for (const stream in this.postgrad[faculty][department]) {
                        for (const degree in this.postgrad[faculty][department][
                            stream
                        ]) {
                            items[stream + "(" + degree + ")"] = {
                                key: (stream + " " + degree).replace(
                                    /\s/g,
                                    "_"
                                ),
                                type: "postgrad"
                            };
                        }
                    }
                }
            }

            this.searchItems = items;
        }
    },
    created() {
        if (sessionStorage.modules) {
            this.modules = JSON.parse(sessionStorage.getItem("modules"));
        } else {
            EventBus.$on("getModules", res => {
                this.modules = res;
            });
        }

        if (sessionStorage.undergradProgrammes) {
            this.undergrad = JSON.parse(
                sessionStorage.getItem("undergradProgrammes")
            );
        } else {
            EventBus.$on("getUP", res => {
                this.undergrad = res;
            });
        }

        if (sessionStorage.postgradProgrammes) {
            this.postgrad = JSON.parse(
                sessionStorage.getItem("postgradProgrammes")
            );
        } else {
            EventBus.$on("getPP", res => {
                this.postgrad = res;
            });
        }
    },
    mounted() {
        EventBus.$on("updateDrawer", res => {
            this.drawer = res;
        });

        this.getSearchData();

        this.getSearchBarItems();

        EventBus.$on("updateSearchBar", res => {
            this.modules = res;

            this.getSearchData();
            this.getSearchBarItems();
        });
    },
    computed: {}
};
</script>
