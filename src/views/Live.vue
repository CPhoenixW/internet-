<template>
  <div class="live-container">
    <Header />
    <div class="content-area">
      <div class="main-content">
        <div class="live-section">
          <div class="live-player">
            <video controls :src="liveUrl" class="live-element"></video>
          </div>
          <div class="live-info">
            <h1 class="live-title">{{ currentLive.title }}</h1>
            <div class="live-status">
              <span class="status-badge" :class="{ 'live': isLiving }">
                {{ isLiving ? '直播中' : '未开始' }}
              </span>
              <span class="start-time">开播时间：{{ currentLive.startTime }}</span>
            </div>
            <div class="author-info">
              <span class="author-name">主播：{{ currentLive.author }}</span>
              <span class="viewer-count">{{ viewerCount }}人观看</span>
            </div>
          </div>
          <div class="action-buttons">
            <button 
              class="action-btn reservation" 
              @click="handleReservation"
              :class="{ 'reserved': isReserved }"
            >
              <span class="icon">📅</span>
              {{ isReserved ? '已预约' : '预约直播' }}
            </button>
            <button 
              class="action-btn replay"
              @click="showReplay"
            >
              <span class="icon">📼</span>
              直播回放
            </button>
            <button 
              class="action-btn comment"
              @click="focusComment"
            >
              <span class="icon">💬</span>
              <span class="count">{{ comments.length }}</span>
            </button>
          </div>
          <div class="comments-section">
            <h2>评论区</h2>
            <div class="comment-input">
              <textarea 
                v-model="newComment" 
                placeholder="写下你的评论..."
                rows="3"
                ref="commentInput"
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
        <h3>更多直播</h3>
        <div class="recommendation-list">
          <div 
            v-for="live in recommendedLives" 
            :key="live.id" 
            class="recommendation-item"
            @click="goToLive(live.id)"
          >
            <div class="recommendation-image">
              <img :src="live.image" :alt="live.title" />
              <span class="live-badge" v-if="live.isLiving">直播中</span>
            </div>
            <div class="recommendation-info">
              <h4 class="recommendation-title">{{ live.title }}</h4>
              <span class="recommendation-author">{{ live.author }}</span>
              <span class="recommendation-time">{{ live.startTime }}</span>
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
  name: 'LivePage',
  components: {
    Header,
    SearchBox
  },
  data() {
    return {
      liveUrl: '/path/to/live/stream',
      currentLive: {
        id: null,
        title: '加载中...',
        author: '加载中...',
        startTime: '加载中...',
        isLiving: false
      },
      isLiving: false,
      isReserved: false,
      viewerCount: 0,
      comments: [],
      newComment: '',
      recommendedLives: [],
      loading: true
    };
  },
  created() {
    const liveId = this.$route.params.id;
    this.fetchLiveData(liveId);
    this.fetchRecommendations();
    this.initializeWebSocket();
  },
  methods: {
    async fetchLiveData(liveId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/lives/${liveId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        this.currentLive = response.data;
        this.isLiving = response.data.isLiving;
        this.viewerCount = response.data.viewerCount;
        this.comments = response.data.comments;
        this.isReserved = response.data.isReserved;
      } catch (error) {
        console.error('获取直播数据失败:', error);
        // 使用模拟数据
        this.currentLive = {
          id: liveId,
          title: '昆曲表演技巧直播课',
          author: '张三',
          startTime: '2024-03-26 20:00',
          isLiving: true
        };
        this.isLiving = true;
        this.viewerCount = 1280;
        this.comments = [
          {
            id: 1,
            author: '李四',
            content: '老师讲得太好了！',
            time: '2024-03-26 20:05'
          },
          {
            id: 2,
            author: '王五',
            content: '这个动作可以再示范一遍吗？',
            time: '2024-03-26 20:08'
          }
        ];
      }
    },
    async fetchRecommendations() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/lives/recommendations`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        this.recommendedLives = response.data;
      } catch (error) {
        console.error('获取推荐失败:', error);
        // 使用模拟数据
        this.recommendedLives = [
          {
            id: 2,
            title: '昆曲《牡丹亭》演出直播',
            author: '李四',
            startTime: '今天 20:00',
            image: 'http://localhost:8080/img/cover1.jpg',
            isLiving: true
          },
          {
            id: 3,
            title: '昆曲发声技巧教学',
            author: '王五',
            startTime: '明天 19:00',
            image: 'http://localhost:8080/img/cover2.jpg',
            isLiving: false
          },
          {
            id: 4,
            title: '昆曲身段基础教学',
            author: '赵六',
            startTime: '后天 14:00',
            image: 'http://localhost:8080/img/cover3.jpg',
            isLiving: false
          },
          {
            id: 5,
            title: '昆曲《长生殿》选段解析',
            author: '孙七',
            startTime: '今天 21:30',
            image: 'http://localhost:8080/img/cover4.jpg',
            isLiving: true
          },
          {
            id: 6,
            title: '昆曲妆容造型直播',
            author: '周八',
            startTime: '明天 15:00',
            image: 'http://localhost:8080/img/cover5.jpg',
            isLiving: false
          },
          {
            id: 7,
            title: '昆曲《西厢记》经典片段赏析',
            author: '张三',
            startTime: '今天 22:00',
            image: 'http://localhost:8080/img/cover6.jpg',
            isLiving: true
          },
          {
            id: 8,
            title: '昆曲扇子功技巧教学',
            author: '李四',
            startTime: '后天 10:00',
            image: 'http://localhost:8080/img/cover1.jpg',
            isLiving: false
          }
        ];
      }
    },
    initializeWebSocket() {
      // 实现WebSocket连接，用于实时更新观众数量和评论
      // 这里是示例代码
      const ws = new WebSocket('ws://localhost:5000/ws/live');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'viewer_count') {
          this.viewerCount = data.count;
        } else if (data.type === 'new_comment') {
          this.comments.unshift(data.comment);
        }
      };
    },
    async handleReservation() {
      try {
        const userId = localStorage.getItem('userID');
        const token = localStorage.getItem('token');
        
        if (!this.isReserved) {
          const response = await axios.post(
            `http://localhost:5000/api/lives/${this.currentLive.id}/reserve`,
            { userId },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.success) {
            this.isReserved = true;
            alert('预约成功！直播开始前将通过邮件提醒您。');
          }
        } else {
          const response = await axios.delete(
            `http://localhost:5000/api/lives/${this.currentLive.id}/reserve`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              data: { userId }
            }
          );

          if (response.data.success) {
            this.isReserved = false;
          }
        }
      } catch (error) {
        console.error('预约操作失败:', error);
      }
    },
    showReplay() {
      this.$router.push(`/live/${this.currentLive.id}/replay`);
    },
    focusComment() {
      this.$refs.commentInput.focus();
    },
    async submitComment() {
      if (!this.newComment.trim()) return;
      
      try {
        const response = await axios.post(
          `http://localhost:5000/api/lives/${this.currentLive.id}/comments`,
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
    goToLive(liveId) {
      this.$router.push(`/live/${liveId}`);
      this.fetchLiveData(liveId);
      this.fetchRecommendations();
    }
  }
};
</script>

<style scoped>
.live-container {
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

.live-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.live-player {
  width: 100%;
  background: #000;
}

.live-element {
  width: 100%;
  aspect-ratio: 16/9;
}

.live-info {
  text-align: left;
  padding: 20px;
}

.live-title {
  font-size: 24px;
  margin: 0 0 10px 0;
  color: #333;
}

.live-status {
  margin-bottom: 10px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  background: #666;
  color: white;
  font-size: 12px;
  margin-right: 10px;
}

.status-badge.live {
  background: #ff4757;
  animation: pulse 2s infinite;
}

.start-time {
  color: #666;
  font-size: 14px;
}

.viewer-count {
  margin-left: 15px;
  color: #666;
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

.action-btn.reservation {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.action-btn.reservation:hover {
  background: #0056b3;
}

.action-btn.reservation.reserved {
  background: #28a745;
  border-color: #28a745;
}

.action-btn.replay {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.action-btn.replay:hover {
  background: #5a6268;
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
  position: relative;
}

.recommendation-item:hover {
  transform: translateX(5px);
}

.recommendation-image {
  width: 120px;
  height: 68px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.recommendation-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: #ff4757;
  color: white;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 12px;
}

.recommendation-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.recommendation-title {
  margin: 0 0 4px 0;
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
  margin-bottom: 2px;
}

.recommendation-time {
  font-size: 12px;
  color: #999;
}

h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style> 