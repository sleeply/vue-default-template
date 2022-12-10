<template>
  <main>
    <!-- <router-view /> -->
    <div class="loader-container">
      <Loader />
    </div>
  </main>
</template>

<script setup>
import Loader from "@/components/Loader.vue"
</script>

<style lang="scss" >
@import "@/style/global.scss";

.loader-container {
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease !important;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
