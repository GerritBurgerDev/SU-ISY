<template>
    <v-row justify="center" class="">
        <v-dialog
            v-model="dialog"
            content-class="psp-form-dialog"
            width="45%"
            :fullscreen="$vuetify.breakpoint.xsOnly"
        >
            <v-card class="psp-form">
                <v-row justify="center">
                    <v-card-title v-if="!formCompleted">
                        Please complete the following form:
                    </v-card-title>
                    <v-card-title v-if="formCompleted && calculating">
                        Please wait
                    </v-card-title>
                    <v-card-title v-if="formCompleted && !calculating">
                        Your possibilities are:
                    </v-card-title>
                </v-row>

                <hr />

                <div v-if="!this.formCompleted">
                    <v-row no-gutters class="psp-form-header">
                        <v-col cols="7">
                            <h3>Subjects</h3>
                        </v-col>
                        <v-col>
                            <h3>Code achieved</h3>
                        </v-col>
                    </v-row>

                    <v-row
                        v-for="(val, subject) in this.form"
                        :key="subject"
                        no-gutters
                        class="psp-form-rows"
                    >
                        <v-col
                            v-if="subject !== 'Average achieved'"
                            cols="7"
                            class="psp-form-row-text"
                        >
                            {{ subject }}
                        </v-col>
                        <v-col
                            v-if="subject !== 'Average achieved'"
                            cols="3"
                            lg="2"
                            sm="3"
                        >
                            <v-select
                                :class="
                                    'psp-' +
                                    subject.replace(/\s+/g, '-').toLowerCase()
                                "
                                v-model="form[subject]"
                                :items="codes"
                                label="Code"
                            ></v-select>
                        </v-col>
                    </v-row>

                    <v-row no-gutters class="psp-form-rows">
                        <v-col class="psp-form-row-text" cols="7">
                            Average achieved
                            <v-icon>info</v-icon>
                        </v-col>
                        <v-col cols="3" sm="3" lg="2">
                            <v-form>
                                <v-text-field
                                    v-model="form['Average achieved']"
                                    label="%"
                                    :rules="[
                                        avgRule.testIput(
                                            form['Average achieved']
                                        ),
                                    ]"
                                >
                                </v-text-field>
                            </v-form>
                        </v-col>
                    </v-row>

                    <v-card-actions>
                        <v-spacer />

                        <v-btn color="red darken-1" text @click="calculate">
                            Calculate
                        </v-btn>
                        <v-btn color="red darken-1" text @click="resetForm">
                            Cancel
                        </v-btn>
                    </v-card-actions>
                </div>

                <v-row
                    v-else-if="this.formCompleted && this.calculating"
                    no-gutters
                    justify="center"
                >
                    <v-progress-circular
                        :size="200"
                        color="red darken-2"
                        indeterminate
                        class="psp-form-loader"
                    ></v-progress-circular>
                </v-row>

                <div v-else-if="formCompleted && !calculating">
                    <div class="psp-possibilities">
                        <v-row
                            v-for="(val, key) in this.possibilities"
                            :key="key"
                            justify="center"
                            no-gutters
                        >
                            <v-col align="center">
                                <v-btn
                                    dark
                                    class="mt-4"
                                    color="red darken-2"
                                    @click="goToProgramme(key)"
                                >
                                    {{ val }}
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row
                            class="justify-center pl-5 pr-5"
                            v-if="Object.keys(this.possibilities).length === 0"
                        >
                            <v-col class="justify-center">
                                <h2>
                                    Unfortunately, you do not qualify for any of
                                    the undergraduate programmes in the faculty
                                    of science.
                                </h2>
                            </v-col>
                        </v-row>
                    </div>

                    <v-card-actions>
                        <v-spacer />

                        <v-btn color="red darken-1" text @click="resetForm">
                            Close
                        </v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </v-dialog>

        <v-snackbar
            v-model="inputError"
            :timeout="2000"
            color="red darken-3"
            top
        >
            <v-row no-gutters justify="center">
                Please complete the entire form.
            </v-row>
        </v-snackbar>
    </v-row>
</template>

