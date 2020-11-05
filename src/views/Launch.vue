<template>
  <v-card class="launch">
    <div>
      <div class="top">
        <div class="atom-spinner">
          <div class="spinner-inner">
            <div class="spinner-line"></div>
            <div class="spinner-line"></div>
            <div class="spinner-line"></div>
            <div class="spinner-circle">
              &#9679;
            </div>
          </div>
        </div>
      </div>
      <div class="head">
        <div class="text">
          Welcome to the Faculty of Science yearbook
        </div>
      </div>
    </div>
    <div class="options-large d-none d-xl-block d-md-block">
      <v-row>
        <v-col>
          <v-card elevation="3" class="options-large-card">
            <div class="card-header">Programmes</div>
            <hr class="card-hr" />
            <div class="card-programmes-buttons">
              <div class="my-2">
                <v-btn class="card-button" @click.prevent="pickUndergrad"
                  >Undergraduate</v-btn
                >
              </div>
              <div class="my-3">
                <v-btn class="card-button" @click.prevent="pickPostgrad"
                  >Postgraduate</v-btn
                >
              </div>
            </div>
            <div class="card-text">
              Get all the information you need about the programmes available in
              the faculty of science!
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
              Get all the information you need about the modules available in
              the faculty of science!
            </div>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="3" class="options-large-card">
            <div class="card-header">Staff</div>
            <hr class="card-hr" />
            <div class="card-programmes-buttons">
              <div class="my-2">
                <v-btn v-if="this.loggedIn && this.userData['admin']" class="card-button" @click="showAddProgramme()">Add a programme</v-btn>
                <v-btn v-else class="card-button" disabled>Add a programme</v-btn>
              </div>
              <div class="my-3">
                <v-btn v-if="this.loggedIn && this.userData['admin']" class="card-button" @click="showAddModule()">Add a module</v-btn>
                <v-btn v-else class="card-button" disabled>Add a module</v-btn>
              </div>
            </div>
            <div class="card-text">
              These options are for staff members only.
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col>
          <v-card elevation="3" class="options-large-card">
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
              Students enrolled at Stellenbosch University can use these options
              to receive helpful information from the yearbook without the
              hassle of going to the admin building.
            </div>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="3" class="options-large-card">
            <div class="card-header">Prospective Students</div>
            <hr class="card-hr" />
            <div class="card-programmes-buttons">
              <div class="my-8">
                <v-btn class="card-button" @click="showProspectivePossibilities"
                  >What can I study
                </v-btn>
              </div>
            </div>
            <div class="card-text">
              Students who plan to enroll at Stellenbosch University can use
              this option to see what degrees they qualify for.
            </div>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="3" class="options-large-card">
            <div class="card-header">Faculty Information</div>
            <hr class="card-hr" />
            <div class="card-programmes-buttons">
              <div class="my-8">
                <v-btn class="card-button" :to="{ path: '/general' }">
                  Go To Information
                </v-btn>
              </div>
            </div>
            <div class="card-text">
              Information about the faculty, like department contact details,
              etc.
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-carousel
      class="options-small d-none d-flex d-sm-flex d-md-none"
      show-arrows-on-hover
      hide-delimiters
    >
      <v-carousel-item v-for="heading in this.cards" :key="heading">
        <v-card light elevation="3" class="mt-12">
          <v-card-title primary-title class="justify-center">
            <div class="card-header">{{ heading }}</div>
          </v-card-title>
          <hr class="card-hr" />
          <v-card-text class="text-center" v-if="heading === 'Programmes'">
            <div class="card-programmes-buttons">
              <div class="my-6">
                <v-btn class="card-button">Undergraduate</v-btn>
              </div>
              <div class="my-12">
                <v-btn class="card-button">Postgraduate</v-btn>
              </div>
            </div>
            <div class="card-text">
              Get all the information you need about the programmes available in
              the faculty of science!
            </div>
          </v-card-text>
          <v-card-text class="text-center" v-else-if="heading === 'Modules'">
            <div class="card-programmes-buttons">
              <div class="my-6">
                <v-btn class="card-button">All modules</v-btn>
              </div>
              <div class="my-12">
                <v-btn class="card-button" @click="pickModule">
                  Specify a module
                </v-btn>
              </div>
            </div>
            <div class="card-text">
              Get all the information you need about the modules available in
              the faculty of science!
            </div>
          </v-card-text>
          <v-card-text class="text-center" v-else-if="heading === 'Staff'">
            <div class="card-programmes-buttons">
              <div class="my-6">
                <v-btn class="card-button">Edit a programme</v-btn>
              </div>
              <div class="my-12">
                <v-btn class="card-button">Edit a module</v-btn>
              </div>
            </div>
            <div class="card-text">
              These options are for staff members only.
            </div>
          </v-card-text>
          <v-card-text class="text-center" v-else-if="heading === 'Students'">
            <div class="card-programmes-buttons">
              <div class="my-6">
                <v-btn class="card-button">Continue Current Degree</v-btn>
              </div>
              <div class="my-12">
                <v-btn class="card-button" @click="showPostgradPossibilities"
                  >Postgraduate possibilities
                </v-btn>
              </div>
            </div>
            <div class="card-text">
              Students enrolled at Stellenbosch University can use these options
              to receive helpful information from the yearbook without the
              hassle of going to the admin building.
            </div>
          </v-card-text>
          <v-card-text
            class="text-center"
            v-else-if="heading === 'Prospective Students'"
          >
            <div class="card-programmes-buttons">
              <div class="my-6 pad-below">
                <v-btn class="card-button">What can I study</v-btn>
              </div>
            </div>
            <div class="card-text">
              Students who plan to enroll at Stellenbosch University can use
              this option to see what degrees they qualify for.
            </div>
          </v-card-text>
          <v-card-text
            class="text-center"
            v-else-if="heading === 'Faculty Information'"
          >
            <div class="card-programmes-buttons">
              <div class="my-6 pad-below">
                <v-btn class="card-button" :to="{ path: '/general' }">
                  Go To Information
                </v-btn>
              </div>
            </div>
            <div class="card-text">
              Information about the faculty, like department contact details,
              etc.
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

  .options-large {
    margin-top: 5.5%;
    margin-left: 5%;
    margin-right: 3%;
  }

  .options-large-card {
    height: 300px;
    width: 400px;
    text-align: center;
    /*background-color: rgba(255, 255, 255, 0.7);*/
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

  .card-programmes-buttons {
    position: relative;
    top: 10px;
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
  name: "Launch",

  data() {
    return {
      cards: [
        "Programmes",
        "Modules",
        "Staff",
        "Students",
        "Prospective Students",
        "Faculty Information"
      ],
      loggedIn: false,
      userData: {}
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
    }
  },
  mounted() {
    if (sessionStorage.user) {
      this.userData = JSON.parse(sessionStorage.getItem("user"));
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }

    EventBus.$on("sendIsLoggedIn", res => {
      const data = res;
      this.userData = data.user;
      this.loggedIn = data.logged;
    });
  }
};
</script>
