<template>
    <div class="p-5 page-container">
        <div class="flex justify-between">
            <label class="text-xl font-bold">Schedule(s)</label>
            <md-tabs class="" md-alignment="centered" @md-changed="onTabChanged">
                <md-tab id="tab-table" md-label="BY TABLE"></md-tab>
                <md-tab id="tab-timeline" md-label="BY TIMELINE"></md-tab>
            </md-tabs>
        </div>
        <div v-if="seeBy == 0" class="mt-5">
            <md-table v-model="fileteredSchedules" md-sort-order="asc" md-card md-fixed-header>
                <md-table-toolbar>
                    <div class="md-toolbar-section-start">
                        <md-field class="w-24">
                            <md-select placeholder="Per page" v-model="pagenation.perpage">
                                <md-option value="1">1</md-option>
                                <md-option value="2">2</md-option>
                                <md-option value="10">10</md-option>
                                <md-option value="25">25</md-option>
                                <md-option value="50">50</md-option>
                                <md-option value="100">100</md-option>
                            </md-select>
                        </md-field>
                    </div>

                    <md-field md-clearable class="md-toolbar-section-end">
                        <md-input placeholder="Search by ..."  v-model="pagenation.search"/>
                    </md-field>
                </md-table-toolbar>
                <md-table-empty-state
                    md-label="No schedule found">
                </md-table-empty-state>
                
                <md-table-row slot="md-table-row" slot-scope="{ item, index }">
                    <md-table-cell md-label="ID" md-numeric>{{ index + 1 + pagenation.perpage * (pagenation.page - 1)}}</md-table-cell>
                    <md-table-cell md-label="Date" md-sort-by="startDate">{{ item.startDate | moment("timezone", "America/New_York", "YYYY/MM/DD") }}</md-table-cell>
                    <md-table-cell md-label="From" >{{ item.startDate | moment("timezone", "America/New_York", "HH:mm") }}</md-table-cell>
                    <md-table-cell md-label="To" >{{ item.endDate | moment("timezone", "America/New_York", "HH:mm") }}</md-table-cell>
                    <md-table-cell md-label="Room" md-sort-by="roomId.title">{{ item.roomId.title }}</md-table-cell>
                    <md-table-cell md-label="Status">
                        <span class="ended-meeting" v-if="getStatus(item) == 1">{{ item.endDate | moment("from")}}</span>
                        <span class="upcoming-meeting" v-else-if="getStatus(item) == 2">{{ item.startDate | moment("from")}}</span>
                        <span class="in-meeting" v-else>In Meeting</span>
                    </md-table-cell>
                    <md-table-cell md-label="Owner" md-sort-by="userId.username">{{ item.userId.username }}</md-table-cell>
                    <md-table-cell md-label="Action">
                        <md-button class="md-icon-button" @click="selectedSchedule = item; showScheduleDetail = true">
                            <md-icon>info</md-icon>
                        </md-button>
                        <md-button class="md-icon-button" @click="selectedSchedule = item; showDelSchedule = true">
                            <md-icon>delete</md-icon>
                        </md-button>
                    </md-table-cell>
                </md-table-row>
            </md-table>
            <v-pagination v-if="pagenation.total > 0" v-model="pagenation.page" :page-count="pagenation.total/pagenation.perpage | ceil" class="none"></v-pagination>
        </div>

        <div v-else>
            <div>
                <div class="flex justify-between mt-5">
                    <md-datepicker v-model="date"  md-immediately  class="w-80" :md-model-type="String"/>
                    <div>
                        <md-radio v-model="seeTimelineBy" value=0 class="md-primary">By User</md-radio>
                        <md-radio v-model="seeTimelineBy" value=1 class="md-primary">By Room</md-radio>
                    </div>
                </div>
            </div>
            <md-card class="mt-5">
                <TimeLine :schedules="schedulesOfDay" v-if="schedulesOfDay.length > 0" v-on:onScheduleClick="onScheduleClick($event)" />
                <md-empty-state v-else
                    md-icon="devices_other"
                    md-label="Create your first project"
                    md-description="Creating project, you'll be able to upload your design and collaborate with people.">
                    <md-button class="md-primary md-raised">Create first project</md-button>
                </md-empty-state>
            </md-card>
        </div>
        <md-dialog-confirm
            :md-active.sync="showDelSchedule"
            md-title="Delete Schedule"
            md-content="Are you sure to delete selected schedule?"
            md-confirm-text="Delete"
            md-cancel-text="Cancel"
            @md-cancel="showDelSchedule = false"
            @md-confirm="onRemoveSchedule()" />
        
        <!--Schedule Detail Sidebar-->
        <md-drawer class="md-right w-6/12" :md-active.sync="showScheduleDetail">
            <md-toolbar class="md-transparent" md-elevation="0">
                <span class="md-title">Schedule Details</span>
            </md-toolbar>

            <md-progress-bar md-mode="indeterminate" v-if="loadingScheduleDetail"></md-progress-bar>
            <div v-else-if="selectedSchedule != null">
                <div class="md-layout-md-gutter">
                    <div class="md-layout-md-gutter" style="position: relative">
                    <div class="md-layout-item md-layout md-gutter" ref="mapBox" id="mapBox">
                        <img src="/img/floor_1.jpeg" v-if="selectedSchedule.roomId.floor == 'A_1'" class="w-full">
                        <img src="/img/floor_2.png" v-else  class="w-full">
                    </div>
                    <svg width="100%" height="100%" style="position: absolute; top:0; left:0" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                        <!-- <circle v-bind:cx=" selectedRoom.positionX + '%' " v-bind:cy=" selectedRoom.positionY + '%' " r="40" stroke="green" stroke-width="4" /> -->
                        <polygon v-bind:points="selectedSchedule.roomId.points" style="fill:none;stroke:red;stroke-width:2" />
                        Sorry, your browser does not support inline SVG.
                    </svg> 
                </div>
                </div>
                <div class="md-layout-md-gutter m-5">
                    <md-table md-card>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Date</md-table-cell>
                            <md-table-cell class="text-base">{{selectedSchedule.startDate | moment("timezone", "America/New_York", "YYYY/MM/DD")}}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">From</md-table-cell>
                            <md-table-cell class="text-base">{{selectedSchedule.startDate | moment("timezone", "America/New_York", "HH:mm")}}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">To</md-table-cell>
                            <md-table-cell class="text-base">{{selectedSchedule.endDate | moment("timezone", "America/New_York", "HH:mm")}}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Room</md-table-cell>
                            <md-table-cell class="text-base">{{selectedSchedule.roomId.title}}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Floor</md-table-cell>
                            <md-table-cell class="text-base">{{selectedSchedule.roomId.floor}}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Status</md-table-cell>
                            <md-table-cell class="text-base">
                                <span class="ended-meeting" v-if="getStatus(selectedSchedule) == 1">{{ selectedSchedule.endDate | moment("from")}}</span>
                                <span class="upcoming-meeting" v-else-if="getStatus(selectedSchedule) == 2">{{ selectedSchedule.startDate | moment("from")}}</span>
                                <span class="in-meeting" v-else>In Meeting</span>
                            </md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell md-numeric class="w-6/12 font-bold text-gray-600">Owner</md-table-cell>
                            <md-table-cell class="text-base">{{selectedSchedule.userId.username}}</md-table-cell>
                        </md-table-row>
                    </md-table>
                </div>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-layout md-gutter m-5 flex flex-row-reverse">
                        <md-button class="md-raised md-accent m-5" v-bind:disabled="getStatus(selectedSchedule) != 2" @click="showDelSchedule = true">Cancel Meeting</md-button>
                    </div>
                </div>
            </div>
        </md-drawer>
        <!--End Schedule Detail Sidebar-->
    </div>
