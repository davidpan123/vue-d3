<template lang='pug'>
    div.force-relation(id="relationChart")
</template>
<script>
import * as d3 from 'd3'
// 默认配置
const defaultConfig = {
    width: 1000,                 // 总画布svg的宽
    height: 800,                // 高
    isHighLight: true,        // 是否启动 鼠标 hover 到节点上高亮与节点有关的节点，其他无关节点透明的功能
    isScale: true,              // 是否启用缩放平移zoom功能
    scaleExtent: [0.5, 1.5],    // 缩放的比例尺
    chargeStrength: -300,        // 万有引力
    collide: 100,                 // 碰撞力的大小 （节点之间的间距）
    nodeWidth: 160,             // 每个node节点所占的宽度，正方形
    margin: 20,                 // node节点距离父亲div的margin
    alphaDecay: 0.0228,          // 控制力学模拟衰减率
    r: 35,                      // 头像的半径 [30 - 45]
    relFontSize: 12,           // 关系文字字体大小
    linkSrc: 30,                // 划线时候的弧度
    linkColor: '#bad4ed',        // 链接线默认的颜色
    strokeColor: '#7ecef4',     // 头像外围包裹的颜色
    strokeWidth: 1,             // 头像外围包裹的宽度
}
export default {
    props: {
        nodesData: {
            type: Array,
            default: () => []
        },
        linksData: {
            type: Array,
            default: () => []
        },
        configs: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            dependsNode: [],            //高亮的node
            dependsLinkAndText: [],     //高亮的link
            config: {},
            map: null,
            tip: null,
            simulation: null,
            SVG: null,
            relMap_g: null,
            edges: null,
            links: null,
            rects: null,
            texts: null,
            circles: null
        }
    },
    mounted () {
        this.init()
        // 创建力学模拟器
        this.initSimulation()
        //更新视图
        this.update()
    },
    methods: {
        init () {
            let selector = '#relationChart'
            // 画布
            this.map = d3.select(selector);
            // 设置宽、高度
            let mapW = parseInt(d3.select(selector).style('width'))
            let mapH = parseInt(d3.select(selector).style('height'))

            let defaultWH = {
                width: mapW,
                height: mapH,
            }
            // 合并配置
            this.config = this.extend({}, defaultConfig, defaultWH, this.configs);
        },
        /**
         * @description 拓展对象
         * newconfig = extend({},defaultConfig,myconfig)
         */
        extend (target) {
            let sources = Array.prototype.slice.call(arguments, 1);

            for (let i = 0; i < sources.length; i += 1) {
                let source = sources[i]
                for (let key in source) {
                    if (source.hasOwnProperty(key)) {
                        target[key] = source[key]
                    }
                }
            }
            return target
        },

        // 求两点间的距离
        getDis (s, t) {
            return Math.sqrt((s.x - t.x) * (s.x - t.x) + (s.y - t.y) * (s.y - t.y));
        },

        // 求元素移动到目标位置所需要的 transform 属性值
        getTransform (source, target, _dis) {
            let r
            if (target.x > source.x) {
                if (target.y > source.y) {
                    r = Math.asin((target.y - source.y) / _dis)
                } else {
                    r = Math.asin((source.y - target.y) / _dis)
                    r = -r
                }
            } else {
                if (target.y > source.y) {
                    r = Math.asin((target.y - source.y) / _dis)
                    r = Math.PI - r
                } else {
                    r = Math.asin((source.y - target.y) / _dis)
                    r -= Math.PI
                }
            }
            r = r * (180 / Math.PI)
            return "translate(" + source.x + "," + source.y + ")rotate(" + r + ")"
        },

        /**
         * @description 创建力学模拟器
         */
        initSimulation () {
            const that = this
            // 创建一个力学模拟器
            this.simulation = d3.forceSimulation(this.nodesData)
            // simulation.force(name,[force])函数，添加某种力
                .force("link", d3.forceLink(this.linksData))
                // 万有引力
                .force("charge", d3.forceManyBody().strength(this.config.chargeStrength))
                // d3.forceCenter()用指定的x坐标和y坐标创建一个新的居中力。
                .force("center", d3.forceCenter(this.config.width / 2, this.config.height / 2))
                // 碰撞作用力，为节点指定一个radius区域来防止节点重叠，设置碰撞力的强度，范围[0,1], 默认为0.7。设置迭代次数，默认为1，迭代次数越多最终的布局效果越好，但是计算复杂度更高
                .force("collide", d3.forceCollide(this.config.collide).strength(0.2).iterations(5))
                // 在计时器的每一帧中，仿真的alpha系数会不断削减,当alpha到达一个系数时，仿真将会停止，也就是alpha的目标系数alphaTarget，该值区间为[0,1]. 默认为0，
                // 控制力学模拟衰减率，[0-1] ,设为0则不停止 ， 默认0.0228，直到0.001
                .alphaDecay(this.config.alphaDecay)
                // 监听事件 ，tick|end ，例如监听 tick 滴答事件
                .on("tick", () => this.ticked())

            // 创建svg标签
            this.SVG = this.map.append("svg")
                .attr('id', 'relationSvg')
                .attr("class", "svgclass")
                .attr("width", this.config.width)
                .attr("height", this.config.height)
                // .transition().duration(750).call(d3.zoom().transform, d3.zoomIdentity);
                .call(d3.zoom().scaleExtent(this.config.scaleExtent).on("zoom", () => {
                    if (this.config.isScale) {
                        this.relMap_g.attr("transform", d3.event.transform);
                    }
                }))
                .on('click', () => {
                        console.log('画布 click')
                })
                .on("dblclick.zoom", null)
        
            // defs  <defs>标签的内容不会显示，只有调用的时候才显示
            let defs = this.SVG.append('defs');
            // 添加箭头
            // this.marker = defs
            //     .append("marker")
            //     .attr('id', "marker")
            //     .attr("markerWidth", 10)    //marker视窗的宽
            //     .attr("markerHeight", 10)   //marker视窗的高
            //     .attr("refX", this.config.r + 3 * this.config.strokeWidth)            //refX和refY，指的是图形元素和marker连接的位置坐标
            //     .attr("refY", 4)
            //     .attr("orient", "auto")     //orient="auto"设置箭头的方向为自动适应线条的方向
            //     .attr("markerUnits", "userSpaceOnUse")  //marker是否进行缩放 ,默认值是strokeWidth,会缩放
            //     .append("path")
            //     .attr("d", "M 0 0 8 4 0 8Z")    //箭头的路径 从 （0,0） 到 （8,4） 到（0,8）
            //     .attr("fill", "steelblue");

            // 添加多个头像图片的 <pattern>
            let patterns = defs
                .selectAll("pattern.patternclass")
                .data(this.nodesData)
                .enter()
                .append("pattern")
                .attr("class", "patternclass")
                .attr("id", function (d, index) {
                    return 'avatar' + d.id
                })
                // 两个取值userSpaceOnUse  objectBoundingBox
                .attr('patternUnits', 'objectBoundingBox')
                // <pattern>，x、y值的改变决定图案的位置，宽度、高度默认为pattern图案占填充图形的百分比。
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", "1")
                .attr("height", "1")

            // 向<defs> - <pattern>添加 头像
            patterns.append("image")
                .attr("class", "circle")
                .attr("xlink:href", function (d) {
                    return d.avatar; // 修改节点头像
                })
                .attr("src", function (d) {
                    return d.avatar; // 修改节点头像
                })
                .attr("height", d => {
                    let r = d.index === 0 ? 45 : this.config.r
                    return r * 2
                })
                .attr("width", d => {
                    let r = d.index === 0 ? 45 : this.config.r
                    return r * 2
                })
                .attr("preserveAspectRatio", "xMidYMin slice");

            // 名字
            patterns.append("rect")
                .attr("x", "0")
                .attr("y", d => {
                    let r = d.index === 0 ? 45 : this.config.r 
                    return 4 / 3 * r
                })
                .attr("width", d => {
                    let r = d.index === 0 ? 45 : this.config.r
                    return r * 2
                })
                .attr("height", d => {
                    let r = d.index === 0 ? 45 : this.config.r
                    return 2 / 3 * r
                })
                .attr("fill", "black")
                .attr("opacity", "0.5");

            patterns.append("text")
                .attr("class", "nodetext")
                .attr("x", d => {
                    return d.index === 0 ? 45 : this.config.r
                })
                .attr("y", d => {
                    let r = d.index === 0 ? 45 : this.config.r
                    return (5 / 3 * r)
                })
                .attr('text-anchor', 'middle')
                .attr("fill", "#fff")
                .style("font-size", 12)
                .text(function (d) {
                    return d.name
                });

            // 放关系图的容器
            this.relMap_g = this.SVG.append("g")
                .attr("class", "relMap_g")
                .attr("width", this.config.width)
                .attr("height", this.config.height)
        },
        /**
         * @description 更新视图
         */
        update () {
            let that = this
            this.timer = null
            // 关系图添加线
            // 每条线是个容器，有线 和一个装文字的容器
            this.edges = this.relMap_g
                .selectAll("g.edge")
                .data(this.linksData)
                .enter()
                .append("g")
                .attr("class", "edge")
                .on('mouseover', function () {
                    d3.select(this).selectAll('path.links').attr('stroke-width', 2)
                    d3.select(this).selectAll('g.rect_g').attr('stroke-width', 2)
                })
                .on('mouseout', function () {
                    d3.select(this).selectAll('path.links').attr('stroke-width', 1)
                    d3.select(this).selectAll('g.rect_g').attr('stroke-width', 1)
                })
                .on('click', function (d) {
                    console.log('线click')
                })
                .attr('fill', function (d) {
                    let str = '#bad4ed';
                    if (d.color) {
                        str = "#" + d.color;
                    }
                    return str;
                })

            // 添加线
            this.links = this.edges.append("path").attr("class", "links")
                .attr("d", d => {
                    return "M" + that.config.linkSrc + "," + 0 + " L" + that.getDis(d.source, d.target) + ",0";
                })
                // .style("marker-end", "url(#marker)")
                // .attr("refX",this.config.r)
                .attr('stroke', (d) => {
                    let str = d.color ? "#" + d.color : this.config.linkColor
                    return str
                });

            // 添加关系文字的容器
            let rect_g = this.edges.append("g").attr("class", "rect_g")

            // 添加rect
            this.rects = rect_g.append("rect")
                .attr("x", 40)
                .attr("y", -10)
                .attr('rx', 10)
                .attr("width", (d) => {
                    return d.owner ? 100 : 60
                })
                .attr("height", 20)
                .attr('fill', (d) => {
                    let str = d.color ? "#" + d.color : this.config.linkColor
                    return str
                })

            // 文本标签  坐标（x,y）代表 文本的左下角的点
            this.texts = rect_g.append("text")
                .attr("x", 40)
                .attr("y", 5)
                .attr("text-anchor", "middle")  // <text>文本中轴对齐方式居中  start | middle | end
                .attr('fill', '#fff')
                .style("font-size", 12).text(d => {
                    return d.relation
                });


            // 关系图添加用于显示头像的节点
            this.circles = this.relMap_g.selectAll("circle.circleclass")
                .data(this.nodesData)
                .enter()
                .append("circle")
                .attr("class", "circleclass")
                .attr("id", (d) => {
                    return `circle${d.id}`
                })
                .style("cursor", "pointer")
                .attr("fill", function (d) {
                    return ("url(#avatar" + d.id + ")");
                })
                .attr("stroke", d => {
                    let color = "#ccf1fc"
                    if (d.color) {
                        color = `#${d.color}`
                    }
                    return color
                })
                .attr("stroke-width", d => {
                    return d.index === 0 ? this.config.strokeWidth + 2 : this.config.strokeWidth
                })
                .attr("r", d => {
                    return d.index === 0 ? 45 : this.config.r
                })
                .on('mouseover', function (d) {
                    d3.select(this).attr('stroke-width', '4');
                    d3.select(this).attr('stroke', d => {
                        let color = '#a3e5f9'
                        if (d.color) {
                            color = `#${d.color}`
                        }
                        return color
                    });
                    if (that.config.isHighLight) {
                        that.highlightRelations(d);
                    }
                    if (this.timer) {
                        clearTimeout(this.timer)
                    }
                    event = d3.event || window.event;
                    var pageX = event.pageX ? event.pageX : (event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft));
                    var pageY = event.pageY ? event.pageY : (event.clientY + (document.body.scrollTop || document.documentElement.scrollTop));
                })
                .on('mouseout', function (d) {
                    d3.select(this).attr('stroke-width', d => {
                        return d.index === 0 ? that.config.strokeWidth + 2 : that.config.strokeWidth
                    });
                    d3.select(this).attr('stroke', d => {
                        let color = '#c5dbf0'
                        if (d.color) {
                            color = `#${d.color}`
                        }
                        return color
                    });
                    if (that.config.isHighLight) {
                        that.highlightRelations(null);
                    }
                })
                .on('click', function (d) {
                    console.log('头像节点click')
                    //阻止事件冒泡  阻止事件默认行为
                    event.stopPropagation ? (event.stopPropagation()) : (event.cancelBubble = true);
                    event.preventDefault ? (event.preventDefault()) : (event.returnValue = false);
                })
                .on('contextmenu', function () {    //鼠标右键菜单
                    event = event || window.event;
                    event.cancelBubble = true
                    event.returnValue = false
                })
                // 应用 自定义的 拖拽事件
                .call(d3.drag()
                    .on('start', (d) => {
                        d3.event.sourceEvent.stopPropagation()
                        // restart()方法重新启动模拟器的内部计时器并返回模拟器。
                        // 与simulation.alphaTarget或simulation.alpha一起使用时，此方法可用于在交互
                        // 过程中进行“重新加热”模拟，例如在拖动节点时，在simulation.stop暂停之后恢复模拟。
                        // 当前alpha值为0，需设置alphaTarget让节点动起来
                        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart()
                        d.fx = d.x
                        d.fy = d.y
                    })
                    .on('drag', (d) => {
                        // d.fx属性- 节点的固定x位置
                        // 在每次tick结束时，d.x被重置为d.fx ，并将节点 d.vx设置为零
                        // 要取消节点，请将节点 .fx和节点 .fy设置为空，或删除这些属性。
                        d.fx = d3.event.x
                        d.fy = d3.event.y
                    })
                    .on('end', (d) => {
                        // 让alpha目标值值恢复为默认值0,停止力模型
                        if (!d3.event.active) this.simulation.alphaTarget(0)
                        d.fx = null
                        d.fy = null
                    }));
        },

        ticked () {
            const that = this
            // 修改每条容器edge的位置
            this.edges.attr("transform", function (d) {
                return that.getTransform(d.source, d.target, that.getDis(d.source, d.target))
            });

            // 修改每条线link位置
            this.links.attr("d", d => {
                return "M" + that.config.linkSrc + "," + 0 + " L" + that.getDis(d.source, d.target) + ",0";
            })

            // 修改线中关系文字text的位置 及 文字的反正
            this.texts
                .attr("x", function (d) {
                    // 根据字的长度来更新兄弟元素 rect 的宽度
                    // let bbox = d3.select(this).node().getBBox();
                    // let width = bbox.width;
                    // ########################
                    // $(this).prev('rect').attr('width', width + 10);
                    // d3.select(this).prev('rect').attr('width', width + 10);
                    // 更新 text 的位置
                    return that.getDis(d.source, d.target) / 2
                })
                .attr("transform", function (d) {
                    // 更新文本反正
                    if (d.target.x < d.source.x) {
                        let x = that.getDis(d.source, d.target) / 2
                        return 'rotate(180 ' + x + ' ' + 0 + ')'
                    } else {
                        return 'rotate(0)'
                    }
                });

            // 修改线中装文本矩形rect的位置
            this.rects
                .attr("x", function (d) {
                    // ######################
                    // return getDis(d.source, d.target) / 2 - $(this).attr('width') / 2
                    return that.getDis(d.source, d.target) / 2 - d3.select(this).attr('width') / 2
                })    // x 坐标为两点中心距离减去自身长度一半

            // 修改节点的位置
            this.circles
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
        },

        /**
         * @description 高亮元素及其相关的元素
         */
        highlightRelations (obj) {
            if (obj) {
                let objIndex = obj.index;
                this.dependsNode = this.dependsNode.concat([objIndex])
                this.dependsLinkAndText = this.dependsLinkAndText.concat([objIndex])
                this.linksData.forEach((lkItem) => {
                    if (objIndex == lkItem['source']['index']) {
                        this.dependsNode = this.dependsNode.concat([lkItem.target.index])
                    } else if (objIndex == lkItem['target']['index']) {
                        this.dependsNode = this.dependsNode.concat([lkItem.source.index])
                    }
                });

                // 隐藏节点
                this.SVG.selectAll('circle').filter((d) => {
                    return (this.dependsNode.indexOf(d.index) == -1);
                }).transition().style('opacity', 0.1)
                // 隐藏线
                this.SVG.selectAll('.edge').filter((d) => {
                    // return true;
                    return ((this.dependsLinkAndText.indexOf(d.source.index) == -1) && (this.dependsLinkAndText.indexOf(d.target.index) == -1))
                }).transition().style('opacity', 0.1)

            } else {
                // 取消高亮
                // 恢复隐藏的线
                this.SVG.selectAll('circle').filter(() => {
                    return true;
                }).transition().style('opacity', 1)
                // 恢复隐藏的线
                this.SVG.selectAll('.edge').filter((d) => {
                    // return true;
                    return ((this.dependsLinkAndText.indexOf(d.source.index) == -1) && (this.dependsLinkAndText.indexOf(d.target.index) == -1))
                }).transition().style('opacity', 1)
                this.dependsNode = []
                this.dependsLinkAndText = []
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.force-relation {
    width: 100%;
    height: 1000px;
}
</style>
