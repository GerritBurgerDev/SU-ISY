<template>
    <v-card class="launch">
        <!-- ISY SPINNER AND GREETING -->
        <v-row>
            <div class="top">
                <div class="atom-spinner">
                    <div class="spinner-inner">
                        <div class="spinner-line"></div>
                        <div class="spinner-line"></div>
                        <div class="spinner-line"></div>
                        <div class="spinner-circle">&#9679;</div>
                    </div>
                </div>
            </div>
            <div class="head">
                <div class="text">
                    Welcome to the Faculty of Science yearbook
                </div>
            </div>
        </v-row>

        <!-- CHOOSE USER TYPE -->
        <v-row class="landing-cards d-none d-xl-block d-md-block">
            <v-row>
                <v-col>
                    <v-card elevation="3" class="landing-card text-center pt-5 pb-5">
                        <h1 class="pt-2">Prospective Student</h1>
                        <hr class="mr-10 ml-10" />
                        <v-icon size="250" color="blue lighten-2"
                            >person</v-icon
                        >
                        <v-card-title class="justify-center">
                            <v-btn
                                class="white--text mr-2"
                                color="red darken-2"
                                @click.prevent="goToLaunch('prospective', true)"
                                >Prospective Student</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card elevation="3" class="landing-card text-center pt-5 pb-5">
                        <h1 class="pt-2">Current Student</h1>
                        <hr class="mr-10 ml-10" />
                        <v-icon size="250" color="red darken-2">person</v-icon>
                        <v-card-title class="justify-center">
                            <v-btn
                                class="white--text mr-2"
                                color="red darken-2"
                                @click.prevent="goToLaunch('student', false)"
                                >Current Student</v-btn
                            >
                            <v-btn
                                class="white--text ml-2"
                                color="red darken-2"
                                @click.prevent="goToLaunch('student', true)"
                                >Direct Login</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card elevation="3" class="landing-card text-center pt-5 pb-5">
                        <h1 class="pt-2">Staff Member</h1>
                        <hr class="mr-10 ml-10" />
                        <v-icon size="250" color="yellow darken-2"
                            >person</v-icon
                        >
                        <v-card-title class="justify-center">
                            <v-btn
                                class="white--text mr-2"
                                color="red darken-2"
                                @click.prevent="goToLaunch('staff', false)"
                                >Staff Member</v-btn
                            >
                            <v-btn
                                class="white--text ml-2"
                                color="red darken-2"
                                @click.prevent="goToLaunch('staff', true)"
                                >Direct Login</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-row>

        <v-row>
            <v-carousel
                class="landing-cards d-none d-flex d-sm-flex d-md-none"
                light
                :show-arrows="false"
                hide-delimiters
            >
                <v-carousel-item>
                    <v-card elevation="5" class="landing-card text-center">
                        <h1 class="pt-2">Prospective Student</h1>
                        <hr class="mr-10 ml-10" />
                        <v-icon size="250" color="blue lighten-2"
                            >person</v-icon
                        >
                        <v-card-title class="justify-center">
                            <v-btn
                                class="white--text mr-2"
                                color="red darken-2"
                                @click.prevent="goToLaunch('prospective', true)"
                                >Prospective Student</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-carousel-item>
                <v-carousel-item>
                    <v-card elevation="5" class="landing-card text-center">
                        <h1 class="pt-2">Current Student</h1>
                        <hr class="mr-10 ml-10" />
                        <v-icon size="250" color="red darken-2">person</v-icon>
                        <v-card-title class="justify-center">
                            <v-btn
                                class="white--text mr-2"
                                color="red darken-2"
                                @click.prevent="goToLaunch('student', false)"
                                >Current Student</v-btn
                            >
                            <v-btn
                                class="white--text mr-3"
                                color="red darken-2"
                                @click.prevent="goToLaunch('student', true)"
                                >Direct Login</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-carousel-item>
                <v-carousel-item>
                    <v-card elevation="5" class="landing-card text-center">
                        <h1 class="pt-2">Staff Member</h1>
                        <hr class="mr-10 ml-10" />
                        <v-icon size="250" color="yellow darken-2"
                            >person</v-icon
                        >
                        <v-card-title class="justify-center">
                            <v-btn
                                class="white--text mr-2"
                                color="red darken-2"
                                @click.prevent="goToLaunch('staff', false)"
                                >Staff Member</v-btn
                            >
                            <v-btn
                                class="white--text mr-3"
                                color="red darken-2"
                                @click.prevent="goToLaunch('staff', true)"
                                >Direct Login</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-carousel-item>
            </v-carousel>
        </v-row>
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

    .landing-cards {
        position: relative;
        top: 22%;
    }

    .landing-card {
        background-color: rgba(248, 248, 248, 0.5);
    }

    .top {
        position: absolute;
        width: 100%;
        top: calc(2%);
        left: calc(22%);
    }

    .head {
        overflow: hidden;
        position: absolute;
        top: calc(2%);
        left: calc(27% - 10px);
        width: 100%;
    }

    .text {
        position: relative;
        font-weight: 400;
        font-size: 40px;
        animation: slide-right 5s;
    }

    .atom-spinner,
    .atom-spinner * {
        box-sizing: border-box;
    }

    .atom-spinner {
        height: 60px;
        width: 60px;
        overflow: hidden;
    }

    .atom-spinner .spinner-circle {
        display: block;
        position: absolute;
        color: #52010e;
        font-size: calc(15px);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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

    .top {
        top: 5px;
        left: 12%;
    }

    .head {
        position: relative;
        top: 10px;
        left: calc(26%);
        width: 80%;
    }

    .landing-cards {
        position: absolute;
        top: 20%;
    }

    .landing-card {
        width: 100vw;
    }

    .pad-below {
        padding-bottom: 40px !important;
    }

    .text {
        font-size: 20px;
        animation: slide-right 4s;
    }

    .atom-spinner {
        height: 50px;
        width: 50px;
        position: relative;
        top: 10px;
    }

    .atom-spinner .spinner-circle {
        font-size: calc(6px);
    }

    .options-small {
        height: 100vh;
    }

    .options-small-card {
        /* position: absolute; */
        top: 30px;
        width: 400px;
        height: 430px;
    }
}

