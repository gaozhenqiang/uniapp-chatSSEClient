# sse 客户端组件，支持v2、v3、安卓、ios、浏览器、微信小程序

## 使用说明

### 导入组件

点击右上角 `下载插件并导入HBuilderX`

uniapp插件地址：https://ext.dcloud.net.cn/plugin?id=20971

或者你可以参考我的示例

### 示例代码

```javascript
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
  url: import.meta.env.VITE_CHAT_URL || 'http://localhost:3000/sse',
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
```

## 配置项

| 属性名              | 类型     | 默认值    | 说明          | web | android/ios | 微信小程序 |
|------------------|--------|--------|-------------|-----|-------------|-------|
| timeout          | Number | 300000 | 请求超时时间，单位毫秒 | √   | √           | √     |     |
| heartbeatTimeout | Number | 120000 | 心跳超时时间，单位毫秒（此参数保证客户端和SSE服务器之间的连接活跃。如果在 heartbeatTimeout 毫秒（比如 120000ms = 2分钟）内，没有收到任何数据或消息，就说明连接可能已经“挂掉”或服务器无响应，这时会主动断开连接并尝试重连。） | √   | √           | √     |
| maxRetryCount    | Number | 5      | 最大重试次数      | √   | √           | √     |

### 示例

```javascript
<gao-ChatSSEClient
  :heartbeat-timeout="120000"
  :timeout="300000"
  :max-retry-count="5"
/>
```

# 温馨提示

示例项目根目录的`sse-server.js`文件提供了一个简单的sse测试服务，使用 `node sse-server.js`运行

**提出问题之前请先确保你的接口没有问题**

---

**请仔细阅读我提供的示例代码。**

**如果你的程序有问题请先下载我提供的示例项目调试！**

---

如果想了解原理请看我掘金的文章： [点击前往](https://juejin.cn/post/7435632766375084082)

本插件依赖于 `fetch-event-source` 库，将编辑后的js集成，因为我修改了原来库解析的逻辑，使其更适用于中国宝宝体质。

---

**如果这个组件解决了你的问题，麻烦去[github](https://github.com/gaozhenqiang/uniapp-chatSSEClient/) 帮我点个赞，谢谢大家**

有新需求或者bug可以在github上提issues，或者加我q `1933669775`

# 常见问题

## ios报错：TypeError: Load failed

后端接口处理一下跨域即可解决。

## 服务器配置了跨域ios还是报错？

**如果后端服务使用了代理，那只需要在代理端做跨域即可，服务端的跨域配置删除。**

**如：使用nginx代理服务，那么在nginx做跨域即可，服务器的跨域配置需要删除**
