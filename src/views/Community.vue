<template>
    <div class="community-container">
      <Header>
        <div class="nav-search">
          <SearchBox @search="handleSearch" />
        </div>
      </Header>
  
      <!-- 内容区域 -->
      <div class="content-area">
        <SearchResults :searchKeyword="currentKeyword" />
      </div>
    </div>
  </template>
  
  <script>
  import Header from '@/components/Header.vue';
  import SearchBox from '@/components/SearchBox.vue';
  import SearchResults from '@/components/SearchCommunity.vue';
  
  export default {
    name: 'CommunityPage',
    components: {
      Header,
      SearchBox,
      SearchResults
    },
    data() {
      return {
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
  
  .nav-search {
    width: 100%;
  }
  
  .content-area {
    margin-top: 50px;
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  </style>