<template>
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
                    class="d-flex pl-6 pt-2"
                    cols="1"
                    v-if="Object.keys(user).length !== 0 && user['admin']"
                >
                    <v-icon large class="editor-icon pr-2" @click="showEditor()"
                        >fa-edit</v-icon
                    >
                    <v-icon large class="delete-icon" @click="removeProgramme()"
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
                                    <ul v-for="(type, item) in val" :key="type">
                                        <li>{{ item }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card>
            </div>

            <template>
                <v-expansion-panels accordion class="programme-years">
                    <v-expansion-panel
                        v-for="(content, key) in table"
                        :key="key"
                    >
                        <!-- THIS IS THE YEARS AND THEIR CONTENTS -->
                        <v-expansion-panel-header
                            disable-icon-rotate
                            v-if="key.includes('year')"
                        >
                            {{ key }}
                            <template v-slot:actions>
                                <v-avatar tile size="28">
                                    <span class="green--text">{{
                                        content["min"]
                                    }}</span>
                                </v-avatar>
                                <v-avatar tile size="28">
                                    <span class="red--text">{{
                                        content["max"]
                                    }}</span>
                                </v-avatar>
                            </template>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                            <v-expansion-panels accordion>
                                <!-- ALERTS WITHIN THE YEARS ITSELF AND NOT COMPULSORY OR ELECTIVE SECTIONS -->
                                <v-alert
                                    border="top"
                                    colored-border
                                    color="red darken-2"
                                    type="info"
                                    elevation="2"
                                    class="info-banner"
                                    dismissible
                                    v-for="item in textOnly(content)"
                                    :key="item"
                                >
                                    {{ item }}
                                </v-alert>
                                <!-- END ALERTS WITHIN THE YEARS ITSELF AND NOT COMPULSORY OR ELECTIVE SECTIONS -->

                                <!-- THIS IS THE EXPANSION PANELS OF THE COMPULSORY AND ELECTIVE MODULES -->
                                <v-expansion-panel
                                    v-for="(content2,
                                    key2) in tablesOnlyUndergrad(content)"
                                    :key="key2"
                                >
                                    <v-expansion-panel-header
                                        disable-icon-rotate
                                        v-if="key2 !== 'min' && key2 !== 'max'"
                                    >
                                        {{ key2 }}
                                        <template v-slot:actions>
                                            <v-avatar tile size="28">
                                                <span class="green--text">{{
                                                    content2["min"]
                                                }}</span>
                                            </v-avatar>
                                            <v-avatar tile size="28">
                                                <span class="red--text">{{
                                                    content2["max"]
                                                }}</span>
                                            </v-avatar>
                                        </template>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content
                                        v-if="key2 !== 'min' && key2 !== 'max'"
                                    >
                                        <!-- ALERTS AND FLAGS FOR THE COMPULSORY AND ELECTIVE MODULES -->
                                        <v-alert
                                            border="top"
                                            colored-border
                                            color="red darken-2"
                                            type="info"
                                            elevation="2"
                                            dismissible
                                            v-for="item in content2['alerts']"
                                            :key="item"
                                        >
                                            {{ item }}
                                        </v-alert>
                                        <!-- END OF THE ALERTS AND FLAGS FOR THE COMPULSORY AND ELECTIVE MODULES -->

                                        <!-- NORMAL PANEL WITH TABLE OF MODULES -->
                                        <div
                                            v-if="
                                                !containsTable(
                                                    content2['modules']
                                                )
                                            "
                                        >
                                            <v-row
                                                no-gutters
                                                justify="center"
                                                class="undergrad-table-header"
                                            >
                                                <v-col
                                                    cols="3"
                                                    class="undergrad-table-header-cols"
                                                    style="border-right: solid 1px black"
                                                >
                                                    Module
                                                </v-col>
                                                <v-col
                                                    cols="1"
                                                    class="undergrad-table-header-cols"
                                                    align="center"
                                                >
                                                    Credits
                                                </v-col>
                                            </v-row>
                                            <v-row
                                                v-for="(credits,
                                                module_name) in content2[
                                                    'modules'
                                                ]"
                                                :key="module_name"
                                                no-gutters
                                                justify="center"
                                                class="undergrad-table-rows"
                                            >
                                                <v-col
                                                    cols="3"
                                                    class="undergrad-table-cols"
                                                    style="border-right: solid 1px black"
                                                >
                                                    {{ module_name }}
                                                </v-col>
                                                <v-col
                                                    cols="1"
                                                    class="undergrad-table-cols"
                                                    align="center"
                                                >
                                                    {{ credits }}
                                                </v-col>
                                            </v-row>
                                        </div>
                                        <!-- END -->

                                        <!-- Panel containing multiple tables -->
                                        <v-expansion-panels accordion v-else>
                                            <v-expansion-panel
                                                v-for="(table,
                                                header) in content2['modules']"
                                                :key="header"
                                            >
                                                <v-expansion-panel-header>
                                                    {{ header }}
                                                    <template
                                                        v-slot:actions
                                                        v-if="
                                                            typeof table ===
                                                                'object'
                                                        "
                                                    ></template>
                                                    <template
                                                        v-slot:actions
                                                        v-else
                                                    >
                                                        <v-avatar
                                                            tile
                                                            size="28"
                                                        >
                                                            <span
                                                                class="green--text"
                                                                >{{
                                                                    table
                                                                }}</span
                                                            >
                                                        </v-avatar>
                                                    </template>
                                                </v-expansion-panel-header>

                                                <v-expansion-panel-content
                                                    v-if="
                                                        typeof table ===
                                                            'object'
                                                    "
                                                >
                                                    <v-alert
                                                        border="top"
                                                        colored-border
                                                        color="red darken-2"
                                                        type="info"
                                                        elevation="2"
                                                        dismissible
                                                        v-for="item in textOnly(
                                                            table
                                                        )"
                                                        :key="item"
                                                    >
                                                        {{ item }}
                                                    </v-alert>

                                                    <v-expansion-panels
                                                        accordion
                                                        v-if="
                                                            containsTable(table)
                                                        "
                                                    >
                                                        <v-expansion-panel
                                                            v-for="(inner_table,
                                                            inner_header) in tablesOnlyUndergrad(
                                                                table
                                                            )"
                                                            :key="inner_header"
                                                        >
                                                            <v-expansion-panel-header>
                                                                {{
                                                                    inner_header
                                                                }}
                                                                <template
                                                                    v-slot:actions
                                                                    v-if="
                                                                        typeof inner_table ===
                                                                            'object'
                                                                    "
                                                                >
                                                                </template>
                                                            </v-expansion-panel-header>

                                                            <v-expansion-panel-content>
                                                                <v-row
                                                                    no-gutters
                                                                    class="undergrad-table-header"
                                                                    justify="center"
                                                                >
                                                                    <v-col
                                                                        cols="3"
                                                                        class="undergrad-table-header-cols"
                                                                        style="border-right: solid 1px black"
                                                                    >
                                                                        Module
                                                                    </v-col>
                                                                    <v-col
                                                                        cols="1"
                                                                        class="undergrad-table-header-cols"
                                                                        align="center"
                                                                    >
                                                                        Credits
                                                                    </v-col>
                                                                </v-row>

                                                                <v-row
                                                                    v-for="(credits,
                                                                    module_name) in modulesOnly(
                                                                        inner_table
                                                                    )"
                                                                    :key="
                                                                        module_name
                                                                    "
                                                                    no-gutters
                                                                    class="undergrad-table-rows"
                                                                    justify="center"
                                                                >
                                                                    <v-col
                                                                        cols="3"
                                                                        class="undergrad-table-cols"
                                                                        style="border-right: solid 1px black"
                                                                    >
                                                                        {{
                                                                            module_name
                                                                        }}
                                                                    </v-col>
                                                                    <v-col
                                                                        cols="1"
                                                                        class="undergrad-table-cols"
                                                                        align="center"
                                                                    >
                                                                        {{
                                                                            credits
                                                                        }}
                                                                    </v-col>
                                                                </v-row>
                                                            </v-expansion-panel-content>
                                                        </v-expansion-panel>
                                                    </v-expansion-panels>

                                                    <div
                                                        v-if="
                                                            Object.keys(
                                                                modulesOnly(
                                                                    table
                                                                )
                                                            ).length !== 0
                                                        "
                                                    >
                                                        <v-row
                                                            no-gutters
                                                            class="undergrad-table-header"
                                                            justify="center"
                                                        >
                                                            <v-col
                                                                cols="3"
                                                                class="undergrad-table-header-cols"
                                                                style="border-right: solid 1px black"
                                                            >
                                                                Module
                                                            </v-col>
                                                            <v-col
                                                                cols="1"
                                                                class="undergrad-table-header-cols"
                                                                align="center"
                                                            >
                                                                Credits
                                                            </v-col>
                                                        </v-row>

                                                        <v-row
                                                            v-for="(credits,
                                                            module_name) in modulesOnly(
                                                                table
                                                            )"
                                                            :key="module_name"
                                                            no-gutters
                                                            class="undergrad-table-rows"
                                                            justify="center"
                                                        >
                                                            <v-col
                                                                cols="3"
                                                                class="undergrad-table-cols"
                                                                style="border-right: solid 1px black"
                                                            >
                                                                {{
                                                                    module_name
                                                                }}
                                                            </v-col>
                                                            <v-col
                                                                cols="1"
                                                                class="undergrad-table-cols"
                                                                align="center"
                                                            >
                                                                {{ credits }}
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- END -->
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                                <!-- END OF THE EXPANSION PANELS OF THE COMPULSORY AND ELECTIVE MODULES -->
                            </v-expansion-panels>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <!-- END OF THE YEAR EXPANSION PANELS -->
                </v-expansion-panels>
            </template>
        </div>

        <div v-if="this.type === 'postgrad'">
            <div class="programme-header">
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
                        class="editor-icon pl-3 pr-2"
                        @click="showEditor"
                        v-if="Object.keys(user).length !== 0 && user['admin']"
                        >fa-edit</v-icon
                    >
                    <v-icon
                        large
                        class="delete-icon"
                        @click="removeProgramme()"
                        v-if="Object.keys(user).length !== 0 && user['admin']"
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

            <hr class="module-header-line" />

            <div v-for="(content, title) in this.programme" :key="title">
                <v-card
                    class="postgrad-info-card"
                    v-if="placeSection(title) && typeof content === 'object'"
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
                <v-row
                    no-gutters
                    v-for="(content, entry) in this.programme[
                        'Programme Content'
                    ]"
                    :key="entry"
                    justify="center"
                >
                    <v-col v-if="content === 'text'">
                        <div>{{ entry }}</div>
                    </v-col>
                    <v-col v-else align="center">
                        <h4>{{ entry }}</h4>

                        <v-row
                            v-if="typeof content === 'object'"
                            class="postgrad-main-table"
                            justify="center"
                        >
                            <v-col
                                v-for="(td, th) in tablesOnly(content)"
                                :key="th"
                                v-bind:class="[
                                    'postgrad-main-table-cols',
                                    getTableHeaderClass(th)
                                ]"
                                align="center"
                            >
                                <div v-if="!containsTable(td)">
                                    <div class="postgrad-main-table-headers">
                                        {{ th }}
                                    </div>
                                    <v-row
                                        no-gutters
                                        class="postgrad-main-table-rows"
                                        v-for="item in td"
                                        :key="item"
                                        align="center"
                                    >
                                        <v-col
                                            class="postgrad-main-table-cols"
                                            align="center"
                                        >
                                            {{ item }}
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-col>
                        </v-row>

                        <div v-if="typeof content === 'object'">
                            <v-row
                                v-for="(data, heading) in getTextTables(
                                    content,
                                    entry
                                )"
                                :key="heading"
                                no-gutters
                                justify="start"
                            >
                                <v-col
                                    v-if="
                                        !containsTable(data) &&
                                            !heading.includes(
                                                'Elective Modules'
                                            ) &&
                                            !heading.includes(
                                                'Compulsory Modules'
                                            )
                                    "
                                    align="start"
                                >
                                    <h4>{{ heading }}</h4>

                                    <v-row
                                        v-for="(useless, key) in data"
                                        :key="key"
                                        no-gutters
                                        style="padding-bottom: 5px"
                                    >
                                        <v-col>{{ key }}</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>

                            <v-row
                                v-for="item in textOnly(content)"
                                :key="item"
                            >
                                <v-col>
                                    {{ item }}
                                </v-col>
                            </v-row>
                        </div>

                        <v-row
                            v-if="typeof content === 'object'"
                            justify="center"
                        >
                            <v-col align="center">
                                <v-row
                                    v-for="(table, title) in content"
                                    :key="title"
                                    justify="center"
                                >
                                    <v-col
                                        v-if="
                                            containsTable(table) ||
                                                title.includes(
                                                    'Elective Modules'
                                                )
                                        "
                                    >
                                        <h4>{{ title }}</h4>
                                        <!-- Outer tables for example if the compulsory modules dont have inner
                                        tables. -->
                                        <v-row justify="center">
                                            <v-col
                                                v-for="(td, th) in tablesOnly(
                                                    table
                                                )"
                                                :key="th"
                                                v-bind:class="[
                                                    'postgrad-main-table-cols',
                                                    getTableHeaderClass(th)
                                                ]"
                                            >
                                                <div
                                                    class="postgrad-main-table-headers"
                                                >
                                                    {{ th }}
                                                </div>
                                                <v-row
                                                    v-for="item in td"
                                                    :key="item"
                                                    class="postgrad-sub-table-rows"
                                                    align="center"
                                                >
                                                    <v-col
                                                        class="postgrad-sub-table-cols"
                                                    >
                                                        {{ item }}
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>

                                        <!-- Inner tables with the compulsory and elective modules -->
                                        <v-row
                                            v-for="(innerTable,
                                            header) in getInnerTables(table)"
                                            :key="header"
                                            justify="center"
                                        >
                                            <v-col>
                                                <v-row
                                                    justify="center"
                                                    class="postgrad-inner-table-hearders"
                                                    >{{ header }}
                                                </v-row>

                                                <v-row justify="center">
                                                    <v-col
                                                        v-for="(td,
                                                        th) in tablesOnly(
                                                            innerTable
                                                        )"
                                                        :key="th"
                                                        v-bind:class="[
                                                            'postgrad-main-table-cols',
                                                            getTableHeaderClass(
                                                                th
                                                            )
                                                        ]"
                                                    >
                                                        <div
                                                            class="postgrad-main-table-headers"
                                                        >
                                                            {{ th }}
                                                        </div>
                                                        <v-row
                                                            v-for="item in td"
                                                            :key="item"
                                                            class="postgrad-sub-table-rows"
                                                            align="center"
                                                        >
                                                            <v-col
                                                                class="postgrad-sub-table-cols"
                                                            >
                                                                {{ item }}
                                                            </v-col>
                                                        </v-row>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>

                                        <!-- NB THIS IS WHERE I PUT EXTRA TEXT FOR EXAMPLE: These modules are offered
                                            in blah blah blah pg. 126 under First Semester of BSc Maths Hons-->
                                        <v-row
                                            v-for="text in textOnly(table)"
                                            :key="text"
                                        >
                                            <v-col>
                                                {{ text }}
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
        </div>
    </v-card>
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
    .module {
        margin-left: 0;
        margin-right: 0;
        padding-left: 2%;
        padding-right: 2%;
        height: 78vh;
    }
}
</style>

