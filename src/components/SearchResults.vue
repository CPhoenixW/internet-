<template>
    <div class="search-results">
      <div v-if="loading" class="loading">加载中...</div>
      
      <template v-else>
        <h2 v-if="!searchKeyword">推荐内容</h2>
        <h2 v-else>搜索结果: "{{ searchKeyword }}"</h2>
        
        <div v-if="items.length === 0" class="no-results">
          {{ !searchKeyword ? '暂无推荐内容' : '没有找到相关内容' }}
        </div>
        
        <div v-else class="results-list">
          <div v-for="item in items" :key="item.id" class="result-card">
            <div class="post-image" v-if="item.image" @click="goToPost(item.url)">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="content-wrapper">
              <div class="content">
                <h3 class="title" @click="goToPost(item.url)">{{ item.title }}</h3>
                <div class="info-row">
                  <span class="author">{{ '作者：' + item.author  || '匿名 ' }}</span>
                </div>
                <div class="info-row">
                  <span class="summary" @click="goToPost(item.url)">{{ item.summary }}</span>
                </div>
              </div>
              <div class="action-buttons">
                <button 
                  class="action-btn" 
                  @click="handleLike(item)"
                  :class="{ 'liked': item.isLiked }"
                >
                  <span class="icon">👍</span>
                  <span class="count">{{ item.likes }}</span>
                </button>
                <button class="action-btn" @click="goToComments(item)">
                  <span class="icon">💬</span>
                  <span class="count">{{ item.comments }}</span>
                </button>
                <button 
                  @click="toggleFavorite(item)"
                  :class="['favorite-btn', { favorited: item.isFavorited }]"
                >
                  {{ item.isFavorited ? '已收藏' : '收藏' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  const mockRecommendations = [
    {
      id: 1,
      title: "牡丹亭游园惊梦",
      author: "张三", 
      image: "http://localhost:8080/img/cover1.jpg",
      url: "http://localhost:8080/post/1",
      summary: "昆曲《牡丹亭》中最著名的折子戏《游园惊梦》,描写大家闺秀杜丽娘在后花园游玩时,因春色撩人而沉醉梦境,梦中与书生柳梦梅相会的故事。这一折充分展现了昆曲'水磨腔'的典雅韵致,以及细腻的情感表达。",
      likes: 328,
      comments: 45,
      isFavorited: true
    },
    {
      id: 2, 
      title: "昆曲艺术的魅力",
      author: "李四",
      url: "http://localhost:8080/post/2",
      summary: "探讨昆曲这一百戏之祖的艺术特色与审美价值。",
      likes: 256,
      comments: 32,
      isFavorited: false
    },
    {
      id: 3,
      title: "昆曲表演艺术浅析",
      author: "王五",
      image: "https://img2.baidu.com/it/u=2636384456,3535167911&fm=253&fmt=auto&app=138&f=JPEG",
      url: "http://localhost:8080/post/3",
      summary: "从唱念做打四个方面分析昆曲表演的艺术特点。",
      likes: 198,
      comments: 28,
      isFavorited: false
    },
    {
      id: 4,
      title: "昆曲与园林文化",
      author: "赵六",
      image: "https://img0.baidu.com/it/u=3224604362,1697670740&fm=253&fmt=auto&app=138&f=JPEG",
      url: "http://localhost:8080/post/4",
      summary: "探讨昆曲与中国传统园林艺术的密切关系。",
      likes: 167,
      comments: 23,
      isFavorited: false
    },
    {
      id: 5,
      title: "当代昆曲创新实践",
      author: "孙七",
      image: "https://img1.baidu.com/it/u=1390353838,2992083102&fm=253&fmt=auto&app=138&f=JPEG",
      url: "http://localhost:8080/post/5",
      summary: "介绍近年来昆曲艺术在传承与创新方面的探索。",
      likes: 145,
      comments: 19,
      isFavorited: false
    },
    {
      id: 6,
      title: "昆曲音乐赏析",
      author: "周八",
      image: "https://img2.baidu.com/it/u=1761044950,1685001554&fm=253&fmt=auto&app=138&f=JPEG",
      url: "http://localhost:8080/post/6",
      summary: "深入解读昆曲音乐的板式、曲牌等特点。",
      likes: 134,
      comments: 21,
      isFavorited: false
    },
    {
      id: 7,
      title: "昆曲与文学",
      author: "吴九",
      image: "https://img1.baidu.com/it/u=3484508569,1991510155&fm=253&fmt=auto&app=138&f=JPEG",
      url: "http://localhost:8080/post/7",
      summary: "分析昆曲与古典文学的渊源关系。",
      likes: 122,
      comments: 18,
      isFavorited: false
    },

  ];
  export default {
    name: 'SearchResults',
    props: {
      searchKeyword: String
    },
    data() {
      return {
        items: [],
        loading: false
      };
    },
    watch: {
      searchKeyword: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.searchContent(newVal);
          } else {
            this.fetchRecommendations();
          }
        }
      }
    },
    methods: {
      async fetchRecommendations() {
        try {
          this.loading = true;
          const response = await axios.get(
            `http://localhost:5000/recommendations/${localStorage.getItem('userID')}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          this.items = await this.processItems(response.data);
        } catch (error) {
          console.error('获取推荐失败，使用模拟数据:', error);
          // 使用 mockRecommendations 作为后备数据
          this.items = await this.processItems(mockRecommendations);
        } finally {
          this.loading = false;
        }
      },
      async searchContent(keyword) {
        try {
          this.loading = true;
          const response = await axios.post(
            `http://localhost:5000/search/${localStorage.getItem('userID')}`,
            { keyword },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );
          this.items = await this.processItems(response.data);
        } catch (error) {
          console.error('搜索失败:', error);
        } finally {
          this.loading = false;
        }
      },
      async processItems(items) {
        try {
          const userId = localStorage.getItem('userID');
          const token = localStorage.getItem('token');
          
          // 获取用户的收藏列表和点赞列表
          const [favoritesResponse, likesResponse] = await Promise.all([
            axios.get(
              `http://localhost:5000/api/users/${userId}/favorites`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            ),
            axios.get(
              `http://localhost:5000/api/users/${userId}/likes`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            )
          ]);

          const favoriteIds = favoritesResponse.data.favorites || [];
          const likedIds = likesResponse.data.likes || [];

          return items.map(item => ({
            ...item,
            isFavorited: favoriteIds.includes(item.id),
            isLiked: likedIds.includes(item.id)
          }));
        } catch (error) {
          console.error('获取状态失败:', error);
          return items.map(item => ({
            ...item,
            isFavorited: false,
            isLiked: false
          }));
        }
      },
      async handleLike(item) {
        try {
          const userId = localStorage.getItem('userID');
          const token = localStorage.getItem('token');
          
          if (!item.isLiked) {
            // 添加点赞
            const response = await axios.post(
              `http://localhost:5000/api/posts/${item.id}/like`,
              { userId },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            if (response.data.success) {
              item.likes++;
              item.isLiked = true;
            }
          } else {
            // 取消点赞
            const response = await axios.delete(
              `http://localhost:5000/api/posts/${item.id}/like`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                data: { userId }
              }
            );

            if (response.data.success) {
              item.likes--;
              item.isLiked = false;
            }
          }
        } catch (error) {
          console.error('点赞操作失败:', error);
        }
      },
      goToComments(item) {
        // 跳转到评论页面或打开评论模态框
        window.open(`${item.url}#comments`, '_blank');
      },
      async toggleFavorite(item) {
        try {
          const userId = localStorage.getItem('userID');
          const token = localStorage.getItem('token');
          
          if (!item.isFavorited) {
            // 添加收藏
            const response = await axios.post(
              `http://localhost:5000/api/posts/${item.id}/favorite`,
              { userId },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            if (response.data.success) {
              item.isFavorited = true;
            }
          } else {
            // 取消收藏
            const response = await axios.delete(
              `http://localhost:5000/api/posts/${item.id}/favorite`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                data: { userId }
              }
            );

            if (response.data.success) {
              item.isFavorited = false;
            }
          }
        } catch (error) {
          console.error('收藏操作失败:', error);
        }
      },
      goToPost(url) {
        if (url) {
          window.open(url, '_blank'); // 在新标签页打开链接
        }
      }
    }
  };
  </script>
  
