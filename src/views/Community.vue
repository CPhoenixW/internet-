<template>
    <div class="community-container">
      <!-- 固定导航栏 -->
      <nav class="community-nav">
        <div class="logo">
            <img src="@/assets/logo.jpg" alt="Logo" class="logo-img" />
            <span class="logo-text">牡丹新声</span>
        </div>
        <div class="nav-search">
          <SearchBox @search="handleSearch" />
        </div>
        <div class="nav-user">
          <span>{{ username }}</span>
        </div>
      </nav>
  
      <!-- 内容区域 -->
      <div class="content-area">
        <SearchResults :searchKeyword="currentKeyword" />
      </div>
    </div>
  </template>
  
  <script>
  import SearchBox from '@/components/SearchBox.vue';
  import SearchResults from '@/components/SearchResults.vue';
  
  export default {
    name: 'CommunityPage',
    components: {
      SearchBox,
      SearchResults
    },
    data() {
      return {
        username: localStorage.getItem('username') || 'PhoenixW',
        currentKeyword: ''
      };
    },
    methods: {
      handleSearch(keyword) {
        this.currentKeyword = keyword;
      }
    }
  };
  </script>
  
  <style scoped>
  .community-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .community-nav {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 100;
  }
  
  .nav-logo {
    flex: 0 0 150px;
  }
  
  .nav-search {
    flex: 1;
    max-width: 600px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .nav-user {
    flex: 0 0 auto;
    font-weight: bold;
  }
  
  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  .logo {
    display: flex;
    align-items: center;
  }
  
  .logo-img {
    width: 50px;
    height: 40px;
    margin-right: 10px;
  }
  
  .logo-text {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
  </style>