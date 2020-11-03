<template>
    <v-app id="inspire">
        <navbar :modules="this.modules" :searchItems="this.searchItems" />

        <v-content>
            <v-container fluid class="content">
                <vue-page-transition name="fade">
                    <router-view />
                </vue-page-transition>
            </v-container>
        </v-content>

        <module-choices />
        <undergrad-programmes />
        <postgrad-programmes />
        <postgrad-possibilities />
        <prospective-possibilities />

        <programme-editor />
        <module-editor />

        <foot />
    </v-app>
</template>

<style>
@media only screen and (max-width: 5000px) {
    html {
        -ms-overflow-style: none;
        height: 100vh;
    }

    html::-webkit-scrollbar {
        display: none;
    }

    .content {
        margin-top: 0.5%;
    }
}

@media only screen and (max-width: 1700px) {
}

@media only screen and (max-width: 1100px) {
}

@media only screen and (max-width: 750px) {
    .content {
        margin-top: 0;
    }
}

#inspire {
    background-image: url("./assets/ISY.jpg");
    background-size: cover;
    overflow-x: hidden;
}
</style>

<script>
import navbar from "@/components/NavigationalComponents/NavBar.vue";
import foot from "@/components/NavigationalComponents/Footer.vue";
import moduleChoices from "@/components/LaunchComponents/FindModule.vue";
import undergradProgrammes from "@/components/LaunchComponents/FindUndergrad.vue";
import postgradProgrammes from "@/components/LaunchComponents/FindPostgrad.vue";
import postgradPossibilities from "@/components/LaunchComponents/PostgradPossibilities.vue";
import prospectivePossibilities from "@/components/LaunchComponents/ProspectivePossibilities.vue";
import programmeEditor from "@/components/ProgrammeComponents/ProgrammeEditor.vue";
import moduleEditor from "@/components/ModuleComponents/ModulesEditor.vue";
// import addModule from "@/components/ModuleComponents/AddModule.vue";

import { EventBus } from "@/event-bus.js";
import axios from "axios";

export default {
    name: "App",

    components: {
        navbar,
        foot,
        moduleChoices,
        undergradProgrammes,
        postgradProgrammes,
        postgradPossibilities,
        prospectivePossibilities,
        programmeEditor,
        moduleEditor,
        // addModule,
    },

    data() {
        return {
            modules: {},
            undergrad: {},
            postgrad: {},
            user: {},
            loggedIn: false,
            searchItems: {}
        };
    },

    methods: {
        getModules() {
            const path = "https://isy-be.herokuapp.com/getModules2";
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
                })
                .catch(error => {
                    console.error(error);
                });
        },
        getProgrammes() {
            const path = "https://isy-be.herokuapp.com/getUPs";
            axios
                .get(path)
                .then(res => {
                    this.undergrad = res.data.undergrad;

                    if (!sessionStorage.undergradProgrammes) {
                        sessionStorage.setItem(
                            "undergradProgrammes",
                            JSON.stringify(this.undergrad)
                        );
                    }

                    EventBus.$emit("getUP", this.undergrad);
                })
                .catch(error => {
                    console.error(error);
                });

            const path2 = "https://isy-be.herokuapp.com/getPPs";
            axios
                .get(path2)
                .then(res => {
                    this.postgrad = res.data.postgrad;

                    if (!sessionStorage.postgradProgrammes) {
                        sessionStorage.setItem(
                            "postgradProgrammes",
                            JSON.stringify(this.postgrad)
                        );
                    }

                    EventBus.$emit("getPP", this.postgrad);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        getUserData(userId) {
            const path = "https://isy-be.herokuapp.com/getUser";
            axios
                .post(path, { id: userId })
                .then(res => {
                    this.user = res.data.user;
                    sessionStorage.setItem("user", JSON.stringify(this.user));

                    this.loggedIn = true;
                    const data = { user: this.user, logged: this.loggedIn };
                    EventBus.$emit("sendIsLoggedIn", data);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        parseURLParams() {
            const urlParams = new URLSearchParams(window.location.search);

            const userId = urlParams.get("id");

            return userId;
        }
    },
    created() {
        this.getModules();

        this.getProgrammes();

        try {
            const id = this.parseURLParams();

            if (id !== null) {
                this.getUserData(id);
                this.$router.replace("/");
            }
        } catch (e) {
            return;
        }
    },
    mounted() {
        // this.$vuetify.theme.dark = true;
        this.$vuetify.theme.dark = false;

        if (sessionStorage.user) {
            this.user = JSON.parse(sessionStorage.getItem("user"));
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }
    }
};
</script>
