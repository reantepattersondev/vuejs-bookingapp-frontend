<template>
    <div>
        <md-table v-model="schedules" md-sort="name" md-sort-order="asc" md-card class="m-5">
            
            <md-table-toolbar>
                <h1 class="md-title">Schedule(s)</h1>
            </md-table-toolbar>
            <md-table-empty-state
                md-label="No schedule found">
            </md-table-empty-state>
            <md-table-row slot="md-table-row" slot-scope="{ item, index }">
                <md-table-cell md-label="SN" md-numeric>{{ index+1 }}</md-table-cell>
                <md-table-cell md-label="Date" md-sort-by="name">{{ item.startDate | moment("DD/MM/YYYY") }}</md-table-cell>
                <md-table-cell md-label="From" md-sort-by="name">{{ item.startDate | moment("HH:mm") }}</md-table-cell>
                <md-table-cell md-label="To" md-sort-by="email">{{ item.endDate | moment("HH:mm") }}</md-table-cell>
                <md-table-cell md-label="Room" md-sort-by="gender">{{ item.roomId.title }}</md-table-cell>
                <md-table-cell md-label="Floor" md-sort-by="gender">{{ item.roomId.floor }}</md-table-cell>
                <md-table-cell md-label="Status" md-sort-by="gender">
                    <span class="ended-meeting" v-if="getStatus(index) == 1">{{ item.endDate | moment("from")}}</span>
                    <span class="upcoming-meeting" v-else-if="getStatus(index) == 2">{{ item.startDate | moment("from")}}</span>
                    <span class="in-meeting" v-else>In Meeting</span>
                </md-table-cell>
                <md-table-cell md-label="Action" md-sort-by="gender">
                    <template v-if="getStatus(index) == 1">
                        <md-button class="md-icon-button" @click="selectedSchedule = item; showDelSchedule = true">
                            <md-icon>delete</md-icon>
                        </md-button>
                    </template>
                    <template v-if="getStatus(index) == 2">
                        <md-button class="md-icon-button" @click="selectedSchedule = item; showDelSchedule = true">
                            <md-icon>delete</md-icon>
                        </md-button>
                    </template>
                </md-table-cell>
            </md-table-row>
        </md-table>
        <md-dialog-confirm
            :md-active.sync="showDelSchedule"
            md-title="Delete Schedule"
            md-content="Are you sure to delete selected schedule?"
            md-confirm-text="Delete"
            md-cancel-text="Cancel"
            @md-cancel="showDelSchedule = false"
            @md-confirm="onRemoveSchedule()" />
        <md-snackbar :md-position="'center'" :md-duration="3000" :md-active.sync="snackbar.show" md-persistent>
            <span>{{ snackbar.message }}</span>
            <md-button class="md-primary" @click="snackbar.show = false">Dismiss</md-button>
        </md-snackbar>
    </div>
</template>
<script>
const moment = require('moment')
import gql from 'graphql-tag'

const GetSchedules = gql`
    query schedules ($userId:Int) {
        getSchedulesByUser (userId: $userId) {
            id
            startDate
            endDate
            roomId {
                id
                title
                floor
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
    name: "AgentScheduleComponent",
    data: () => ({
        schedules : [],
        userid: 1,
        showDelSchedule : false,
        selectedSchedule : null,
        snackbar : {
            show : false,
            message : ""
        }
    }),
    methods: {
        getStatus(index) {
            let schedule = this.schedules[index]
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
        onRemoveSchedule() {
            this.$apollo.mutate({
                mutation: RemoveMeetingMutation,
                variables : {
                    id: this.selectedSchedule.id
                }
            }).then(res => {
                console.log(res)
                this.$apollo.queries.schedules.refresh()
                this.snackbar.message = "Meeting is cancelled"
                this.snackbar.show = true
            }).catch(err => {
                console.log(err)
                this.snackbar.message = "Something went wrong. Try again please"
                this.snackbar.show = true
            })
        }
    },
    apollo: {
        schedules : {
            query: GetSchedules,
            variables: {
                userId: 1
            },
            update: (data) => {
                console.log(data)
                return data.getSchedulesByUser
            }
        }
    }
}
</script>

<style scoped>

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