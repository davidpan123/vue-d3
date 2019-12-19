<template lang='pug'>
    div.force-pane(:id="id")
        svg
</template>
<script>
/**
 * 力导向图
 */
import * as d3 from 'd3'
let gs = '',
    forceSimulation = '',
    links = '',
    linksText = ''
let nodes = [{ name: '湖南' }, { name: '毛泽东' }, { name: '主席' }]
 
let edges = [
    { source: 0, target: 1, relation: '籍贯', value: 1.3 },
    { source: 1, target: 2, relation: '职责', value: 1 }
]
export default {
    name: 'Scale',
    data() {
        return {
            id: ''
        }
    },
    methods: {
        uuid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
            }
            return (
                s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
            )
        },
        ticked() {
            links
                .attr('x1', function(d) {
                    return d.source.x
                })
                .attr('y1', function(d) {
                    return d.source.y
                })
                .attr('x2', function(d) {
                    return d.target.x
                })
                .attr('y2', function(d) {
                    return d.target.y
                })
 
            linksText
                .attr('x', function(d) {
                    return (d.source.x + d.target.x) / 2
                })
                .attr('y', function(d) {
                    return (d.source.y + d.target.y) / 2
                })
 
            gs.attr('transform', d => {
                return 'translate(' + d.x + ',' + d.y + ')'
            })
        },
        dragStart(d) {
            if (!d3.event.active) {
                //设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
                forceSimulation.alphaTarget(0.4).restart()
            }
            d.fx = d.x
            d.fy = d.y
        },
        dragEnd(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y
        },
        drag(d) {
            if (!d3.event.active) {
                forceSimulation.alphaTarget(0)
            }
            d.fx = null
            d.fy = null
        }
    },
    created() {
        this.id = this.uuid()
    },
    mounted() {
        //1.创建svg画布
        let marge = { top: 160, bottom: 60, left: 160, right: 60 }
        let width = document.getElementById(this.id).clientWidth
        let height = 600
        const svg = d3
            .select(this.$el)
            .select('svg')
            .attr('width', width)
            .attr('height', height)
        let g = svg
            .append('g')
            .attr(
                'transform',
                'translate(' + marge.top + ',' + marge.left + ')'
            )
 
        //2.设置一个color的颜色比例尺，为了让不同的扇形呈现不同的颜色
        var colorScale = d3
            .scaleOrdinal()
            .domain(d3.range(nodes.length))
            .range(d3.schemeCategory10)
 
        //3.新建一个力导向图
        forceSimulation = d3
            .forceSimulation()
            .force('link', d3.forceLink())
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter())
 
        //4. 初始化力导向图
        //生成节点数据
        forceSimulation.nodes(nodes).on('tick', this.ticked)
        //生成边数据
        forceSimulation
            .force('link')
            .links(edges)
            .distance(function(d) {
                //每一边的长度
                return d.value * 100
            })
        //设置图形的中心位置
        forceSimulation
            .force('center')
            .x(width / 4)
            .y(height / 4)
 
        //5. 绘制边(有了节点和边的数据后)
        links = g
            .append('g')
            .selectAll('line')
            .data(edges)
            .enter()
            .append('line')
            .attr('stroke', function(d, i) {
                return colorScale(i)
            })
            .attr('stroke-width', 1)
        linksText = g
            .append('g')
            .selectAll('text')
            .data(edges)
            .enter()
            .append('text')
            .text(function(d) {
                return d.relation
            })
 
        //6. 绘制节点, 先为节点和节点上的文字分组
        gs = g
            .selectAll('.circleText')
            .data(nodes)
            .enter()
            .append('g')
            .attr('transform', function(d, i) {
                var cirX = d.x
                var cirY = d.y
                return 'translate(' + cirX + ',' + cirY + ')'
            })
            .call(
                d3
                    .drag()
                    .on('start', this.dragStart)
                    .on('drag', this.drag)
                    .on('end', this.dragEnd)
            )
 
        //绘制节点
        gs.append('circle')
            .attr('r', 10)
            .attr('fill', function(d, i) {
                return colorScale(i)
            })
        //文字
        gs.append('text')
            .attr('x', -10)
            .attr('y', -20)
            .attr('dy', 10)
            .text(function(d) {
                return d.name
            })
    }
}
</script>
<style lang='scss' scoped>
.force-pane {
    width: 100%;
    height: 1000px;
}
</style>
