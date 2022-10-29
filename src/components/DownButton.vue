<template>
     <button class="down" :class="{'show': show}" @click="down">
        <div>
            <span>V</span>
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
