<template>
    <div class="main-div">
        <v-card class="module">
            <div v-if="this.type === 'undergrad'">
                <v-row class="programme-header">
                    <v-col cols="11">
                        <h1>
                            {{ this.programme["programme"] }}
                        </h1>
                        <h2 v-if="'degree' in this.programme">
                            Programme: {{ this.programme["degree"] }}
                        </h2>
                        <h3 v-if="'stream' in this.programme">
                            Stream: {{ this.programme["stream"] }}
                        </h3>
                        <h3 v-if="'option' in this.programme">
                            Option: {{ this.programme["option"] }}
                        </h3>
                    </v-col>
                    <v-col
                        class="d-none d-lg-flex d-xl-flex d-md-flex pl-6 pt-2"
                        cols="1"
                        v-if="Object.keys(user).length !== 0 && user['admin']"
                    >
                        <v-icon
                            large
                            class="editor-icon pr-2"
                            @click="showEditor()"
                            >fa-edit</v-icon
                        >
                        <v-icon
                            large
                            class="delete-icon"
                            @click="removeProgramme()"
                            >mdi-delete</v-icon
                        >
                    </v-col>
                </v-row>

                <hr class="module-header-line" />

                <div v-for="(contents, key) in this.programme" :key="key">
                    <v-card
                        v-if="placeSection(key)"
                        class="programme-info-sections"
                    >
                        <p v-if="contents === 'text'">
                            {{ key }}
                        </p>

                        <div v-else>
                            <h3>{{ key }}</h3>

                            <div v-for="(val, item) in contents" :key="item">
                                <div class="list-item">
                                    {{ item }}

                                    <div v-if="typeof val === 'object'">
                                        <ul
                                            v-for="(type, item) in val"
                                            :key="type"
                                        >
                                            <li>{{ item }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </div>

                <uci
                    class="ume-content"
                    :payload="this.programme['Programme Content']"
                    :depth="0"
                    :year="''"
                    :prev-key="''"
                />
            </div>

            <div v-if="this.type === 'postgrad'">
                <div class="programme-header d-none d-xl-block d-md-block">
                    <div style="display: flex">
                        <h1>
                            {{ this.programme["degree"] }} in
                            {{ this.programme["module_name"] }}
                        </h1>
                        <v-spacer></v-spacer>
                        <h1 v-if="this.programme['module_code'] !== ''">
                            Module code - {{ this.programme["module_code"] }}
                        </h1>
                        <v-icon
                            large
                            class="editor-icon pl-3 pr-2 d-none d-lg-flex d-xl-flex d-md-flex"
                            @click="showEditor"
                            v-if="
                                Object.keys(user).length !== 0 && user['admin']
                            "
                            >fa-edit</v-icon
                        >
                        <v-icon
                            large
                            class="delete-icon d-none d-lg-flex d-xl-flex d-md-flex"
                            @click="removeProgramme()"
                            v-if="
                                Object.keys(user).length !== 0 && user['admin']
                            "
                            >mdi-delete</v-icon
                        >
                    </div>
                    <div style="display: flex">
                        <h2>
                            {{ this.programme["department"] }}
                        </h2>
                        <v-spacer></v-spacer>
                        <h3>
                            {{ this.programme["faculty"] }}
                        </h3>
                    </div>
                    <div style="display: flex">
                        <h3 v-if="this.programme['subject_code'] !== ''">
                            Subject code - {{ this.programme["subject_code"] }}
                        </h3>
                        <v-spacer></v-spacer>
                        <h3 v-if="this.programme['credits'] !== ''">
                            {{ this.programme["credits"] }} credits
                        </h3>
                    </div>
                </div>
                <div
                    class="programme-header d-none d-block d-sm-block d-md-none"
                >
                    <div style="display: flex">
                        <h2>
                            {{ this.programme["degree"] }} in
                            {{ this.programme["module_name"] }}
                        </h2>
                    </div>
                    <div style="">
                        <h3>
                            {{ this.programme["department"] }}
                        </h3>
                        <h3>
                            {{ this.programme["faculty"] }}
                        </h3>
                        <h3 v-if="this.programme['module_code'] !== ''">
                            Module code - {{ this.programme["module_code"] }}
                        </h3>
                    </div>
                    <div style="display: flex">
                        <h3 v-if="this.programme['subject_code'] !== ''">
                            Subject code - {{ this.programme["subject_code"] }}
                        </h3>
                        <v-spacer></v-spacer>
                        <h3 v-if="this.programme['credits'] !== ''">
                            {{ this.programme["credits"] }} credits
                        </h3>
                    </div>
                </div>

                <hr class="module-header-line" />

                <div v-for="(content, title) in this.programme" :key="title">
                    <v-card
                        class="postgrad-info-card"
                        v-if="
                            placeSection(title) && typeof content === 'object'
                        "
                    >
                        <h3>{{ title }}</h3>
                        <ul>
                            <li v-for="(val, entry) in content" :key="entry">
                                {{ entry }}
                            </li>
                        </ul>
                    </v-card>
                </div>

                <v-card
                    class="postgrad-programme-content postgrad-info-card"
                    v-if="'Programme Content' in this.programme"
                >
                    <h3>Programme Content</h3>
                    <pci
                        :payload="this.programme['Programme Content']"
                        :depth="0"
                        :root="''"
                        :prev-key="''"
                    />
                </v-card>
            </div>
        </v-card>

        <template>
            <v-row justify="center">
                <v-dialog v-model="confirmRemove" persistent max-width="600">
                    <v-card class="test">
                        <v-card-title class="headline pb-0"
                            >Are you sure you want to remove this programme?
                        </v-card-title>

                        <v-container class="pb-5">
                            <v-row class="justify-center">
                                <v-btn
                                    dark
                                    class="mr-4"
                                    color="green"
                                    @click="
                                        confirmRemove = false;
                                        confirmRemoveProgramme();
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
        margin-top: -10px;
        margin-left: 8%;
        margin-right: 8%;
        padding-left: 2%;
        padding-right: 2%;
        padding-top: 1%;
        height: 84vh;
        overflow-y: scroll;
        -ms-overflow-style: none;
    }

    .module::-webkit-scrollbar {
        display: none;
    }

    .module-header-line {
        margin-bottom: 20px;
        border-color: #7c0800;
    }

    .programme-info-sections {
        margin-top: 0;
        margin-bottom: 1%;
        padding: 1.5%;
    }

    .info-banner {
        top: -10px;
        width: 80%;
        margin-left: 0;
        left: -10%;
    }

    /* UNDERGRAD PROPERTIES */
    .undergrad-table-header {
    }

    .undergrad-table-header-cols {
        border-bottom: solid 2px #a80000;
    }

    .undergrad-table-rows {
    }

    .undergrad-table-cols {
        border-bottom: solid 1px black;
    }

    /* POSTGRAD PROPERTIES */
    .postgrad-info-card {
        margin-top: 0;
        margin-bottom: 1%;
        padding: 1.5%;
    }

    /* POSTGRAD MAIN TABLES */
    .postgrad-main-table {
        margin-left: 10px;
        margin-right: 10px;
    }

    .postgrad-main-table-headers {
        border-bottom: solid 2px #a80000;
    }

    .postgrad-main-table-rows {
        border-bottom: solid 1px;
        margin: 0 !important;
        padding: 0 !important;
        height: 70px;
    }

    .postgrad-main-table-cols.col {
        padding: 0 !important;
        margin: 0 !important;
    }

    .postgrad-sub-table-rows {
        border-bottom: solid 1px;
        margin: 0 !important;
        padding: 0 !important;
        height: 45px;
    }

    .postgrad-sub-table-cols.col {
        padding: 0 !important;
        margin: 0 !important;
    }

    .postgrad-inner-table-hearders {
        padding-bottom: 5px;
    }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
    .main-div {
        width: 100vw;
        margin: 0;
        padding: 0;
        position: absolute;
        left: 0;
    }

    .module {
        margin-left: 0;
        margin-right: 0;
        padding-left: 2%;
        padding-right: 2%;
        height: 83vh;
        width: 100vw;
    }
}
</style>

