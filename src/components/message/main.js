import MessageVue from "./message.vue";
import Vue from "vue";

const MessageConstructor = Vue.extend(MessageVue);

let seed = 1;

let instances = [];

const Message = function(config) {
  if (Vue.prototype.$isServer) return;

  if (typeof config === "string") {
    config = {
      type: "normal",
      info: config
    };
  }

  if (config.type === "error") {
    config.info = "❗️ " + config.info;
  }
  if (config.type === "success") {
    config.info = "✅ " + config.info;
  }
  if (config.type === "warning") {
    config.info = "⚠️ " + config.info;
  }
  if (config.el) {
    config.fix = false;
  }

  const instance = new MessageConstructor({ data: { ...config } });
  instance.$mount();
  const parentEle = config.el || document.body;
  parentEle.appendChild(instance.$el);

  instance.id = `message_${seed++}`;
  let verticalOffset = 20;

  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16;
  });

  instance.verticalOffset = verticalOffset;

  instance.visible = true;

  instances.push(instance);

  setTimeout(() => {
    const index = instances.findIndex(item => item.id === instance.id);
    instances
      .filter((e, i) => i > index)
      .forEach(item => {
        item.verticalOffset -= instance.verticalOffset + 16;
      });
    instances = instances.filter(e => e.id !== instance.id);
    instance.$destroy();
    parentEle.removeChild(instance.$el);
  }, 2000);
};

Message.error = info =>
  Message({
    type: "error",
    info
  });

Message.success = info =>
  Message({
    type: "success",
    info
  });
Message.warning = info =>
  Message({
    type: "warning",
    info
  });

export default Message;
