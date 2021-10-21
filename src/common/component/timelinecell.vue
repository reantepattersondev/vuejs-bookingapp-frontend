<template>
    <div class="timeline-cell pl-2 md-ripple" 
            :class="[{
                'ended-meeting' : schedule.status == 1, 
                'upcoming-meeting' : schedule.status == 2,
                'in-meeting' : schedule.status == 3,
                }]" 
            v-bind:style="{left: getOffset() + 'em', width: getWidth() + 'em'}"
            @click="onClick()"
            >
        <div class="subject-title font-bold italic">{{ schedule.title }}</div>
        <div class="subject-duration">{{ schedule.startTime }} ~ {{ schedule.endTime }}</div>
    </div>
</template>

<script>
const moment = require('moment')
export default {
    name: 'TimeLineCell',
    props: {
        schedule:Object
    },
    data: function() {
        return {
            offset: 0
        }
    },
    methods: {
        getOffset() {
            let baseTime =moment("00:00", "HH:mm")
            let startTime = moment(this.schedule.startTime, "HH:mm")
            // let endTime = moment(this.endTime, "HH:mm")

            let offset = ((startTime-baseTime) / 1000 / 60 / 10 )
            return offset
        },
        getWidth() {
            let startTime = moment(this.schedule.startTime, "HH:mm")
            let endTime = moment(this.schedule.endTime, "HH:mm")

            let width = ((endTime-startTime) / 1000 / 60 / 10 )
            return width
        },
        onClick() {
            this.$emit("onScheduleClick", this.schedule.id)
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .timeline-cell {
        height: 2.5em;
        background: lightgray;
        position: absolute;
        width: 20em;
        border-radius: 3px;
        text-align: center;
    }

    .timeline-cell:hover {
        cursor: pointer;
    }

    .timeline-cell::before {
        min-height: 2.5em;
        min-width: 5px;
        position: absolute;
        content: "";
        border-radius: 3px 0px 0px 3px;
        left: 0px;
    }

    .subject-title {
        font-size: 13px;
    }
    .subject-duration {
        font-size: 10px;
    }
    .ended-meeting.timeline-cell::before {
        background: royalblue;
    }
    .upcoming-meeting.timeline-cell::before {
        background: seagreen;
    }
    .in-meeting.timeline-cell::before {
        background: red;
    }
</style>