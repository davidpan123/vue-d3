<template lang='pug'>
    div.histogram-pane(:id='id')
        svg.histogram-container
            g.viewport
                //- 画线方式1
                g.lines
                    line(x1="0" y1="0" x2="200" y2="0" stroke="red" stroke-width="2")
                
</template>
 
<script>
import * as d3 from 'd3'
import { Uuid } from '@/util/common'
export default {
    name: 'learn',
    data () {
        return {
            id: '',
            width: 0,
            height: 0,
            margin: null
        }
    },
    created () {
        this.id = Uuid()
    },
    mounted () {
        let width = document.getElementById(this.id).clientWidth
        let height = document.getElementById(this.id).clientHeight
        this.margin = { top: 60, bottom: 60, left: 60, right: 60 }
        d3.select('svg').attr('width', width).attr('height', height)
        d3.select('g.viewport').attr('transform', 'translate(' + this.margin.top + ',' + this.margin.left + ')')

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
        // 绘画
        this.draw()
    },
    methods: {
        draw () {
            let g = d3.select('g.viewport')
            // 画线方式2
            g.append('g')
                .append('line')
                .attr('x1', 120)
                .attr('y1', 120)
                .attr('x2', 300)
                .attr('y2', 100)
                .attr('class', 'lines2')
                .attr('stroke', '#222333')
            // 线段生成器1
            let lines = [[10, 60], [40, 90], [60, 10], [190, 10]]
            let linePaths = d3.line()
            g.append('g').append('path').attr('d', linePaths(lines)).attr('stroke', 'black').attr('fill', 'none')
            // 线段生成器2：指定x,y
            let lines2 = [{ x: 20, y: 120 }, { x: 60, y: 120 }, { x: 100, y: 200 }]
            let linePaths2 = d3.line().x(d => {
                console.log(d)
                return d.x
            }).y(d => d.y)
            g.append('g').append('path').attr('d', linePaths2(lines2)).attr('stroke', 'black').attr('fill', 'none')
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
.lines2 {
    stroke: aqua;
    stroke-width: 1;
}
</style>
