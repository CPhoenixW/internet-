<template>
    <div class="header">
      <div class="logo">
        <img src="@/assets/logo.jpg" alt="Logo" class="logo-img" />
        <span class="logo-text">牡丹新声</span>
      </div>
      <div class="auth-buttons">
        <button @click="navigateTo('/register')">注册</button>
        <button @click="navigateTo('/login')">登录</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const navigateTo = (path) => {
    router.push(path);
  };
  </script>
  
  <style scoped>
  .header {
    padding: 20px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    display: flex;
    align-items: center;
  }
  
  .logo-img {
    width: 50px;
    height: 40px;
    margin-right: 10px;
  }
  
  .logo-text {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
  
  .auth-buttons button {
    font-size: 16px;
    margin-left: 0px;
    margin-right: 50px;
    padding: 8px 15px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .auth-buttons button:hover {
    background-color: #0056b3;
  }
  </style>
  