<template lang='pug'>
  div#app
    div.navbar
        div.menuList
            div.menu-item(v-for="item in menuList" :key="item.id"
                :class="{'active': curruntId === item.id}"
                @click="goMenu(item.url, item.id)"
            ) {{item.name}}
    div.home-container
        <router-view/>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'
export default {
    name: 'Navbar',
    components: { Navbar },
    data () {
        return {
            curruntId: 1,
            menuList: [
                {
                    id: 1,
                    url: '/chart',
                    name: '柱状图'
                },
                {
                    id: 2,
                    url: '/tree',
                    name: '树状图'
                },
                {
                    id: 3,
                    url: '/orchestrator',
                    name: '编排'
                },
                {
                    id: 4,
                    url: '/force',
                    name: '力导向图'
                },
                {
                    id: 5,
                    url: '/relation',
                    name: '关系图'
                },
                {
                    id: 6,
                    url: '/scatter',
                    name: '散点图'
                },
                {
                    id: 7,
                    url: '/learn',
                    name: '练习'
                }
            ]
        }
    },
    methods: {
        goMenu (url, id) {
            console.log(url)
            this.curruntId = id
            this.$router.push(url)
        }
    }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
    .navbar {
        width: 200px;
        height: 100%;
        overflow-y: auto;
        background-color: #ffffff;
        position: absolute;
        top: 0;
        left: 0;
        .menuList {
            padding: 20px;
            .menu-item {
                cursor: pointer;
                padding-bottom: 10px;
                &.active {
                    color: #0081f6;
                }
            }
        }
    }
    .home-container {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        left: 200px;
    }
}
</style>
