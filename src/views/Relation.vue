<template lang='pug'>
    div.force-pane
        RelationChart(:nodesData="nodesData" :linksData="linksData" :configs="configs")
</template>
<script>
/**
 * 力导向图
 */
import * as d3 from 'd3'
import RelationChart from '@/components/RelationChart'
let mockData = [
    {
        "cllx":"小型轿车",
        "clsbdh":"WDDUG6CB0GA222187",
        "csys":"黑色",
        "czsfz":"320321199209261417",
        "czsr":"1993-10-12",
        "czxb":"女",
        "czxm":"渠帅",
        "hphm":"陕AR6V67",
        "img": require('../assets/img/140646844806.jpg'),
        "jsrMapList":[
            {
                "csrq":"1996-10-06",
                "tcr":[
                    {
                        "csrq":"2012-08-10",
                        "sfzh":"54a81085-f4ab-482c-a75c-15c99512051",
                        "xm":"铁葶",
                        "count":42,
                        "xb":"男",
                        "pic": require('../assets/img/141152124754.jpg')
                    },
                    {
                        "csrq":"2012-08-10",
                        "sfzh":"54a81085-f4ab-482c-a75c-15c99147183",
                        "xm":"余熹酌",
                        "count":6,
                        "xb":"女",
                        "pic": require('../assets/img/141152124754.jpg')
                    }
                ],
                "sfzh":"54a81085-f4ab-482c-a75c-15c99531011",
                "xm":"胥梁嗓",
                "count":31,
                "xb":"女",
                "pic": require('../assets/img/140848800133.jpg')
            },
            {
                "csrq":"1996-10-06",
                "tcr":[
                    {
                        "csrq":"2012-08-10",
                        "sfzh":"54a81085-f4ab-482c-a75c-15c99568001",
                        "xm":"佘末昶",
                        "count":38,
                        "xb":"男",
                        "pic": require('../assets/img/141152124754.jpg')
                    },
                    {
                        "csrq":"2012-08-10",
                        "sfzh":"54a81085-f4ab-482c-a75c-15c99718159",
                        "xm":"宓劈伫",
                        "count":12,
                        "xb":"女",
                        "pic": require('../assets/img/141152124754.jpg')
                    },
                    {
                        "csrq":"2014-03-12",
                        "sfzh":"54a81085-f4ab-482c-a75c-15c99741150",
                        "xm":"宗鄂鎏",
                        "count":4,
                        "xb":"男",
                        "pic": require('../assets/img/141152124754.jpg')
                    }
                ],
                "sfzh":"54a81085-f4ab-482c-a75c-15c99571005",
                "xm":"兀官擎",
                "count":31,
                "xb":"女",
                "pic": require('../assets/img/140848800133.jpg')
            },
            {
                "csrq":"1996-10-06",
                "tcr":[
                    {
                        "csrq":"2012-08-10",
                        "sfzh":"54a81085-f4ab-482c-a75c-15c99634052",
                        "xm":"竹但医",
                        "count":44,
                        "xb":"男",
                        "pic": require('../assets/img/141152124754.jpg')
                    },
                    {
                        "csrq":"2014-03-12",
                        "sfzh":"54a81085-f4ab-482c-a75c-15c99712684",
                        "xm":"慎泰",
                        "count":4,
                        "xb":"女",
                        "pic": require('../assets/img/141152124754.jpg')
                    },
                    {
                        "csrq":"2012-08-10",
                        "sfzh":"54a81085-f4ab-482c-a75c-15c99752626",
                        "xm":"昌迫锏",
                        "count":2,
                        "xb":"男",
                        "pic": require('../assets/img/141152124754.jpg')
                    }
                ],
                "sfzh":"54a81085-f4ab-482c-a75c-15c99628020",
                "xm":"邬狩滂",
                "count":66,
                "xb":"女",
                "pic": require('../assets/img/140848800133.jpg')
            }
        ],
        "ppxh":"梅赛德斯-奔驰2996CC轿车",
        "syrMapList":[
            {
                "csrq":"1993-10-12",
                "sfzh":"320321199209261417",
                "xm":"渠帅",
                "count":2,
                "xb":"女",
                "pic": require('../assets/img/141152124754.jpg'),
                "syr":{
                    "tcr":[
                        {
                            "csrq":"2012-08-10",
                            "sfzh":"54a81085-f4ab-482c-a75c-15c99634052",
                            "xm":"竹但医",
                            "count":44,
                            "xb":"女",
                            "pic": require('../assets/img/141152124754.jpg'),
                        },
                        {
                            "csrq":"2014-03-12",
                            "sfzh":"54a81085-f4ab-482c-a75c-15c99712684",
                            "xm":"慎泰",
                            "count":4,
                            "xb":"女",
                            "pic": require('../assets/img/141152124754.jpg'),
                        }
                    ]
                }
            }
        ]
    }
]