<script>
import { EventBus } from "@/event-bus.js";
import axios from "axios";

import pci from "@/components/ProgrammeComponents/PostgradCourseInfo.vue";
import uci from "@/components/ProgrammeComponents/UndergradCourseInfo.vue";

export default {
    name: "Programme",

    components: {
        pci,
        uci,
    },
    data() {
        return {
            componentKey: 0,
            programme: {},
            type: "",
            programme_info: {},
            table: {},
            user: {},
            confirmRemove: false,
        };
    },
    methods: {
        placeSection(string) {
            if (
                string === "programme" ||
                string === "degree" ||
                string === "stream" ||
                string === "option" ||
                string === "_id" ||
                string === "_key" ||
                string === "_rev" ||
                string === "Programme Content"
            ) {
                return false;
            }

            return true;
        },
        getProgrammeInfoSections() {
            for (const entry in this.programme) {
                if (Array.isArray(this.programme[entry])) {
                    this.programme_info[entry] = this.programme[entry];
                }
            }
        },
        showEditor() {
            EventBus.$emit("showProgrammeEditor", {
                programme: this.programme,
                type: this.type,
            });
        },
        confirmRemoveProgramme() {
            const path = "https://isy-be.herokuapp.com/removeProgramme";

            axios
                .post(path, {
                    programme: this.programme,
                    programme_type: this.type,
                })
                .then((res) => {
                    this.temp = res;
                    this.$router.replace("/home");
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        removeProgramme() {
            this.confirmRemove = true;
        },
    },
    mounted() {
        if (sessionStorage.currentProgramme) {
            const result = JSON.parse(
                sessionStorage.getItem("currentProgramme")
            );
            this.programme = result.data;
            this.type = result.type;
        }

        EventBus.$on("updateProgramme", (res) => {
            this.programme = res.data;
            this.type = res.type;
            this.programme_info = {};
            this.getProgrammeInfoSections();
        });

        if (sessionStorage.user) {
            this.user = JSON.parse(sessionStorage.getItem("user"));
        }

        this.getProgrammeInfoSections();
    },
};
</script>
