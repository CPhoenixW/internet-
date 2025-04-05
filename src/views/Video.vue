<template>
  <div class="video-container">
    <Header />
    <div class="content-area">
      <div class="main-content">
        <div class="video-section">
          <div class="video-player">
            <video controls :src="videoUrl" class="video-element"></video>
          </div>
          <div class="video-info">
            <h1 class="video-title">{{ currentVideo.title }}</h1>
            <div class="author-info">
              <span class="author-name">{{ currentVideo.author }}</span>
            </div>
          </div>
          <div class="action-buttons">
            <button 
              class="action-btn" 
              @click="handleLike"
              :class="{ 'liked': isLiked }"
            >
              <span class="icon">👍</span>
              <span class="count">{{ likes }}</span>
            </button>
            <button class="action-btn">
              <span class="icon">💬</span>
              <span class="count">{{ comments.length }}</span>
            </button>
            <button 
              @click="toggleFavorite"
              :class="['favorite-btn', { favorited: isFavorited }]"
            >
              {{ isFavorited ? '已收藏' : '收藏' }}
            </button>
          </div>
          <div class="comments-section">
            <h2>评论区</h2>
            <div class="comment-input">
              <textarea 
                v-model="newComment" 
                placeholder="写下你的评论..."
                rows="3"
              ></textarea>
              <button @click="submitComment" class="submit-btn">发表评论</button>
            </div>
            <div class="comments-list">
              <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="recommendations">
        <h3>相关推荐</h3>
        <div class="recommendation-list">
          <div 
            v-for="video in recommendedVideos" 
            :key="video.id" 
            class="recommendation-item"
            @click="goToVideo(video.id)"
          >
            <div class="recommendation-image">
              <img :src="video.image" :alt="video.title" />
            </div>
            <div class="recommendation-info">
              <h4 class="recommendation-title">{{ video.title }}</h4>
              <span class="recommendation-author">{{ video.author }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import SearchBox from '@/components/SearchBox.vue';
import axios from 'axios';

export default {
  name: 'VideoPage',
  components: {
    Header,
    SearchBox
  },
  data() {
    return {
      videoUrl: '/img/屏幕录制 2025-03-25 193924.mp4',
      currentVideo: {
        id: null,
        title: '加载中...',
        author: '加载中...'
      },
      isLiked: false,
      isFavorited: false,
      likes: 0,
      comments: [],
      newComment: '',
      recommendedVideos: [],
      loading: true
    };
  },
  created() {
    // 从路由参数获取视频ID
    const videoId = this.$route.params.id;
    this.fetchVideoData(videoId);
    this.fetchRecommendations();
  },
  methods: {
    async fetchVideoData(videoId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/videos/${videoId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        this.currentVideo = response.data;
        this.likes = response.data.likes;
        this.comments = response.data.comments;
        this.isLiked = response.data.isLiked;
        this.isFavorited = response.data.isFavorited;
      } catch (error) {
        console.error('获取视频数据失败:', error);
        // 使用模拟数据
        this.currentVideo = {
          id: videoId,
          title: '昆曲基础入门教学',
          author: '张三',
          likes: 328,
          isLiked: false,
          isFavorited: false
        };
        this.likes = 328;
        this.comments = [
          {
            id: 1,
            author: '李四',
            content: '讲解得很清楚，对初学者很有帮助！',
            time: '2024-03-25 19:45'
          },
          {
            id: 2,
            author: '王五',
            content: '希望能有更多这样的教学视频',
            time: '2024-03-25 20:15'
          },
          {
            id: 3,
            author: '张明',
            content: '老师讲解的很细致，每个动作都讲得很到位',
            time: '2024-03-25 20:30'
          },
          {
            id: 4,
            author: '小红',
            content: '作为昆曲爱好者，这个视频对我帮助很大',
            time: '2024-03-25 21:00'
          },
          {
            id: 5,
            author: '昆曲学习者',
            content: '这个系列太棒了，期待更多精彩内容',
            time: '2024-03-25 21:15'
          },
          {
            id: 6,
            author: '艺术爱好者',
            content: '讲解专业，示范到位，非常适合自学',
            time: '2024-03-25 21:30'
          },
          {
            id: 7,
            author: '戏曲迷',
            content: '老师的发声技巧讲解特别细致，受益匪浅',
            time: '2024-03-25 22:00'
          },
          {
            id: 8,
            author: '小李',
            content: '建议多出一些进阶内容，让我们能够系统学习',
            time: '2024-03-25 22:15'
          }
        ];
      }
    },
    async fetchRecommendations() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/videos/recommendations`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        this.recommendedVideos = response.data;
      } catch (error) {
        console.error('获取推荐失败:', error);
        // 使用模拟数据
        this.recommendedVideos = [
          {
            id: 2,
            title: '昆曲《牡丹亭》赏析',
            author: '李四',
            image: 'http://localhost:8080/img/cover1.jpg'
          },
          {
            id: 3,
            title: '昆曲唱腔技巧详解',
            author: '王五',
            image: 'http://localhost:8080/img/cover2.jpg'
          },
          {
            id: 4,
            title: '昆曲表演身段教学',
            author: '赵六',
            image: 'http://localhost:8080/img/cover3.jpg'
          },
          {
            id: 5,
            title: '昆曲经典剧目导赏',
            author: '张明',
            image: 'http://localhost:8080/img/cover4.jpg'
          },
          {
            id: 6,
            title: '昆曲扇子功基础教学',
            author: '李四',
            image: 'http://localhost:8080/img/cover5.jpg'
          },
          {
            id: 7,
            title: '昆曲《长生殿》选段教学',
            author: '王五',
            image: 'http://localhost:8080/img/cover6.jpg'
          },
          {
            id: 8,
            title: '昆曲表演艺术赏析',
            author: '赵六',
            image: 'http://localhost:8080/img/cover1.jpg'
          },
          {
            id: 9,
            title: '昆曲发声技巧进阶',
            author: '张明',
            image: 'http://localhost:8080/img/cover2.jpg'
          },
          {
            id: 10,
            title: '昆曲舞台表演实践',
            author: '李四',
            image: 'http://localhost:8080/img/cover3.jpg'
          },
          {
            id: 11,
            title: '昆曲《西厢记》教学',
            author: '王五',
            image: 'http://localhost:8080/img/cover4.jpg'
          }
        ];
      }
    },
    handleSearch(keyword) {
      this.$router.push(`/course?search=${keyword}`);
    },
    async handleLike() {
      try {
        const userId = localStorage.getItem('userID');
        const token = localStorage.getItem('token');
        
        if (!this.isLiked) {
          const response = await axios.post(
            `http://localhost:5000/api/videos/${this.currentVideo.id}/like`,
            { userId },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.success) {
            this.likes++;
            this.isLiked = true;
          }
        } else {
          const response = await axios.delete(
            `http://localhost:5000/api/videos/${this.currentVideo.id}/like`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              data: { userId }
            }
          );

          if (response.data.success) {
            this.likes--;
            this.isLiked = false;
          }
        }
      } catch (error) {
        console.error('点赞操作失败:', error);
      }
    },
    async toggleFavorite() {
      try {
        const userId = localStorage.getItem('userID');
        const token = localStorage.getItem('token');
        
        if (!this.isFavorited) {
          const response = await axios.post(
            `http://localhost:5000/api/videos/${this.currentVideo.id}/favorite`,
            { userId },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.success) {
            this.isFavorited = true;
          }
        } else {
          const response = await axios.delete(
            `http://localhost:5000/api/videos/${this.currentVideo.id}/favorite`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              data: { userId }
            }
          );

          if (response.data.success) {
            this.isFavorited = false;
          }
        }
      } catch (error) {
        console.error('收藏操作失败:', error);
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) return;
      
      try {
        const response = await axios.post(
          `http://localhost:5000/api/videos/${this.currentVideo.id}/comments`,
          {
            userId: localStorage.getItem('userID'),
            content: this.newComment
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          this.comments.unshift({
            id: response.data.commentId,
            author: localStorage.getItem('username'),
            content: this.newComment,
            time: new Date().toLocaleString()
          });
          this.newComment = '';
        }
      } catch (error) {
        console.error('发表评论失败:', error);
      }
    },
    goToVideo(videoId) {
      this.$router.push(`/video/${videoId}`);
      this.fetchVideoData(videoId);
      this.fetchRecommendations();
    }
  }
};
</script>

