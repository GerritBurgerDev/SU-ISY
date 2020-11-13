<template>
    <div>
        <v-card class="module">
            <v-row>
                <v-col cols="11">
                    <div class="module-header">
                        <h1>
                            {{ this.module["subject_code"] }} -
                            {{ this.module["module_name"] }}
                            {{ this.module["module_code"] }} ({{
                                this.module["credits"]
                            }})
                        </h1>
                        <h3>Department: {{ this.module["department"] }}</h3>
                    </div>
                </v-col>
                <v-col
                    class="d-flex pt-7"
                    cols="1"
                    v-if="Object.keys(user).length !== 0 && user['admin']"
                >
                    <v-icon
                        large
                        class="pl-2 pr-3 edit-icon"
                        @click="showEditor"
                    >
                        fa-edit
                    </v-icon>
                    <v-icon large class="delete-icon" @click="removeModule()"
                        >mdi-delete</v-icon
                    >
                </v-col>
            </v-row>
            <hr class="module-header-line" />

            <div v-for="paragraph in this.module['info']" :key="paragraph">
                <v-card class="pl-5 pr-5 pb-1 pt-2 mb-4" tile>
                    <p>{{ paragraph }}</p>
                </v-card>
            </div>

            <v-card
                tile
                class="pl-3 pr-3 pt-3 pb-3 mb-4"
                v-if="this.module['method_of_assessment'] !== ''"
            >
                <div class="text-bold">Method of assessment:</div>
                <div class="">
                    {{ this.module["method_of_assessment"] }}
                </div>
            </v-card>

            <v-row no-gutters class="prerequisites">
                <v-col cols="12" lg="4">
                    <v-card
                        class="pl-5 pt-2 pb-2 mr-lg-2"
                        style="min-height: 200px"
                        tile
                    >
                        <div class="text-bold prereq-head-small">
                            Prerequisite modules
                        </div>

                        <v-item-group
                            v-for="line in this.module['P']"
                            :key="line"
                            class="prerequisite-list"
                        >
                            <v-icon class="prerequisites-list-item"
                                >label</v-icon
                            >
                            {{ line }}
                        </v-item-group>
                    </v-card>
                </v-col>
                <v-col cols="12" lg="4">
                    <v-card
                        class="pl-5 pt-2 pb-2 mt-5 mt-lg-0 mr-lg-2 ml-lg-2"
                        style="min-height: 200px"
                        tile
                    >
                        <div class="text-bold">Prerequisite pass modules</div>

                        <v-item-group
                            v-for="line in this.module['PP']"
                            :key="line"
                            class="prerequisite-list"
                        >
                            <v-icon class="prerequisites-list-item"
                                >label</v-icon
                            >
                            {{ line }}
                        </v-item-group>
                    </v-card>
                </v-col>
                <v-col cols="12" lg="4">
                    <v-card
                        class="pl-5 pt-2 pb-2 mt-5 mt-lg-0 ml-lg-2"
                        style="min-height: 200px"
                        tile
                    >
                        <div class="text-bold prereq-head-small">
                            Co-requisite modules
                        </div>

                        <v-item-group
                            v-for="line in this.module['C']"
                            :key="line"
                            class="prerequisite-list"
                        >
                            <v-icon class="prerequisites-list-item"
                                >label</v-icon
                            >
                            {{ line }}
                        </v-item-group>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>

        <template>
            <v-row justify="center">
                <v-dialog v-model="confirmRemove" persistent max-width="600">
                    <v-card class="test">
                        <v-card-title class="headline pb-0"
                            >Are you sure you want to remove this module?
                        </v-card-title>

                        <v-container class="pb-5">
                            <v-row class="justify-center">
                                <v-btn
                                    dark
                                    class="mr-4"
                                    color="green"
                                    @click="
                                        confirmRemove = false;
                                        confirmRemoveModule();
                                    "
                                    >Confirm</v-btn
                                >
                                <v-btn
                                    dark
                                    class="ml-4"
                                    color="red darken-1"
                                    @click="confirmRemove = false"
                                    >Cancel</v-btn
                                >
                            </v-row>
                        </v-container>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
    </div>
</template>

<style scoped>
@media only screen and (max-width: 5000px) {
    .module {
        margin-top: 0;
        margin-left: 8%;
        margin-right: 8%;
        padding-left: 2%;
        padding-right: 2%;
        height: 84vh;
        overflow-y: scroll;
        -ms-overflow-style: none;
    }

    .module::-webkit-scrollbar {
        display: none;
    }

    .module-header {
        padding-top: 1%;
        padding-bottom: 10px;
    }

    .module-header-line {
        margin-bottom: 20px;
        border-color: #7c0800;
    }

    .prerequisite-list {
        margin-right: 20px;
    }

    .text-bold {
        font-weight: bold;
    }

    .flex-line {
        display: flex;
    }

    .padd-bottom {
        padding-bottom: 15px;
    }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
    .module {
        margin-left: 0;
        margin-right: 0;
        padding-left: 2%;
        padding-right: 2%;
        padding-bottom: 5%;
        height: 84vh;
    }

    .module-header h1 {
        font-size: 25px;
    }

    .module-header h3 {
        font-size: 15px;
        font-weight: normal;
    }

    .prerequisites {
        font-size: 12px;
    }

    .prereq-head-small {
        padding-bottom: 13%;
    }

    .prerequisites-list-item {
        font-size: 12px;
    }

    .flex-line {
        font-size: 12px;
    }

    p {
        font-size: 12px;
    }
}
</style>

<script>
import { EventBus } from "@/event-bus.js";
import axios from "axios";

export default {
    name: "Module",

    components: {},
    data() {
        return {
            module: {},
            user: {},
            modules: {},
            confirmRemove: false,
        };
    },
    mounted() {
        if (sessionStorage.currentModule) {
            this.module = JSON.parse(sessionStorage.getItem("currentModule"));
        }

        EventBus.$on("updateModule", res => {
            this.module = res;
        });

        if (sessionStorage.user) {
            this.user = JSON.parse(sessionStorage.getItem("user"));
        }
    },

    methods: {
        getModules() {
            const path = "https://isy-be.herokuapp.com/getModules";
            axios
                .get(path)
                .then(res => {
                    this.modules = res.data.departments;

                    EventBus.$emit("getModules", this.modules);
                    EventBus.$emit("updateSearchBar", this.modules);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        showEditor() {
            EventBus.$emit("showModulesEditor", {
                module: this.module
            });
        },
        confirmRemoveModule() {
            const path = "https://isy-be.herokuapp.com/removeModule";

            axios
                .post(path, {
                    module: this.module
                })
                .then(res => {
                    this.temp = res;

                    this.$router.replace("/");

                    this.getModules();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        removeModule() {
            this.confirmRemove = true;
        }
    }
};
</script>