<script>
import { EventBus } from "@/event-bus.js";
import axios from "axios";

export default {
    name: "Programme",

    components: {},
    data() {
        return {
            componentKey: 0,
            programme: {},
            type: "",
            programme_info: {},
            table: {},
            user: {}
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
        getTable() {
            const temp = {};
            this.table = {};

            for (const item in this.programme["Programme Content"]) {
                temp[item] = this.programme["Programme Content"][item];
            }

            for (const year in temp) {
                console.log(year);
                const yearIndex = year.indexOf("year") + 4;
                const part1 = year.substring(0, yearIndex);
                const part2 = year.substring(yearIndex, year.length);
                const credits = part2.match(/\d+/g).map(Number);
                this.table[part1] = {};

                if (credits.length > 0) {
                    if (credits.length === 1) {
                        this.table[part1]["min"] = null;
                        this.table[part1]["max"] = credits[0];
                    } else {
                        if (credits[1].length !== 3) {
                            this.table[part1]["min"] = null;
                            this.table[part1]["max"] = credits[0];
                        } else {
                            this.table[part1]["min"] = credits[0];
                            this.table[part1]["max"] = credits[1];
                        }
                    }
                } else {
                    this.table[part1]["min"] = null;
                    this.table[part1]["max"] = null;
                }

                for (const type in temp[year]) {
                    const temp2 = {};
                    const modules = {};
                    const alerts = [];
                    let type_credits = [];

                    temp2["min"] = null;
                    temp2["max"] = null;

                    for (const item in temp[year][type]) {
                        if (temp[year][type][item] === "text") {
                            if (
                                item.includes("credits") &&
                                item.includes("(")
                            ) {
                                type_credits = item.match(/\d+/g).map(Number);
                                if (type_credits.length === 1) {
                                    temp2["max"] = type_credits[0];
                                } else {
                                    temp2["min"] = type_credits[0];
                                    temp2["max"] = type_credits[1];
                                }
                            } else {
                                alerts.push(item);
                            }
                        } else {
                            modules[item] = temp[year][type][item];
                        }
                    }

                    temp2["modules"] = modules;
                    temp2["alerts"] = alerts;

                    if (temp[year][type] === "text") {
                        this.table[part1][type] = "text";
                    } else {
                        this.table[part1][type] = temp2;
                    }
                }
            }
        },
        getProgrammeInfoSections() {
            for (const entry in this.programme) {
                if (Array.isArray(this.programme[entry])) {
                    this.programme_info[entry] = this.programme[entry];
                }
            }
        },
        containsTable: function(Content) {
            for (const item in Content) {
                if (typeof Content[item] === "object") {
                    return true;
                }
            }

            return false;
        },
        tablesOnlyUndergrad: function(Content) {
            const objects = {};

            for (const item in Content) {
                if (typeof Content[item] === "object") {
                    objects[item] = Content[item];
                }
            }

            return objects;
        },
        tablesOnly: function(Content) {
            const objects = {};

            for (const item in Content) {
                if (Array.isArray(Content[item])) {
                    objects[item] = Content[item];
                }
            }

            return objects;
        },
        getInnerTables: function(Content) {
            const tables = {};

            for (const item in Content) {
                if (
                    typeof Content[item] === "object" &&
                    !Array.isArray(Content[item])
                ) {
                    tables[item] = Content[item];
                }
            }

            return tables;
        },
        textOnly: function(Content) {
            const textOnly = [];

            for (const item in Content) {
                if (Content[item] === "text") {
                    textOnly.push(item);
                }
            }

            return textOnly;
        },
        modulesOnly: function(Content) {
            const mods = {};

            for (const item in Content) {
                if (
                    Content[item] !== "text" &&
                    typeof Content[item] !== "object"
                ) {
                    mods[item] = Content[item];
                }
            }

            return mods;
        },
        getTableHeaderClass: function(Header) {
            if (Header === "Module Name") {
                return "col-4";
            } else {
                return "col-1";
            }
        },
        getTextTables: function(Content, PrevHeader) {
            const data = {};

            if (
                PrevHeader.includes("Compulsory Module") ||
                PrevHeader.includes("Elective Module")
            ) {
                return {};
            }

            for (const entry in Content) {
                if (!Array.isArray(Content[entry])) {
                    data[entry] = Content[entry];
                }
            }

            return data;
        },
        showEditor() {
            EventBus.$emit("showProgrammeEditor", {
                programme: this.programme,
                type: this.type
            });
        },
        removeProgramme() {
            const path = "https://isy-be.herokuapp.com/removeProgramme";

            axios
                .post(path, {
                    programme: this.programme,
                    programme_type: this.type
                })
                .then(res => {
                    console.log(res);

                    this.$router.replace("/");
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },
    mounted() {
        if (sessionStorage.currentProgramme) {
            const result = JSON.parse(
                sessionStorage.getItem("currentProgramme")
            );
            this.programme = result.data;
            this.type = result.type;
        }
        // else {
        //     EventBus.$on("sendProgramme", res => {
        //         this.programme = res.data;
        //         this.type = res.type;
        //     });
        // }
        EventBus.$on("updateProgramme", res => {
            this.programme = res.data;
            this.type = res.type;
            this.programme_info = {};
            this.getProgrammeInfoSections();
            this.getTable();
        });

        if (sessionStorage.user) {
            this.user = JSON.parse(sessionStorage.getItem("user"));
        }

        this.getProgrammeInfoSections();
        this.getTable();
    }
};
</script>
