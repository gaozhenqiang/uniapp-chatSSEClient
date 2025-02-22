<template>
  <ChatSSEClient
    ref="chatSSEClientRef"
    @onMessage="messageCore"
  />
  <button @click="start">开始</button>
  <button @click="stop">停止</button>
  <view>
    {{ responseText }}
  </view>
</template>

<script>
import ChatSSEClient from "../../components/gao-ChatSSEClient/gao-ChatSSEClient.vue"
export default {
  components: {
    ChatSSEClient
  },
  data() {
    return {
      responseText: ''
    }
  },
  mounted() {
    console.log(this.$refs['chatSSEClientRef'])
  },
  methods: {
    start() {
      this.responseText = "";
      this.$refs['chatSSEClientRef'].startChat({
        // 将它换成你的地址
        url: "https://api.deepseek.com/beta/chat/completions",
        headers: {
          Authorization: "Bearer sk-5ffdff9a588748c28ba53a562bb39b2f",
        },
        body: {
          "stream":true,
          "model": "deepseek-chat",
          "messages": [
            {"role": "system", "content": "你是来自艺咖科技的数字员工，你的名字叫小咖。"}]
        }
      })
    },
    stop() {
      this.$refs['chatSSEClientRef'].stopChat()
    },
    messageCore(msg) {
      console.log("message sse：", msg);
      this.responseText += `${msg}\n`
    }
  },
}
</script>