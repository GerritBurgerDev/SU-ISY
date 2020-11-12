<template>
    <v-card>
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
        <v-row class="d-none d-xl-block d-md-block">
            <v-row>
                <v-col>
                    <v-card elevation="3">
                        <v-img
                            src="https://picsum.photos/350/165?random"
                            height="125"
                            class="grey darken-4"
                        ></v-img>
                        <v-card-title class="my-2" justify-center>
                            <v-btn @click.prevent="pickUndergrad"
                                >Prospective Student</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card elevation="3">
                        <v-img
                            src="https://picsum.photos/350/165?random"
                            height="125"
                            class="grey darken-4"
                        ></v-img>
                        <v-card-title class="my-2" justify-center>
                            <v-btn @click.prevent="pickUndergrad"
                                >Current Student</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card elevation="3">
                        <v-img
                            src="https://picsum.photos/350/165?random"
                            height="125"
                            class="grey darken-4"
                        ></v-img>
                        <v-card-title class="my-2" justify-center>
                            <v-btn @click.prevent="pickUndergrad"
                                >Staff Member</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-row>

        <v-row>
            <v-carousel
                class="options-small d-none d-flex d-sm-flex d-md-none"
                show-arrows-on-hover
                hide-delimiters
            >
                <v-carousel-item>
                    <v-card elevation="3">
                        <v-img
                            src="https://picsum.photos/350/165?random"
                            height="125"
                            class="grey darken-4"
                        ></v-img>
                        <v-card-title class="my-2" justify-center>
                            <v-btn @click.prevent="pickUndergrad"
                                >Prospective Student</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-carousel-item>
                <v-carousel-item>
                    <v-card elevation="3">
                        <v-img
                            src="https://picsum.photos/350/165?random"
                            height="125"
                            class="grey darken-4"
                        ></v-img>
                        <v-card-title class="my-2" justify-center>
                            <v-btn @click.prevent="pickUndergrad"
                                >Current Student</v-btn
                            >
                        </v-card-title>
                    </v-card>
                </v-carousel-item>
                <v-carousel-item>
                    <v-card elevation="3">
                        <v-img
                            src="https://picsum.photos/350/165?random"
                            height="125"
                            class="grey darken-4"
                        ></v-img>
                        <v-card-title class="my-2" justify-center>
                            <v-btn @click.prevent="pickUndergrad"
                                >Staff Member</v-btn
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
        /*background-color: rgba(255, 255, 255, 0.9);*/
    }

    .launch::-webkit-scrollbar {
        display: none;
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
        background-color: rgba(255, 255, 255, 0.7);
    }

    .options-small-card {
        color: black;
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

export default {
    name: "Landing",

    data() {
        return {
            loggedIn: false,
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
    },
    mounted() {
        if (sessionStorage.user) {
            this.userData = JSON.parse(sessionStorage.getItem("user"));
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }

        if (this.loggedIn) {
            EventBus.$on("sendIsLoggedIn", (res) => {
                const data = res;
                this.userData = data.user;
                this.loggedIn = data.logged;
            });

            this.$router.replace("/home");
        }
    },
};
</script>
