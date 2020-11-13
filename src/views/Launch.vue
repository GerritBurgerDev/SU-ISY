<template>
    <v-card class="launch">
        <div class="options-large d-none d-xl-block d-md-block">
            <v-row>
                <v-col>
                    <v-card elevation="3" class="options-large-card">
                        <div class="card-header">Programmes</div>
                        <hr class="card-hr" />
                        <v-btn
                            class="card-button mt-5 mb-2"
                            @click.prevent="pickUndergrad"
                            >Undergraduate</v-btn
                        ><br/>
                        <v-btn class="card-button mt-3 mb-5" @click.prevent="pickPostgrad"
                            >Postgraduate</v-btn
                        >
                        <div class="card-text">
                            Get all the information you need about the
                            programmes available in the faculty of science!
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card elevation="3" class="options-large-card">
                        <div class="card-header">Modules</div>
                        <hr class="card-hr" />
                        <div class="card-programmes-buttons">
                            <div class="my-8">
                                <v-btn class="card-button" @click="pickModule">
                                    Specify a module
                                </v-btn>
                            </div>
                        </div>
                        <div class="card-text">
                            Get all the information you need about the modules
                            available in the faculty of science!
                        </div>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card elevation="3" class="options-large-card">
                        <div class="card-header">Faculty Information</div>
                        <hr class="card-hr" />
                        <div class="card-programmes-buttons">
                            <div class="my-8">
                                <v-btn
                                    class="card-button"
                                    :to="{ path: '/general' }"
                                >
                                    Go To Information
                                </v-btn>
                            </div>
                        </div>
                        <div class="card-text">
                            Information about the faculty, like department
                            contact details, etc.
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col></v-col>
                <v-col>
                    <v-card
                        v-if="!this.loggedIn"
                        elevation="3"
                        class="options-large-card"
                    >
                        <div class="card-header">Prospective Students</div>
                        <hr class="card-hr" />
                        <div class="card-programmes-buttons">
                            <div class="my-8">
                                <v-btn
                                    class="card-button"
                                    @click="showProspectivePossibilities"
                                    >What can I study
                                </v-btn>
                            </div>
                        </div>
                        <div class="card-text">
                            Students who plan to enroll at Stellenbosch
                            University can use this option to see what degrees
                            they qualify for.
                        </div>
                    </v-card>
                    <v-card
                        v-if="this.loggedIn && !this.userData['admin']"
                        elevation="3"
                        class="options-large-card"
                    >
                        <div class="card-header">Students</div>
                        <hr class="card-hr" />
                        <div class="card-programmes-buttons">
                            <div class="my-2" v-if="this.loggedIn">
                                <v-btn
                                    class="card-button"
                                    :to="{ path: '/continue-current-degree' }"
                                >
                                    Continue Current Degree
                                </v-btn>
                            </div>
                            <div class="my-2" v-else>
                                <v-btn class="card-button" disabled>
                                    Continue Current Degree
                                </v-btn>
                            </div>
                            <div class="my-3" v-if="this.loggedIn">
                                <v-btn
                                    class="card-button"
                                    @click.prevent="showPostgradPossibilities"
                                >
                                    Postgraduate possibilities
                                </v-btn>
                            </div>
                            <div class="my-3" v-else>
                                <v-btn disabled class="card-button">
                                    Postgraduate possibilities
                                </v-btn>
                            </div>
                        </div>
                        <div class="card-text">
                            Students enrolled at Stellenbosch University can use
                            these options to receive helpful information from
                            the yearbook without the hassle of going to the
                            admin building.
                        </div>
                    </v-card>
                    <v-card
                        v-if="this.loggedIn && this.userData['admin']"
                        elevation="3"
                        class="options-large-card"
                    >
                        <div class="card-header">Staff</div>
                        <hr class="card-hr" />
                        <div class="card-programmes-buttons">
                            <div class="my-2">
                                <v-btn
                                    v-if="
                                        this.loggedIn && this.userData['admin']
                                    "
                                    class="card-button"
                                    @click="showAddProgramme()"
                                    >Add a programme</v-btn
                                >
                                <v-btn v-else class="card-button" disabled
                                    >Add a programme</v-btn
                                >
                            </div>
                            <div class="my-3">
                                <v-btn
                                    v-if="
                                        this.loggedIn && this.userData['admin']
                                    "
                                    class="card-button"
                                    @click="showAddModule()"
                                    >Add a module</v-btn
                                >
                                <v-btn v-else class="card-button" disabled
                                    >Add a module</v-btn
                                >
                            </div>
                        </div>
                        <div class="card-text">
                            These options are for staff members only.
                        </div>
                    </v-card>
                </v-col>
                <v-col></v-col>
            </v-row>
        </div>

        <v-carousel
            class="options-small d-none d-flex d-sm-flex d-md-none"
            show-arrows-on-hover
            hide-delimiters
        >
            <v-carousel-item v-if="this.loggedIn && this.userData['admin']">
                <v-card light elevation="3" class="options-small-card">
                    <v-card-title primary-title class="justify-center">
                        <div class="card-header">Staff</div>
                    </v-card-title>
                    <hr class="card-hr" />
                    <v-card-text class="text-center" style="width: 95vw">
                        <div class="card-text pb-10 pt-5">
                            <h2>Unfortunately the staff options are only available on larger device screens.</h2>
                        </div>
                    </v-card-text>
                </v-card>
            </v-carousel-item>

            <v-carousel-item v-if="this.loggedIn && !this.userData['admin']">
                <v-card light elevation="3" class="options-small-card">
                    <v-card-title primary-title class="justify-center">
                        <div class="card-header">Current Student</div>
                    </v-card-title>
                    <hr class="card-hr" />
                    <v-card-text class="text-center">
                        <v-btn
                            class="card-button mt-4 mb-5"
                            :to="{ path: '/continue-current-degree' }"
                        >
                            Continue Current Degree
                        </v-btn>
                        <v-btn
                            class="card-button mt-5 mb-10"
                            @click.prevent="showPostgradPossibilities"
                            :disabled="!this.userData['undergrad'].hasOwnProperty('3rd year')"
                        >
                            Postgraduate possibilities
                        </v-btn>
                        <div class="card-text">
                            Students enrolled at Stellenbosch University can use
                            these options to receive helpful information from
                            the yearbook without the hassle of going to the
                            admin building.
                        </div>
                    </v-card-text>
                </v-card>
            </v-carousel-item>

            <v-carousel-item v-if="!this.loggedIn">
                <v-card light elevation="3" class="options-small-card">
                    <v-card-title primary-title class="justify-center">
                        <div class="card-header">Prospective Student</div>
                    </v-card-title>
                    <hr class="card-hr" />
                    <v-card-text class="text-center">
                        <v-btn
                            class="card-button mb-10 mt-5"
                            @click="showProspectivePossibilities"
                            >What can I study
                        </v-btn>
                        <div class="card-text">
                            Students who plan to enroll at Stellenbosch
                            University can use this option to see what degrees
                            they qualify for.
                        </div>
                    </v-card-text>
                </v-card>
            </v-carousel-item>

            <v-carousel-item v-for="heading in this.cards" :key="heading">
                <v-card light elevation="3" class="options-small-card">
                    <v-card-title primary-title class="justify-center">
                        <div class="card-header">{{ heading }}</div>
                    </v-card-title>
                    <hr class="card-hr" />
                    <v-card-text
                        class="text-center"
                        v-if="heading === 'Programmes'"
                    >
                        <v-btn
                            class="card-button mb-5 mt-4"
                            @click="pickUndergrad"
                            >Undergraduate</v-btn
                        ><br />
                        <v-btn
                            class="card-button mt-5 mb-10"
                            @click="pickPostgrad"
                            >Postgraduate</v-btn
                        >
                        <div class="card-text">
                            Get all the information you need about the
                            programmes available in the faculty of science!
                        </div>
                    </v-card-text>
                    <v-card-text
                        class="text-center"
                        v-if="heading === 'Modules'"
                    >
                        <v-btn
                            class="card-button mt-7 mb-10"
                            @click="pickModule"
                        >
                            Specify a module
                        </v-btn>
                        <div class="card-text">
                            Get all the information you need about the modules
                            available in the faculty of science!
                        </div>
                    </v-card-text>
                    <v-card-text
                        class="text-center"
                        v-if="heading === 'Faculty Information'"
                    >
                        <v-btn
                            class="card-button mb-10 mt-5"
                            :to="{ path: '/general' }"
                        >
                            Go To Information
                        </v-btn>
                        <div class="card-text">
                            Information about the faculty, like department
                            contact details, etc.
                        </div>
                    </v-card-text>
                </v-card>
            </v-carousel-item>
        </v-carousel>
    </v-card>
