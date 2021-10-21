<template>
     <div class="p-5 page-container min-h-full">
        <md-table v-model="allRooms" md-sort-order="asc" md-card >
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title text-xl font-bold">Rooms</h1>
                </div>

                <div class="md-toolbar-section-end">
                    <md-field md-clearable>
                        <md-icon>search</md-icon>
                        <md-input placeholder="Search" v-model="search" @input="searchOnTable" />
                    </md-field>
                    <md-button class="md-primary md-raised" @click="onAddRoom">Add Room</md-button>
                </div>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id">{{ item.id }}</md-table-cell>
                <md-table-cell md-label="Title" md-sort-by="name">{{ item.title }}</md-table-cell>
                <md-table-cell md-label="Floor" md-sort-by="email">{{ item.floor }}</md-table-cell>
                <md-table-cell md-label="Status" >
                    <span v-if="item.status" class="status-enabled">Enabled</span>
                    <span v-else class="status-disabled">Disabled</span>
                </md-table-cell>
                <md-table-cell md-label="Action">
                    <md-button class="md-icon-button" @click="onViewRoom(item.id)">
                        <md-icon>info</md-icon>
                    </md-button>
                </md-table-cell>
            </md-table-row>
        </md-table>
        <CommonSpinner v-if="lazy == true"/>
        <md-snackbar :md-position="'center'" :md-duration="3000" :md-active.sync="showSuccessSnackbar" md-persistent>
            <span>Room status is successfully updated</span>
            <md-button class="md-primary" @click="showSuccessSnackbar = false">Dismiss</md-button>
        </md-snackbar>

        <!-------------------------- Room Detail ------------------------------->
        <md-drawer class="md-right w-6/12" :md-active.sync="showRoomDetails">
            <md-toolbar class="md-transparent" md-elevation="0">
                <span class="md-title">Room Details</span>
            </md-toolbar>

            <md-progress-bar md-mode="indeterminate" v-if="loadingRoomDetail"></md-progress-bar>
            <div v-else-if="selectedRoom != null">
                <div class="md-layout-md-gutter" style="position: relative">
                    <div class="md-layout-item md-layout md-gutter" ref="mapBox" id="mapBox">
                        <img src="/img/floor_1.jpeg" v-if="selectedRoom.floor == 'A_1'" class="w-full">
                        <img src="/img/floor_2.png" v-else  class="w-full">
                    </div>
                    <svg width="100%" height="100%" style="position: absolute; top:0; left:0" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                        <!-- <circle v-bind:cx=" selectedRoom.positionX + '%' " v-bind:cy=" selectedRoom.positionY + '%' " r="40" stroke="green" stroke-width="4" /> -->
                        <polygon v-bind:points="selectedRoom.points" style="fill:none;stroke:red;stroke-width:2" />
                        <text :x=" selectedRoom.positionX + '%' " :y=" selectedRoom.positionY + '%' " fill="red">{{ selectedRoom.title }}</text>
                        Sorry, your browser does not support inline SVG.
                    </svg> 
                </div>
                <div class="md-layout-md-gutter m-5">
                    <md-table md-card>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Title</md-table-cell>
                            <md-table-cell class="text-base">{{ selectedRoom.title }}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Floor</md-table-cell>
                            <md-table-cell class="text-base">{{ selectedRoom.floor }}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Status</md-table-cell>
                            <md-table-cell class="text-base">
                                <md-switch v-model="selectedRoom.status" class="md-primary" @change="onStateChanged(selectedRoom.id, selectedRoom.status)"></md-switch>
                            </md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Booked meeting(s)</md-table-cell>
                            <md-table-cell class="text-base">{{ selectedRoom.scheduleCountBooked }}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">In meeting(s)</md-table-cell>
                            <md-table-cell class="text-base">{{ selectedRoom.scheduleCountInmeeting }}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Past meeting(s)</md-table-cell>
                            <md-table-cell class="text-base">{{ selectedRoom.scheduleCountCompleted }}</md-table-cell>
                        </md-table-row>
                    </md-table>
                </div>
                <!-- <div class="md-layout md-gutter">
                    <div class="md-layout-item md-layout md-gutter">
                        <md-button class="md-raised md-primary">Update</md-button>
                    </div>
                </div> -->
            </div>
        </md-drawer>
        <!-------------------------- End Room Detail --------------------------->

        <!-------------------------- Add Room ------------------------------->
        <md-dialog :md-active.sync="showRoomAddDialog">
            <md-dialog-title>Add New Room</md-dialog-title>
            <div class="p-5">
                <div class="md-layout">
                    <div class="md-layout-item md-size-66">
                        <div class="flex flex-row-reverse">
                            <md-button class="md-icon-button md-raised md-accent ml-auto" @click="roomCreateForm.points = ''">
                                <md-icon>clear</md-icon>
                            </md-button>
                        </div>
                        <div class="relative" ref="FloorImage">
                            <img src="/img/floor_1.jpeg" v-if="roomCreateForm.floor == 1" class="w-full">
                            <img src="/img/floor_2.png" v-else  class="w-full">
                            <svg width="100%" height="100%" class="absolute top-0 left-0" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                                <polyline :points="roomCreateForm.points" style="fill:none;stroke:red;stroke-width:2" />
                            </svg>
                            <div class="absolute w-full h-full top-0 left-0" 
                                @click="onDrawRoomClick($event)"/>
                        </div>
                    </div>
                    <div class="md-layout-item md-size-33 md-card p-5">
                        <div class="md-layout">
                            <md-field :class="getValidationClass('title')">
                                <label>Title</label>
                                <md-input v-model="roomCreateForm.title"></md-input>
                                <span class="md-error" v-if="!$v.roomCreateForm.title.requried">The title is required</span>
                            </md-field>
                        </div>
                        <div class="md-layout mt-5">
                            <md-field class="">
                                <label for="movie">Floor</label>
                                <md-select v-model="roomCreateForm.floor">
                                    <md-option value="1">1</md-option>
                                    <md-option value="2">2</md-option>
                                </md-select>
                            </md-field>
                        </div>
                        <div class="md-layout mt-5">
                            <md-switch class="md-primary" v-model="roomCreateForm.status">Status</md-switch>
                        </div>
                    </div>
                </div>
            </div>
            <md-dialog-actions>
                <md-button class="md-primary" @click="showRoomAddDialog = false">Close</md-button>
                <md-button class="md-primary" @click="onAddRoomConfirm">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
        <!-------------------------- End Add Room --------------------------->
    </div>
    
