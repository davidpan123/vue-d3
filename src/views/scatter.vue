<template lang='pug'>
    div.histogram-pane(:id='id')
        svg.histogram-container
            g.viewport
                
</template>
 
<script>
/**
 * 散点图
 */
import * as d3 from 'd3'
import { Uuid } from '@/util/common'
export default {
    name: 'scatter',
    data () {
        return {
            id: '',
            width: 0,
            height: 0,
            xAxisWidth: 300,
            yAxisHeight: 300,
            margin: null,
            dataSet: [
                [0.5, 0.5], [0.7, 0.8], [0.4, 0.9], [0.11, 0.32], [0.88, 0.25], 
                [0.75, 0.12], [0.5, 0.1], [0.2, 0.3], [0.4, 0.1], [0.6, 0.7]
            ]
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
            // 绘制坐标轴
            let xscale = d3.scaleLinear().domain([0, 1.2 * d3.max(this.dataSet, d => {
                return d[0]
            })]).range([0, this.xAxisWidth])
            let xAxis = d3.axisBottom(xscale)
            g.append('g')
                .attr('transform', 'translate(' + 0 + ',' + this.yAxisHeight + ')')
                .call(xAxis)

            let yscale = d3.scaleLinear().domain([0, 1.2 * d3.max(this.dataSet, d => {
                return d[1]
            })]).range([this.yAxisHeight, 0])
            let yAxis = d3.axisLeft(yscale)
            g.append('g')
                .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
                .call(yAxis)
            
            // 绘制散点图
            let circle = g.selectAll('cricle').data(this.dataSet).enter().append('circle')
            circle.attr('fill', 'black')
                .attr('cx', d => {
                    return xscale(d[0])
                })
                .attr('cy', d => {
                    return this.yAxisHeight - yscale(d[1])
                })
                .attr('r', 5)
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