</template>

<style scoped>
@media only screen and (max-width: 5000px) {
    .launch {
        margin-left: 8%;
        margin-right: 8%;
        margin-top: -10px;
        padding-left: 2%;
        padding-right: 2%;
        height: 84vh;
        max-width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        -ms-overflow-style: none;
        background-color: rgba(250, 250, 250, 0.95);
    }

    .launch::-webkit-scrollbar {
        display: none;
    }

    .options-large {
        position: relative;
        top: 8%;
        left: 3.5%;
    }

    .options-large-card {
        height: 300px;
        width: 400px;
        text-align: center;
        background-color: rgba(248, 248, 248, 0.5);
    }

    .card-header {
        position: relative;
        top: 10px;
        font-size: 30px;
        font-weight: 400;
    }

    .card-hr {
        margin-top: 10px;
        margin-right: 10%;
        margin-left: 10%;
    }

    .card-button {
        background-color: #a80000 !important;
        color: white;
    }

    .card-text {
        position: relative;
        top: 5%;
        margin-left: 2%;
        margin-right: 2%;
        /*color: black;*/
    }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
    .launch {
        margin-top: 5%;
        margin-left: 0;
        margin-right: 0;
        height: 75vh;
    }

    .options-small {
        height: 100vh;
    }

    .options-small-card {
        top: 20%;
        background-color: rgba(255, 255, 255, 0.7);
    }
}
</style>

<script>
import { EventBus } from "@/event-bus.js";

export default {
    name: "Launch",

    data() {
        return {
            cards: ["Programmes", "Modules", "Faculty Information"],
            userType: "",
            loggedIn: false,
            userData: {},
        };
    },
    methods: {
        pickModule() {
            EventBus.$emit("showPickModule", true);
        },
        pickUndergrad() {
            EventBus.$emit("showUndergrad", true);
        },
        pickPostgrad() {
            EventBus.$emit("showPostgrad", true);
        },
        showPostgradPossibilities() {
            EventBus.$emit("showPostgradPossibilities", this.userData);
        },
        showProspectivePossibilities() {
            EventBus.$emit("showProspectivePossibilities", true);
        },
        showAddModule() {
            EventBus.$emit("showAddModule", true);
        },
        showAddProgramme() {
            EventBus.$emit("showAddProgramme", true);
        },
    },
    mounted() {
        if (sessionStorage.user) {
            this.userData = JSON.parse(sessionStorage.getItem("user"));
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }

        EventBus.$on("sendIsLoggedIn", (res) => {
            const data = res;
            this.userData = data.user;
            this.loggedIn = data.logged;
        });
    },
};
</script>
