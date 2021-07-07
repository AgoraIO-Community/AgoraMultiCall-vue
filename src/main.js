import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Message from "./components/message/main.js"

import AgoraRtcVue from "agora-rtc-vue/lib/agora-rtc-vue.umd";
import "agora-rtc-vue/lib/agora-rtc-vue.css";

Vue.config.productionTip = false;

Vue.prototype.$message = Message;

console.log(AgoraRtcVue);

Vue.use(AgoraRtcVue,{});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
