<template>
    <DisplayCanvas :address="address"/>
</template>

<script>
import DisplayCanvas from "../components/DisplayCanvas";
export default {
    name: "MainPage.vue",
    components: { DisplayCanvas },
    computed: {
        address() {
            return this.$route.params.address || "1";
        }
    }
};
</script>

<style scoped></style>