<style scoped>
.video-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;

}

.content-area {
  display: flex;
  gap: 24px;
  padding: 20px;
  margin-top: 50px;
  height: 100vh;
}

.main-content {
  flex: 1;
  max-width: 1000px;
  height: 100vh;
}

.video-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.video-player {
  width: 100%;
  background: #000;
}

.video-element {
  width: 100%;
  aspect-ratio: 16/9;
}

.video-info {
  text-align: left;
  padding: 20px;
}

.video-title {
  font-size: 24px;
  margin: 0 0 10px 0;
  color: #333;
}

.author-info {
  color: #666;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  padding: 0 20px 20px;
  border-bottom: 1px solid #eee;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f5f5f5;
}

.action-btn.liked {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.favorite-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  background: #f5f5f5;
}

.favorite-btn.favorited {
  background: #ffd700;
  color: #333;
  border-color: #ffd700;
}

.comments-section {
  padding: 20px;
}

.comment-input {
  margin-bottom: 20px;
}

.comment-input textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.submit-btn {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #0056b3;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: bold;
  color: #333;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-content {
  color: #666;
  line-height: 1.5;
}

.recommendations {
  width: 300px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: fit-content;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommendation-item {
  display: flex;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.recommendation-item:hover {
  transform: translateX(5px);
}

.recommendation-image {
  width: 120px;
  height: 68px;
  border-radius: 4px;
  overflow: hidden;
}

.recommendation-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommendation-info {
  flex: 1;
  min-width: 0;
}

.recommendation-title {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.recommendation-author {
  font-size: 12px;
  color: #666;
}

h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}
</style> 