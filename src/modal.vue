<template>
    <div v-if="show" class="modal">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Props {
    show: boolean;
}

export default defineComponent({
    name: "Modal",
    props: {
        show: {
            type: Boolean,
            required: true,
        },
    },
});
</script>
