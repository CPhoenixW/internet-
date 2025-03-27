<template>
  <div class="app">
    <Header />
    <iframe
      src="https://primary-emoji-339261.framer.app/"
      class="iframe"
    ></iframe>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
</script>

<style>
html, body, .app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.iframe {
  position: absolute;
  top: 60px; /* 预留 Header 高度 */
  left: 0;
  width: 100%;
  height: calc(100% - 60px); /* 让 iframe 填充 Header 下面的空间 */
  border: none;
}
</style>
