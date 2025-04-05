<template>
  <div class="search-course">
    <div v-if="loading" class="loading">加载中...</div>
    
    <template v-else>
      <h2 v-if="!searchKeyword">{{ categoryTitle }}推荐</h2>
      <h2 v-else>搜索结果: "{{ searchKeyword }}"</h2>
      
      <div v-if="items.length === 0" class="no-results">
        {{ !searchKeyword ? '暂无推荐内容' : '没有找到相关内容' }}
      </div>
      
      <div v-else class="course-grid">
        <div v-for="item in items" :key="item.id" class="course-card" @click="goToCourse(item.url)">
          <div class="course-image">
            <img :src="item.image" :alt="item.title" />
            <div v-if="item.type === 'live'" class="live-badge">直播中</div>
          </div>
          <div class="course-info">
            <h3 class="course-title">{{ item.title }}</h3>
            <div class="course-author">{{ item.author }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';

const mockCourses = {
  video: [
    {
      id: 1,
      type: 'video',
      title: "昆曲基础入门教学",
      author: "张三",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/video/1"
    },
    {
      id: 2,
      type: 'video',
      title: "昆曲《牡丹亭》赏析",
      author: "李四",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/video/2"
    },
    {
      id: 3,
      type: 'video',
      title: "昆曲唱腔技巧详解",
      author: "王五",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/video/3"
    },
    {
      id: 4,
      type: 'video',
      title: "昆曲表演身段教学",
      author: "赵六",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/video/4"
    },
    {
      id: 5,
      type: 'video',
      title: "昆曲经典剧目介绍",
      author: "孙七",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/video/5"
    },
    {
      id: 6,
      type: 'video',
      title: "昆曲妆容造型讲解",
      author: "周八",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/video/6"
    }
  ],
  ppt: [
    {
      id: 101,
      type: 'ppt',
      title: "昆曲表演系统课程【初级班】",
      author: "张三",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/ppt/101"
    },
    {
      id: 102,
      type: 'ppt',
      title: "昆曲表演系统课程【中级班】",
      author: "李四",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/ppt/102"
    },
    {
      id: 103,
      type: 'ppt',
      title: "昆曲表演系统课程【高级班】",
      author: "王五",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/ppt/103"
    },
    {
      id: 104,
      type: 'ppt',
      title: "昆曲唱腔进阶课程",
      author: "赵六",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/ppt/104"
    },
    {
      id: 105,
      type: 'ppt',
      title: "昆曲身段提升班",
      author: "孙七",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/ppt/105"
    },
    {
      id: 106,
      type: 'ppt',
      title: "昆曲表演艺术大师班",
      author: "周八",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/ppt/106"
    }
  ],
  live: [
    {
      id: 201,
      type: 'live',
      title: "昆曲艺术赏析直播课",
      author: "张三",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/live/201"
    },
    {
      id: 202,
      type: 'live',
      title: "昆曲表演技巧在线指导",
      author: "李四",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/live/202"
    },
    {
      id: 203,
      type: 'live',
      title: "昆曲经典剧目排练课",
      author: "王五",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/live/203"
    },
    {
      id: 204,
      type: 'live',
      title: "昆曲唱腔练习直播",
      author: "赵六",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/live/204"
    },
    {
      id: 205,
      type: 'live',
      title: "昆曲身段基础训练",
      author: "孙七",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/live/205"
    },
    {
      id: 206,
      type: 'live',
      title: "昆曲表演大师在线答疑",
      author: "周八",
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/live/206"
    }
  ]
};

export default {
  name: 'SearchCourse',
  props: {
    searchKeyword: String,
    category: {
      type: String,
      required: true,
      validator: value => ['video', 'course', 'live'].includes(value)
    }
  },
  data() {
    return {
      items: [],
      loading: false
    };
  },
  computed: {
    categoryTitle() {
      const titles = {
        video: '视频',
        course: '课件',
        live: '直播'
      };
      return titles[this.category];
    }
  },
  watch: {
    searchKeyword: {
      handler: 'fetchData',
      immediate: true
    },
    category: {
      handler: 'fetchData',
      immediate: true
    }
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        if (this.searchKeyword) {
          await this.searchContent();
        } else {
          await this.fetchRecommendations();
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchRecommendations() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/${this.category}/recommendations/${localStorage.getItem('userID')}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        this.items = response.data;
      } catch (error) {
        console.error('获取推荐失败，使用模拟数据:', error);
        // 使用模拟数据
        this.items = mockCourses[this.category] || [];
      }
    },
    async searchContent() {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/${this.category}/search`,
          {
            keyword: this.searchKeyword,
            userId: localStorage.getItem('userID')
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        this.items = response.data;
      } catch (error) {
        console.error('搜索失败:', error);
        this.items = [];
      }
    },
    goToCourse(url) {
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped>
.search-course {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading, .no-results {
  text-align: center;
  padding: 40px;
  color: #888;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 20px;
}

.course-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.course-image {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
}

.course-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.course-info {
  padding: 12px;
}

.course-title {
  margin: 0;
  font-size: 16px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-author {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

h2 {
  margin: 20px 0;
  font-size: 24px;
  color: #333;
}
</style> 