</template>

<script>
const moment = require('moment')
import gql from 'graphql-tag'
import vPagination from 'vue-plain-pagination'

const GetAllSchedule = gql`
    query allSchedules {
        allSchedules {
            id
            startDate
            endDate
            userId {
                id
                username
                email
            } 
            roomId {
                title
                id
                floor
                points
            }
        }
    }
`

const GetSchedule = gql`
    query getSchedule($id:Int) {
        getSchedule(id: $id) {
            id
            startDate
            endDate
            userId {
                id
                username
                email
            } 
            roomId {
                title
                id
                floor
                points
            }
        }
    }
`

const GetAllScheduleByUser = gql`
    query GetAllScheduleByUser($date:String!) {
        getUsersWithSchedule(date:$date) {
            id
            username
            scheduleSet {
                id
                startDate
                endDate
                roomId {
                    title
                    id
                    floor
                    points
                }
            }
        }
    }
`

const GetAllScheduleByRoom = gql`
    query GetAllScheduleByRoom($date:DateTime!) {
        getRoomsWithSchedule(date:$date) {
            id
            title
            scheduleSet {
                id
                startDate
                endDate
                userId {
                    username
                    id
                }
            }
        }
    }
`

const RemoveMeetingMutation = gql`
    mutation RemoveMeetingMutation($id:Int) {
        removeMeeting(id:$id) {
            success
        }
    }
`

