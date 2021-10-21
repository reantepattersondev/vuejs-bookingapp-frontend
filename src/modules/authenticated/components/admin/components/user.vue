<template>
    <div class="p-5 page-container">
        <md-table v-model="allMembers" md-sort-order="asc" md-card>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                    <h1 class="md-title text-xl font-bold">Users</h1>
                </div>

                <div class="md-toolbar-section-end">
                    <md-field md-clearable class="w-6/12">
                        <md-icon>search</md-icon>
                        <md-input placeholder="Search" />
                    </md-field>
                    <md-button class="md-primary md-raised" @click="onAddNewUser">
                        Add User
                    </md-button>
                </div>
                
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item, index }">
                <md-table-cell md-label="ID" md-sort-by="id">{{ index+1 }}</md-table-cell>
                <md-table-cell md-label="Name" md-sort-by="name">{{ item.username }}</md-table-cell>
                <md-table-cell md-label="Email" md-sort-by="name">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="Role" md-sort-by="name">
                    {{ item.profile | userRoleName }}
                </md-table-cell>
                <md-table-cell md-label="Status" md-sort-by="name">
                    <span v-if="item.isActive" class="status-enabled">
                        Actived
                    </span>
                    <span v-else class="status-disabled">
                        Disabled
                    </span>
                </md-table-cell>
                <md-table-cell md-label="Last Login" md-sort-by="email">{{ item.lastLogin | moment("timezone", "America/New_York", "YYYY/MM/DD HH:mm") }}</md-table-cell>
                <md-table-cell md-label="Action" md-sort-by="email">
                    <md-button class="md-icon-button" @click="onEditUser(index)">
                        <md-icon>edit</md-icon>
                    </md-button>
                </md-table-cell>
            </md-table-row>
        </md-table>
        <!-- <v-pagination v-model="currentPage" :page-count="30" class="none"></v-pagination> -->

        <CommonSpinner v-if="lazy == true"/>
        <md-snackbar :md-position="'center'" :md-duration="3000" :md-active.sync="snackbar.show" md-persistent>
            <span>{{ snackbar.message }}</span>
            <md-button class="md-primary" @click="snackbar.show = false">Dismiss</md-button>
        </md-snackbar>

        <!--Edit User Sidebar-->
        <md-drawer class="md-right w-6/12" :md-active.sync="userEditSidebarShow" :md-fixed="true">
            <form>
                <md-toolbar class="md-transparent" md-elevation="0">
                    <span class="md-title" v-if="userForm.id == '0'">Create User</span>
                    <span class="md-title" v-else>Edit User</span>
                </md-toolbar>

                <!-- <md-progress-bar md-mode="indeterminate" v-if="loadingScheduleDetail"></md-progress-bar> -->
                <div >
                    <div class="md-layout-md-gutter">
                        <div class="md-layout-item md-layout md-gutter">
                        </div>
                    </div>
                    <div class="md-layout m-5">
                        <div class="md-layout-item md-gutter">
                            <md-field :class="getValidationClass('username')">
                                <label>Username</label>
                                <md-input v-model="userForm.username" :maxlength="20"></md-input>
                                <span class="md-error" v-if="!$v.userForm.username.required">The username is required</span>
                                <span class="md-error" v-else-if="!$v.userForm.username.minlength">Required more than 3 characters</span>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout m-5">
                        <div class="md-layout-item md-gutter">
                            <md-field :class="getValidationClass('email')">
                                <label>Email</label>
                                <md-input v-model="userForm.email" :maxlength="20"></md-input>
                                <span class="md-error" v-if="!$v.userForm.email.required">The email is required</span>
                                <span class="md-error" v-else-if="!$v.userForm.email.email">Required email format</span>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout m-5">
                        <div class="md-layout-item md-gutter">
                            <md-field>
                                <label>Role</label>
                                <md-select v-model="userForm.role">
                                    <md-option value="0">Admin</md-option>
                                    <md-option value="1">User</md-option>
                                </md-select>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout m-5">
                        <div class="md-layout-item md-gutter">
                            <md-switch v-model="userForm.status" class="md-primary">User Status</md-switch>
                        </div>
                    </div>
                    <div class="md-layout m-5" v-if="userForm.id != 0">
                        <div class="md-layout-item md-gutter">
                            <md-checkbox v-model="userForm.updatePassword" value="1">Update password?</md-checkbox>
                        </div>
                    </div>
                    <div class="md-layout m-5" v-if="userForm.updatePassword || userForm.id == 0">
                        <div class="md-layout-item md-gutter">
                            <md-field :class="getValidationClass('password')">
                                <label>Password</label>
                                <md-input type="password" v-model="userForm.password" :maxlength="20"></md-input>
                                <span class="md-error" v-if="!$v.userForm.password.required">The password is required</span>
                                <span class="md-error" v-else-if="!$v.userForm.password.minlength">Required more than 6 characters</span>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout m-5" v-if="userForm.updatePassword || userForm.id == 0">
                        <div class="md-layout-item md-gutter">
                            <md-field :class="getValidationClass('confirmPassword')">
                                <label>Confirm Password</label>
                                <md-input type="password" v-model="userForm.confirmPassword" :maxlength="20"></md-input>
                                <span class="md-error" v-if="!$v.userForm.confirmPassword.sameAsPassword">The password is not matched</span>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-layout md-gutter m-5 flex flex-row-reverse">
                            <md-button v-if="userForm.id != 0" class="md-raised md-primary m-5" @click="onEditUserConfirm()">Update</md-button>
                            <md-button v-else class="md-raised md-primary m-5" @click="onAddNewUserConfirm()">Create</md-button>
                        </div>
                    </div>
                </div>
            </form>
        </md-drawer>
        <!--End Edit User Sidebar-->
    </div>
