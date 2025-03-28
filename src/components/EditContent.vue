<template>
  <div class="edit-content-modal">
    <div class="modal-content">
      <h2>编辑个人资料</h2>
      <form @submit.prevent="saveChanges">
        <div class="form-group">
          <label>昵称</label>
          <input type="text" v-model="formData.name" required />
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input type="email" v-model="formData.email" />
        </div>
        <div class="form-group">
          <label>手机号</label>
          <input type="tel" v-model="formData.phone" />
        </div>
        <div class="form-group">
          <label>生日</label>
          <input type="date" v-model="formData.birthday" />
        </div>
        <div class="form-group">
          <label>所在地</label>
          <input type="text" v-model="formData.location" required />
        </div>
        <div class="form-group">
          <label>个性签名</label>
          <textarea v-model="formData.signature" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>个人简介</label>
          <textarea v-model="formData.bio" rows="5"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-button" @click="$emit('close')">取消</button>
          <button type="submit" class="save-button">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['save', 'close']);

const formData = ref({
  name: props.user.name,
  age: props.user.age,
  location: props.user.location,
  signature: props.user.signature,
  bio: props.user.bio
});

watch(props, (newProps) => {
  formData.value = {
    name: newProps.user.name,
    age: newProps.user.age,
    location: newProps.user.location,
    signature: newProps.user.signature,
    bio: newProps.user.bio
  };
});

const saveChanges = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:5000/api/infochange/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        birthday: formData.value.birthday,
        location: formData.value.location,
        signature: formData.value.signature,
        bio: formData.value.bio
      })
    });

    if (!response.ok) {
      throw new Error('个人信息更新失败');
    }

    emit('save', formData.value);
    emit('close');
    
    await router.push('/personal');
    window.location.reload();
  } catch (error) {
    console.error('更新个人信息时出错:', error);
  }
};
</script>

<style scoped>
.edit-content-modal {
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
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #6366f1;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button,
.save-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.cancel-button {
  background: #f0f0f0;
  color: #333;
}

.cancel-button:hover {
  background: #ddd;
}

.save-button {
  background: #6366f1;
  color: white;
}

.save-button:hover {
  background: #4f46e5;
}
</style> 