<script>
import { EventBus } from "@/event-bus.js";
import axios from "axios";

export default {
    name: "ProspectivePossibilities",

    data() {
        return {
            form: {
                Afrikaans: "",
                English: "",
                Mathematics: "",
                "Physical Sciences": "",
                "Any other accredited subject": "",
                "Average achieved": "",
            },
            codes: ["N/A", "1", "2", "3", "4", "5", "6", "7"],
            possibilities: {},
            formCompleted: false,
            dialog: false,
            calculating: false,
            avgRule: {
                testIput(val) {
                    if (/^\b(0|[1-9][0-9]?|100)\b$/.test(val)) {
                        this.validAvg = true;
                        return true;
                    }

                    this.validAvg = false;
                    return "Incorrect";
                },
            },
            validAvg: false,
            inputError: false,
        };
    },

    methods: {
        calculate() {
            let calc = true;

            if (this.avgRule.validAvg) {
                for (const item in this.form) {
                    if (this.form[item] === "") {
                        calc = false;
                        break;
                    } else {
                        if (this.form[item] === "N/A") {
                            this.form[item] = 0;
                        } else {
                            this.form[item] = parseInt(this.form[item]);
                        }
                    }
                }
            } else {
                calc = false;
            }

            if (calc) {
                const path =
                    "https://isy-be.herokuapp.com/getProspectivePossibilities";

                axios
                    .post(path, this.form)
                    .then((res) => {
                        this.possibilities = res.data.result;
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                this.formCompleted = true;
                this.calculating = true;
            } else {
                this.inputError = true;
            }
        },
        resetForm() {
            this.dialog = false;
            this.formCompleted = false;
            this.calculating = false;
            this.form = {
                Afrikaans: "",
                English: "",
                Mathematics: "",
                "Physical Sciences": "",
                "Any other accredited subject": "",
                "Average achieved": "",
            };
        },
        goToProgramme(key) {
            this.dialog = false;

            const path = "https://isy-be.herokuapp.com/getUP";

            const payload = { key: key };

            axios
                .post(path, payload)
                .then((res) => {
                    const result = {
                        type: "undergrad",
                        data: res.data.programme,
                    };

                    sessionStorage.setItem(
                        "currentProgramme",
                        JSON.stringify(result)
                    );

                    EventBus.$emit("sendProgramme", result);
                    EventBus.$emit("updateProgramme", result);

                    if (this.$router.currentRoute.name !== "Programme") {
                        this.$router.push({ name: "Programme" });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },

    mounted() {
        EventBus.$on("showProspectivePossibilities", (res) => {
            this.dialog = res;
        });
    },

    watch: {
        calculating(val) {
            if (!val) return;

            this.calculating = false;
        },
        dialog(val) {
            if (val) return;

            this.resetForm();
        },
    },
};
</script>

<style>
@media only screen and (max-width: 5000px) {
    .psp-form-dialog {
        height: 68%;

        overflow-x: hidden;
        overflow-y: scroll;
        -ms-overflow-style: none;
    }

    .psp-form-dialog::-webkit-scrollbar {
        display: none;
    }

    .psp-form {
        height: 100%;
    }

    .psp-form-header {
        margin-top: 2%;
        margin-bottom: 2%;
        margin-left: 15%;
    }

    .psp-form-rows {
        margin-left: 15%;
    }

    .psp-form-row-text {
        font-size: 18px;
        position: relative;
        top: 10px;
    }

    .psp-form-loader {
        position: relative !important;
        top: 100px !important;
    }

    .psp-possibilities {
        /*margin-top: 2%;*/
        height: 470px;

        overflow-x: hidden;
        overflow-y: scroll;
        -ms-overflow-style: none;
    }

    .psp-possibilities::-webkit-scrollbar {
        display: none;
    }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
    .psp-form-dialog {
        height: 100vh;
        overflow-x: hidden;
        overflow-y: scroll;
        -ms-overflow-style: none;
    }

    .psp-form-header {
        margin-top: 5%;
        margin-bottom: 2%;
        margin-left: 5%;
    }

    .psp-form-rows {
        margin-left: 5%;
    }
}
</style>
