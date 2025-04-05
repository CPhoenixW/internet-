<template>
  <div class="course-container">
    <Header>
      <div class="nav-search">
        <SearchBox @search="handleSearch" />
      </div>
    </Header>

    <div class="category-buttons">
      <button 
        v-for="category in categories" 
        :key="category.type"
        :class="['category-btn', { active: currentCategory === category.type }]"
        @click="selectCategory(category.type)"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="content-area">
      <SearchCourse 
        :searchKeyword="currentKeyword"
        :category="currentCategory"
      />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import SearchBox from '@/components/SearchBox.vue';
import SearchCourse from '@/components/SearchCourse.vue';

export default {
  name: 'CoursePage',
  components: {
    Header,
    SearchBox,
    SearchCourse
  },
  data() {
    return {
      currentKeyword: '',
      currentCategory: 'video',
      categories: [
        { type: 'video', name: '视频' },
        { type: 'ppt', name: '课件' },
        { type: 'live', name: '直播' }
      ]
    };
  },
  methods: {
    handleSearch(keyword) {
      this.currentKeyword = keyword;
    },
    selectCategory(type) {
      this.currentCategory = type;
    }
  }
};
</script>

<style scoped>
.course-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.nav-search {
  width: 100%;
}

.category-buttons {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  margin-top: 50px;
}

.category-btn {
  padding: 8px 24px;
  font-size: 16px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.category-btn:hover {
  color: #007bff;
}

.category-btn.active {
  color: #007bff;
  font-weight: bold;
}

.category-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: #007bff;
  border-radius: 2px;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style> 