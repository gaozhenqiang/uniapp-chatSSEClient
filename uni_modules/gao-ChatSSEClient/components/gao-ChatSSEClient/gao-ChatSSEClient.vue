<template>
  <!--  #ifdef MP-WEIXIN || MP-ALIPAY -->
  <ChatWxApplet
    ref="chatRef"
    @onInnerOpen="open"
    @onInnerError="error"
    @onInnerMessage="message"
    @onInnerFinish="finish"
  />
  <!--  #endif-->

  <!--  #ifdef APP-PLUS || H5-->
  <ChatAppAndWeb
    ref="chatRef"
    @onInnerOpen="open"
    @onInnerError="error"
    @onInnerMessage="message"
    @onInnerFinish="finish"
  />
  <!--  #endif-->
</template>

<script>
// #ifdef MP-WEIXIN || MP-ALIPAY
import ChatWxApplet from "./children/ChatWxApplet.vue";
// #endif

// #ifdef APP-PLUS || H5
import ChatAppAndWeb from "./children/ChatAppAndWeb.vue";
// #endif

export default {
  components: {
    // #ifdef MP-WEIXIN || MP-ALIPAY
    ChatWxApplet,
    // #endif

    // #ifdef APP-PLUS || H5
    ChatAppAndWeb,
    // #endif
  },

  methods: {
    startChat(config) {
      config['method'] = (config['method'] || 'post').toUpperCase();
      config['headers'] = config['headers'] || {};
      this.$refs['chatRef'].startChat(config);
    },

    stopChat(...args) {
      this.$refs['chatRef'].stopChat(...args);
    },

    open(...args) {
      this.$emit("onOpen", ...args)
    },
    message(msg) {
      this.$emit("onMessage", msg)
    },
    error(...args) {
      this.$emit("onError", ...args)
    },
    finish() {
      this.$emit("onFinish")
    }
  },
}
</script>