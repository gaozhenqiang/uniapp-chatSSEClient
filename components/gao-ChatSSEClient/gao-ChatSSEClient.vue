<!--#ifdef APP-PLUS || H5  -->
<script>
export default {
  props: {},
  data() {
    return {
      stopCount: 0,
      renderjsData: {
        url: "",
        key: 0,
        body: ""
      }
    }
  },
  methods: {
    stopChat() {
      this.stopCount += 1
    },
    /**
     * 开始chat对话
     * @param body
     * @param url
     * @param headers
     */
    startChat({body, url, headers = {}}) {
      this.renderjsData = Object.assign({}, this.renderjsData, {
        key: this.renderjsData.key + 1,
        body: body ? JSON.stringify(body) : '',
        url: url,
        headers
      });
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

<script module="chat" lang="renderjs">
import { fetchEventSource } from './fetch-event-source';

export default {
	data() {
		return {
			ctrl: null,
		}
	},
	methods: {
		/**
		 * 停止生成
		 */
		stopChatCore() {
			this.ctrl?.abort();
		},

		/**
		 * 开始对话
		 */
		startChatCore({ url, body, headers }) {
			if (!url) return;
			try {
				this.ctrl = new AbortController();
				fetchEventSource(
					url,
					{
					readJson: true,
						method: 'POST',
            openWhenHidden: true,
						signal: this.ctrl.signal,
						headers: {
							"Content-Type": "application/json",
							...headers,
						},
						body: body,
						onopen: () => {
							this.$ownerInstance.callMethod('open');
						},
						onmessage: ({ data }) => {
							this.$ownerInstance.callMethod('message', data);
						},
						onerror: (err) => {
              console.log(err)
							this.$ownerInstance.callMethod('error', err);
						},
					}).then(() => {
						this.$ownerInstance.callMethod('finish');
				}).catch(err => {
					this.$ownerInstance.callMethod('error', err);
				})
			} catch (e) {
				console.log(e);
			}
		}
	}
}
</script>

<template>
  <view
    :renderjsData="renderjsData"
    :change:renderjsData="chat.startChatCore"
    :stopCount="stopCount"
    :change:stopCount="chat.stopChatCore"
  />
</template>
<!--#endif-->

<!--#ifdef MP-WEIXIN  -->
<script>
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
     */
    startChat({body, url, headers = {}}) {
      requestTask = uni.request({
        url: url,
        method: 'POST',
        header: {
          Accept: 'text/event-stream',
          ...headers,
        },
        data: body,
        enableChunked: true,
        responseType: 'arraybuffer',
        success: (res) => {},
        fail: (error) => {
          this.$emit("onError", error)
        },
        complete: () => {
          this.$emit("onFinish")
        },
      });

      requestTask.onChunkReceived(this.listener)
      this.$emit("onOpen")
    },

    listener(data) {
      this.$emit("onMessage", this.decode(data.data))
    },
  },
}
</script>

<template>
  <view />
</template>
<!--#endif-->
