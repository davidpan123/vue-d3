<template lang='pug'>
  div#app
    div.navbar
        div.menuList
            div.menu-item(v-for="item in menuList" :key="item.id"
                :class="{'active': curruntId === item.id}"
                @click="goMenu(item.url)"
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
                }
            ]
        }
    },
    methods: {
        goMenu (url) {
            console.log(url)
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
