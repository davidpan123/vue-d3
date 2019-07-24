<template lang='pug'>
    div.histogram-pane
        histogram(:dataset="dataset")
</template>
 
<script>
import Histogram from '@/components/Histogram'
export default {
    name: '',
    data () {
        return {
            dataset: [10, 20, 30, 23, 13, 40, 27, 35, 20, 33]
        }
    },
    components: { Histogram }
}
</script>
 
<style lang="scss" scoped>
.histogram-pane {
    width: 100%;
    height: 100%;
}
</style>
