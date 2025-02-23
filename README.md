# sse 客户端组件，支持v2、v3、安卓、ios、浏览器、微信小程序

## 使用说明

### 导入组件

点击右上角 `下载插件并导入HBuilderX`

uniapp插件地址：https://ext.dcloud.net.cn/plugin?id=20971

或者你可以参考我的示例

### 示例代码

```javascript
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
import ChatSSEClient from "@/components/ChatSSEClient.vue";
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
    url: "",
    headers: {
      authorization: "",
    },
    body: {
      "messages":[
        { "role":"user", "content": "你好！" }
      ],
      "stream":true,
      "model":"deepseek-chat",
      "temperature":1,
      "presence_penalty":0,
      "frequency_penalty":0,
      "top_p":1
    },
  })
}
const stop = () => {
  chatSSEClientRef.value.stopChat()
  console.log("stop");
}
</script>
```

# 温馨提示


**请仔细阅读我提供的示例代码。**

**如果你的程序有问题请先下载我提供的示例项目调试！**

本插件只是一个单组件，组件封装了renderjs和@microsoft/fetch-event-source，必须通过本组件这个中间层来操作。

如果想了解原理请看我掘金的文章： [点击前往](https://juejin.cn/post/7435632766375084082)

本插件依赖于 `fetch-event-source` 库，将编辑后的js集成，因为我修改了原来库解析的逻辑，使其更适用于中国宝宝体质。

如果这个组件解决了你的问题，麻烦去[github](https://github.com/gaozhenqiang/uniapp-chatSSEClient/) 帮我点个赞，谢谢大家

有新需求或者bug可以在github上提issues，或者加我q `1933669775`

已知的需求有（我抽空会加上的）：
1. 微信小程序会一次返回多条数据连在一起，这是因为没有解析数据的问题，h5端也有这种问题，只是`fetch-event-source`帮我们处理了。

# 常见问题

## ios报错：TypeError: Load failed

后端接口处理一下跨域即可解决。

