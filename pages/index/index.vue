<template>
  <button @click="start">开始</button>
  <button @click="stop">停止</button>
  <template v-if="loading">
    <view>{{ openLoading ? "正在连接sse..." : '连接完成！' }}</view>
    <view>{{ loading ? "加载中..." : '' }}</view>
  </template>

  <view>
    {{ responseText }}
  </view>

  <gao-ChatSSEClient
    ref="chatSSEClientRef"
    @onOpen="openCore"
    @onError="errorCore"
    @onMessage="messageCore"
    @onFinish="finishCore"
    @onRetryuUpperlimit="retryuUpperlimitCore"
  />
</template>

<script setup>
import { ref } from 'vue'

const chatSSEClientRef = ref(null);
const responseText = ref("");
const loading = ref(false);
const openLoading = ref(false);

const openCore = (response) => {
  openLoading.value = false;
  console.log("open sse：", response);
}
const errorCore = (err) => {
  console.log("error sse：", err);
}
const messageCore = (msg) => {
  console.log("message sse：", msg);
  responseText.value += `${msg.data}

  `
}
const finishCore = () => {
  console.log("finish sse")
  loading.value = false;
}

const retryuUpperlimitCore = () => {
  console.log("重试次数达到上限");
}

const start = () => {
  if (loading.value) return;

  openLoading.value = true;
  loading.value = true;
  responseText.value = "";

  chatSSEClientRef.value.startChat({
    /**
     * 将它换成你的地址
     * 注意：
     * 如果使用 sse-server.js 要在手机端使用的话，请确保你的手机和电脑处在一个局域网下并且是正常的ip地址
     */
    // url: import.meta.env.VITE_CHAT_URL || 'http://localhost:3000/sse',
    url: 'http://127.0.0.1:3000/sse',
    // 请求头
    headers: {
      Authorization: import.meta.env.VITE_CHAT_AUTHORIZATION,
    },
    // 默认为 post
    method: 'get',
    // body: {
    //   "stream":true,
    //   "model": "deepseek-chat",
    //   "messages": [
    //     {"role": "system", "content": "你的名字叫小咖。"}]
    // }
  })
}
const stop = () => {
  chatSSEClientRef.value.stopChat()
  console.log("stop");
}
</script>