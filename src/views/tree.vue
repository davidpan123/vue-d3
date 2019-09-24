<template lang='pug'>
    div.tree-container(:id="id")
        svg.d3-tree 
            g.container
</template>
<script>
/**
 * 树状图
 */
//数据
/* eslint-disable */
const dataset = {
    id: '1',
    name:"中国",
    children:[
        {
            name:"浙江",
            id: '2',
            children:[
                {name:"杭州" ,value:100, id: '3'},
                {name:"宁波",value:100, id: '4'},
                {name:"温州",value:100, id: '5'},
                {name:"绍兴",value:100, id: '6'}
            ]
        },
        {
            name:"新疆" , 
            id: '7',
            children:
            [
                {name:"乌鲁木齐", id: '8'},
                {name:"克拉玛依", id: '9'},
                {name:"吐鲁番", id: '10'},
                {name:"哈密", id: '11'}
            ]
        },
        {
            name:"新疆" , 
            id: '12',
            children:
            [
                {name:"乌鲁木齐", id: '13'},
                {name:"克拉玛依", id: '14'},
                {name:"吐鲁番", id: '15'},
                {name:"哈密", id: '16'}
            ]
        }
    ]
}
import * as d3 from 'd3'
export default {
    name: 'Scale',
    data() {
        return {
            id: '',
            zoom: null,
            index: 0,
            duration: 750,
            root: null,
            nodes: [],
            links: [],
            dTreeData: null,
            transform: null,
            margin: { top: 20, right: 90, bottom: 30, left: 90 }
        }
    },
    methods: {
        uuid () {
            function s4 () {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
            }
            return (
                s4() + s4() + '-' + s4() + '-' + s4() +  '-' + s4() + '-' + s4() + s4() + s4()
            )
        },
        /**
         * @description 获取构造根节点
         */
        getRoot () {
            let root = d3.hierarchy(dataset, d => { 
                return d.children
            })
            root.x0 = this.height / 2
            root.y0 = 0
            return root
        },
        /**
         * @description 点击节点，展开or收缩
         */
        clickNode (d) {
            if (!d._children && !d.children)
                return
            if (d.children) {
                this.$set(d, '_children', d.children)          
                d.children = null
            } else {
                this.$set(d, 'children', d._children)
                d._children = null
            }
            this.$nextTick(
                () => {
                    this.update(d)                
                }
            )
        },
        diagonal (s, d) {
            return `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`
        },
        /**
         * @description 获取构造的node数据和link数据
         */
        getNodesAndLinks () {
            // treemap generate new x、y coordinate according to root node, 
            // so can‘t use computed propter of vue
            this.dTreeData = this.treemap(this.root)
            this.nodes = this.dTreeData.descendants()
            this.links = this.dTreeData.descendants().slice(1)
        },
        /**
         * @description 重新计算高度
         */
        calculateHeight (source) {
            // dataset 一般来说是父组件传下来的prop, 这里数据是静态的所以直接写了
            let treeData = JSON.parse(JSON.stringify(dataset))
            let levelWidth = [1]
            let newClientHeight = -1
            this.height = document.getElementById(this.id).clientHeight

            let childCount = function (level, n) {
                // id: 此处的id为数据中唯一标识，真实情况替换这个即可
                let children = [], isExpend = true
                if (n.id === source.data.id && (source.children === null)) 
                    isExpend = false

                if (n.children) 
                    children = isExpend ? n.children : []
        
                if (n.data && n.data.children)
                    children = isExpend ? n.data.children : []

                if (children && children.length > 0) {
                    if (levelWidth.length <= level + 1) levelWidth.push(0)
                    levelWidth[level + 1] += children.length
                    children.forEach(d => {
                        childCount(level + 1, d)
                    })
                }
            }
            childCount(0, treeData)
            newClientHeight = d3.max(levelWidth) * 40 // 40 pixels per line  
            this.height = newClientHeight > this.height ? newClientHeight : this.height
        },
        /** 
         * @description 数据与Dom进行绑定
         */
        update (source) {
            this.calculateHeight(source)
            this.getNodesAndLinks()
            this.nodes.forEach(d => { 
                d.y = d.depth * 180
            })
            // *************************** Nodes section *************************** //
            // Update the nodes...
            const svg = d3.select(this.$el).select('svg.d3-tree')
            const container = svg.select('g.container')
            let node = container.selectAll('g.node')
                .data(this.nodes, d => {
                    return d.id || (d.id = ++this.index)
                }) 
            // Enter any new sources at the parent's previous position.
            let nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .on('click', this.clickNode)
                .attr('transform', d => {
                    return 'translate(' + source.y0 + ',' + source.x0 + ')'
                })  
            nodeEnter.append("circle")
                .attr("r", 10)
                .style("fill", function(d) { return d.children || d._children ? "lightsteelblue" : "#fff"; });

            nodeEnter.append("text")
                .attr("x", function(d) { return d.children || d._children ? -15 : 15; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .text(function(d) { return d.data.name })
                .style("fill-opacity", 1e-6);
            // Transition nodes to their new position.
            let nodeUpdate = nodeEnter.merge(node)
                .transition()
                .duration(this.duration)
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("circle")
                .attr("r", 10)
                .attr("fill", "white")
                .attr("stroke", "blue")
                .attr("stroke-width", 1)
                .style("fill", function(d) { return d.children || d._children ? "lightsteelblue" : "#fff"; });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            let nodeExit = node.exit()
                .transition()
                .duration(this.duration)
                .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // *************************** Links section *************************** //
            // Update the links…
            let link = container.selectAll('path.link')
                .data(this.links, d => { return d.id })
            
            // Enter any new links at the parent's previous position.
            let linkEnter = link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", d => {
                    let o = {x: source.x0, y: source.y0};
                    return this.diagonal(o, o)
                })
                .attr("fill", 'none')
                .attr("stroke-width", 1)
                .attr('stroke', '#ccc')
            // Transition links to their new position.
            let linkUpdate = linkEnter.merge(link)
            linkUpdate.transition()
                .duration(this.duration)
                .attr('d', d => { return this.diagonal(d, d.parent) })

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(this.duration)
                .attr("d", d => {
                    let o = {x: source.x, y: source.y};
                    return this.diagonal(o, o)
                })
                .remove();

            // Stash the old positions for transition.
            this.nodes.forEach(d => {
                d.x0 = d.x
                d.y0 = d.y
            })
        },
        /** 
         * @description control the canvas zoom to up or down
         */
        zoomed () {
            d3.select(this.$el).select('g.container').attr('transform', d3.event.transform)
        }
    },
    created() {
        this.id = this.uuid()
    },
    mounted () {
        //创建svg画布
        this.width = document.getElementById(this.id).clientWidth
        this.height = document.getElementById(this.id).clientHeight
        const svg = d3.select(this.$el).select('svg.d3-tree')
            .attr('width', this.width)
            .attr('height', this.height)
        const transform = d3.zoomIdentity.translate(this.margin.left, this.margin.top).scale(1)    
        const container = svg.select('g.container')
        // init zoom behavior, which is both an object and function
        this.zoom = d3.zoom()
            .scaleExtent([1 / 2, 8])
            .on('zoom', this.zoomed)
        container.transition().duration(750).call(this.zoom.transform, transform)
        svg.call(this.zoom)
        this.root = this.getRoot()
        this.update(this.root)
    },
    computed: {
        treemap () {
            return d3.tree().size([this.height, this.width])
        }
    }
}
</script>
<style lang='scss' scoped>
.tree-container {
    width: 100%;
    height: 1000px;
}

.d3-tree {
    .node {
        cursor: pointer;
    }

    .node circle {
        fill: #fff;
        stroke: steelblue;
        stroke-width: 1.5px;
    }

    .node text {
        font: 18px sans-serif;
    }

    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 1.5px;
    }
}
</style>





