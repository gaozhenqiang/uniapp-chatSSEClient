<script>
export default {
  props: {},
  data() {
    return {
      stopCount: 0,
      renderjsData: {
        url: "",
        key: 0,
        body: "",
        method: ""
      }
    }
  },
  methods: {
    stopChat() {
      this.stopCount += 1
    },
    /**
     * 开始chat对话
     */
    startChat(config) {
      const { body } = config;
      this.renderjsData = Object.assign({}, this.renderjsData, {
        key: this.renderjsData.key + 1,
        ...config,
        body: body ? JSON.stringify(body) : 0,
      });
    },

    open(...args) {
      this.$emit("onInnerOpen", ...args)
    },
    message(msg) {
      this.$emit("onInnerMessage", msg)
    },
    error(...args) {
      this.$emit("onInnerError", ...args)
      this.stopChat();
    },
    finish() {
      this.$emit("onInnerFinish")
    }
  },
}
</script>

<script module="chat" lang="renderjs">
import { fetchEventSource } from '../fetch-event-source';

export default {
	data() {
		return {
			ctrl: null,
		}
	},
	methods: {
    objToJson(obj) {
      const json = {};
      for (const key in obj) {
        const val = obj[key];
        if (typeof val === "string" || typeof val === 'number' || typeof val === 'boolean') {
          json[key] = val;
        }
      }
      return json;
    },

		/**
		 * 停止生成
		 */
		stopChatCore() {
			this.ctrl?.abort();
		},

		/**
		 * 开始对话
		 */
		startChatCore({ url, body, headers, method }) {
			if (!url) return;
			try {
				this.ctrl = new AbortController();
				fetchEventSource(
					url,
					{
					readJson: true,
						method,
            openWhenHidden: true,
						signal: this.ctrl.signal,
						headers: {
							"Content-Type": "application/json",
							...headers,
						},
						body: body ? body : undefined,
						onopen: (response) => {
							this.$ownerInstance.callMethod('open', this.objToJson(response));
						},
						onmessage: ({ data }) => {
							this.$ownerInstance.callMethod('message', data);
						},
						onerror: (err) => {
              console.log(err)
							this.$ownerInstance.callMethod('error', JSON.stringify(err));
						},
					}).then(() => {
						this.$ownerInstance.callMethod('finish');
				}).catch(err => {
          console.log(err)
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