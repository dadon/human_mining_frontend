<template>
    <DisplayCanvas />
</template>

<script>
import DisplayCanvas from "../components/DisplayCanvas";
export default {
    name: "MainPage.vue",
    components: { DisplayCanvas },
    computed: {
        address() {
            return this.$route.params.address || "0x017b9d3cFB2F775E4d24C9e93D7D6E3679E3F1fF";
        }
    }
};
</script>

<style scoped></style>
