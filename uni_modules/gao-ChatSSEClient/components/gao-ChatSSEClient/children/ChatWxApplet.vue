<script>
import {getLines, getMessages} from "../fetch-event-source/parse"

let requestTask;
export default {
  props: {},
  data() {
    return {
      onChunk: undefined
    }
  },
  mounted() {
    const onLine = getMessages(() => {}, () => {}, (line) => {
      this.$emit("onInnerMessage", line)
    })
    this.onChunk = getLines(onLine);
  },
  methods: {
    stopChat() {
      requestTask.offChunkReceived(this.listener)
      requestTask.abort();
    },

    decode(data) {
      return decodeURIComponent(escape(String.fromCharCode(...data)));
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
      this.$emit("onInnerOpen", requestTask)
    },

    listener({ data }) {
      const type = Object.prototype.toString.call(data);
      if (type ==="[object Uint8Array]") {
      } else if (data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
      }
      this.onChunk(data)
    },
  },
}
</script>

<template>
  <view />
</template>