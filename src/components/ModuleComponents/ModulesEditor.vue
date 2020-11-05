<template>
    <div class="text-center">
        <v-dialog v-model="dialog" width="80vw" persistent>
            <v-card min-height="90vh" class="module-editor test">
                <v-card-title class="headline">
                    Edit Module
                </v-card-title>
                <hr style="border-bottom-color: #c40b00" />

                <v-container class="pa-2 pl-10 pr-10">
                    <v-row>
                        <v-col>
                            <h2>Module details</h2>
                        </v-col>
                    </v-row>
                    <v-row
                        v-for="(value, key) in this.textContentOnly(
                            this.module
                        )"
                        :key="key"
                        no-gutters
                    >
                        <v-col>
                            <v-text-field
                                v-model="module[key]"
                                :label="key"
                                :append-icon="'mdi-close-circle'"
                                @click:append="clearField(key)"
                            />
                        </v-col>
                    </v-row>

                    <!-- Module Information -->
                    <v-row>
                        <v-col cols="11">
                            <h2>Module information paragraphs</h2>
                        </v-col>
                        <v-col cols="1">
                            <v-icon
                                large
                                color="grey darken-2"
                                class="pl-10 ml-5 mod-info-button"
                                @click="
                                    editModuleInformation = true;
                                    type = 'info';
                                "
                            >
                                create
                            </v-icon>
                        </v-col>
                    </v-row>

                    <!-- Module Requisites -->
                    <v-row>
                        <v-col cols="11">
                            <h2>Pre-requisites</h2>
                        </v-col>
                        <v-col cols="1">
                            <v-icon
                                large
                                color="grey darken-2"
                                class="pl-10 ml-5"
                                @click="
                                    editModuleInformation = true;
                                    type = 'P';
                                "
                            >
                                create
                            </v-icon>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="11">
                            <h2>Pass Pre-requisites</h2>
                        </v-col>
                        <v-col cols="1">
                            <v-icon
                                large
                                color="grey darken-2"
                                class="pl-10 ml-5"
                                @click="
                                    editModuleInformation = true;
                                    type = 'PP';
                                "
                            >
                                create
                            </v-icon>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="11">
                            <h2>Co-requisites</h2>
                        </v-col>
                        <v-col cols="1">
                            <v-icon
                                large
                                color="grey darken-2"
                                class="pl-10 ml-5"
                                @click="
                                    editModuleInformation = true;
                                    type = 'C';
                                "
                            >
                                create
                            </v-icon>
                        </v-col>
                    </v-row>
                </v-container>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="red"
                        text
                        @click="
                            dialog = false;
                            module = module_backup;
                            type = '';
                        "
                    >
                        cancel
                    </v-btn>
                    <v-btn
                        color="success"
                        text
                        @click="
                            dialog = false;
                            if (typeAddModule) {
                                addModule();
                            } else {
                                saveChanges();
                            }
                            typeAddModule = false;
                        "
                    >
                        Save changes
                    </v-btn>
                </v-card-actions>
            </v-card>

            <template>
                <v-row justify="center">
                    <v-dialog
                        v-model="editModuleInformation"
                        persistent
                        width="75vw"
                    >
                        <v-card class="pce-new-list" min-height="85vh">
                            <v-card-title class="headline pb-0">
                                Edit Information

                                <v-spacer />

                                <v-row no-gutters class="d-flex">
                                    <v-col>
                                        <div class="float-right">
                                            <v-icon
                                                small
                                                color="red darken-2"
                                                class="mr-1"
                                                @click="
                                                    changeListAmt(false, type)
                                                "
                                                >remove
                                            </v-icon>
                                            {{
                                                getLength(
                                                    this.module[this.type]
                                                )
                                            }}
                                            <v-icon
                                                small
                                                color="green darken-2"
                                                class="ml-1"
                                                @click="
                                                    changeListAmt(true, type)
                                                "
                                                >add
                                            </v-icon>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-title>

                            <v-container class="pl-6 pr-6 pt-2 pb-0">
                                <v-row v-if="type !== 'info' && type !== ''">
                                    <v-col>
                                        <v-row class="justify-center">
                                            <v-alert
                                                border="top"
                                                colored-border
                                                color="red darken-4"
                                                elevation="2"
                                                type="warning"
                                            >
                                                <v-row>
                                                    <v-col cols="10">
                                                        <span
                                                            class="font-weight-bold"
                                                            >Please note: This
                                                            information is
                                                            format sensitive </span
                                                        ><br />
                                                        Click here here for
                                                        information on how to
                                                        enter information here
                                                        to prevent errors in the
                                                        background calculations.
                                                    </v-col>
                                                    <v-col cols="2">
                                                        <v-btn
                                                            color="red darken-1"
                                                            dark
                                                            class="mt-5"
                                                            @click="
                                                                modulesGuideline = true
                                                            "
                                                        >
                                                            Click me
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-alert>
                                        </v-row>

                                        <v-row>
                                            <v-col cols="2">
                                                <v-text-field
                                                    v-model="
                                                        module[
                                                            type + '_constraint'
                                                        ]
                                                    "
                                                    :append-icon="'mdi-close'"
                                                    label="Constraint"
                                                    @click:append="
                                                        clearField(
                                                            type + '_constraint'
                                                        )
                                                    "
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <v-row
                                    v-for="(content, key) in this.module[type]"
                                    :key="key"
                                >
                                    <v-col cols="11">
                                        <v-textarea
                                            rows="4"
                                            no-resize
                                            v-model="module[type][key]"
                                            clearable
                                            v-if="type === 'info'"
                                        />
                                        <v-text-field
                                            v-model="module[type][key]"
                                            :append-icon="'mdi-close'"
                                            @click:append="
                                                clearField(key, type)
                                            "
                                            v-else
                                        />
                                    </v-col>
                                    <v-col cols="1">
                                        <v-icon
                                            large
                                            color="red darken-2"
                                            :class="getClass(type)"
                                            @click="removeIndex(key, type)"
                                        >
                                            close
                                        </v-icon>
                                    </v-col>
                                </v-row>
                            </v-container>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="red darken-1"
                                    text
                                    @click="
                                        editModuleInformation = false;
                                        module = module_backup;
                                        type = '';
                                    "
                                    >Cancel</v-btn
                                >
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="
                                        editModuleInformation = false;
                                        type = '';
                                    "
                                    >Save</v-btn
                                >
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>
            </template>

            <template>
                <v-row justify="center">
                    <v-dialog
                        v-model="modulesGuideline"
                        persistent
                        width="75vw"
                    >
                        <v-card class="" min-height="85vh">
                            <v-card-title class="headline pb-0">
                                Editing Modules Guidelines
                            </v-card-title>

                            <v-container class="">
                                <v-alert
                                    border="left"
                                    colored-border
                                    type="error"
                                    elevation="2"
                                >
                                    <span class="font-weight-bold"
                                        >Constraint:
                                    </span>
                                    The constraint value
                                    <span class="font-weight-bold">MUST</span>
                                    be a fraction of the total amount of
                                    prerequisites. For example if there are 4
                                    prerequisites and the students only need to
                                    take 3 of the them: 3/4.
                                </v-alert>

                                <v-alert
                                    border="left"
                                    colored-border
                                    type="info"
                                    elevation="2"
                                >
                                    Adding modules have a very specific format.
                                    Here are some
                                    <span class="font-weight-bold"
                                        >very important</span
                                    >
                                    things to remember or do when adding
                                    modules:
                                    <ul>
                                        <li>
                                            Please ensure that the spelling of
                                            the module names and module codes
                                            are correct or the algorithm might
                                            not work as intended
                                        </li>
                                        <li>
                                            When the studen is required to take
                                            two modules together or they can
                                            choose between two modules or both
                                            the following examples should help
                                            with the format that is required:
                                            <br />
                                            <span class="font-weight-bold"
                                                >Must take both modules:</span
                                            >
                                            Computer Science 114 and Mathematics
                                            114<br />
                                            <span class="font-weight-bold"
                                                >Can choose between two
                                                modules:</span
                                            >
                                            Computer Science 114 or Mathematics
                                            114<br />
                                            <span class="font-weight-bold"
                                                >Choose between two different
                                                options for two required
                                                modules:</span
                                            >
                                            Computer Science 114 and
                                            Mathematics 114 or Computer
                                            Science 114 and Mathematics 124
                                        </li>
                                        <li>
                                            From the example above it is
                                            important to note that when the
                                            student can choose between two
                                            options for two required modules the
                                            requires modules are grouped with an
                                            <span class="font-weight-bold"
                                                >and</span
                                            >,
                                            and the choices are seperated with
                                            an
                                            <span class="font-weight-bold"
                                                >or</span
                                            >.
                                        </li>
                                    </ul>
                                </v-alert>
                            </v-container>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="modulesGuideline = false"
                                    >OK</v-btn
                                >
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>
            </template>
        </v-dialog>
    </div>
