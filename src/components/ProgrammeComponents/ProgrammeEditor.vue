<template>
    <div class="text-center">
        <v-dialog v-model="dialog" width="80vw" persistent>
            <v-card class="programme-editor">
                <v-card-title class="headline">
                    Edit programme
                </v-card-title>
                <hr style="border-bottom-color: #c40b00" />

                <v-container class="pa-2 pl-10 pr-10">
                    <v-row>
                        <v-col>
                            <h2>Programme details</h2>
                        </v-col>
                    </v-row>
                    <v-row
                        v-for="(value, key) in this.textContentOnly(
                            this.programme
                        )"
                        :key="key"
                        no-gutters
                    >
                        <v-col>
                            <v-text-field
                                v-model="programme[key]"
                                :label="key"
                                :append-icon="'mdi-close-circle'"
                                @click:append="clearField(key)"
                                :rules="rules"
                            />
                        </v-col>
                    </v-row>

                    <!-- Edit Admission Requiremnts -->
                    <v-row>
                        <v-col cols="11">
                            <h2>Edit admission requirements</h2>
                        </v-col>
                        <v-col cols="1">
                            <v-icon
                                large
                                color="grey darken-2"
                                class="pl-10 ml-5 ar-edit"
                                @click="editRequirements = true"
                            >
                                create
                            </v-icon>
                        </v-col>
                    </v-row>

                    <!-- Programme Information -->
                    <v-row>
                        <v-col cols="11">
                            <h2>Programme information</h2>
                        </v-col>
                        <v-col cols="1">
                            <v-icon
                                large
                                color="grey darken-2"
                                class="pl-10 ml-5"
                                @click="this.createCard"
                            >
                                add_box
                            </v-icon>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col>
                            <ise :payload="this.cards" :depth="0" />
                        </v-col>
                    </v-row>

                    <!-- Programme Curricula -->
                    <v-row>
                        <v-col cols="11">
                            <h2>Programme curricula</h2>
                        </v-col>
                        <v-col cols="1">
                            <v-icon
                                large
                                color="grey darken-2"
                                class="pl-10 ml-5"
                                @click="this.createYear"
                                v-if="this.type === 'undergrad'"
                            >
                                add_box
                            </v-icon>
                            <v-icon
                                large
                                color="grey darken-2"
                                class="pl-10 ml-5 postgrad-add-list-main"
                                @click="this.createList"
                                v-else
                            >
                                add_box
                            </v-icon>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col>
                            <ume
                                class="ume-content"
                                v-if="this.type === 'undergrad'"
                                :payload="this.programme['Programme Content']"
                                :depth="0"
                                :year="''"
                                :prev-key="''"
                            />
                            <pce
                                v-else-if="this.type === 'postgrad'"
                                :payload="this.programme['Programme Content']"
                                :depth="0"
                                :root="''"
                                :prev-key="''"
                            />
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
                            iseCancelEdit();
                            admission_requirements = deepCopy(
                                admission_requirements_backup
                            );
                        "
                    >
                        cancel
                    </v-btn>
                    <v-btn
                        color="success"
                        text
                        @click="
                            dialog = false;
                            if (typeAddProgramme) {
                                addProgramme();
                            } else {
                                saveChanges();
                            }
                            typeAddProgramme = false;
                        "
                    >
                        Save changes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <template>
            <v-row justify="center">
                <v-dialog
                    v-model="editRequirements"
                    persistent
                    max-width="900"
                    max-height="600"
                >
                    <v-card class="ar-editor">
                        <v-card-title class="headline pb-0"
                            >Edit admission requirements <v-spacer />
                            <div
                                class="d-flex"
                                v-if="this.type === 'undergrad'"
                            >
                                <v-icon
                                    small
                                    color="red darken-2"
                                    class="mr-1 ar_remove"
                                    @click="changeReqAmt(false)"
                                >
                                    remove
                                </v-icon>
                                {{ this.requirements_only.length }}
                                <v-icon
                                    small
                                    color="green darken-2"
                                    class="ml-1 ar_add"
                                    @click="changeReqAmt(true)"
                                >
                                    add
                                </v-icon>
                            </div>
                            <div
                                class="d-flex"
                                v-else-if="this.type === 'postgrad'"
                            >
                                <v-icon
                                    medium
                                    color="green darken-2"
                                    class="ml-1 ar_p_add"
                                    @click="addReq(true)"
                                >
                                    add
                                </v-icon>
                            </div>
                        </v-card-title>

                        <v-container
                            v-if="this.type === 'undergrad'"
                            class="pl-6 pr-6 pt-0 mt-5"
                        >
                            <v-alert
                                border="left"
                                elevation="2"
                                colored-border
                                type="error"
                            >
                                <v-row>
                                    <v-col cols="10">
                                        <span class="font-weight-bold"
                                            >Please note: This information is
                                            format sensitive </span
                                        ><br />
                                        Click here here for information on how
                                        to enter information here to prevent
                                        errors in the background calculations.
                                    </v-col>
                                    <v-col cols="2">
                                        <v-btn
                                            color="red darken-1"
                                            dark
                                            class="mt-5"
                                            @click="
                                                admissionGuidelinesUndergrad = true
                                            "
                                        >
                                            Click me
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-alert>
                            <v-row
                                no-gutters
                                v-for="index in this.requirements_only.length"
                                :key="index"
                            >
                                <v-col>
                                    <v-text-field
                                        v-model="requirements_only[index - 1]"
                                        clearable
                                        :label="'Item ' + index"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-container v-else class="pl-6 pr-6 pt-0 mt-5">
                            <v-alert
                                border="left"
                                elevation="2"
                                colored-border
                                type="error"
                            >
                                <v-row>
                                    <v-col cols="10">
                                        <span class="font-weight-bold"
                                            >Please note: This information is
                                            format sensitive </span
                                        ><br />
                                        Click here here for information on how
                                        to enter information here to prevent
                                        errors in the background calculations.
                                    </v-col>
                                    <v-col cols="2">
                                        <v-btn
                                            color="red darken-1"
                                            dark
                                            class="mt-5"
                                            @click="
                                                admissionGuidelinesPostgrad = true
                                            "
                                        >
                                            Click me
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-alert>
                            <ae
                                :payload="this.admission_requirements"
                                :depth="0"
                                :prev-key="''"
                                class=""
                            />
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="editRequirements = false"
                                >Cancel</v-btn
                            >
                            <v-btn
                                color="green darken-1"
                                text
                                @click="
                                    editRequirements = false;
                                    if (type === 'undergrad') {
                                        convertAR();
                                    }
                                "
                                >Change</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <!-- DIALOGS FOR THE INFORMATION SECTIONS -->
        <template>
            <v-row justify="center">
                <v-dialog
                    class="ise-add-dialog"
                    v-model="iseAddItemDialog"
                    persistent
                    max-width="600"
                >
                    <v-card>
                        <v-card-title class="headline pb-0"
                            >Add item</v-card-title
                        >

                        <v-container class="pl-6 pr-6 pt-0">
                            <v-row no-gutters class="d-flex">
                                <v-col cols="10">
                                    <v-checkbox
                                        v-model="iseAddItemListOption"
                                        color="green darken-1"
                                    >
                                        <template v-slot:label>
                                            <div @click.stop="">
                                                Add a list
                                            </div>
                                        </template>
                                    </v-checkbox>
                                </v-col>
                                <v-col
                                    cols="2"
                                    class="pt-6"
                                    v-if="this.iseAddItemListOption"
                                >
                                    <v-icon
                                        small
                                        color="red darken-2"
                                        class="mr-1"
                                        @click="changeListAmt(false)"
                                        >remove
                                    </v-icon>
                                    {{ this.iseAddItemListItems.length }}
                                    <v-icon
                                        small
                                        color="green darken-2"
                                        class="ml-1"
                                        @click="changeListAmt(true)"
                                        >add
                                    </v-icon>
                                </v-col>
                            </v-row>
                            <v-row no-gutters v-if="!this.iseAddItemListOption">
                                <v-col>
                                    <v-textarea
                                        v-model="iseAddItemContent"
                                        clearable
                                        label="Item content"
                                        no-resize
                                        rows="2"
                                    />
                                </v-col>
                            </v-row>
                            <v-row no-gutters v-else>
                                <v-col>
                                    <v-row no-gutters>
                                        <v-col>
                                            <v-text-field
                                                v-model="iseAddItemListHeader"
                                                clearable
                                                label="List header"
                                            />
                                        </v-col>
                                    </v-row>
                                    <v-row
                                        no-gutters
                                        v-for="index in this.iseAddItemListItems
                                            .length"
                                        :key="index"
                                    >
                                        <v-col>
                                            <v-text-field
                                                v-model="
                                                    iseAddItemListItems[
                                                        index - 1
                                                    ]
                                                "
                                                clearable
                                                :label="'Item ' + index"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="iseResetAddItem()"
                                >Cancel</v-btn
                            >
                            <v-btn
                                class="ise-add-dialog-add"
                                color="green darken-1"
                                text
                                @click="iseConfirmAddItem()"
                                >Add</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <template>
            <v-row justify="center">
                <v-dialog v-model="createCardDialog" persistent max-width="600">
                    <v-card class="test">
                        <v-card-title class="headline pb-0"
                            >Add a new card</v-card-title
                        >

                        <v-container class="pl-6 pr-6 pt-0">
                            <v-row no-gutters class="d-flex">
                                <v-spacer />
                                <v-col>
                                    <v-icon
                                        small
                                        color="red darken-2"
                                        class="mr-1"
                                        @click="changeListAmt(false)"
                                        >remove
                                    </v-icon>
                                    {{ this.iseAddItemListItems.length }}
                                    <v-icon
                                        small
                                        color="green darken-2"
                                        class="ml-1"
                                        @click="changeListAmt(true)"
                                        >add
                                    </v-icon>
                                </v-col>
                            </v-row>

                            <v-row no-gutters>
                                <v-col>
                                    <v-row no-gutters>
                                        <v-col>
                                            <v-text-field
                                                v-model="iseAddItemListHeader"
                                                clearable
                                                label="Card header"
                                            />
                                        </v-col>
                                    </v-row>
                                    <v-row
                                        no-gutters
                                        v-for="index in this.iseAddItemListItems
                                            .length"
                                        :key="index"
                                    >
                                        <v-col>
                                            <v-text-field
                                                v-model="
                                                    iseAddItemListItems[
                                                        index - 1
                                                    ]
                                                "
                                                clearable
                                                :label="'Item ' + index"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="
                                    iseResetAddItem();
                                    createCardDialog = false;
                                "
                                >Cancel</v-btn
                            >
                            <v-btn
                                color="green darken-1"
                                text
                                @click="
                                    iseConfirmAddItem();
                                    createCardDialog = false;
                                "
                                >Add</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <template>
            <v-row justify="center">
                <v-dialog
                    class="ise-edit-dialog"
                    v-model="iseEditItemDialog"
                    persistent
                    max-width="600"
                >
                    <v-card>
                        <v-card-title class="headline pb-0"
                            >Edit item</v-card-title
                        >

                        <v-container class="pl-6 pr-6 pt-2 pb-0">
                            <v-textarea
                                v-model="iseEditItemContent"
                                clearable
                                label="Item content"
                                rows="2"
                                no-resize
                            />
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="this.iseResetEditItem"
                                >Cancel</v-btn
                            >
                            <v-btn
                                class="ise-edit-dialog-save"
                                color="green darken-1"
                                text
                                @click="this.iseConfirmEditItem"
                                >Save</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <!-- DIALOGS FOR THE UNDERGRAD COURSE CONTENT -->
        <template>
            <v-row justify="center">
                <v-dialog
                    class="ume-add-dialog"
                    v-model="umeAddDialog"
                    persistent
                    max-width="600"
                >
                    <v-card>
                        <v-card-title class="headline pb-0">
                            Add {{ this.umeType }}
                            <v-spacer />
                            <div v-if="this.umeType === 'Module'">
                                <div style="display: flex">
                                    <v-icon
                                        small
                                        color="red darken-2"
                                        class="mr-1"
                                        @click="changeModulesAmt(false)"
                                    >
                                        remove
                                    </v-icon>
                                    {{ this.umeAddModules.length }}
                                    <v-icon
                                        small
                                        color="green darken-2"
                                        class="ml-1"
                                        @click="changeModulesAmt(true)"
                                    >
                                        add
                                    </v-icon>
                                </div>
                            </div>
                        </v-card-title>

                        <v-container class="pl-6 pr-6 pt-2 pb-0">
                            <v-text-field
                                v-model="umeAddItemModel"
                                clearable
                                label="List Title"
                                v-if="this.umeType === 'List'"
                                hint="Please ensure correct spelling to avoid calculation errors."
                            />
                            <v-textarea
                                v-model="umeAddItemModel"
                                clearable
                                rows="3"
                                no-resize
                                label="Alert message"
                                v-if="this.umeType === 'Alert'"
                            />
                            <v-row v-if="this.umeType === 'Credits'">
                                <v-col>
                                    Minimum:
                                    <v-text-field
                                        v-model="umeCreditsMin"
                                        clearable
                                        label="Min"
                                    />
                                </v-col>
                                <v-col>
                                    Maximum:
                                    <v-text-field
                                        v-model="umeCreditsMax"
                                        clearable
                                        label="Max"
                                    />
                                </v-col>
                            </v-row>
                            <v-row v-if="this.umeType === 'Module'">
                                <v-col>
                                    <v-row
                                        v-for="i in this.umeAddModules.length"
                                        :key="i"
                                    >
                                        <v-col cols="10">
                                            <v-text-field
                                                v-model="
                                                    umeAddModules[i - 1].modules
                                                "
                                                clearable
                                                label="Modules"
                                                :rules="[umeRules.required]"
                                                hint="Please ensure correct spelling to avoid calculation errors."
                                            />
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field
                                                v-model="
                                                    umeAddModules[i - 1].credits
                                                "
                                                clearable
                                                label="Credits"
                                                :rules="[
                                                    umeRules.required,
                                                    umeRules.nan,
                                                    umeRules.tooSmall,
                                                    umeRules.tooLarge
                                                ]"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="this.resetUMEVariables"
                                >Cancel</v-btn
                            >
                            <v-btn
                                class="ume-add-dialog-add"
                                color="green darken-1"
                                text
                                @click="this.umeConfirmAddItem"
                                >Add</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <template>
            <v-row justify="center">
                <v-dialog
                    class="ume-edit-dialog"
                    v-model="umeEditDialog"
                    persistent
                    max-width="600"
                >
                    <v-card>
                        <v-card-title class="headline pb-0">
                            Edit {{ this.umeType }}
                        </v-card-title>

                        <v-container class="pl-6 pr-6 pt-2 pb-0">
                            <v-text-field
                                v-model="umeNewKey"
                                clearable
                                label="List Title"
                                hint="Please ensure correct spelling to avoid calculation errors."
                                v-if="this.umeType === 'List'"
                            />
                            <v-textarea
                                v-model="umeNewKey"
                                clearable
                                rows="3"
                                no-resize
                                label="Alert message"
                                v-if="this.umeType === 'Alert'"
                            />
                            <v-row v-if="this.umeType === 'Credits'">
                                <v-col>
                                    Minimum:
                                    <v-text-field
                                        v-model="umeCreditsMin"
                                        clearable
                                        label="Min"
                                    />
                                </v-col>
                                <v-col>
                                    Maximum:
                                    <v-text-field
                                        v-model="umeCreditsMax"
                                        clearable
                                        label="Max"
                                    />
                                </v-col>
                            </v-row>
                            <v-row v-if="this.umeType === 'Module'">
                                <v-col cols="10">
                                    <v-text-field
                                        v-model="umeNewKey"
                                        clearable
                                        label="Module"
                                        :rules="[umeRules.required]"
                                        hint="Please ensure correct spelling to avoid calculation errors."
                                    />
                                </v-col>
                                <v-col cols="2">
                                    <v-text-field
                                        v-model="umeVal"
                                        clearable
                                        label="Credits"
                                        :rules="[
                                            umeRules.required,
                                            umeRules.nan,
                                            umeRules.tooSmall,
                                            umeRules.tooLarge
                                        ]"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="this.resetUMEVariables"
                                >Cancel</v-btn
                            >
                            <v-btn
                                class="ume-edit-dialog-save"
                                color="green darken-1"
                                text
                                @click="this.umeConfirmEditItem"
                                >Save</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <template>
            <v-row justify="center">
                <v-dialog v-model="createYearDialog" persistent max-width="600">
                    <v-card>
                        <v-card-title class="headline pb-0"
                            >Add a year</v-card-title
                        >

                        <v-container class="pl-6 pr-6 pt-2 pb-0">
                            <v-row>
                                <v-col>
                                    <v-select
                                        v-model="umeYear"
                                        label="Year"
                                        :items="[
                                            '1st year',
                                            '2nd year',
                                            '3rd year'
                                        ]"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    Minimum:
                                    <v-text-field
                                        v-model="umeCreditsMin"
                                        clearable
                                        label="Min"
                                    />
                                </v-col>
                                <v-col>
                                    Maximum:
                                    <v-text-field
                                        v-model="umeCreditsMax"
                                        clearable
                                        label="Max"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="this.resetUMEVariables"
                                >Cancel</v-btn
                            >
                            <v-btn
                                color="green darken-1"
                                text
                                @click="this.createNewYear"
                                >Add</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <!-- DIALOGS FOR THE POSTGRAD COURSE CONTENT -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="pceAddDialog" persistent max-width="1400">
                    <v-card class="pce-add-dialog">
                        <v-card-title class="headline pb-0">
                            Add {{ this.pceType }}
                            <v-spacer />
                            <div v-if="this.pceType === 'Module'">
                                <div style="display: flex">
                                    <v-icon
                                        small
                                        color="red darken-2"
                                        class="mr-1"
                                        @click="changeModulesAmtPCE(false)"
                                    >
                                        remove
                                    </v-icon>
                                    {{ this.pceAddModules["Credits"].length }}
                                    <v-icon
                                        small
                                        color="green darken-2"
                                        class="ml-1"
                                        @click="changeModulesAmtPCE(true)"
                                    >
                                        add
                                    </v-icon>
                                </div>
                            </div>
                        </v-card-title>

                        <v-container class="pl-6 pr-6 pt-2 pb-0">
                            <v-text-field
                                v-model="pceAddItemModel"
                                clearable
                                label="List Title"
                                v-if="this.pceType === 'List'"
                                hint="Please ensure correct spelling to avoid calculation errors."
                            />
                            <v-textarea
                                v-model="pceAddItemModel"
                                clearable
                                rows="3"
                                no-resize
                                label="Text content"
                                v-if="this.pceType === 'Text'"
                            />
                            <v-row v-if="this.pceType === 'Credits'">
                                <v-col>
                                    Minimum:
                                    <v-text-field
                                        v-model="pceCreditsMin"
                                        clearable
                                        label="Min"
                                    />
                                </v-col>
                                <v-col>
                                    Maximum:
                                    <v-text-field
                                        v-model="pceCreditsMax"
                                        clearable
                                        label="Max"
                                    />
                                </v-col>
                            </v-row>
                            <v-row v-if="this.pceType === 'Module'">
                                <v-col>
                                    <v-row class="red">
                                        <v-col cols="2"> Subject Number</v-col>
                                        <v-col cols="1"> Semester</v-col>
                                        <v-col cols="6"> Module Name</v-col>
                                        <v-col cols="2"> Module Code</v-col>
                                        <v-col cols="1"> Credits</v-col>
                                    </v-row>
                                    <v-row
                                        v-for="i in this.pceAddModules[
                                            'Credits'
                                        ].length"
                                        :key="i"
                                    >
                                        <v-col cols="2">
                                            <v-text-field
                                                v-model="
                                                    pceAddModules[
                                                        'Subject Number'
                                                    ][i - 1]
                                                "
                                                clearable
                                                label="Subject Number"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                        <v-col cols="1">
                                            <v-text-field
                                                v-model="
                                                    pceAddModules['Semester'][
                                                        i - 1
                                                    ]
                                                "
                                                clearable
                                                label="Semester"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                v-model="
                                                    pceAddModules[
                                                        'Module Name'
                                                    ][i - 1]
                                                "
                                                clearable
                                                label="Module Name"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field
                                                v-model="
                                                    pceAddModules[
                                                        'Module Code'
                                                    ][i - 1]
                                                "
                                                clearable
                                                label="Module Code"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                        <v-col cols="1">
                                            <v-text-field
                                                v-model="
                                                    pceAddModules['Credits'][
                                                        i - 1
                                                    ]
                                                "
                                                clearable
                                                label="Credits"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="this.resetPCEVariables"
                                >Cancel</v-btn
                            >
                            <v-btn
                                color="green darken-1"
                                text
                                @click="this.pceConfirmAddItem"
                                >Add</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <template>
            <v-row justify="center">
                <v-dialog
                    class="pce-edit-dialog"
                    v-model="pceEditDialog"
                    persistent
                    max-width="1400"
                >
                    <v-card>
                        <v-card-title class="headline pb-0">
                            Edit {{ this.pceType }}
                        </v-card-title>

                        <v-container class="pl-6 pr-6 pt-2 pb-0">
                            <v-text-field
                                v-model="pceNewKey"
                                clearable
                                label="List Title"
                                hint="Please ensure correct spelling to avoid calculation errors."
                                v-if="this.pceType === 'List'"
                            />
                            <v-textarea
                                v-model="pceNewKey"
                                clearable
                                rows="3"
                                no-resize
                                label="Text content"
                                v-if="this.pceType === 'Text'"
                            />
                            <v-row v-if="this.pceType === 'Credits'">
                                <v-col>
                                    Minimum:
                                    <v-text-field
                                        v-model="pceCreditsMin"
                                        clearable
                                        label="Min"
                                    />
                                </v-col>
                                <v-col>
                                    Maximum:
                                    <v-text-field
                                        v-model="pceCreditsMax"
                                        clearable
                                        label="Max"
                                    />
                                </v-col>
                            </v-row>
                            <v-row v-if="this.pceType === 'Table'">
                                <v-col cols="12">
                                    <v-row class="red">
                                        <v-col cols="2"> Subject Number</v-col>
                                        <v-col cols="1"> Semester</v-col>
                                        <v-col cols="5"> Module Name</v-col>
                                        <v-col cols="2"> Module Code</v-col>
                                        <v-col cols="1"> Credits</v-col>
                                    </v-row>
                                    <v-row
                                        v-for="i in this.pceEditModules[
                                            'Credits'
                                        ].length"
                                        :key="i"
                                    >
                                        <v-col cols="2">
                                            <v-text-field
                                                v-model="
                                                    pceEditModules[
                                                        'Subject Number'
                                                    ][i - 1]
                                                "
                                                clearable
                                                label="Subject Number"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                        <v-col cols="1">
                                            <v-text-field
                                                v-model="
                                                    pceEditModules['Semester'][
                                                        i - 1
                                                    ]
                                                "
                                                clearable
                                                label="Semester"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                        <v-col cols="5">
                                            <v-text-field
                                                v-model="
                                                    pceEditModules[
                                                        'Module Name'
                                                    ][i - 1]
                                                "
                                                clearable
                                                label="Module Name"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field
                                                v-model="
                                                    pceEditModules[
                                                        'Module Code'
                                                    ][i - 1]
                                                "
                                                clearable
                                                label="Module Code"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                        <v-col cols="1">
                                            <v-text-field
                                                v-model="
                                                    pceEditModules['Credits'][
                                                        i - 1
                                                    ]
                                                "
                                                clearable
                                                label="Credits"
                                                :rules="[umeRules.required]"
                                            />
                                        </v-col>
                                        <v-col cols="1">
                                            <v-icon
                                                large
                                                color="red darken-2"
                                                @click="pceRemoveModule(i - 1)"
                                                class="pt-2"
                                            >
                                                close
                                            </v-icon>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-0 pt-0">
                                        <v-col cols="11"></v-col>
                                        <v-col cols="1">
                                            <v-icon
                                                large
                                                color="green darken-2"
                                                class=""
                                                @click="pceAddModule"
                                            >
                                                add
                                            </v-icon>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="resetPCEVariables"
                                >Cancel</v-btn
                            >
                            <v-btn
                                class="pce-edit-dialog-save"
                                color="green darken-1"
                                text
                                @click="pceConfirmEditItem"
                                >Save</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <template>
            <v-row justify="center">
                <v-dialog v-model="createListDialog" persistent max-width="600">
                    <v-card class="pce-new-list">
                        <v-card-title class="headline pb-0"
                            >Add a list</v-card-title
                        >

                        <v-container class="pl-6 pr-6 pt-2 pb-0">
                            <v-row>
                                <v-col>
                                    <v-text-field
                                        v-model="pceNewKey"
                                        clearable
                                        label="List title"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="this.resetPCEVariables"
                                >Cancel</v-btn
                            >
                            <v-btn
                                color="green darken-1"
                                text
                                @click="this.createNewList"
                                >Add</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <!-- DIALOGS FOR ADMISSION REQUIREMENTS CONTENT -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="aeAddDialog" persistent max-width="900">
                    <v-card class="pce-add-dialog">
                        <v-card-title class="headline pb-0">
                            Add {{ this.aeType }}
                        </v-card-title>

                        <v-container class="pl-6 pr-6 pt-2 pb-0">
                            <v-text-field
                                v-model="aeAddItemKey"
                                clearable
                                label="List Title"
                                v-if="this.aeType === 'List'"
                                hint="Please ensure correct spelling to avoid calculation errors."
                            />
                            <v-row v-if="this.aeType === 'Item'">
                                <v-col cols="4">
                                    <v-text-field
                                        v-model="aeAddItemKey"
                                        clearable
                                        label="Item"
                                    />
                                </v-col>
                                <v-col cols="2">
                                    <v-text-field
                                        v-model="aeAddItemVal"
                                        clearable
                                        label="%"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="this.cancelAE"
                                >Cancel</v-btn
                            >
                            <v-btn
                                color="green darken-1"
                                text
                                @click="this.aeConfirmAddItem"
                                >Add</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <template>
            <v-row justify="center">
                <v-dialog v-model="aeEditDialog" persistent max-width="900">
                    <v-card class="pce-add-dialog">
                        <v-card-title class="headline pb-0">
                            Edit {{ this.aeType }}
                        </v-card-title>

                        <v-container class="pl-6 pr-6 pt-2 pb-0">
                            <v-text-field
                                v-model="aeNewKey"
                                clearable
                                label="List Title"
                                v-if="this.aeType === 'List'"
                                hint="Please ensure correct spelling to avoid calculation errors."
                            />
                            <v-row v-if="this.aeType === 'Item'">
                                <v-col cols="4">
                                    <v-text-field
                                        v-model="aeNewKey"
                                        clearable
                                        label="Item"
                                    />
                                </v-col>
                                <v-col cols="2">
                                    <v-text-field
                                        v-model="aeNewVal"
                                        clearable
                                        label="%"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="this.cancelAE"
                                >Cancel</v-btn
                            >
                            <v-btn
                                color="green darken-1"
                                text
                                @click="this.aeConfirmEditItem"
                                >Edit</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <!-- Key already exists in the object -->
        <template>
            <div class="text-center">
                <v-snackbar v-model="keyExistsError" top color="white">
                    <span style="color: black"
                        >This entry already exists within the list. Please
                        specify a different value.</span
                    >
                    <v-btn
                        color="red"
                        text
                        elevation="2"
                        @click="keyExistsError = false"
                    >
                        Close
                    </v-btn>
                </v-snackbar>
            </div>
        </template>

        <!-- Year already exists -->
        <template>
            <div class="text-center">
                <v-snackbar
                    v-model="yearError"
                    :timeout="4000"
                    top
                    color="white"
                >
                    <span style="color: black"
                        >The year you wanted to add is already present in this
                        programme.</span
                    >
                    <v-btn
                        color="red"
                        text
                        elevation="2"
                        @click="yearError = false"
                    >
                        Close
                    </v-btn>
                </v-snackbar>
            </div>
        </template>

        <template>
            <v-row justify-center>
                <v-dialog v-model="chooseType" width="500">
                    <v-card class="add-programme-type">
                        <v-card-title class="headline grey lighten-2">
                            Please choose the programme type
                        </v-card-title>

                        <v-card-text>
                            <v-row class="justify-center pt-5">
                                <v-col>
                                    <v-row class="justify-center">
                                        <v-btn
                                            color="red"
                                            dark
                                            @click="
                                                chooseType = false;
                                                type = 'undergrad';
                                                setType('undergrad');
                                                dialog = true;
                                            "
                                        >
                                            Undergraduate
                                        </v-btn>
                                    </v-row>
                                    <v-row class="justify-center pt-5">
                                        <v-btn
                                            color="red"
                                            dark
                                            @click="
                                                chooseType = false;
                                                type = 'postgrad';
                                                setType('postgrad');
                                                dialog = true;
                                            "
                                        >
                                            Postgraduate
                                        </v-btn>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red" text @click="chooseType = false">
                                Cancel
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <template>
            <v-row justify="center">
                <v-dialog
                    v-model="admissionGuidelinesUndergrad"
                    persistent
                    width="75vw"
                >
                    <v-card class="" min-height="85vh">
                        <v-card-title class="headline pb-0">
                            Undergraduate Programme Requirements Guideline
                        </v-card-title>

                        <v-container class="">
                            <v-alert
                                border="left"
                                colored-border
                                type="error"
                                elevation="2"
                            >
                                The format will be explained by showing and
                                explaining an example programmes - Computer
                                Science.
                            </v-alert>

                            <v-alert
                                border="left"
                                colored-border
                                type="info"
                                elevation="2"
                            >
                                The Computer Science programme's requirements
                                are as follows:
                                <ul>
                                    <li>'Average - 65'</li>
                                    <li>'Afrikaans - 4' OR 'English - 4'</li>
                                    <li>
                                        'Any other subject from the designated
                                        list for university admission - 4' OR
                                        'Physical Sciences - 4'
                                    </li>
                                    <li>'Mathematics - 6'</li>
                                </ul>
                                From the list above we can see that all of the
                                individual requirements are
                                <span class="font-weight-bold"
                                    >encapsulated with single qoutes, which is
                                    very important.</span
                                ><br />
                                The first item 'Average - 65' is how you specify
                                the average mark the student had to achieve in
                                grade 12 in order to enroll for the
                                programmes.<br />
                                <br />
                                The last three items are how the subjects are
                                specified:
                                <ul>
                                    <li>
                                        To specify the code the student had to
                                        achieve for a specific subject a
                                        <span class="font-weight-bold"
                                            >dash (-)</span
                                        >
                                        seperator is used, for example in list
                                        item 2 we can see that the student must
                                        have a code 4 for afrikaans or english.
                                    </li>
                                    <li>
                                        Item 2 and 3 shows how to specify
                                        requirements that the student can choose
                                        between, by using the
                                        <span class="font-weight-bold">OR</span>
                                        specifier. For example the student
                                        should either have had a code 4 for
                                        Afrikaans or for English.
                                    </li>
                                    <li>
                                        Lastly, it is important to note that
                                        each of the items listed is a
                                        <span class="font-weight-bold"
                                            >MUST HAVE</span
                                        >
                                        requirement of the student. This means
                                        that a studemt who wants to enroll to
                                        study BSc Computer Science must have a
                                        code 6 achievement for mathematics, a
                                        code 4 achievement for either english or
                                        afrikaans, a code 4 achievement for
                                        either physical sciences or any other
                                        acredited subject and an overall average
                                        of 65% for grade 12.
                                    </li>
                                </ul>
                                <br />
                                The following is a list of possible items you
                                can specify
                                <span class="font-weight-bold"
                                    >(spelling is very important)</span
                                >:
                                <ul>
                                    <li>Average</li>
                                    <li>Afrikaans</li>
                                    <li>English</li>
                                    <li>Mathematics</li>
                                    <li>Physical Sciences</li>
                                    <li>
                                        Any other subject from the designated
                                        list for university admission
                                    </li>
                                </ul>
                            </v-alert>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="green darken-1"
                                text
                                @click="admissionGuidelinesUndergrad = false"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <template>
            <v-row justify="center">
                <v-dialog
                    v-model="admissionGuidelinesPostgrad"
                    persistent
                    width="75vw"
                >
                    <v-card class="" min-height="85vh">
                        <v-card-title class="headline pb-0">
                            Postgraduate Programme Requirements Guideline
                        </v-card-title>

                        <v-container class="">
                            <v-alert
                                border="left"
                                colored-border
                                type="error"
                                elevation="2"
                            >
                                The format will be explained by showing and
                                explaining an example programmes - BSc
                                Microbiology (Hons)
                            </v-alert>

                            <v-alert
                                border="left"
                                colored-border
                                type="info"
                                elevation="2"
                            >
                                The requirements for the programme is given in a
                                tree format to easily explain how it should be
                                structured:
                                <ul>
                                    <li>
                                        1:
                                        <ul>
                                            <li>Microbiology 3: 60</li>
                                        </ul>
                                    </li>
                                    <li>
                                        2:
                                        <ul>
                                            <li>
                                                Chemistry and Polymer Science:
                                                <ul>
                                                    <li>
                                                        1:
                                                        <ul>
                                                            <li>
                                                                Microbiology
                                                                314: 60
                                                            </li>
                                                            <li>
                                                                Microbiology
                                                                324: 60
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        2:
                                                        <ul>
                                                            <li>
                                                                Microbiology
                                                                314: 60
                                                            </li>
                                                            <li>
                                                                Microbiology
                                                                364: 60
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>

                                From the tree above there are a few things to
                                point out.
                                <ul>
                                    <li>
                                        The primary list items 1 and 2
                                        symbolises that the student has two
                                        choices in order to qualify for this
                                        programme:
                                        <ul>
                                            <li>The first possibility is that the student should have majored in Microbiology and must have an average of 60% for their major.</li>
                                            <li>The second possibility is more complex. The student must have studied the stream Chemistry and Polymer Science. The lists within this requirement signify that the student must have chosen one of two combinations of modules:
                                                <ul>
                                                    <li>The student must have chosen Microbiology 314 and 324 and must have achieved 60% average for these modules.</li>
                                                    <li>OR the student must have chosen Microbiology 314 and 364 and must have achieved 60% average for these modules.</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>In order to specify choices you thus create separate lists containing their respective requirements which can either be a major in a subject, a certain programme, or modules.</li>
                                    <li>In order to specify that a student had to have majored in a certain subject you have to use the format: <span class="font-weight-bold">{Module name} 3</span>. (This will check that the student took 4 modules of the specified subject or the maximum amount of modules for the sbuject if there is less than 4 available.</li>
                                    <li>In order to specify that a student should have followed a certain programme or more specifically a stream or option within a programme you simply specify the programme, stream or option. <span class="font-weight-bold">(spelling is very important so please double check)</span></li>
                                </ul>
                            </v-alert>
                        </v-container>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="green darken-1"
                                text
                                @click="admissionGuidelinesPostgrad = false"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
    </div>
</template>

<script>
import { EventBus } from "@/event-bus";
import axios from "axios";

import ume from "@/components/ProgrammeComponents/UndergradModulesEditor.vue";
import pce from "@/components/ProgrammeComponents/PostgradCourseEditor.vue";
import ise from "@/components/ProgrammeComponents/InformationSectionsEditor.vue";
import ae from "@/components/ProgrammeComponents/AdmissionEditor.vue";

export default {
    name: "ProgrammeEditor",

    components: {
        ume,
        ise,
        pce,
        ae
    },

    data() {
        return {
            chooseType: false,
            typeAddProgramme: false,
            dialog: false,
            type: "",
            programme: {},
            programme_backup: {},
            cards: {},
            course: {},
            rules: [value => !!value || "Can't be empty."],
            umeRules: {
                required: value => !!value || "Required",
                nan: value => !isNaN(value) || "Must be a number",
                tooSmall: value => parseInt(value) > 0 || "Too small",
                tooLarge: value => parseInt(value) <= 128 || "Too large"
            },
            keyExistsError: false,

            // Admission Requiremtns
            editRequirements: false,
            admission_requirements: {},
            admission_requirements_backup: {},
            requirements_only: [],
            admissionGuidelinesUndergrad: false,
            admissionGuidelinesPostgrad: false,

            // ISE (Information Section Editor) variables
            createCardDialog: false,
            iseAddItemDialog: false,
            iseAddItemKey: "",
            iseAddItemListOption: false,
            iseAddItemContent: "",
            iseAddItemListHeader: "",
            iseAddItemListItems: [""],
            iseEditItemDialog: false,
            iseEditItemKey: "",
            iseEditItemContent: "",

            // UME (Undergrad Modules Editor) variables
            createYearDialog: false,
            yearError: false,
            umeAddDialog: false,
            umeEditDialog: false,
            umeType: "",
            umeVal: "",
            umeKey: "",
            umeNewKey: "",
            umeYear: "",
            umePrevKey: "",
            umeAddItemModel: "",
            umeCreditsMin: "",
            umeCreditsMax: "",
            umeAddModules: [{ modules: "", credits: "" }],

            // PCE (Postgrad Course Editor) variables
            createListDialog: false,
            pceAddDialog: false,
            pceEditDialog: false,
            pceType: "",
            pceRoot: "",
            pceKey: "",
            pceNewKey: "",
            pcePrevKey: "",
            pceAddItemModel: "",
            pceCreditsMin: "",
            pceCreditsMax: "",
            pceAddModules: {
                Credits: [""],
                "Module Code": [""],
                "Module Name": [""],
                Semester: [""],
                "Subject Number": [""]
            },
            pceEditModules: {},

            aeAddDialog: false,
            aeEditDialog: false,
            aeType: "",
            aeKey: "",
            aeNewKey: "",
            aePrevKey: "",
            aeVal: "",
            aeNewVal: "",
            aeAddItemKey: "",
            aeAddItemVal: ""
        };
    },

    methods: {
        isNumeric: function(str) {
            if (typeof str != "string") return false;
            return !isNaN(str) && !isNaN(parseInt(str));
        },
        getNumOfKeys: function(obj) {
            let count = 0;

            for (const item in obj) {
                if (this.isNumeric(item)) count++;
            }

            return count;
        },
        convertAR() {
            let ar = { avg: 0, requirements: {} };

            for (const i in this.requirements_only) {
                let item = this.requirements_only[i];

                if (item.includes("Average")) {
                    item = item.replaceAll("'", "");
                    ar["avg"] = parseInt(
                        item.substring(item.length - 2, item.length)
                    );
                } else {
                    if (item.includes("OR")) {
                        item = item.replaceAll("'", "");
                        let arr = item.split(" OR ");

                        let obj = {};

                        for (const j in arr) {
                            let subj_temp = arr[j];

                            let temp_arr = subj_temp.split(" - ");
                            obj[temp_arr[0]] = parseInt(temp_arr[1]);
                        }

                        ar["requirements"][
                            this.getNumOfKeys(ar["requirements"]) + 1
                        ] = obj;
                    } else {
                        item = item.replaceAll("'", "");
                        let temp_arr = item.split(" - ");
                        ar["requirements"][temp_arr[0]] = parseInt(temp_arr[1]);
                    }
                }
            }

            this.admission_requirements["avg"] = ar["avg"];
            this.admission_requirements["requirements"] = ar["requirements"];
        },
        changeReqAmt(option) {
            if (option) {
                this.requirements_only.push("");
            } else {
                if (this.requirements_only.length > 0) {
                    this.requirements_only.pop();
                }
            }
        },
        addReq() {
            let count = 0;

            for (const item in this.admission_requirements) {
                if (!item.includes("_")) {
                    this.temp = item;
                    count++;
                }
            }

            count++;

            this.admission_requirements[count.toString()] = {};

            EventBus.$emit("reloadAE", true);
        },
        getAdmissionRequirements() {
            const path = "https://isy-be.herokuapp.com/getAdmissionRequirements";
            axios
                .post(path, { type: this.type, key: this.programme["_key"] })
                .then(res => {
                    this.admission_requirements = res.data.requirements;
                    this.admission_requirements_backup = this.deepCopy(
                        this.admission_requirements
                    );
                    this.getRequirementsOnly();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        getRequirementsOnly() {
            let arr = [];

            arr.push("'Average - " + this.admission_requirements["avg"] + "'");

            for (const item in this.admission_requirements["requirements"]) {
                if (
                    typeof this.admission_requirements["requirements"][item] ===
                    "object"
                ) {
                    let str = "";
                    for (const item2 in this.admission_requirements[
                        "requirements"
                    ][item]) {
                        let temp =
                            "'" +
                            item2 +
                            " - " +
                            this.admission_requirements["requirements"][item][
                                item2
                            ] +
                            "'";
                        str = str + temp + " OR ";
                    }

                    str = str.substring(0, str.length - 4);

                    arr.push(str);
                } else {
                    arr.push(
                        "'" +
                            item +
                            " - " +
                            this.admission_requirements["requirements"][item] +
                            "'"
                    );
                }
            }

            this.requirements_only = arr;
        },
        // Get programme info like programme, stream, etc.
        textContentOnly: function(dic) {
            let obj = {};

            for (let key in dic) {
                if (key !== "_key" && key !== "_id" && key !== "_rev") {
                    if (typeof dic[key] !== "object") {
                        obj[key] = dic[key];
                    }
                }
            }

            return obj;
        },
        // Create a deep copy of an object
        deepCopy: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        // Get info sections only
        infoCardsOnly: function(dic) {
            let obj = {};

            for (let key in dic) {
                if (
                    key !== "_key" &&
                    key !== "_id" &&
                    key !== "_rev" &&
                    key !== "Programme Content"
                ) {
                    if (typeof dic[key] === "object") {
                        obj[key] = dic[key];
                    }
                }
            }

            return obj;
        },
        // Add to an object method for UME
        addToObjectUME: function(obj, prevKey, key, addKey, addContent) {
            if (!addKey.replace(/\s/g, "").length) {
                return obj;
            }

            if (prevKey === "") {
                if (addKey in obj) {
                    this.keyExistsError = true;
                    return obj;
                }

                obj[addKey] = addContent;
            } else {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== prevKey) {
                        this.addToObjectUME(
                            obj[i],
                            prevKey,
                            key,
                            addKey,
                            addContent
                        );
                    } else if (i === prevKey) {
                        if (addKey in obj[prevKey][key]) {
                            this.keyExistsError = true;
                            return obj;
                        }

                        obj[prevKey][key][addKey] = addContent;
                    }
                }
            }

            return obj;
        },
        // Delete from object for UME
        filterObjectUME: function(obj, prevKey, key) {
            if (prevKey === "") {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== key) {
                        this.filterObjectUME(obj[i], prevKey, key);
                    } else if (i === key) {
                        delete obj[key];
                    }
                }
            } else {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== prevKey) {
                        this.filterObjectUME(obj[i], prevKey, key);
                    } else if (i === prevKey) {
                        delete obj[prevKey][key];
                    }
                }
            }

            return obj;
        },
        // Edit method for UME
        editObjectUME: function(obj, prevKey, key, newKey) {
            if (prevKey === "" || prevKey === this.umeYear) {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== key) {
                        this.editObjectUME(obj[i], prevKey, key, newKey);
                    } else if (i === key) {
                        if (this.umeType === "Module") {
                            obj[newKey] = this.umeVal;
                        } else {
                            if (newKey in obj) {
                                this.keyExistsError = true;
                                return obj;
                            }

                            obj[newKey] = obj[key];
                        }

                        if (newKey !== key) {
                            delete obj[key];
                        }
                    }
                }
            } else {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== prevKey) {
                        this.editObjectUME(obj[i], prevKey, key, newKey);
                    } else if (i === prevKey) {
                        if (this.umeType === "Module") {
                            obj[prevKey][newKey] = this.umeVal;
                        } else {
                            if (newKey in obj[prevKey]) {
                                this.keyExistsError = true;
                                return obj;
                            }

                            obj[prevKey][newKey] = obj[prevKey][key];
                        }

                        if (newKey !== key) {
                            delete obj[prevKey][key];
                        }
                    }
                }
            }

            return obj;
        },
        // Add to an object method for PCE
        addToObjectPCE: function(obj, prevKey, key, addKey, addContent) {
            if (!addKey.replace(/\s/g, "").length) {
                return obj;
            }

            for (let i in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;

                if (typeof obj[i] === "object" && i !== prevKey) {
                    this.addToObjectPCE(
                        obj[i],
                        prevKey,
                        key,
                        addKey,
                        addContent
                    );
                } else if (i === prevKey) {
                    if (addKey === "Modules") {
                        if (
                            Object.keys(this.getTable(obj[prevKey][key]))
                                .length !== 0
                        ) {
                            for (let header in this.pceAddModules) {
                                for (let item in this.pceAddModules[header]) {
                                    obj[prevKey][key][header].push(
                                        this.pceAddModules[header][item]
                                    );
                                }
                            }
                        } else {
                            for (let header in this.pceAddModules) {
                                obj[prevKey][key][header] = this.pceAddModules[
                                    header
                                ];
                            }
                        }
                    } else {
                        if (addKey in obj[prevKey][key]) {
                            this.keyExistsError = true;
                            return obj;
                        }

                        obj[prevKey][key][addKey] = addContent;
                    }
                }
            }

            return obj;
        },
        // Delete from object for PCE
        filterObjectPCE: function(obj, prevKey, key) {
            if (prevKey === "") {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== key) {
                        this.filterObjectPCE(obj[i], prevKey, key);
                    } else if (i === key) {
                        delete obj[key];
                    }
                }
            } else {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== prevKey) {
                        this.filterObjectPCE(obj[i], prevKey, key);
                    } else if (i === prevKey) {
                        if (key === "") {
                            delete obj[prevKey]["Subject Number"];
                            delete obj[prevKey]["Module Name"];
                            delete obj[prevKey]["Module Code"];
                            delete obj[prevKey]["Credits"];
                            delete obj[prevKey]["Semester"];
                        } else {
                            delete obj[prevKey][key];
                        }
                    }
                }
            }

            return obj;
        },
        // Edit method for PCE
        editObjectPCE: function(obj, prevKey, key, newKey) {
            if (prevKey === "") {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== key) {
                        this.editObjectPCE(obj[i], prevKey, key, newKey);
                    } else if (i === key) {
                        if (newKey in obj) {
                            this.keyExistsError = true;
                            return obj;
                        }

                        obj[newKey] = obj[key];

                        if (newKey !== key) {
                            delete obj[key];
                        }
                    }
                }
            } else {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== prevKey) {
                        this.editObjectPCE(obj[i], prevKey, key, newKey);
                    } else if (i === prevKey) {
                        if (newKey === "Table") {
                            for (let header in obj[prevKey]) {
                                obj[prevKey][header] = this.pceEditModules[
                                    header
                                ];
                            }
                        } else {
                            if (newKey in obj[prevKey]) {
                                this.keyExistsError = true;
                                return obj;
                            }

                            obj[prevKey][newKey] = obj[prevKey][key];

                            if (newKey !== key) {
                                delete obj[prevKey][key];
                            }
                        }
                    }
                }
            }

            return obj;
        },
        // Add to object
        addToObject: function(obj, key, addKey, addContent) {
            if (!addKey.replace(/\s/g, "").length) {
                return obj;
            }

            if (key === "") {
                if (addKey in obj) {
                    this.keyExistsError = true;
                    return obj;
                }

                obj[addKey] = addContent;

                return obj;
            }

            for (let i in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                if (typeof obj[i] === "object" && i !== key) {
                    this.addToObject(obj[i], key, addKey, addContent);
                } else if (i === key) {
                    if (addKey in obj[key]) {
                        this.keyExistsError = true;
                        return obj;
                    }

                    obj[key][addKey] = addContent;
                }
            }

            return obj;
        },
        // Edit element in object
        editObject: function(obj, key, newKey) {
            for (let i in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                if (typeof obj[i] === "object" && i !== key) {
                    this.editObject(obj[i], key, newKey);
                } else if (i === key) {
                    if (newKey in obj) {
                        this.keyExistsError = true;
                        return obj;
                    }

                    obj[newKey] = obj[key];
                    delete obj[key];
                }
            }

            return obj;
        },
        // Delete from object
        filterObject: function(obj, key) {
            for (let i in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                if (typeof obj[i] === "object" && i !== key) {
                    this.filterObject(obj[i], key);
                } else if (i === key) {
                    delete obj[key];
                }
            }
            return obj;
        },

        // Add to an object method for AE
        addToObjectAE: function(obj, prevKey, key, addKey, addContent) {
            if (!addKey.replace(/\s/g, "").length) {
                return obj;
            }

            for (let i in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;

                if (typeof obj[i] === "object" && i !== prevKey) {
                    this.addToObjectAE(
                        obj[i],
                        prevKey,
                        key,
                        addKey,
                        addContent
                    );
                } else if (i === prevKey) {
                    if (obj[prevKey][key] !== undefined) {
                        if (addKey in obj[prevKey][key]) {
                            this.keyExistsError = true;
                            return obj;
                        }
                    }

                    obj[prevKey][key][addKey] = addContent;
                    break;
                }
            }

            return obj;
        },
        // Delete from object for AE
        filterObjectAE: function(obj, prevKey, key) {
            if (prevKey === "") {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== key) {
                        this.filterObjectAE(obj[i], prevKey, key);
                    } else if (i === key) {
                        delete obj[key];
                    }
                }
            } else {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== prevKey) {
                        this.filterObjectAE(obj[i], prevKey, key);
                    } else if (i === prevKey) {
                        delete obj[prevKey][key];
                    }
                }
            }

            return obj;
        },
        // Edit method for AE
        editObjectAE: function(obj, prevKey, key, newKey, newVal) {
            if (prevKey === "") {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== key) {
                        this.editObjectAE(obj[i], prevKey, key, newKey);
                    } else if (i === key) {
                        if (newKey in obj) {
                            this.keyExistsError = true;
                            return obj;
                        }

                        if (newVal === "") {
                            obj[newKey] = obj[key];
                        } else {
                            obj[newKey] = newVal;
                        }

                        if (newKey !== key) {
                            delete obj[key];
                        }

                        break;
                    }
                }
            } else {
                for (let i in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    if (typeof obj[i] === "object" && i !== prevKey) {
                        this.editObjectAE(obj[i], prevKey, key, newKey);
                    } else if (i === prevKey) {
                        if (obj[prevKey] !== undefined) {
                            if (newKey in obj[prevKey]) {
                                this.keyExistsError = true;
                                return obj;
                            }
                        }

                        if (newVal === "") {
                            obj[prevKey][newKey] = obj[prevKey][key];
                        } else {
                            obj[prevKey][newKey] = newVal;
                        }

                        if (newKey !== key) {
                            delete obj[prevKey][key];
                        }
                        break;
                    }
                }
            }

            return obj;
        },

        // Clear element in the programme object
        clearField(key) {
            this.programme[key] = "";
        },

        // Create an information section
        createCard() {
            this.createCardDialog = true;
            this.iseAddItemKey = "";
            this.iseAddItemListOption = true;
        },

        // Create a new Year for the course
        createYear() {
            this.createYearDialog = true;
        },
        createNewYear() {
            let error = false;

            for (let item in this.programme["Programme Content"]) {
                if (item.includes(this.umeYear)) {
                    error = true;
                }
            }

            if (error) {
                this.yearError = true;
                this.resetUMEVariables();
                return;
            }

            let key = this.umeYear;
            if (this.umeCreditsMin !== "" || this.umeCreditsMax !== "") {
                if (this.umeCreditsMin !== "" && this.umeCreditsMax !== "") {
                    key +=
                        " (minimum " +
                        this.umeCreditsMin +
                        ", maximum " +
                        this.umeCreditsMax +
                        " credits)";
                } else {
                    key +=
                        " (" +
                        this.umeCreditsMin +
                        this.umeCreditsMax +
                        " credits)";
                }
            }

            this.programme["Programme Content"][key] = {};

            EventBus.$emit("reloadUME", true);

            this.resetUMEVariables();
        },

        // Create a new list item for postgrad course
        createList() {
            this.createListDialog = true;
        },
        createNewList() {
            if (this.pceNewKey in this.programme["Programme Content"]) {
                this.keyExistsError = true;
                this.resetPCEVariables();
                return;
            }

            this.programme["Programme Content"][this.pceNewKey] = {};

            EventBus.$emit("reloadPCE", true);

            this.resetPCEVariables();
        },

        // Methods for the information section dialogs
        iseAddItem(key) {
            this.iseAddItemDialog = true;
            this.iseAddItemKey = key;
        },
        iseEditItem(key) {
            this.iseEditItemDialog = true;
            this.iseEditItemKey = key;
            this.iseEditItemContent = key;
        },
        iseDeleteEntry(key) {
            this.programme = this.filterObject(this.programme, key);
            this.cards = this.infoCardsOnly(this.programme);
            EventBus.$emit("reloadISE", true);
        },
        changeListAmt(option) {
            if (option) {
                this.iseAddItemListItems.push("");
            } else {
                if (this.iseAddItemListItems.length > 0) {
                    this.iseAddItemListItems.pop();
                }
            }
        },
        iseResetAddItem() {
            if (this.iseAddItemKey === "") {
                this.createCardDialog = false;
            }

            this.iseAddItemDialog = false;
            this.iseAddItemKey = "";
            this.iseAddItemListOption = false;
            this.iseAddItemContent = "";
            this.iseAddItemListHeader = "";
            this.iseAddItemListItems = [""];
            this.cards = this.infoCardsOnly(this.programme);
        },
        iseConfirmAddItem() {
            if (this.iseAddItemListOption) {
                let newObj = {};

                while (this.iseAddItemListItems.length !== 0) {
                    newObj[this.iseAddItemListItems.pop()] = "text";
                }

                this.programme = this.addToObject(
                    this.programme,
                    this.iseAddItemKey,
                    this.iseAddItemListHeader,
                    newObj
                );
                this.cards = this.infoCardsOnly(this.programme);
            } else {
                this.programme = this.addToObject(
                    this.programme,
                    this.iseAddItemKey,
                    this.iseAddItemContent,
                    "text"
                );
                this.cards = this.infoCardsOnly(this.programme);
            }

            EventBus.$emit("reloadISE", true);

            this.iseResetAddItem();
        },
        iseConfirmEditItem() {
            this.programme = this.editObject(
                this.programme,
                this.iseEditItemKey,
                this.iseEditItemContent
            );
            this.cards = this.infoCardsOnly(this.programme);
            EventBus.$emit("reloadISE", true);
            this.iseResetEditItem();
        },
        iseResetEditItem() {
            this.iseEditItemDialog = false;
            this.iseEditItemKey = "";
            this.iseEditItemContent = "";
        },
        iseCancelEdit() {
            this.dialog = false;
            this.programme = this.deepCopy(this.programme_backup);
            this.cards = this.infoCardsOnly(this.programme);
        },

        // Methods for the undergrad course content dialogs
        umeAddItem(key, year, prev, type) {
            this.umeAddDialog = true;
            this.umeKey = key;
            this.umeYear = year;
            this.umePrevKey = prev;
            this.umeType = type;
        },
        umeEditItem(key, year, prev, type, value) {
            if (type === "Credits") {
                let numbers = key.match(/\d+/g);
                if (numbers.length === 2) {
                    this.umeCreditsMin = numbers[0];
                    this.umeCreditsMax = numbers[1];
                } else {
                    this.umeCreditsMin = "";
                    this.umeCreditsMax = numbers[0];
                }
            }

            this.umeEditDialog = true;
            this.umeKey = key;
            this.umeNewKey = key;
            this.umeYear = year;
            this.umePrevKey = prev;
            this.umeType = type;
            this.umeVal = value;
        },
        umeDeleteItem(key, year, prev) {
            if (year === prev) {
                if (year === "") {
                    this.programme["Programme Content"] = this.filterObjectUME(
                        this.programme["Programme Content"],
                        "",
                        key
                    );
                } else {
                    this.programme["Programme Content"][
                        year
                    ] = this.filterObjectUME(
                        this.programme["Programme Content"][year],
                        "",
                        key
                    );
                }
            } else {
                this.programme["Programme Content"][
                    year
                ] = this.filterObjectUME(
                    this.programme["Programme Content"][year],
                    prev,
                    key
                );
            }

            EventBus.$emit("reloadUME", true);
        },
        changeModulesAmt(option) {
            if (option) {
                this.umeAddModules.push({ modules: "", credits: "" });
            } else {
                if (this.umeAddModules.length > 0) {
                    this.umeAddModules.pop();
                }
            }
        },
        umeConfirmAddItem() {
            let addKey = "";
            let addContent = "";

            if (this.umeType === "List") {
                addKey = this.umeAddItemModel;
                addContent = {};
            }
            if (this.umeType === "Alert") {
                addKey = this.umeAddItemModel;
                addContent = "text";
            }
            if (this.umeType === "Credits") {
                if (this.umeCreditsMin === "" || this.umeCreditsMax === "") {
                    addKey =
                        "(credits = " +
                        this.umeCreditsMin +
                        this.umeCreditsMax +
                        ")";
                } else {
                    addKey =
                        "(credits = minimum " +
                        this.umeCreditsMin +
                        ", maximum " +
                        this.umeCreditsMax +
                        ")";
                }
                addContent = "text";
            }

            if (this.umeYear === "") {
                if (
                    addKey in this.programme["Programme Content"][this.umeKey]
                ) {
                    this.keyExistsError = true;
                } else {
                    this.programme["Programme Content"][this.umeKey][
                        addKey
                    ] = addContent;
                }
            } else {
                if (this.umeYear === this.umePrevKey) {
                    if (this.umeType === "Module") {
                        for (let i in this.umeAddModules) {
                            let addKey = this.umeAddModules[i]["modules"];
                            let addContent = this.umeAddModules[i]["credits"];

                            if (addKey === "" || addContent === "") continue;

                            this.programme[
                                "Programme Content"
                            ] = this.addToObjectUME(
                                this.programme["Programme Content"],
                                this.umePrevKey,
                                this.umeKey,
                                addKey,
                                addContent
                            );
                        }
                    } else {
                        this.programme[
                            "Programme Content"
                        ] = this.addToObjectUME(
                            this.programme["Programme Content"],
                            this.umePrevKey,
                            this.umeKey,
                            addKey,
                            addContent
                        );
                    }
                } else {
                    if (this.umeType === "Module") {
                        for (let i in this.umeAddModules) {
                            let addKey = this.umeAddModules[i]["modules"];
                            let addContent = this.umeAddModules[i]["credits;"];

                            if (addKey === "" || addContent === "") continue;

                            this.programme["Programme Content"][
                                this.umeYear
                            ] = this.addToObjectUME(
                                this.programme["Programme Content"][
                                    this.umeYear
                                ],
                                this.umePrevKey,
                                this.umeKey,
                                addKey,
                                addContent
                            );
                        }
                    } else {
                        this.programme["Programme Content"][
                            this.umeYear
                        ] = this.addToObjectUME(
                            this.programme["Programme Content"][this.umeYear],
                            this.umePrevKey,
                            this.umeKey,
                            addKey,
                            addContent
                        );
                    }
                }
            }

            EventBus.$emit("reloadUME", true);

            this.resetUMEVariables();
        },
        umeConfirmEditItem() {
            if (this.umeType !== "Credits") {
                if (this.umeYear === "") {
                    this.programme["Programme Content"] = this.editObjectUME(
                        this.programme["Programme Content"],
                        this.umePrevKey,
                        this.umeKey,
                        this.umeNewKey
                    );
                } else {
                    this.programme["Programme Content"][
                        this.umeYear
                    ] = this.editObjectUME(
                        this.programme["Programme Content"][this.umeYear],
                        this.umePrevKey,
                        this.umeKey,
                        this.umeNewKey
                    );
                }
            } else {
                let newKey;
                if (this.umeCreditsMin === "" || this.umeCreditsMax === "") {
                    newKey =
                        "(credits = " +
                        this.umeCreditsMin +
                        this.umeCreditsMax +
                        ")";
                } else {
                    newKey =
                        "(credits = minimum " +
                        this.umeCreditsMin +
                        ", maximum " +
                        this.umeCreditsMax +
                        ")";
                }

                if (this.umeYear === "") {
                    this.programme["Programme Content"] = this.editObjectUME(
                        this.programme["Programme Content"],
                        this.umePrevKey,
                        this.umeKey,
                        newKey
                    );
                } else {
                    this.programme["Programme Content"][
                        this.umeYear
                    ] = this.editObjectUME(
                        this.programme["Programme Content"][this.umeYear],
                        this.umePrevKey,
                        this.umeKey,
                        newKey
                    );
                }
            }

            EventBus.$emit("reloadUME", true);

            this.resetUMEVariables();
        },
        resetUMEVariables() {
            this.createYearDialog = false;
            this.umeAddDialog = false;
            this.umeEditDialog = false;
            this.umeType = "";
            this.umeVal = "";
            this.umeKey = "";
            this.umeYear = "";
            this.umePrevKey = "";
            this.umeAddItemModel = "";
            this.umeCreditsMin = "";
            this.umeCreditsMax = "";
            this.umeAddModules = [{ modules: "", credits: "" }];
        },

        // Methods for the postgrad course content dialogs
        pceRemoveModule(index) {
            for (let header in this.pceEditModules) {
                this.pceEditModules[header].splice(index, 1);
            }
        },
        pceAddModule() {
            for (let header in this.pceEditModules) {
                this.pceEditModules[header].push("");
            }
        },
        findTable: function(obj, prevKey) {
            for (let i in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                if (typeof obj[i] === "object" && i !== prevKey) {
                    this.findTable(obj[i], prevKey);
                } else if (i === prevKey) {
                    this.pceEditModules = this.getTable(obj[prevKey]);
                    return;
                }
            }
        },
        pceAddItem(key, prev, type) {
            this.pceAddDialog = true;
            this.pceKey = key;
            this.pcePrevKey = prev;
            this.pceType = type;
        },
        pceEditItem(root, key, prev, type) {
            if (type === "Credits") {
                let numbers = key.match(/\d+/g);
                if (numbers.length === 2) {
                    this.pceCreditsMin = numbers[0];
                    this.pceCreditsMax = numbers[1];
                } else {
                    this.pceCreditsMin = "";
                    this.pceCreditsMax = numbers[0];
                }
            }
            if (type === "Table") {
                if (root === prev)
                    this.pceEditModules = this.programme["Programme Content"][
                        root
                    ];
                else
                    this.findTable(
                        this.programme["Programme Content"][root],
                        prev
                    );
            }

            this.pceEditDialog = true;
            this.pceKey = key;
            this.pceNewKey = key;
            this.pceRoot = root;
            this.pcePrevKey = prev;
            this.pceType = type;
        },
        pceDeleteItem(key, prev) {
            if (prev === "") {
                this.programme["Programme Content"] = this.filterObjectPCE(
                    this.programme["Programme Content"],
                    "",
                    key
                );
            } else {
                this.programme["Programme Content"] = this.filterObjectPCE(
                    this.programme["Programme Content"],
                    prev,
                    key
                );
            }

            EventBus.$emit("reloadPCE", true);
        },
        getTable: function(obj) {
            let temp = {};

            for (let item in obj) {
                if (Array.isArray(obj[item])) {
                    temp[item] = obj[item];
                }
            }

            let table = {};
            let keys = Object.keys(temp).reverse();

            for (let item in keys) {
                table[keys[item]] = temp[keys[item]];
            }

            return table;
        },
        pceConfirmAddItem() {
            let addKey = "";
            let addContent = "";

            if (this.pceType === "List") {
                addKey = this.pceAddItemModel;
                addContent = {};
            }
            if (this.pceType === "Text") {
                addKey = this.pceAddItemModel;
                addContent = "text";
            }
            if (this.pceType === "Credits") {
                if (this.pceCreditsMin === "" || this.pceCreditsMax === "") {
                    addKey =
                        "(credits = " +
                        this.pceCreditsMin +
                        this.pceCreditsMax +
                        ")";
                } else {
                    addKey =
                        "(credits = minimum " +
                        this.pceCreditsMin +
                        ", maximum " +
                        this.pceCreditsMax +
                        ")";
                }
                addContent = "text";
            }

            if (this.pcePrevKey === "") {
                if (this.pceType === "Module") {
                    if (
                        Object.keys(
                            this.getTable(
                                this.programme["Programme Content"][this.pceKey]
                            )
                        ).length !== 0
                    ) {
                        for (let header in this.pceAddModules) {
                            for (let item in this.pceAddModules[header]) {
                                this.programme["Programme Content"][
                                    this.pceKey
                                ][header].push(
                                    this.pceAddModules[header][item]
                                );
                            }
                        }
                    } else {
                        for (let header in this.pceAddModules) {
                            this.programme["Programme Content"][this.pceKey][
                                header
                            ] = this.pceAddModules[header];
                        }
                    }
                } else {
                    if (
                        addKey in
                        this.programme["Programme Content"][this.pceKey]
                    ) {
                        this.keyExistsError = true;
                    } else {
                        this.programme["Programme Content"][this.pceKey][
                            addKey
                        ] = addContent;
                    }
                }
            } else {
                if (this.pceType === "Module") {
                    let addKey = "Modules";
                    let addContent = this.pceAddModules;

                    this.programme["Programme Content"] = this.addToObjectPCE(
                        this.programme["Programme Content"],
                        this.pcePrevKey,
                        this.pceKey,
                        addKey,
                        addContent
                    );
                } else {
                    this.programme["Programme Content"] = this.addToObjectPCE(
                        this.programme["Programme Content"],
                        this.pcePrevKey,
                        this.pceKey,
                        addKey,
                        addContent
                    );
                }
            }

            EventBus.$emit("reloadPCE", true);

            this.resetPCEVariables();
        },
        pceConfirmEditItem() {
            let newKey;
            if (this.pceType === "Credits") {
                if (this.pceCreditsMin === "" || this.pceCreditsMax === "") {
                    newKey =
                        "(credits = " +
                        this.pceCreditsMin +
                        this.pceCreditsMax +
                        ")";
                } else {
                    newKey =
                        "(credits = minimum " +
                        this.pceCreditsMin +
                        ", maximum " +
                        this.pceCreditsMax +
                        ")";
                }
            } else {
                newKey = this.pceNewKey;
            }

            if (this.pcePrevKey === "") {
                this.programme["Programme Content"] = this.editObjectPCE(
                    this.programme["Programme Content"],
                    this.pcePrevKey,
                    this.pceKey,
                    newKey
                );
            } else {
                if (this.pceType === "Table") {
                    if (this.pcePrevKey === this.pceRoot) {
                        for (let header in this.programme["Programme Content"][
                            this.pceRoot
                        ]) {
                            this.programme["Programme Content"][this.pceRoot][
                                header
                            ] = this.pceEditModules[header];
                        }
                    } else {
                        this.programme["Programme Content"][
                            this.pceRoot
                        ] = this.editObjectPCE(
                            this.programme["Programme Content"][this.pceRoot],
                            this.pcePrevKey,
                            this.pceKey,
                            "Table"
                        );
                    }
                } else {
                    if (this.pcePrevKey === this.pceRoot) {
                        this.programme[
                            "Programme Content"
                        ] = this.editObjectPCE(
                            this.programme["Programme Content"],
                            this.pcePrevKey,
                            this.pceKey,
                            newKey
                        );
                    } else {
                        this.programme["Programme Content"][
                            this.pceRoot
                        ] = this.editObjectPCE(
                            this.programme["Programme Content"][this.pceRoot],
                            this.pcePrevKey,
                            this.pceKey,
                            newKey
                        );
                    }
                }
            }

            EventBus.$emit("reloadPCE", true);

            this.resetPCEVariables();
        },
        resetPCEVariables() {
            this.createListDialog = false;
            this.pceAddDialog = false;
            this.pceEditDialog = false;
            this.pceType = "";
            this.pceKey = "";
            this.pceNewKey = "";
            this.pcePrevKey = "";
            this.pceAddItemModel = "";
            this.pceCreditsMin = "";
            this.pceCreditsMax = "";
            this.pceAddModules = {
                Credits: [""],
                "Module Code": [""],
                "Module Name": [""],
                Semester: [""],
                "Subject Number": [""]
            };
            this.pceEditModules = {};
        },
        setType: function(params) {
            if (params === "undergrad") {
                this.programme = {
                    "Programme Content": {},
                    degree: "",
                    programme: "",
                    stream: "",
                    option: ""
                };
                this.admission_requirements = {
                    avg: 0,
                    requirements: {}
                };
            } else {
                this.programme = {
                    "Programme Content": {},
                    degree: "",
                    department: "",
                    faculty: "",
                    credits: "",
                    module_code: "",
                    module_name: "",
                    subject_code: ""
                };
                this.admission_requirements = {};
            }

            this.programme_backup = this.deepCopy(this.programme);
        },
        aeAdd(key, prev, type) {
            this.aeAddDialog = true;
            this.aeKey = key;
            this.aePrevKey = prev;
            this.aeType = type;
        },
        aeEdit(key, prev, val, type) {
            this.aeEditDialog = true;
            this.aeKey = key;
            this.aeVal = val;
            this.aeNewVal = "";
            this.aeNewKey = key;
            this.aePrevKey = prev;
            this.aeType = type;
        },
        aeDeleteItem(key, prev) {
            this.admission_requirements = this.filterObjectAE(
                this.admission_requirements,
                prev,
                key
            );

            EventBus.$emit("reloadAE", true);
        },
        aeConfirmAddItem() {
            let addKey = "";
            let addContent = "";

            if (this.aeType === "List") {
                addKey = this.aeAddItemKey;
                addContent = {};
            }
            if (this.aeType === "Item") {
                addKey = this.aeAddItemKey;
                addContent = parseInt(this.aeAddItemVal);
            }

            if (this.aePrevKey === "") {
                if (addKey in this.admission_requirements[this.aeKey]) {
                    this.keyExistsError = true;
                } else {
                    this.admission_requirements[this.aeKey][
                        addKey
                    ] = addContent;
                }
            } else {
                this.admission_requirements = this.addToObjectAE(
                    this.admission_requirements,
                    this.aePrevKey,
                    this.aeKey,
                    addKey,
                    addContent
                );
            }

            EventBus.$emit("reloadAE", true);

            this.resetAEVariables();
        },
        aeConfirmEditItem() {
            let newKey = this.aeNewKey;
            let newVal = this.aeNewVal;

            if (newVal !== "") {
                newVal = parseInt(newVal);
            }

            if (newKey in this.admission_requirements) {
                this.keyExistsError = true;
            } else {
                this.admission_requirements = this.editObjectAE(
                    this.admission_requirements,
                    this.aePrevKey,
                    this.aeKey,
                    this.aeNewKey,
                    newVal
                );
            }

            EventBus.$emit("reloadAE", true);

            this.resetAEVariables();
        },
        resetAEVariables() {
            this.aeAddDialog = false;
            this.aeEditDialog = false;
            this.aeType = "";
            this.aeKey = "";
            this.aeNewKey = "";
            this.aePrevKey = "";
            this.aeAddItemKey = "";
            this.aeAddItemVal = "";
        },
        cancelAE() {
            this.resetAEVariables();
        },
        saveChanges() {
            const path = "https://isy-be.herokuapp.com/saveProgramme";

            axios
                .post(path, {
                    programme: this.programme,
                    backup: this.programme_backup,
                    programme_type: this.type,
                    admission_req: this.admission_requirements
                })
                .then(res => {
                    const result = {
                        type: this.type,
                        data: res.data.programme
                    };

                    sessionStorage.setItem(
                        "currentProgramme",
                        JSON.stringify(result)
                    );

                    EventBus.$emit("sendProgramme", result);
                    EventBus.$emit("updateProgramme", result);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        addProgramme() {
            const path = "https://isy-be.herokuapp.com/addProgramme";

            axios
                .post(path, {
                    programme: this.programme,
                    programme_type: this.type,
                    admission_req: this.admission_requirements
                })
                .then(res => {
                    const result = {
                        type: this.type,
                        data: res.data.programme
                    };

                    this.$router.replace("/programme");

                    sessionStorage.setItem(
                        "currentProgramme",
                        JSON.stringify(result)
                    );

                    EventBus.$emit("sendProgramme", result);
                    EventBus.$emit("updateProgramme", result);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },

    mounted() {
        EventBus.$on("showProgrammeEditor", res => {
            this.dialog = true;
            this.type = res.type;
            this.programme = this.deepCopy(res.programme);
            this.programme_backup = this.deepCopy(res.programme);
            this.cards = this.infoCardsOnly(this.programme);
            this.getAdmissionRequirements();
        });

        EventBus.$on("showAddProgramme", res => {
            this.chooseType = res;
            this.typeAddProgramme = res;
            if (this.type === "undergrad") {
                this.admission_requirements = { avg: 0, requirements: {} };
            } else {
                this.admission_requirements = {};
            }
        });

        // Event Listeners for Information Section Editor
        EventBus.$on("peISEAddItem", res => {
            this.iseAddItem(res);
        });
        EventBus.$on("peISEEditItem", res => {
            this.iseEditItem(res);
        });
        EventBus.$on("peISEDeleteEntry", res => {
            this.iseDeleteEntry(res);
        });

        // Event Listeners for Undergrad Modules Editor
        EventBus.$on("peUMEAddList", res => {
            this.umeAddItem(res.key, res.year, res.prev, "List");
        });
        EventBus.$on("peUMEAddAlert", res => {
            this.umeAddItem(res.key, res.year, res.prev, "Alert");
        });
        EventBus.$on("peUMEAddCredits", res => {
            this.umeAddItem(res.key, res.year, res.prev, "Credits");
        });
        EventBus.$on("peUMEAddModule", res => {
            this.umeAddItem(res.key, res.year, res.prev, "Module");
        });
        EventBus.$on("peUMEEditItem", res => {
            this.umeEditItem(res.key, res.year, res.prev, res.type, res.value);
        });
        EventBus.$on("peUMEDeleteItem", res => {
            this.umeDeleteItem(res.key, res.year, res.prev);
        });

        // Event Listeners for Postgrad Course Editor
        EventBus.$on("pePCEAdd", res => {
            this.pceAddItem(res.key, res.prev, res.type);
        });
        EventBus.$on("pePCEEditItem", res => {
            this.pceEditItem(res.root, res.key, res.prev, res.type);
        });
        EventBus.$on("pePCEDeleteItem", res => {
            this.pceDeleteItem(res.key, res.prev);
        });

        // Event Listeners for Admission Requirements Editor
        EventBus.$on("aeAddList", res => {
            this.aeAdd(res.key, res.prev, "List");
        });
        EventBus.$on("aeAddItem", res => {
            this.aeAdd(res.key, res.prev, "Item");
        });
        EventBus.$on("aeEditList", res => {
            this.aeEdit(res.key, res.prev, "", "List");
        });
        EventBus.$on("aeEditItem", res => {
            this.aeEdit(res.key, res.prev, res.val, "Item");
        });
        EventBus.$on("aeDeleteItem", res => {
            this.aeDeleteItem(res.key, res.prev);
        });
    }
};
</script>

<style scoped>
.test {
    height: 65vh !important;
    overflow-x: hidden;
    overflow-y: scroll;
    -ms-overflow-style: none;
}
</style>