export default {
    name: "ScheduleManageComponent",
    components: { vPagination },
    data: () =>{
        return {
            date : null,
            schedules: [],
            fileteredSchedules : [],
            schedulesOfDay: [],
            seeBy: 0,
            seeTimelineBy: 0,
            selectedSchedule : null,
            showDelSchedule : false,
            showScheduleDetail : false,
            loadingScheduleDetail : false,
            pagenation : {
                perpage: 10,
                search : "",
                page : 1,
                total : 0
            }
        }
    },
    methods: {
        filter (schedules) {
            let result = []
            result = schedules.filter((schedule) => {
                return schedule.roomId.title.includes(this.pagenation.search) || 
                        schedule.userId.username.includes(this.pagenation.search) ||
                        schedule.startDate.includes(this.pagenation.search) 
            })
            this.pagenation.total = result.length
            result = result.slice(this.pagenation.perpage * (this.pagenation.page-1), this.pagenation.perpage * (this.pagenation.page))

            return result
        },
        getStatus(schedule) {
            let startTime = moment(schedule.startDate)
            let endTime = moment(schedule.endDate)
            let now = moment.now()
            if(now > endTime) {
                return 1
            } else if( now < startTime) {
                return 2
            } else {
                return 3
            }
        },
        onChangeOnTimelineView() {
            if(this.date != null) {
                this.$apollo.query({
                    query : this.seeTimelineBy == 0 ? GetAllScheduleByUser : GetAllScheduleByRoom,
                    variables: {
                        date: moment(this.date).tz("America/New_York", true).startOf("day")
                    }
                }).then(res => {
                    this.schedulesOfDay = []

                    let selectedDate = moment( moment(this.date).tz("America/New_York", true).startOf("day").format() )
                    let nextDate = moment( moment(this.date).tz("America/New_York", true).endOf("day").format() )
                    
                    if(this.seeTimelineBy == 0) {
                        let users = res.data.getUsersWithSchedule
                        users.forEach(user => {
                            let schedule = {
                                title: user.username,
                                id: user.id,
                                type: 0,
                                schedules : []
                            }
                            user.scheduleSet.forEach(_schedule => {
                                
                                let scheduleDate = moment(_schedule.startDate).tz("America/New_York", true)
                                
                                if(scheduleDate > selectedDate && scheduleDate < nextDate) {
                                    schedule.schedules.push({
                                        id: _schedule.id,
                                        startTime: moment(_schedule.startDate).tz("America/New_York").format("HH:mm"),
                                        endTime : moment(_schedule.endDate).tz("America/New_York").format("HH:mm"),
                                        title : _schedule.roomId.title,
                                        status: this.getStatus(_schedule)
                                    })
                                }
                            })

                            this.schedulesOfDay.push(schedule)
                        })
                    } else {
                        let rooms = res.data.getRoomsWithSchedule
                        rooms.forEach(room => {
                            let schedule = {
                                title: room.title,
                                id: room.id,
                                type: 1,
                                schedules : []
                            }

                            room.scheduleSet.forEach(_schedule => {
                                
                                let scheduleDate = moment(_schedule.startDate).tz("America/New_York", true)
                                
                                if(scheduleDate > selectedDate && scheduleDate < nextDate) {
                                    schedule.schedules.push({
                                        id: _schedule.id,
                                        startTime: moment(_schedule.startDate).tz("America/New_York").format("HH:mm"),
                                        endTime : moment(_schedule.endDate).tz("America/New_York").format("HH:mm"),
                                        title : _schedule.userId.username,
                                        status: this.getStatus(_schedule)
                                    })
                                }
                            })

                            this.schedulesOfDay.push(schedule)
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else {
                this.schedulesOfDay = []
            }
        },
        onRemoveSchedule() {
            this.$apollo.mutate({
                mutation: RemoveMeetingMutation,
                variables: {
                    id: this.selectedSchedule.id
                }
            }).then(res => {
                console.log(res)
                this.$apollo.queries.schedules.refresh()
            }).catch(err => {
                console.log(err)
            })
        },
        onScheduleClick($event) {
            this.$apollo.query({
                query: GetSchedule,
                variables: {
                    id: $event
                }
            }).then(res => {
                let schedule = res.data.getSchedule
                this.selectedSchedule = schedule
                this.showScheduleDetail = true
            }).catch(err => {
                console.log(err)
            })
        },
        onTabChanged(tabId) {
            if(tabId == 'tab-table') {
                this.seeBy = 0
            } else if(tabId == 'tab-timeline') {
                this.seeBy = 1
            }
        }
    },
    watch: {
        schedules: {
            handler(value) {
                this.fileteredSchedules = this.filter(value)
            }
        },
        seeTimelineBy: {
            handler()  {
                this.onChangeOnTimelineView()
            },
            deep: true
        },
        date: {
            handler() {
                this.onChangeOnTimelineView()
            }
        },
        pagenation : {
            handler() {
                this.fileteredSchedules = this.filter(this.schedules)
                if(this.pagenation.page > this.$options.filters.ceil(this.pagenation.total/this.pagenation.perpage)) {
                    this.pagenation.page = this.$options.filters.ceil(this.pagenation.total/this.pagenation.perpage)
                }
            },
            deep: true
        }
    },
    apollo: {
        schedules: {
            query: GetAllSchedule,
            update: (data) => {
                

                return data.allSchedules
            },
            fetchPolicy: 'network-only'
        }
    },
    filters : {
        ceil : (value) => {
            let v = Math.ceil(value)
            return v
        },
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
    .ended-meeting {
        background: royalblue;
        color: white;
        border-radius: 2px;
        padding: 5px;
        font-weight: bold;
    }
    .upcoming-meeting {
        background: seagreen;
        color: white;
        border-radius: 2px;
        padding: 5px;
        font-weight: bold;
    }
    .in-meeting {
        background: red;
        color: white;
        border-radius: 2px;
        padding: 5px;
        font-weight: bold;
    }
</style>