<template lang='pug'>
    div.histogram-pane(:id='id')
        svg.histogram-container
            g.viewport
                
</template>
 
<script>
import * as d3 from 'd3'
import { Uuid } from '@/util/common'
export default {
    name: 'orchestrator',
    data () {
        return {
            id: '',
            height: 0,
            padding: null,
            reactWidth: -1,
            reactStep: -1,
            dataSet: [50, 43, 120, 87, 99, 167, 142]
        }
    },
    created () {
        this.id = Uuid()
    },
    mounted () {
        // let margin = { top: 200, bottom: 60, left: 200, right: 60 }
        this.padding = { top: 20, bottom: 20, left: 20, right: 20 }
        // d3.select('svg').select('g.viewport').attr('transform', 'translate(' + margin.top + ',' + margin.left + ')')

        this.reactWidth = 30
        this.reactStep = 35

        // let width = document.getElementById(this.id).clientWidth
        this.height = document.getElementById(this.id).clientHeight

        this.draw()
        // 缩放
        const zoomed = function () {
        d3.select('svg')
            .select('g.viewport')
            .attr('transform', d3.event.transform)
        }
    
        const zoom = d3.zoom().on('zoom', zoomed)

        d3.select('svg')
        .call(zoom)
        .on('dblclick.zoom', null)
    },
    methods: {
        draw () {
            
        }
    }
}
</script>
 
<style lang='scss' scoped>
.histogram-pane {
  width: 100%;
  height: 100%;
}
.histogram-container {
  width: 100%;
  height: 100%;
}
</style>
