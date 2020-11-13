<template>
    <v-row justify="center" class="">
        <v-dialog v-model="dialog" content-class="popup-dialog" width="30%" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card class="popup">
                <v-card-title class="headline"
                    >Choose a Programme:</v-card-title
                >

                <hr style="padding-left: 0" class="top-hr" />

                <v-alert
                    border="top"
                    colored-border
                    color="red darken-2"
                    type="info"
                    elevation="2"
                    class="info-banner"
                >
                    The options are searchable
                </v-alert>

                <v-card-text>
                    <h2 class="">Choose a Programme</h2>
                    <v-autocomplete
                        v-model="programme"
                        :items="programmes_only"
                        class="undergrad-programme"
                        color="red darken-2"
                        dense
                        filled
                        attach
                        label="Departments"
                        @change="getDegrees"
                    ></v-autocomplete>

                    <div
                        v-if="
                            this.programme !== null &&
                            Object.keys(
                                this.programmes[programme]['programmes']
                            ).length !== 0
                        "
                    >
                        <h2 class="">Choose a Degree</h2>
                        <v-autocomplete
                            v-model="degree"
                            :items="degrees"
                            class="undergrad-degree"
                            color="red darken-2"
                            dense
                            filled
                            attach
                            label="Modules"
                            @change="getStreams"
                        ></v-autocomplete>
                    </div>

                    <div v-if="this.streams.length !== 0">
                        <h2 class="">Choose a Stream</h2>
                        <v-autocomplete
                            v-model="stream"
                            :items="streams"
                            class="undergrad-stream"
                            color="red darken-2"
                            dense
                            filled
                            attach
                            label="Modules"
                            @change="getOptions"
                        ></v-autocomplete>
                    </div>

                    <div v-if="this.pOptions.length !== 0">
                        <h2 class="">Choose an Option</h2>
                        <v-autocomplete
                            v-model="pOption"
                            :items="pOptions"
                            color="red darken-2"
                            dense
                            filled
                            attach
                            label="Modules"
                        ></v-autocomplete>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="dialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="red darken-1" text @click="goToProgramme">
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { EventBus } from "@/event-bus.js";
import axios from "axios";

export default {
    name: "FindUndergrad",

    data() {
        return {
            programmes: {},
            programmes_only: [],
            degrees: [],
            streams: [],
            pOptions: [],
            dialog: false,
            programme: null,
            degree: null,
            stream: null,
            pOption: null,
        };
    },
    methods: {
        buildKey() {
            let key = this.programme;

            if (this.degree !== null) {
                key += "_" + this.degree;
            }
            if (this.stream !== null) {
                key += "_" + this.stream;
            }
            if (this.pOption !== null) {
                key += "_" + this.pOption;
            }

            return key.replace(" ", "_");
        },
        goToProgramme() {
            this.dialog = false;

            const path = "https://isy-be.herokuapp.com/getUP";

            const getKey = this.buildKey();

            const payload = { key: getKey };

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
                })
                .catch((error) => {
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
        getDegrees() {
            this.degrees = [];
            this.streams = [];
            this.pOptions = [];

            if (
                Object.keys(this.programmes[this.programme]["programmes"])
                    .length !== 0
            ) {
                for (const val in this.programmes[this.programme][
                    "programmes"
                ]) {
                    this.degrees.push(val);
                }
            } else {
                this.getStreams();
            }
        },
        getStreams() {
            this.streams = [];
            this.pOptions = [];
            if (this.degree !== null) {
                for (const val in this.programmes[this.programme]["programmes"][
                    this.degree
                ]) {
                    this.streams.push(val);
                }
            } else {
                for (const val in this.programmes[this.programme]["streams"]) {
                    this.streams.push(val);
                }
            }
        },
        getOptions() {
            this.pOptions = [];
            if (this.degree !== null) {
                for (const val in this.programmes[this.programme]["programmes"][
                    this.degree
                ][this.stream]) {
                    this.pOptions.push(
                        this.programmes[this.programme]["programmes"][
                            this.degree
                        ][this.stream][val]
                    );
                }
            } else {
                for (const val in this.programmes[this.programme]["streams"][
                    this.stream
                ]) {
                    this.pOptions.push(
                        this.programmes[this.programme]["streams"][this.stream][
                            val
                        ]
                    );
                }
            }
        },
        openPickProgramme(val) {
            this.dialog = val;
        },
    },
    created() {},
    mounted() {
        if (sessionStorage.undergradProgrammes) {
            this.programmes = JSON.parse(
                sessionStorage.getItem("undergradProgrammes")
            );
        } else {
            EventBus.$on("getUP", (res) => {
                this.programmes = res;
            });
        }

        EventBus.$on("showUndergrad", (res) => {
            for (const prog in this.programmes) {
                this.programmes_only.push(prog);
            }

            this.dialog = res;
        });
    },
};
</script>

<style scoped>
@media only screen and (max-width: 5000px) {
    .popup-dialog {
        width: 30% !important;
    }

    .popup {
        height: 70vh !important;
        overflow-y: scroll;
        -ms-overflow-style: none;
    }

    .popup::-webkit-scrollbar {
        display: none;
    }

    .top-hr {
        margin-bottom: 5%;
    }

    .info-banner {
        top: -10px;
        width: 80%;
        margin-left: 10%;
    }

    .buttons {
        position: absolute;
        left: 410px;
        bottom: 10px;
    }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
}
</style>