</template>

<script>
import gql from 'graphql-tag';
import {
    required,
    email,
    minLength,
    sameAs
} from 'vuelidate/lib/validators'
// import vPagination from 'vue-plain-pagination'

const UserQuery = gql` query allMembers{
    allMembers {
        id
        username
        lastLogin
        email
        isActive
        profile {
            role
        }
    }
}
`
const CreateUserMutation = gql` mutation createNewUser ($username:String!, $email:String!, $role:Int!, $password:String!, $status:Boolean) {
    createNewUser(username:$username, email:$email, role:$role, password:$password, status:$status) {
        success
    }
}
`
const EditUserMutation = gql` mutation updateUser ($id:Int!, $username:String!, $email:String!, $role:Int!, $password:String!, $updatePassword:Boolean, $status:Boolean) {
    updateUser (id:$id, username:$username, email:$email, role:$role, password:$password, status:$status, updatePassword:$updatePassword) {
        success
    }
}
`

export default {
    name: "UserManageComponent",
    // components: { vPagination },
    data : () => {
        return {
            allMembers: [],
            userDialogShow: false,
            userEditDialogShow: false,
            lazy : false,
            currentPage: 1,
            snackbar: {
                show: false,
                message: "",
            },
            userForm : {
                id: '0',
                role: 0,
                username : "",
                email : "",
                status: true,
                password : "",
                confirmPassword : "",
                updatePassword: true
            },
            bootstrapPaginationClasses: {
                ul: 'pagination',
                li: 'page-item',
                liActive: 'active',
                liDisable: 'disabled',
                button: 'page-link'  
            },
            userEditSidebarShow: false
        }
    },
    validations() {
        if(this.userForm.updatePassword) {
            return {
                userForm : {
                    username : {
                        required,
                        minLength: minLength(3)
                    },
                    email : {
                        required,
                        email
                    },
                    password : {
                        required,
                        minLength: minLength(6)
                    },
                    confirmPassword : {
                        sameAsPassword : sameAs('password')
                    }
                }
            }
        } else {
            return {
                userForm : {
                    username : {
                        required,
                        minLength: minLength(3)
                    },
                    email : {
                        required,
                        email
                    }
                }
            }
        }
        
    },
    methods:{
        getValidationClass (fieldName) {
            const field = this.$v.userForm[fieldName]

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        onAddNewUser() {
            this.userForm = {
                id: 0,
                role: 0,
                username : "",
                email : "",
                status: true,
                password : "",
                confirmPassword : "",
                updatePassword : true
            }
            this.userEditSidebarShow = true
        },
        onAddNewUserConfirm() {
            this.$v.$touch()
            console.log(this.$v.userForm)

            if(!this.$v.userForm.$invalid) {
                this.lazy = true
                console.log(this.userForm)
                this.$apollo.mutate({
                    mutation: CreateUserMutation,
                    variables: {
                        username    : this.userForm.username,
                        email       : this.userForm.email,
                        role        : this.userForm.role,
                        password    : this.userForm.password,
                        status      : this.userForm.status
                    }
                }).then( res => {
                    this.lazy = false
                    this.userDialogShow = false
                    this.snackbar.message = "User created successfully."
                    this.snackbar.show = true
                    this.$apollo.queries.allMembers.refresh()
                    console.log(res)
                }).catch( error => {
                    console.log(error.graphQLErrors)
                })
            }
        },
        onEditUser(index) {
            const user = this.allMembers[index]
            console.log(this.allMembers)
            this.userForm = {
                id: user.id,
                role: user.profile.role == "A_1" ? 0 : 1,
                username : user.username,
                email : user.email,
                status: user.isActive,
                password : "",
                confirmPassword : "",
                updatePassword : false
            }
            this.userEditSidebarShow = true
            console.log(this.userForm)
        },
        onEditUserConfirm() {
            this.$v.$touch()
            console.log(this.$v.userForm)

            if(!this.$v.userForm.$invalid) {
                this.$apollo.mutate({
                    mutation: EditUserMutation,
                    variables: {
                        id: this.userForm.id,
                        username: this.userForm.username,
                        email: this.userForm.email,
                        password: this.userForm.password,
                        role: this.userForm.role,
                        status: this.userForm.status,
                        updatePassword: this.userForm.updatePassword
                    }
                }).then( res => {
                    console.log(res)
                    this.$apollo.queries.allMembers.refresh()
                    this.userEditDialogShow = false
                }).catch( err => {
                    console.log(err)
                })
            }
        },
    },
    filters: {
        userRoleName(profile) {
            if(profile.role == "A_1") {
                return "Admin"
            } else if(profile.role == "A_2") {
                return "User"
            } else {
                return ""
            }
        }
    },
    apollo: {
        allMembers : {
            query: UserQuery,
            update(data) {
                console.log(data)
                return data.allMembers
            },
            fetchPolicy: 'network-only'
        }
    }
}
</script>

<style scoped>
    .dialog-content {
        min-width: 50vw;
    }
    .status-enabled {
        background-color: #448aff;
        color: white;
        padding: 5px;
        border-radius: 2px;
    }
    .status-disabled {
        background-color: orangered;
        color: white;
        padding: 5px;
        border-radius: 2px;
    }
    .page-container {
        min-height: 100%;
        overflow: hidden;
        position: relative;
        border: 1px solid rgba(#000, .12);
    }
</style>