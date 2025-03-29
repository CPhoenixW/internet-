<template>
  <div class="search-box">
    <input
      type="text"
      v-model="keyword"
      placeholder="搜索社区内容..."
      @keyup.enter="triggerSearch"
    />
    <button @click="triggerSearch">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  data() {
    return {
      keyword: ''
    };
  },
  methods: {
    triggerSearch() {
      this.$emit('search', this.keyword.trim());
    }
  }
};
</script>

<style scoped>
.search-box {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;
}

.search-box input {
  flex: 1;
  padding: 8px 15px;
  border: none;
  outline: none;
}

.search-box button {
  width: 40px;
  background: #f8f8f8;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-box button:hover {
  background: #eee;
}
</style>