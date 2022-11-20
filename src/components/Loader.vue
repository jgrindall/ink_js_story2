<template>
    <div class="loader">
        <div>
            <van-loading size="128" ></van-loading>
        </div>
    </div>
</template>

<script lang="ts" setup>

    const props = defineProps({
        'show':{

        }
    });

</script>

<style lang="scss" scoped>
    .loader{
        position: fixed;
        top: 0;
        width: 100%;
        left: 0;
        height: 100%;
        background: rgba(100,100,100,0.5);
        display: flex;
        justify-content: center;
        align-items: center;    
        >div{
            width:200px;
            height: 200px;
        }
    }
    
</style>
