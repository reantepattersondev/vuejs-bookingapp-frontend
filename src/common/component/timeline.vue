<template>
  <div class="timeline-container">
      <table class="timeline-table bg-white">
          <thead>
              <tr class="pb-5">
                    <th class="bg-gray-200 sticky left-0"></th>
                    <th v-for="(vitem, index) in Array(24)" :key="index" class="timeline mb-5">
                        {{ index | TimeFormatter }}
                    </th>
              </tr>
          </thead>
          <tbody>
              <tr class="timeline-table-row" v-for="(item, index) in schedules" :key="index">
                    <td class="subject font-bold text-base sticky left-0 z-10 bg-gray-200">
                        <md-icon v-if="item.type == 0">person</md-icon>
                        <md-icon v-if="item.type == 1">meeting_room</md-icon>
                        {{ item.title }}
                    </td>
                    <td colspan="24">
                        <div class="subject-timeline">
                            <template v-for="(_schedule, index2) in item.schedules">
                                <TimeLineCell :schedule="_schedule" :key="index + '_' + index2" v-on:onScheduleClick="onScheduleClick($event)"></TimeLineCell>
                            </template>
                        </div>
                    </td>
              </tr>
          </tbody>
          <tfoot></tfoot>
      </table>
  </div>
</template>

<script>
import TimeLineCell from './timelinecell'

export default {
    name: 'TimeLine',
    props: {
        schedules:Array
    },
    components : {
        TimeLineCell
    },
    filters: {
        TimeFormatter : (data) => {
            if(data >= 10) {
                return `${data}:00`
            } else {
                return `0${data}:00`
            }
        }
    },
    methods: {
        onScheduleClick($event) {
            this.$emit("onScheduleClick", $event)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
th {
    text-align: left;
}
.timeline-container {
    overflow-x: scroll;
}
.timeline {
    min-width: 6em;
}
.subject {
    min-width: 10em;
}
.subject-timeline {
    position: relative;
    height: 2.5em;
}
.timeline-table > tbody > tr {
    height: 2.5em;
}

</style>