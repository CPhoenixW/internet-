<template>
    <div class="header">
      <div class="logo" @click="navigateTo('/')">
        <img src="@/assets/logo.jpg" alt="Logo" class="logo-img" />
        <span class="logo-text">牡丹新声</span>
      </div>
      <div class="center-content">
        <slot></slot>
      </div>
      <div class="nav-buttons">
        <button @click="navigateTo('/course')">课程</button>
        <button @click="navigateTo('/community')">社区</button>
        <button @click="navigateTo('/personal')">我的</button>
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
    height: 50px;
    padding: 0 20px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: opacity 0.3s;
    min-width: 150px;
  }
  
  .logo:hover {
    opacity: 0.8;
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
  
  .logo-img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  
  .logo-text {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .center-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 600px;
    margin: 0 20px;
    height: 100%;
  }
  
  .nav-buttons {
    display: flex;
    gap: 10px;
    margin-right: 50px;
    min-width: 150px;
    justify-content: flex-end;
  }
  
  .nav-buttons button {
    font-size: 14px;
    padding: 6px 20px;
    border: none;
    background-color: transparent;
    color: #333;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .nav-buttons button:hover {
    background-color: #f0f0f0;
    color: #007bff;
  }
  </style>
  