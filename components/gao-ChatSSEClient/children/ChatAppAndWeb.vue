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
      this.$emit("onInnerOpen")
    },
    message(msg) {
      this.$emit("onInnerMessage", msg)
    },
    error(err) {
      this.$emit("onInnerError", err)
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