</template>

<script>
    import gql from 'graphql-tag';
    import {
        required,
    } from 'vuelidate/lib/validators'

    const toLower = text => {
        return text.toString().toLowerCase()
    }

    const searchByName = (items, term) => {
        if (term) {
        return items.filter(item => toLower(item.title).includes(toLower(term)))
        }
        return items
    }

    const GetRoomDetail = gql`
        query GetRoomDetail($id:Int) {
            getRoomDetail(id:$id) {
                id
                title
                floor
                positionX
                positionY
                points
                scheduleCountCompleted
                scheduleCountBooked
                scheduleCountInmeeting
                status
            }
        }
    `

    const CreateRoomMutation = gql`
        mutation createRoom($title:String!, $floor:Int, $status:Boolean, $points:String) {
            createRoom(title:$title, floor:$floor, status:$status, points:$points) {
                success
            }
        }
    `

    export default {
        name: "RoomManageComponent",
        data: () => ({
            search: null,
            searched: [],
            allRooms: [],
            showMap: false,
            lazy: false,
            showSuccessSnackbar: false,
            showRoomDetails : false,
            loadingRoomDetail : false,
            selectedRoom : null,
            points: [],
            showRoomAddDialog : false,
            roomCreateForm : {
                title : "",
                floor : 1,
                status : true,
                points : ""
            },
        }),
        methods: {
            getValidationClass (fieldName) {
                const field = this.$v.roomCreateForm[fieldName]

                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            onAddRoom() {
                this.roomCreateForm = {
                    title : "",
                    floor : 1,
                    status : true,
                    points : ""
                }
                this.showRoomAddDialog = true
            },
            onAddRoomConfirm() {
                this.$v.roomCreateForm.$touch()
                if(!this.$v.roomCreateForm.$invalid) {
                    this.$apollo.mutate({
                        mutation: CreateRoomMutation,
                        variables : {
                            title: this.roomCreateForm.title,
                            floor: this.roomCreateForm.floor,
                            status: this.roomCreateForm.status,
                            points: this.roomCreateForm.points
                        }
                    }).then(res=> {
                        console.log(res)
                        this.showRoomAddDialog = false
                        this.$apollo.queries.allRooms.refresh()
                    }).catch(err => {
                        console.log(err.message)
                    })
                }
            },
            onDrawRoomClick($e) {
                let width = this.$refs.FloorImage.clientWidth
                let height = this.$refs.FloorImage.clientHeight
                let x = $e.offsetX / width * 1000
                let y = $e.offsetY / height * 1000

                this.roomCreateForm.points += ` ${x},${y}`
            },
            newUser () {
                window.alert('Noop')
            },
            searchOnTable () {
                this.searched = searchByName(this.allRooms, this.search)
            },
            onViewRoom(roomId) {
                this.showRoomDetails = true
                this.loadingRoomDetail = true
                this.$apollo.query({
                    query: GetRoomDetail,
                    variables : {
                        id : roomId
                    },
                }).then(res => {
                    this.loadingRoomDetail = false
                    this.selectedRoom = res.data.getRoomDetail
                    console.log(this.selectedRoom)
                }).catch(err => {
                    console.log(err)
                })
            },
            onStateChanged(id, status) {
                
                this.lazy = true
                this.$apollo.mutate({
                    mutation: gql` mutation changeRoomStatus ($id:Int!, $status:Boolean){
                        changeRoomStatus(id:$id, status:$status) {
                            success
                        }
                    }
                    `,
                    variables: {
                        id: id,
                        status: status
                    }
                }).then( res => {
                    this.lazy = false
                    this.showSuccessSnackbar = true
                    this.$apollo.queries.allRooms.refresh()
                    console.log(res)
                }).catch( err => {
                    this.lazy = false
                    console.log(err)
                })
            }
        },
        validations : {
            roomCreateForm : {
                title : {
                    required,
                }
            }
        },
        created () {
            this.searched = []
        },
        computed : {
            mapWidth() {
                return this.$refs.mapBox == undefined ? 0 : this.$refs.mapBox.clientWidth
            },
            mapHeight() {
                return this.$refs.mapBox == undefined ? 0 : this.$refs.mapBox.clientHeight
            }
        },
        filters : {
            polyline(points) {
                let result = ""
                points.forEach(point => {
                    result += ` ${point.x},${point.y}`
                })

                return result
            }
        },
        apollo: {
            allRooms: {
                query: gql`query allRooms {
                    allRooms {
                        id
                        title
                        floor
                        status
                    }
                }`,
                update: data => {
                    console.log(data)
                    return data['allRooms']
                },
                fetchPolicy: 'network-only'
            }
        }
    }
</script>

<style scoped>
    .page-container {
        min-height: 300px;
        overflow: hidden;
        position: relative;
        border: 1px solid rgba(#000, .12);
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
</style>