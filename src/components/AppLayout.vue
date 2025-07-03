<template>
    <div class="app-container">
        <AppHeader />
        <div class="main-container">
            <el-main>
                <slot></slot>
            </el-main>
        </div>
        <el-footer class="app-footer">
            <div class="footer-content">
                <p>© {{ currentYear }} 环保公众监督系统 - 公众监督员端</p>
            </div>
        </el-footer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from './AppHeader.vue'

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-container {
    flex: 1;
    margin-top: 60px;
    padding: 20px;
    background-color: var(--background-color);
}

.app-footer {
    background-color: #fff;
    border-top: 1px solid #e6e6e6;
    padding: 20px 0;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    color: #606266;
    font-size: 14px;
}
</style>