let mockData2 = [{
    "xm": "达扎",
    "xb": "女",
    "csrq": "1982-07-04",
    "sfzh": "542122196510210058",
    "pic": "./img/141152124754.jpg",
    "jsclxx": [{
            "cs": "5",
            "ys": "J",
            "cllx": "K31",
            "ppxh": "丰田牌",
            "hphm": "陕AS31F7",
            "img": "./img/140646844806.jpg",
            "syr": {
                "xm": "达扎",
                "xb": "男",
                "csrq": "1993-10-12",
                "sfzh": "622627198711050032",
                "pic": "./img/141152124754.jpg"
            },
            "jsr": {
                "xm": "张丽娜",
                "xb": "女",
                "csrq": "1982-11-21",
                "sfzh": "610125197405053256",
                "pic": "./img/141152124754.jpg",
                "cs": "55"
            },
            "syxz": "9",
            "clsbm": "LVGDC46A6DG520360",
            "fdjbh": null,
            "zcrq": "2013-12-11 00:00:00",
            "fzrq": "2016-04-25 10:52:44",
            "wkcc": "{cwkc:4795,cwkk1910,cwkg1760}",
            "isOwner": true
        },
        {
            "cs": "6",
            "ys": "J",
            "cllx": "K33",
            "ppxh": "奥迪牌",
            "hphm": "陕AM92X6",
            "img": "./img/140646844806.jpg",
            "syr": {
                "xm": "王鹏",
                "xb": "女",
                "csrq": "1993-10-12",
                "sfzh": "622627198711050036",
                "pic": "./img/141152124754.jpg"
            },
            "jsr": {
                "xm": "张周全",
                "xb": "女",
                "csrq": "1982-11-21",
                "sfzh": "610125197405053556",
                "pic": "./img/141152124754.jpg",
                "cs": "5"
            },
            "syxz": "9",
            "clsbm": "LFV3A24G7F3139247",
            "fdjbh": null,
            "zcrq": "2016-03-08 12:10:44",
            "fzrq": "2016-03-08 13:36:00",
            "wkcc": "{cwkc:5036,cwkk1874,cwkg1466}",
            "isOwner": false
        },
        {
            "cs": "4",
            "ys": "J",
            "cllx": "K33",
            "ppxh": "起亚牌",
            "hphm": "陕AS85R7",
            "img": "./img/140646844806.jpg",
            "syr": {
                "xm": "王更五",
                "xb": "女",
                "csrq": "1993-10-12",
                "sfzh": "622726198708200856",
                "pic": "./img/141152124754.jpg"
            },
            "jsr": {
                "xm": "富斤缺",
                "xb": "男",
                "csrq": "2011-01-09",
                "sfzh": "542122196510240058",
                "pic": "./img/141152124754.jpg",
                "cs": "5"
            },
            "syxz": "9",
            "clsbm": "LJDGAA223B0213025",
            "fdjbh": null,
            "zcrq": "2011-09-01 00:00:00",
            "fzrq": "2016-04-26 11:03:18",
            "wkcc": "{cwkc:4530,cwkk1775,cwkg1460}",
            "isOwner": false
        }
    ],
    "czclxx": [{
        "cs": "4",
        "ys": "J",
        "cllx": "K33",
        "ppxh": "起亚牌",
        "hphm": "陕AS85R7",
        "img": "./img/140646844806.jpg",
        "syr": {
            "xm": "王更五",
            "xb": "女",
            "csrq": "1993-10-12",
            "sfzh": "622726198708200856",
            "pic": "./img/141152124754.jpg"
        },
        "jsr": [{
            "xm": "陈安",
            "xb": "女",
            "csrq": "1995-03-07",
            "sfzh": "610104196303072119",
            "pic": "./img/141152124754.jpg",
            "cs": "5"
        }],
        "syxz": "9",
        "clsbm": "LJDGAA223B0213025",
        "fdjbh": null,
        "zcrq": "2011-09-01 00:00:00",
        "fzrq": "2016-04-26 11:03:18",
        "wkcc": "{cwkc:4530,cwkk1775,cwkg1460}",
        "isOwner": false
    }]
}]
export default {
    name: 'Scale',
    data() {
        return {
            configs: {},
            nodesData: [],
            linksData: []
        }
    },
    created(){
        this.init()
    },
    methods: {
        init () {
            // 获取所有
            this.getRelationByType(['owner', 'driver', 'passenger'])
            // this.getRelationByType(['owner'])
            // this.getRelationByType(['driver'])
            // this.getRelationByType(['passenger'])
            // this.getRelationByType(['owner', 'driver'])
            // this.getRelationByType(['owner', 'passenger'])
            // this.getRelationByType(['driver', 'passenger'])
            // this.getRelationByType([])
            // this.getRelationByType2(['owner', 'driver', 'passenger'])
            // this.getRelationByType2(['owner'])
            // this.getRelationByType2(['driver'])
            // this.getRelationByType2(['passenger'])
            // this.getRelationByType2(['owner', 'driver'])
            // this.getRelationByType2(['owner', 'passenger'])
            // this.getRelationByType2(['driver', 'passenger'])
            // this.getRelationByType2([])
        },
       
        /**
         * @description 根据类型获取关系
         * @params Types ['owner', 'driver', 'passenger']
         */
        getRelationByType(Types) {
            let result = this.getRelationData(mockData, Types)
            this.nodesData = result.nodes
            this.linksData = result.links
        },

        /**
         * @description 获取关系数据(车 ----> 人)
         */
        getRelationData(data, Types) {
            let result = {
                nodes: [],
                links: []
            }
            data.forEach(item => {
                // 车辆信息
                const carInfo = {
                    id: item.hphm,
                    name: item.hphm,
                    avatar: item.img,
                    carColor: item.csys,
                    type: item.ppxh,
                    num: item.fdjbh ? item.fdjbh : '--',
                    isCar: true,
                    color: '2080F7',
                }
                result.nodes.push(carInfo)
                // 车辆所有人信息
                if (Types.includes('owner')) {
                    item.syrMapList.forEach((ownerItem, index) => {
                        const ownerInfo = {
                            id: ownerItem.sfzh,
                            name: ownerItem.xm,
                            avatar: ownerItem.pic,
                            owner: true,
                            sex: ownerItem.xb,
                            brithdayDate: ownerItem.csrq,
                            color: '2080F7'
                        }
                        result.nodes.push(ownerInfo)
                        // 建立车主与车的关系
                        const ownerLink = {
                            source: 0,
                            target: index + 1,
                            relation: `车主驾驶${ownerItem.count}次`,
                            color: '2080F7',
                            owner: true
                        }
                        result.links.push(ownerLink)
                    })
                }
                

                // 驾驶人和乘坐人信息
                item.jsrMapList.forEach(driverItem => {
                    let driverLink = null
                    if (Types.includes('driver')) {
                        const driverInfo = {
                            id: driverItem.sfzh,
                            name: driverItem.xm,
                            avatar: driverItem.pic,
                            sex: driverItem.xb,
                            brithdayDate: driverItem.csrq,
                            color: 'FF952C'
                        }
                        result.nodes.push(driverInfo)
                        // 建立驾驶人与车的关系
                        driverLink = {
                            source: 0,
                            target: result.nodes.length - 1,
                            relation: `驾驶${driverItem.count}次`,
                            color: 'FF952C'
                        }
                        result.links.push(driverLink)
                    }


                
                    // 同乘人的信息
                    if (Types.includes('passenger')) {
                        const source = driverLink ? driverLink.target : 0
                        driverItem.tcr.forEach(passItem => {
                            const passInfo = {
                                id: passItem.sfzh,
                                name: passItem.xm,
                                avatar: passItem.pic,
                                sex: passItem.xb,
                                brithdayDate: passItem.csrq,
                                color: '00BF0F'
                            }
                        
                            result.nodes.push(passInfo)
                            // 建立驾驶人与同乘人的关系
                            const passLink = {
                                source: source,
                                target: result.nodes.length - 1,
                                relation: `同乘${passItem.count}次`,
                                color: '00BF0F'
                            }
                            result.links.push(passLink)
                        })
                    }
                })
            })

            return result
        },

        /**
         * @description 根据类型获取关系
         * @params Types ['owner', 'driver', 'passenger']
         */
        getRelationByType2(Types) {
            clearMap()
            let result = getRelationData2(mockData2, Types)
            new RelationChart(map, result)
        },

        getRelationData2(data, Types) {
            let result = {
                nodes: [],
                links: []
            }
            if(!data.length) return result
            const personInfo = data[0]
            const personCenterInfo = {
                id: personInfo.sfzh,
                name: personInfo.xm,
                avatar: personInfo.pic,
                sex: personInfo.xb,
                brithdayDate: personInfo.csrq,
                color: '2080F7'
            }
            result.nodes.push(personCenterInfo)

            // 判断是否有车主
            let isHasCarOwner = personInfo.jsclxx.some(item => item.isOwner)
            // 构建中心人和驾驶车辆信息
            personInfo.jsclxx.forEach(driverCarItem => {
                // 驾驶车辆信息
                const driverCarInfo = {
                    id: driverCarItem.hphm,
                    name: driverCarItem.hphm,
                    avatar: driverCarItem.img,
                    carColor: driverCarItem.ys,
                    type: driverCarItem.ppxh,
                    num: driverCarItem.fdjbh ? driverCarItem.fdjbh : '--',
                    isCar: true,
                    color: 'FF952C'
                }
                if (Types.includes('owner')) {
                    if (driverCarItem.isOwner) {
                        result.nodes.push(driverCarInfo)
                    }
                }

                if (Types.includes('driver')) {
                    if (!driverCarItem.isOwner) {
                        result.nodes.push(driverCarInfo)
                    }
                }
                
                // 建立中心人与驾驶车的关系
                const personCenterLink = {
                    source: 0,
                    target: result.nodes.length - 1,
                    relation: driverCarItem.isOwner ? `名下车辆驾驶${driverCarItem.cs}次` : `驾驶${driverCarItem.cs}次`,
                    color: driverCarItem.isOwner ? '2080F7' : 'FF952C',
                    owner: driverCarItem.isOwner
                }

                if (Types.includes('owner')) {
                    if (driverCarItem.isOwner) {
                        result.links.push(personCenterLink)
                    }
                }

                if (Types.includes('driver')) {
                    if (!driverCarItem.isOwner) {
                        result.links.push(personCenterLink)
                    }
                }

                // 构建车与车主和驾驶人的关系
                const source = personCenterLink.target

                const ownerInfo = {
                    id: driverCarItem.syr.sfzh,
                    name: driverCarItem.syr.xm,
                    avatar: driverCarItem.syr.pic,
                    sex: driverCarItem.syr.xb,
                    brithdayDate: driverCarItem.syr.csrq,
                    color: '2080F7'
                }
                if (Types.includes('owner')) {
                    if (driverCarItem.isOwner) {
                        result.nodes.push(ownerInfo)
                    }

                    if (Types.includes('driver')) {
                        result.nodes.push(ownerInfo)
                    }
                }

                // 建立车与车主的关系
                const ownerLink = {
                    source: source,
                    target: result.nodes.length - 1,
                    relation: '车主',
                    color: '2080F7'
                }
                if (Types.includes('owner')) {
                    if (driverCarItem.isOwner) {
                        result.links.push(ownerLink)
                    }

                    if (Types.includes('driver')) {
                        result.links.push(ownerLink)
                    }
                }
                
                // 建立车与驾驶人的关系
                if (Types.includes('driver')) {
                    if (Types.includes('owner')) {
                        // 驾驶人信息
                        let driverItem = driverCarItem.jsr
                        const driverInfo = {
                            id: driverItem.sfzh,
                            name: driverItem.xm,
                            avatar: driverItem.pic,
                            sex: driverItem.xb,
                            brithdayDate: driverItem.csrq,
                            color: 'FF952C'
                        }
                        if (isHasCarOwner || driverInfo.id !== personCenterInfo.id) {
                            result.nodes.push(driverInfo)
                            // 建立驾驶人关系
                            const driverLink = {
                                source: source,
                                target: result.nodes.length - 1,
                                relation: `驾驶${driverItem.cs}次`,
                                color: 'FF952C'
                            }
                            result.links.push(driverLink)
                        }
                    } else {
                        if (!driverCarItem.isOwner) {
                            // 驾驶人信息
                            let driverItem = driverCarItem.jsr
                            const driverInfo = {
                                id: driverItem.sfzh,
                                name: driverItem.xm,
                                avatar: driverItem.pic,
                                sex: driverItem.xb,
                                brithdayDate: driverItem.csrq,
                                color: 'FF952C'
                            }
                            if (isHasCarOwner || driverInfo.id !== personCenterInfo.id) {
                                result.nodes.push(driverInfo)
                                // 建立驾驶人关系
                                const driverLink = {
                                    source: source,
                                    target: result.nodes.length - 1,
                                    relation: `驾驶${driverItem.cs}次`,
                                    color: 'FF952C'
                                }
                                result.links.push(driverLink)
                            }
                        }
                    }
                }
            })

            // 构建中心人和乘坐车辆信息
            if (Types.includes('passenger')) {
                personInfo.czclxx.forEach(passCarItem => {
                    // 乘坐车辆信息
                    const passCarInfo = {
                        id: passCarItem.hphm,
                        name: passCarItem.hphm,
                        avatar: passCarItem.img,
                        carColor: passCarItem.ys,
                        type: passCarItem.ppxh,
                        num: passCarItem.fdjbh ? passCarItem.fdjbh : '--',
                        isCar: true,
                        color: 'FF952C'
                    }
                    result.nodes.push(passCarInfo)

                    // 建立中心人与乘坐车的关系
                    const passCarLink = {
                        source: 0,
                        target: result.nodes.length - 1,
                        relation: `乘坐${passCarItem.cs}次`,
                        color: '00BF0F'
                    }
                    result.links.push(passCarLink)

                    // 构建乘坐车辆的关系
                    const source = passCarLink.target
                    const passCarOwnerInfo = {
                        id: passCarItem.syr.sfzh,
                        name: passCarItem.syr.xm,
                        avatar: passCarItem.syr.pic,
                        sex: passCarItem.syr.xb,
                        brithdayDate: passCarItem.syr.csrq,
                        color: '2080F7'
                    }
                    if (Types.includes('owner')) {
                        result.nodes.push(passCarOwnerInfo)
                    }
                    
                    // 建立乘坐车辆和车主的关系
                    const passCarOwnerLink = {
                        source: source,
                        target: result.nodes.length - 1,
                        relation: '车主',
                        color: '2080F7'
                    }
                    if (Types.includes('owner')) {
                        result.links.push(passCarOwnerLink)
                    }
                    
                    // 建立乘坐车辆和驾驶人的关系
                    if (Types.includes('driver')) {
                        passCarItem.jsr.forEach(driverItem => {
                            // 驾驶人信息
                            const driverInfo = {
                                id: driverItem.sfzh,
                                name: driverItem.xm,
                                avatar: driverItem.pic,
                                sex: driverItem.xb,
                                brithdayDate: driverItem.csrq,
                                color: 'FF952C'
                            }
                            result.nodes.push(driverInfo)
                            // 建立驾驶人关系
                            const driverLink = {
                                source: source,
                                target: result.nodes.length - 1,
                                relation: `驾驶${driverItem.cs}次`,
                                color: 'FF952C'
                            }
                            result.links.push(driverLink)
                        })
                    }
                })
            }
            
            return result
        }
    },
    components: { RelationChart }
}
</script>
<style lang='scss' scoped>
</style>
