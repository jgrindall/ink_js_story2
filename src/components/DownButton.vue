<template>
     <button class="down" :class="{'show': show}" @click="down">
        <div>
            <van-icon name="arrow-down" color="#ee0a24" size="1.5rem"/>
        </div>
    </button>
</template>

<script lang="ts" setup>

    const props = defineProps({
        'show':{

        }
    });

</script>

<style lang="scss" scoped>
    .down{
        &.show{
            opacity: 1;
        }
    }
    
</style>
