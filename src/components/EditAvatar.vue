<template>
  <div class="edit-avatar-modal">
    <div class="modal-content">
      <h2>更换头像</h2>
      <div class="avatar-preview">
        <img :src="previewImage || currentAvatar" alt="头像预览" class="preview-image" />
      </div>
      <div class="upload-options">
        <label class="upload-button">
          <input type="file" accept="image/*" @change="handleFileChange" hidden />
          选择图片
        </label>
        <button class="confirm-button" @click="saveAvatar" :disabled="!previewImage">
          确认更换
        </button>
      </div>
      <button class="close-button" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  currentAvatar: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['save', 'close']);

const previewImage = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveAvatar = async () => {
  if (previewImage.value) {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/avatarchange/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatar: previewImage.value  // base64格式的图片数据
        })
      });

      if (!response.ok) {
        throw new Error('头像更新失败');
      }

      emit('save', previewImage.value);
      emit('close');
      
      await router.push('/personal');
      window.location.reload();
    } catch (error) {
      console.error('更新头像时出错:', error);
    }
  }
};
</script>

<style scoped>
.edit-avatar-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 400px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #333;
}

.avatar-preview {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f0f0f0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-options {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.upload-button,
.confirm-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.upload-button {
  background: #6366f1;
  color: white;
}

.upload-button:hover {
  background: #4f46e5;
}

.confirm-button {
  background: #10b981;
  color: white;
}

.confirm-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}

.close-button svg {
  width: 20px;
  height: 20px;
}
</style> 