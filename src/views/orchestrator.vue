<template lang='pug'>
    div.histogram-pane
        svg.histogram-container
            g.viewport
                defs
                    marker(
                        id="arrow"
                        viewBox="0 -5 10 10"
                        refX="9"
                        markerWidth="8"
                        markerHeight="8"
                        orient="auto"
                    )
                        path(
                            d="M0,-5L10,0L0,5"
                            fill="#dddddd"
                        )
                g.nodes
                g.lines
                    line(x1="0" y1="0" x2="200" y2="50" stroke="red" stroke-width="2" marker-end="url(#arrow)")
</template>
 
<script>
import * as d3 from 'd3'
export default {
    name: 'orchestrator',
    data () {
        return {
            simulation: null,
            dataset: [ 
                { id: 1, name: 'hh1' },
                { id: 2, name: 'hh2' },
                { id: 3, name: 'hh3' }
            ]
        }
    },
    mounted () {
        let marge = { top: 200, bottom: 60, left: 200, right: 60 }
        d3.select('svg').select('g.viewport').attr('transform', 'translate(' + marge.top + ',' + marge.left + ')')
        
        // 数据绑定
        const nodes = d3.select('svg').select('g.nodes').selectAll('g.node').data(this.dataset, (d) => {
            return d.id
        })

        const dragBehivor = d3.drag().on('start', this.dragStart).on('drag', this.drag).on('end', this.dragEnd)

        // 新增
        const reactEnter = nodes.enter().append('g').attr('class', 'node')
        reactEnter.call(dragBehivor)
        reactEnter.append('rect').attr('width', 100).attr('height', 100).attr('fill', 'white').style('stroke', 'red')

        reactEnter.append('text').text((d) => {
            return d.name
        })

        // 更新
        const update = nodes.merge(reactEnter)
        update.call(dragBehivor)
        // update.select('rect').style('fill', (d) => {
        //     // id偶数为红色，奇数为绿色
        //     return !(d.id % 2) ? 'red' : 'green'
        // })

        // 移除
        nodes.exit().remove()

        // 创建物理仿真
        this.simulation = d3.forceSimulation(this.dataset).force('charge', d3.forceManyBody()).on('tick', this.tick)

        // 缩放
        const zoomed = function () {
            d3.select('svg').select('g.viewport').attr('transform', d3.event.transform)
        }

        const zoom = d3.zoom().on('zoom', zoomed)

        d3.select('svg').call(zoom)
        .on('dblclick.zoom', null)
    },
    methods: {
        tick (d) {
            d3.select('svg').select('g.nodes').selectAll('g.node').attr('transform', (d) => {
                return `translate(${d.x}, ${d.y})`
            })
        },
        dragStart (d) {
            if (!d3.event.active)
                this.simulation.alphaTarget(0.3).restart()
        },
        drag (d) {
            // 更新节点位置数据(DOM并未改变)
            d.fx = d3.event.x
            d.fy = d3.event.y
            console.log(d)
        },
        dragEnd (d) {

        }
    }
}
</script>
 
<style lang="scss" scoped>
.histogram-pane {
    width: 100%;
    height: 100%;
}
.histogram-container {
    width: 100%;
    height: 100%;
}
</style>
