<template>
    <div class="m-5">
        <!-- <carousel :perPage=1 >
            <slide>
                <div class="stair-img-container">
                    <img src="/img/office_background.jpg">
                    <h1 class="stair-title w-full">Stair 1</h1>
                </div>
            </slide>
            <slide>
                <div class="stair-img-container">
                    <img src="/img/office_background.jpg">
                    <h1 class="stair-title w-full">Stair 2</h1>
                </div>
            </slide>
        </carousel> -->
        <md-card class="p-5">
            <div class="md-layout md-gutter">
                <div class="md-layout-item">
                    <div class="text-lg font-bold">Meeting Date:</div>
                    <div>
                        <date-picker type="date" v-model="meeting.date" value-type="format" format="YYYY-MM-DD" :disabled=false></date-picker>
                    </div>
                </div>
                <div class="md-layout-item">
                    <div class="text-lg font-bold">From:</div>
                    <div>
                        <date-picker type="time" v-model="meeting.startTime" value-type="format" format="HH:mm" :minute-step=10>
                            <template v-slot:icon-calendar>
                                <md-icon>schedule</md-icon>
                            </template>
                        </date-picker>
                    </div>
                </div>
                <div class="md-layout-item">
                    <div class="text-lg font-bold">To:</div>
                    <div>
                        <date-picker type="time" v-model="meeting.endTime" value-type="format" format="HH:mm" :minute-step=10>
                            <template v-slot:icon-calendar>
                                <md-icon>schedule</md-icon>
                            </template>
                        </date-picker>
                    </div>
                </div>
                <div class="md-layout-item flex items-end">
                    <md-button class="md-raised md-primary mt-auto" @click="onFindSite" :disabled="!meeting.filled()">
                        <md-icon>search</md-icon>
                        Find Room
                    </md-button>
                </div>
            </div>
        </md-card>
        <md-card class="mt-5 mb-5">
            <md-card-header>
                <div class="md-title">Available Room(s)</div>
            </md-card-header>
            <md-card-content>
                <md-table class="" v-model="allRooms">
                    <md-table-empty-state
                        md-label="No room found"
                        :md-description="''">
                    </md-table-empty-state>
                    <md-table-row slot="md-table-row" slot-scope="{ item, index }" class="md-primary">
                        <md-table-cell md-label="SN" md-sort-by="name">{{ index + 1 }}</md-table-cell>
                        <md-table-cell md-label="Title" md-sort-by="email">{{ item.title }}</md-table-cell>
                        <md-table-cell md-label="Floor" md-sort-by="email">{{ item.floor }}</md-table-cell>
                        <md-table-cell md-label="Action">
                            <md-button class="md-icon-button" @click="selectedRoom = item; showRoomDetails = true">
                                <md-icon>info</md-icon>
                            </md-button>
                        </md-table-cell>
                    </md-table-row>
                </md-table>
            </md-card-content>
            <!-- <md-card-actions>
                <md-button class="md-accent" @click="reset">Reset</md-button>
                <md-button class="md-primary" @click="book">Proceed</md-button>
            </md-card-actions> -->
        </md-card>
        <md-snackbar :md-position="'center'" :md-duration="3000" :md-active.sync="snackbar.show" md-persistent>
            <span>{{ snackbar.message }}</span>
            <md-button class="md-primary" @click="snackbar.show = false">Dismiss</md-button>
        </md-snackbar>

        <md-drawer class="md-right w-6/12" :md-active.sync="showRoomDetails" :md-fixed="true">
            <md-toolbar class="md-transparent" md-elevation="0">
                <span class="md-title">Room Details</span>
            </md-toolbar>
            <div v-if="selectedRoom != null">
                <div class="md-layout-md-gutter" style="position: relative">
                    <div class="md-layout-item md-layout md-gutter" ref="mapBox" id="mapBox">
                        <img src="/img/floor_1.jpeg" v-if="selectedRoom.floor == 'A_1'" class="w-full">
                        <img src="/img/floor_2.png" v-else  class="w-full">
                    </div>
                    <svg width="100%" height="100%" style="position: absolute; top:0; left:0" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                        <!-- <circle v-bind:cx=" selectedRoom.positionX + '%' " v-bind:cy=" selectedRoom.positionY + '%' " r="40" stroke="green" stroke-width="4" /> -->
                        <polygon v-bind:points="selectedRoom.points" style="fill:none;stroke:red;stroke-width:2" />
                        
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
                                <span v-if="selectedRoom.status" class="status-enabled">Enabled</span>
                                <span v-else class="status-disabled">Disabled</span>
                            </md-table-cell>
                        </md-table-row>
                    </md-table>
                </div>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-layout md-gutter m-5 flex flex-row-reverse">
                        <md-button class="md-raised md-primary m-5" @click="book()">Book Meeting</md-button>
                    </div>
                </div>
            </div>
        </md-drawer>
    </div>
