<template>
  <!--  #ifdef MP-WEIXIN-->
  <ChatWxApplet
    ref="chatRef"
    @onOpen="open"
    @onError="error"
    @onMessage="message"
    @onFinish="finish"
  />
  <!--  #endif-->

  <!--  #ifdef APP-PLUS || H5-->
  <ChatAppAndWeb
    ref="chatRef"
    @onOpen="open"
    @onError="error"
    @onMessage="message"
    @onFinish="finish"
  />
  <!--  #endif-->
</template>

<script>
// #ifdef MP-WEIXIN
import ChatWxApplet from "./children/ChatWxApplet.vue";
// #endif

// #ifdef APP-PLUS || H5
import ChatAppAndWeb from "./children/ChatAppAndWeb.vue";
// #endif

export default {
  components: {
    // #ifdef MP-WEIXIN
    ChatWxApplet,
    // #endif

    // #ifdef APP-PLUS || H5
    ChatAppAndWeb,
    // #endif
  },

  methods: {
    startChat(...args) {
      this.$refs['chatRef'].startChat(...args);
    },

    stopChat(...args) {
      this.$refs['chatRef'].stopChat(...args);
    },

    open() {
      this.$emit("onOpen")
    },
    message(msg) {
      this.$emit("onMessage", msg)
    },
    error(err) {
      this.$emit("onError", err)
    },
    finish() {
      this.$emit("onFinish")
    }
  },
}
</script>