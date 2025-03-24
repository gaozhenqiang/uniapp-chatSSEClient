<script>
import { parseSseData } from "../utils";

let requestTask;
export default {
  props: {},
  data() {
    return {
    }
  },
  methods: {
    stopChat() {
      requestTask.offChunkReceived(this.listener)
      requestTask.abort();
    },

    decode(data) {
      if(typeof data === 'string') {
        return data;
      }
      let txt;
      // 进行判断返回的对象是Uint8Array（开发者工具）或者ArrayBuffer（真机）
      // 1.获取对象的准确的类型
      const type = Object.prototype.toString.call(data); // Uni8Array的原型对象被更改了所以使用字符串的信息进行判断。
      if(type ==="[object Uint8Array]"){
        txt = decodeURIComponent(escape(String.fromCharCode(...data)))
      }else if(data instanceof ArrayBuffer){
        // 将ArrayBuffer转换为Uint8Array
        const uint8Array = new Uint8Array(data);
        txt=decodeURIComponent(escape(String.fromCharCode(...uint8Array)))
      }
      return txt;
    },

    /**
     * 开始chat对话
     * @param body
     * @param url
     * @param headers
     * @param method
     */
    startChat({ body, url, headers, method }) {
      requestTask = uni.request({
        url: url,
        method,
        header: {
          Accept: 'text/event-stream',
          ...headers,
        },
        data: body,
        enableChunked: true,
        responseType: 'arraybuffer',
        success: (res) => {},
        fail: (error) => {
          this.$emit("onInnerError", error)
        },
        complete: () => {
          this.$emit("onInnerFinish")
        },
      });

      requestTask.onChunkReceived(this.listener)
      this.$emit("onInnerOpen")
    },

    listener({ data }) {
      const msg = this.decode(data);
      const lines = parseSseData(msg);
      for (const line of lines) {
        this.$emit("onInnerMessage", line)
      }
    },
  },
}
</script>

<template>
  <view />
</template>