<template>
  <ChatSSEClient
    ref="chatSSEClientRef"
    @onOpen="openCore"
    @onError="errorCore"
    @onMessage="messageCore"
    @onFinish="finishCore"
  />
  <button @click="start">开始</button>
  <button @click="stop">停止</button>
  <template v-if="loading">
    <view>{{ openLoading ? "正在连接sse..." : '连接完成！' }}</view>
    <view>{{ loading ? "加载中..." : '' }}</view>
  </template>

  <view>
    {{ responseText }}
  </view>
</template>

<script setup>
import ChatSSEClient from "../../components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
import { ref } from 'vue'

const chatSSEClientRef = ref(null);
const responseText = ref("");
const loading = ref(false);
const openLoading = ref(false);

const openCore = () => {
  openLoading.value = false;
  console.log("open sse");
}
const errorCore = (err) => {
  console.log("error sse：", err);
}
const messageCore = (msg) => {
  console.log("message sse：", msg);
  responseText.value += `${msg}\n`
}
const finishCore = () => {
  console.log("finish sse")
  loading.value = false;
}

const start = () => {
  if (loading.value) return;

  openLoading.value = true;
  loading.value = true;
  responseText.value = "";

  chatSSEClientRef.value.startChat({
    // 将它换成你的地址
    url: import.meta.env.VITE_CHAT_URL,
    // 请求头
    headers: {
      Authorization: import.meta.env.VITE_CHAT_AUTHORIZATION,
    },
    // 默认为 post
    method: 'post',
    body: {
      "stream":true,
      "model": "deepseek-chat",
      "messages": [
        {"role": "system", "content": "你是来自艺咖科技的数字员工，你的名字叫小咖。"}]
    }
  })
}
const stop = () => {
  chatSSEClientRef.value.stopChat()
  console.log("stop");
}
</script>