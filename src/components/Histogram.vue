<template lang='pug'>
    div.histogram(:id="id")
        svg
</template>
 
<script>
/* eslint-disable */
import * as d3 from 'd3'
import {Uuid} from '@/util/common'
export default {
    name: '',
    props: ['dataset'],
    data () {
        return {
            id: ''
        }
    },
    created () {
        this.id = Uuid()
    },
    mounted () {
        //1.创建svg画布
        let marge = { top: 60, bottom: 60, left: 60, right: 60 }
        let width = document.getElementById(this.id).clientWidth
        let height = document.getElementById(this.id).clientHeight
        // let width = 600
        // let height = 400
        const svg = d3.select(this.$el).select('svg').attr('width', width).attr('height', height)
        let g = svg.append('g').attr('transform', 'translate(' + marge.top + ',' + marge.left + ')')
        //2.数据集
        // this.dataset
        //3.坐标轴
        //x轴序数比例尺（d3.scaleBand()并不是一个连续性的比例尺，domain()中使用一个数组，不过range()需要是一个连续域）
        let ranges = d3.range(this.dataset.length)
        let xcale = d3.scaleBand().domain(ranges).range([0, width - marge.left - marge.right])
        let xAxis = d3.axisBottom(xcale)
        g.append('g')
            .attr('transform', 'translate(' + 0 + ',' + (height - marge.top - marge.bottom) + ')')
            .call(xAxis)
        //y轴线性比例尺
        let yscale = d3.scaleLinear().domain([0, d3.max(this.dataset)]).range([height - marge.top - marge.bottom, 0])
        let yAxis = d3.axisLeft(yscale)
        g.append('g')
            .attr('transform', 'translate(0, 0)')
            .call(yAxis)
        //4.为每个矩形和对应的文字创建一个分组<g>
        let gs = g.selectAll('rect')
            .data(this.dataset)
            .enter()
            .append('g')
        //5.绘制矩形
        //设置矩形之间的间隙
        let rectPadding = 20 
        gs.append('rect')
            .attr('x', function(d, i) {
                //xcale(i): 画布真实宽度(48)横坐标且从0开始, 0, 48, 96 ... 432
                return xcale(i) + rectPadding/2
            })
            .attr('width', function() {
                //xcale.step() 画布真实宽度(48):width-marge.left-marge.right/this.dataset.lenght
                return xcale.step() - rectPadding
            })
            .attr('y', function(d){
                return yscale(d)
            })
            .attr('height', function(d){
                return height - marge.top - marge.bottom - yscale(d)
            })
            .attr('fill', 'blue')
        //6.绘制文字
        gs.append('text')
            .attr('x', function(d, i) {
                return xcale(i) + rectPadding/2
            })
            .attr('width', function() {
                return xcale.step() - rectPadding
            })
            .attr('y', function(d) {
                return yscale(d)
            })
            .attr('dy', rectPadding)
            .text(function(d) {
                return d
            })
    }
}
</script>
 
<style lang="scss" scoped>
.histogram {
    width: 600px;
    height: 400px;
}
</style>
