<template>
  <div class="home">
    <meet
      v-if="isJoinMeeting"
      :channel="channel"
      :appid="appid"
      :token="token"
      :preMute="config.mute"
      :preCameraOff="config.cameraOff"
      @leave-meeting="handleLeaveMeeting"
    />
    <main-page
      v-else
      @join-meeting="handleJoinMeeting"
      :channel="channel"
      :appid="appid"
      :token="token"
    />
  </div>
</template>

<script>
import Meet from "@/components/Meet.vue";
import MainPage from "@/components/Main.vue";

export default {
  name: "Home",
  components: {
    Meet,
    MainPage
  },
  data() {
    return {
      isJoinMeeting: false,
      config: null,
      appid: localStorage.getItem("appid"),
      channel: sessionStorage.getItem("channel"),
      token:
        localStorage.getItem("token") === "null"
          ? null
          : localStorage.getItem("token") === null
          ? undefined
          : localStorage.getItem("token")
    };
  },
  watch: {
    appid: {
      immediate: true,
      handler(newV) {
        if (!newV || newV === "null" || newV === undefined) {
          const appid = "8a540bb507b642609834cbdea8963e5c"; //window.prompt("Input your appid:");
          if (appid) {
            localStorage.setItem("appid", appid);
            this.appid = appid;
          } else {
            window.location.reload();
          }
        }
      }
    },
    channel: {
      immediate: true,
      handler(newV) {
        if (!newV || newV === "null" || newV === undefined) {
          const channel = "freedata"; //window.prompt("Input your room channel:");
          if (channel) {
            sessionStorage.setItem("channel", channel);
            this.channel = channel;
          } else {
            window.location.reload();
          }
        }
      }
    },
    token: {
      immediate: true,
      handler(newV) {
        if (!newV && newV !== null) {
          const token = "b3e0b93686b94fd3a41361a9cdef673c"; //window.prompt("Input your token:");
          if (token) {
            localStorage.setItem("token", token);
            this.token = token === "null" ? null : token === null ? undefined : token;
          } else {
            window.location.reload();
          }
        }
      }
    }
  },
  methods: {
    handleJoinMeeting(config) {
      this.isJoinMeeting = true;
      this.config = config;
    },
    handleLeaveMeeting() {
      this.isJoinMeeting = false;
    }
  }
};
</script>
