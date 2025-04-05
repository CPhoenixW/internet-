<template>
  <div class="ppt-container">
    <Header />
    <div class="content-area">
      <div class="main-content">
        <div class="ppt-section">
          <div class="ppt-preview">
            <img :src="currentPPT.previewImage" class="preview-image" :alt="currentPPT.title" />
          </div>
          <div class="ppt-info">
            <h1 class="ppt-title">{{ currentPPT.title }}</h1>
            <div class="author-info">
              <span class="author-name">作者：{{ currentPPT.author }}</span>
              <span class="upload-time">上传时间：{{ currentPPT.uploadTime }}</span>
              <span class="download-count">{{ downloadCount }}次下载</span>
            </div>
          </div>
          <div class="action-buttons">
            <button 
              class="action-btn preview" 
              @click="handlePreview"
            >
              <span class="icon">👁️</span>
              预览
            </button>
            <button 
              class="action-btn download"
              @click="handleDownload"
            >
              <span class="icon">⬇️</span>
              下载
            </button>
            <button 
              @click="toggleFavorite"
              :class="['favorite-btn', { favorited: isFavorited }]"
            >
              <span class="icon">{{ isFavorited ? '⭐' : '☆' }}</span>
              {{ isFavorited ? '已收藏' : '收藏' }}
            </button>
          </div>
          <div class="ppt-description">
            <h2>课件简介</h2>
            <div class="description-content">{{ currentPPT.description }}</div>
            <div class="tags">
              <span class="tag" v-for="tag in currentPPT.tags" :key="tag">{{ tag }}</span>
            </div>
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
        <h3>相关课件</h3>
        <div class="recommendation-list">
          <div 
            v-for="ppt in recommendedPPTs" 
            :key="ppt.id" 
            class="recommendation-item"
            @click="goToPPT(ppt.id)"
          >
            <div class="recommendation-image">
              <img :src="ppt.previewImage" :alt="ppt.title" />
            </div>
            <div class="recommendation-info">
              <h4 class="recommendation-title">{{ ppt.title }}</h4>
              <span class="recommendation-author">{{ ppt.author }}</span>
              <span class="recommendation-downloads">{{ ppt.downloads }}次下载</span>
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
  name: 'PPTPage',
  components: {
    Header,
    SearchBox
  },
  data() {
    return {
      currentPPT: {
        id: null,
        title: '加载中...',
        author: '加载中...',
        uploadTime: '加载中...',
        previewImage: '',
        description: '',
        tags: []
      },
      isFavorited: false,
      downloadCount: 0,
      comments: [],
      newComment: '',
      recommendedPPTs: [],
      loading: true
    };
  },
  created() {
    const pptId = this.$route.params.id;
    this.fetchPPTData(pptId);
    this.fetchRecommendations();
  },
  methods: {
    async fetchPPTData(pptId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ppts/${pptId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        this.currentPPT = response.data;
        this.downloadCount = response.data.downloads;
        this.comments = response.data.comments;
        this.isFavorited = response.data.isFavorited;
      } catch (error) {
        console.error('获取课件数据失败:', error);
        // 使用模拟数据
        this.currentPPT = {
          id: pptId,
          title: '昆曲表演艺术基础教程',
          author: '张三',
          uploadTime: '2024-03-26',
          previewImage: 'http://localhost:8080/img/cover1.jpg',
          description: '本课件详细介绍了昆曲表演艺术的基础知识，包括身段、唱腔、表情等多个方面的技巧要领。适合昆曲初学者学习使用。',
          tags: ['昆曲', '表演艺术', '基础教程', '戏曲']
        };
        this.downloadCount = 156;
        this.comments = [
          {
            id: 1,
            author: '李四',
            content: '课件内容非常详实，对初学者很有帮助！',
            time: '2024-03-26 15:30'
          },
          {
            id: 2,
            author: '王五',
            content: '图文并茂，讲解清晰，很好的学习资料。',
            time: '2024-03-26 16:45'
          }
        ];
      }
    },
    async fetchRecommendations() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ppts/recommendations`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        this.recommendedPPTs = response.data;
      } catch (error) {
        console.error('获取推荐失败:', error);
        // 使用模拟数据
        this.recommendedPPTs = [
          {
            id: 2,
            title: '昆曲《牡丹亭》赏析课件',
            author: '李四',
            previewImage: 'http://localhost:8080/img/cover2.jpg',
            downloads: 89
          },
          {
            id: 3,
            title: '昆曲发声技巧详解',
            author: '王五',
            previewImage: 'http://localhost:8080/img/cover3.jpg',
            downloads: 120
          },
          {
            id: 4,
            title: '昆曲表演身段训练指南',
            author: '赵六',
            previewImage: 'http://localhost:8080/img/cover4.jpg',
            downloads: 76
          },
          {
            id: 5,
            title: '昆曲经典剧目赏析',
            author: '张明',
            previewImage: 'http://localhost:8080/img/cover5.jpg',
            downloads: 145
          }
        ];
      }
    },
    handlePreview() {
      window.open(`/preview/ppt/${this.currentPPT.id}`, '_blank');
    },
    async handleDownload() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ppts/${this.currentPPT.id}/download`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            responseType: 'blob'
          }
        );
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.currentPPT.title}.pptx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        this.downloadCount++;
      } catch (error) {
        console.error('下载失败:', error);
        alert('下载失败，请稍后重试');
      }
    },
    async toggleFavorite() {
      try {
        const userId = localStorage.getItem('userID');
        const token = localStorage.getItem('token');
        
        if (!this.isFavorited) {
          const response = await axios.post(
            `http://localhost:5000/api/ppts/${this.currentPPT.id}/favorite`,
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
            `http://localhost:5000/api/ppts/${this.currentPPT.id}/favorite`,
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
          `http://localhost:5000/api/ppts/${this.currentPPT.id}/comments`,
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
    goToPPT(pptId) {
      this.$router.push(`/ppt/${pptId}`);
      this.fetchPPTData(pptId);
      this.fetchRecommendations();
    }
  }
};
</script>

<style scoped>
.ppt-container {
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

.ppt-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ppt-preview {
  width: 100%;
  background: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.ppt-info {
  text-align: left;
  padding: 20px;
}

.ppt-title {
  font-size: 24px;
  margin: 0 0 10px 0;
  color: #333;
}

.author-info {
  color: #666;
  font-size: 14px;
  display: flex;
  gap: 20px;
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

.action-btn.preview {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.action-btn.preview:hover {
  background: #0056b3;
}

.action-btn.download {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.action-btn.download:hover {
  background: #218838;
}

.favorite-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.favorite-btn:hover {
  background: #f5f5f5;
}

.favorite-btn.favorited {
  background: #ffd700;
  color: #333;
  border-color: #ffd700;
}

.ppt-description {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.description-content {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
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

.recommendation-downloads {
  font-size: 12px;
  color: #999;
}

h2, h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}
</style> 