</template>
<script>
const moment = require('moment')
import gql from 'graphql-tag'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import { getProfile } from '@/common/service/auth'

const GetAvailableRooms = gql`
    query allRooms($startDate:String!, $endDate:String!) {
        getAvailableRooms(startDate:$startDate, endDate:$endDate) {
            id
            title
            floor
            status
            points
        }
    }
`

const BookMeetingMutation = gql`
    mutation bookMeeting($startDate:String!, $endDate:String!, $roomId:Int, $userId:Int) {
        bookMeeting(startDate:$startDate, endDate:$endDate, roomId:$roomId, userId:$userId) {
            success
        }
    }
`

export default {
    name: "BookingComponent",
    components: {
        DatePicker
    },
    data() {
        return {
            moment: moment,
            startDate: "",
            endDate: "",
            selectedRoom: null,
            showRoomDetails : false, 

            allRooms : [],
            meeting : {
                date: null,
                startTime: null,
                endTime: null,
                filled : () => {
                    return !(this.meeting.date == null || this.meeting.startTime == null || this.meeting.endTime == null)
                }
            },
            snackbar : {
                show : false,
                message : ""
            }
        }
    },
    methods: {
        onFindSite() {
            console.log(this.meeting)
            if(this.meeting.filled()) {
                this.$apollo.query({
                    query: GetAvailableRooms,
                    variables: {
                        startDate: moment(`${this.meeting.date} ${this.meeting.startTime}`, "YYYY-MM-DD HH:mm").tz("America/New_York", true).format(),
                        endDate: moment(`${this.meeting.date} ${this.meeting.endTime}`, "YYYY-MM-DD HH:mm").tz("America/New_York", true).format(),
                    }
                }).then(({data, loading, network}) => {
                    console.log(data, loading, network)
                    this.allRooms = data.getAvailableRooms
                }).catch(err => {
                    console.log(err)
                })
            } else {
                this.allRooms = []
            }
        },
        onRoomSelect(item) {
            this.selectedRoom = item.id
        },
        book() {
            this.$apollo.mutate({
                mutation: BookMeetingMutation,
                variables: {
                    startDate: moment(`${this.meeting.date} ${this.meeting.startTime}`, "YYYY-MM-DD HH:mm").tz("America/New_York", true).format(),
                    endDate: moment(`${this.meeting.date} ${this.meeting.endTime}`, "YYYY-MM-DD HH:mm").tz("America/New_York", true).format(),
                    roomId : this.selectedRoom.id,
                    userId : getProfile().id
                },
            }).then( res => {
                console.log(res)
                this.snackbar.message = "Your meeting is successfully scheduled"
                this.snackbar.show = true
            }).catch( err => {
                console.log(err)
                this.snackbar.message = "Something went wrong. Try again please"
                this.snackbar.show = true
            })
        },
        reset() {
            this.startDate = ""
            this.endDate = ""
            this.allRooms = []
        },
    },
    watch: {
    }
}
</script>

<style scoped>
    .page-container {
        min-height: 100%;
        overflow: hidden;
        position: relative;
        border: 1px solid rgba(#000, .12);
    }
    .stair-img-container {
        position: relative;
        text-align: center;
    }
    .stair-title {
        position: absolute;
        bottom :20px;
        font-weight: bold;
        color: white;
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