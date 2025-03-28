<template>
  <div class="home">
    <!-- 用户资料展示部分 -->

      <section class="profile-banner">
        <div class="avatar-container">
          <img :src="user.avatar" alt="用户头像" class="avatar" />
          <div class="avatar-hover">
            <button class="change-avatar" @click="showAvatarModal = true">更换头像</button>
          </div>
        </div>
        <div class="banner-info">
          <h2 class="user-name">{{ user.name }}</h2>
          <p class="signature">{{ user.signature }}</p>
        </div>
        <button class="edit-button" @click="editMode = !editMode">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          {{ editMode ? '取消' : '编辑' }}
        </button>
      </section>
      
      <!-- 编辑内容部分 -->
      <div class="edit-section" v-if="editMode">
        <EditContent
          :user="user"
          @save="updateUser"
          @close="editMode = false"
        />
      </div>

      <!-- 详细信息部分 -->
      <section class="profile-details">
        <div class="detail-card">
          <h3 class="detail-title">基本信息</h3>
          <div class="detail-list">
            <div class="detail-item">
              <span class="label">邮箱</span>
              <span class="value">{{ user.email || '未填写' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">微信账号</span>
              <span class="value">{{ user.wechat || '未填写' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">手机号</span>
              <span class="value">{{ user.phone || '未填写' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">生日</span>
              <span class="value">{{ user.birthday || '未填写' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">所在地</span>
              <span class="value">{{ user.location || '未填写' }}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-card">
          <h3 class="detail-title">个人简介</h3>
          <p class="bio-content">{{ user.bio }}</p>
        </div>
      </section>

      <!-- 编辑头像模态框 -->
      <EditAvatar
        v-if="showAvatarModal"
        :current-avatar="user.avatar"
        @save="updateAvatar"
        @close="showAvatarModal = false"
      />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EditAvatar from "@/components/EditAvatar.vue";
import EditContent from "@/components/EditContent.vue";

// mockUser 作为初始值和 fallback
const mockUser = {
  id: "10086",
  name: "- Phoenix Wang -",
  email: "phoenix.wang@example.com",
  wechat: "phoenix_wang",
  phone: "110",
  birthday: "1998-10-01",
  age: 25,
  avatar: "https://avatars.githubusercontent.com/u/1234567",
  bio: "热爱生活，热爱编程。喜欢探索新技术，空闲时间喜欢看书和旅行。目前是一名前端开发工程师，专注于Vue.js和React技术栈。",
  location: "阿尔巴尼亚",
  zodiac: "天蝎座",
  signature: "代码写出来是给人看的，附带能在机器上运行"
};

// 使用 ref 初始化 user 为 mockUser
const user = ref({ ...mockUser });
const editMode = ref(false);
const showAvatarModal = ref(false);

// 获取用户信息的方法
const fetchUserInfo = async () => {
  try {
    // 从 LocalStorage 获取 id 和 token
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // 如果没有 id 或 token，直接使用 mockUser，不发起请求
    if (!userId || !token) {
      console.warn('未找到 userId 或 token，使用 mockUser 数据');
      return;
    }

    // 发起 API 请求
    const response = await fetch(`http://localhost:5000/api/userinfo/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // 将 token 添加到请求头
        'Content-Type': 'application/json'
      }
    });

    // 检查响应是否成功
    if (!response.ok) {
      throw new Error('请求用户信息失败');
    }

    // 解析返回的数据并更新 user
    const data = await response.json();
    user.value = data; // 假设返回的数据格式与 mockUser 一致
  } catch (error) {
    console.error('获取用户信息失败，使用 mockUser 数据:', error);
    user.value = { ...mockUser }; // 请求失败时回退到 mockUser
  }
};

// 更新用户信息
const updateUser = (updatedUser) => {
  user.value = updatedUser;
  editMode.value = false;
};

// 更新头像
const updateAvatar = (newAvatar) => {
  user.value.avatar = newAvatar;
};

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
html, body {
  overflow-y: auto;
  height: 100%;
} 
.home {
  max-width: 2000px;
  margin: 0 auto;
  overflow-y: auto;
  height: 100%;

}

.profile-banner {
  height: 200px;
  background-image: url('@/assets/cover6.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 40px 0;
  display: flex;
  align-items: flex-end;
  gap: 40px;
  color: white;
}

.profile-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 100%);
  z-index: 1;
}

.avatar-container, .banner-info {
  position: relative;
  z-index: 2;
}

.avatar-container {
  width: 100px;
  height: 100px;
  margin-bottom: -20px;
  margin-left: 40px;
  transform: translateY(-40px);
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.avatar-hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 108%;
  height: 108%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.avatar-container:hover .avatar-hover {
  opacity: 1;
}

.change-avatar {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.change-avatar:hover {
  background: rgba(255, 255, 255, 0.3);
}

.banner-info {
  flex: 1;
  margin-bottom: 20px;
}

.user-name {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 1px;
}

.signature {
  margin: 8px 0 0;
  font-size: 16px;
  opacity: 0.9;
  font-style: italic;
}

.edit-button {
  position: absolute;
  top: 50px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 3;
  backdrop-filter: blur(5px);
}

.edit-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.edit-button svg {
  width: 16px;
  height: 16px;
}

.profile-details {
  padding: 40px 40px 40px;
  max-width: 500px;
  min-height: 1000px;
}

.detail-card {
  background: rgb(255, 255, 255);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.detail-title {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: #334155;
  position: relative;
  padding-bottom: 10px;
}

.detail-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  width: 100px;
  color: #64748b;
  font-weight: 500;
  font-size: 15px;
}

.value {
  flex: 1;
  color: #1e293b;
  font-weight: 500;
}

.bio-content {
  line-height: 1.8;
  color: #475569;
  margin: 0;
  white-space: pre-line;
}

</style>