</template>

<script>
import axios from "axios";
import { EventBus } from "@/event-bus";

export default {
    name: "ModulesEditor",

    data() {
        return {
            dialog: false,
            editModuleInformation: false,
            modulesGuideline: false,
            module: {},
            module_backup: {},
            type: ""
        };
    },

    methods: {
        // Clear the value of a key in the modules object
        clearField(key) {
            this.module[key] = "";
        },
        clearRequiste(index, type) {
            this.module[type][index] = "";
        },
        getClass(type) {
            if (type === "info") {
                return "pt-10";
            }

            return "pt-2";
        },
        getLength(array) {
            let count = 0;

            for (let i in array) {
                this.temp = i;
                count++;
            }

            return count;
        },
        // Create a deep copy of an object
        deepCopy: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        // Find module info like name, credits, etc.
        textContentOnly: function(dic) {
            let obj = {};

            for (let key in dic) {
                if (
                    key !== "_key" &&
                    key !== "_id" &&
                    key !== "_rev" &&
                    !key.includes("constraint")
                ) {
                    if (typeof dic[key] !== "object") {
                        obj[key] = dic[key];
                    }
                }
            }

            return obj;
        },
        removeIndex(index, type) {
            this.module[type].splice(index, 1);
        },
        changeListAmt(option, type) {
            if (option) {
                this.module[type].push("");
            } else {
                if (this.module[type].length > 0) {
                    this.module[type].pop();
                }
            }
        },
        saveChanges() {
            const path = "https://isy-be.herokuapp.com/saveModule";

            axios
                .post(path, {
                    module: this.module,
                    backup: this.module_backup
                })
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
        },
        addModule() {
            const path = "https://isy-be.herokuapp.com/addModule";

            axios
                .post(path, {
                    module: this.module
                })
                .then(res => {
                    this.get_module = res.data.module;
                    this.getModules();

                    this.$router.replace("/module");

                    sessionStorage.setItem(
                        "currentModule",
                        JSON.stringify(this.get_module)
                    );
                    EventBus.$emit("sendModule", this.get_module);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        getModules() {
            const path = "https://isy-be.herokuapp.com/getModules";
            axios
                .get(path)
                .then(res => {
                    this.modules = res.data.departments;

                    if (!sessionStorage.modules) {
                        sessionStorage.setItem(
                            "modules",
                            JSON.stringify(this.modules)
                        );
                    }

                    EventBus.$emit("getModules", this.modules);
                    EventBus.$emit("updateSearchBar", this.modules);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },

    mounted() {
        EventBus.$on("showModulesEditor", res => {
            this.dialog = true;
            this.module = this.deepCopy(res.module);
            this.module_backup = this.deepCopy(res.module);
        });

        EventBus.$on("showAddModule", res => {
            this.dialog = res;
            this.typeAddModule = res;
            this.module = {
                _key: "",
                C: [],
                C_constraint: "",
                P: [],
                PP: [],
                PP_constraint: "",
                P_constraint: "",
                credits: "",
                department: "",
                info: [],
                method_of_assessment: "",
                module_code: "",
                module_name: "",
                subject_code: ""
            };
            this.module_backup = this.deepCopy(this.module);
        });
    }
};
</script>

<style scoped>
.test {
    height: 75vh !important;
    overflow-x: hidden;
    overflow-y: scroll;
    -ms-overflow-style: none;
}

.test::-webkit-scrollbar {
    display: none;
}
</style>