<style scoped>
  .search-results {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
    border: 3px solid #eee;
    border-radius: 2px;
  }
  
  .loading, .no-results {
    text-align: center;
    padding: 40px;
    color: #888;
  }
  
  .results-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }
  
  .result-card {
    border: 2px solid #eee;
    border-radius: 8px;
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
    background: white;
    display: flex;
    gap: 20px;
  }
  
  .result-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .post-image {
    flex-shrink: 0;
    width: 180px;
    height: 120px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
  }
  
  .post-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .post-image:hover img {
    transform: scale(1.05);
  }
  
  .content-wrapper {
    flex: 1;
    min-width: 0;
  }
  
  .content {
    flex: 1;
    min-width: 0;
  }
  
  .info-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 10px 0;
  }
  
  .author {
    color: #666;
    font-size: 14px;
    white-space: nowrap;
  }
  
  .summary {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  
  .summary:hover {
    color: #6366f1;
  }
  
  .action-buttons {
    display: flex;
    gap: 15px;
    margin-top: 15px;
    align-items: center;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
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
  
  .icon {
    font-size: 16px;
  }
  
  .count {
    font-size: 14px;
  }
  
  .favorite-btn {
    padding: 6px 12px;
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
  
  .title {
    cursor: pointer;
    margin: 0;
    text-align: left;
    font-size: 18px;
    color: #333;
  }
  
  .title:hover {
    color: #6366f1;
  }
  
  .action-btn.liked {
    background: #ff4757;
    color: white;
    border-color: #ff4757;
  }
</style>