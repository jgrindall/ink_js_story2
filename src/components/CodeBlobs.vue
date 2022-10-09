<template>
    <div class="blobs">
        <span class="blob blob1"></span>
        <span class="blob blob2"></span>
        <span class="blob blob3"></span>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
    .blobs{
        display: flex;
        align-items: center;
        gap:6px;
        .blob{
            width:16px;
            height:16px;
            border-radius: 50%;
            &.blob1{
                background: #ff5f56;
            }
            &.blob2{
                background: #ffbd2e;
            }
            &.blob3{
                background: #27c93f;
            }
        }
    }
</style>