@keyframes slide-right {
    from {
        margin-left: -100%;
        width: 300%;
    }
    to {
        margin-left: 0;
    }
}

.atom-spinner .spinner-inner {
    position: relative;
    display: block;
    height: 100%;
    width: 100%;
}

.atom-spinner .spinner-line {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation-duration: 1s;
    border-top-width: calc(60px / 25);
    border-left-color: #910016;
    border-left-style: solid;
    border-top-style: solid;
    border-top-color: transparent;
}

.atom-spinner .spinner-line:nth-child(1) {
    animation: atom-spinner-animation-1 1s linear infinite;
    transform: rotateZ(120deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(2) {
    animation: atom-spinner-animation-2 1s linear infinite;
    transform: rotateZ(240deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(3) {
    animation: atom-spinner-animation-3 1s linear infinite;
    transform: rotateZ(360deg) rotateX(66deg) rotateZ(0deg);
}

@keyframes atom-spinner-animation-1 {
    100% {
        transform: rotateZ(120deg) rotateX(66deg) rotateZ(360deg);
    }
}

@keyframes atom-spinner-animation-2 {
    100% {
        transform: rotateZ(240deg) rotateX(66deg) rotateZ(360deg);
    }
}

@keyframes atom-spinner-animation-3 {
    100% {
        transform: rotateZ(360deg) rotateX(66deg) rotateZ(360deg);
    }
}
</style>

<script>
import { EventBus } from "@/event-bus.js";
import axios from "axios";

export default {
    name: "Landing",

    data() {
        return {};
    },
    methods: {
        getModules() {
            const path = "https://isy-be.herokuapp.com/getModules";
            axios
                .get(path)
                .then((res) => {
                    EventBus.$emit("getModules", res.data.departments);
                    EventBus.$emit("updateSearchBar", res.data.departments);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        goToLaunch: function (userType, directLogin) {
            this.getModules();

            if (!directLogin) {
                window.location.href = "https://isy-be.herokuapp.com/loginUser";
            } else {
                if (userType === "prospective") {
                    const data = { user: {}, logged: false };

                    EventBus.$emit("sendIsLoggedIn", data);
                    EventBus.$emit("sendShowBar", true);

                    this.$router.replace("/home");
                } else if (userType === "student") {
                    this.$router.replace(
                        "/?id=gAAAAABfoDttjROgmpuE9ldZhzoFFJpfVL3ngwHmgKahGqfO5m59YeAkJbXWNiBmeqtzE7abwXYlMhBu8PcLc5hm0leoa-e7fw=="
                    );
                } else {
                    this.$router.replace(
                        "/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw=="
                    );
                }
            }
        },
    },
    mounted() {},
};
</script>
