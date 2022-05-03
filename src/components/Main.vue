<template>
  <div class="main">
    <div class="banner">
      <div class="logo">
        Agora Web Multi-party Call Demo.Vue
      </div>
    </div>
    <agora
      channel="channel"
      :autoStart="false"
      :errorHandler="
        error => {
          this.$message.error(error.message || error);
        }
      "
    >
      <agora-video-sender
        customizationPlayer
        @video-ready="handleVideoReady"
        :cameraOff="cameraOff"
      />
      <agora-audio-sender
        ref="audioSender"
        :mute="mute"
        @track-created="handleTrackCreated"
      />
    </agora>
    <div
      ref="cameraArea"
      v-if="localVideoDirective"
      class="camera-area"
      :class="playerClass"
      v-player="localVideoDirective"
    >
      <voice-dot class="voice-dot-local" :mute="mute" :level="level" />
      <mp-button-white
        class="mp-btn-local"
        :class="mpClass"
        @click="handleMpClick"
      ></mp-button-white>
      <video-button-white
        class="video-btn-local"
        :class="videoClass"
        @click="handleVideoClick"
      ></video-button-white>
    </div>
    <div class="operation">
      <p class="question">Are you ready to join meeting ?</p>
      <p class="tip">Enjoy the meeting time</p>
      <div class="join-button" @click="handleJoinClient">Client Join now</div>
      <div class="join-button" @click="handleJoinHost">Host Join now</div>
    </div>

    <div class="footer">
      <div class="desc">This is a demo for AgoraRtcVue</div>
      <div class="copyright">2021 Agora Inc. | All rights reserved</div>
    </div>
  </div>
</template>

<script>
import VoiceDot from "./voice-dot/main.vue";
import MpButtonWhite from "./buttons/mp-button-white";
import VideoButtonWhite from "./buttons/video-button-white";
export default {
  name: "Main",
  components: {
    VoiceDot,
    MpButtonWhite,
    VideoButtonWhite
  },
  props: {
    channel: {
      type: [String, null]
    },
    appid: {
      type: [String, null]
    },
    token: {
      type: [String, null]
    }
  },
  data() {
    return {
      localVideoDirective: null,
      mute: false,
      level: 0,
      cameraOff: false
    };
  },
  computed: {
    mpClass() {
      return this.mute ? "mp-mute" : "mp-normal";
    },
    videoClass() {
      return this.cameraOff ? "video-mute" : "video-normal";
    },
    playerClass() {
      return this.cameraOff ? "camera-off" : "";
    }
  },
  methods: {
    handleVideoReady(localVideo) {
      this.localVideoDirective = localVideo;
    },
    handleTrackCreated() {
      let id = undefined;
      const callback = () => {
        this.level = this.$refs.audioSender.getTrack().getVolumeLevel();
        id = window.requestAnimationFrame(callback);
      };
      id = window.requestAnimationFrame(callback);
      this.$once("hook:beforeDestroy", () => {
        window.cancelAnimationFrame(id);
      });
    },
    handleJoinClient() {
      this.$emit("join-meeting", {
        channel:this.channel,
        mute:this.mute,
        cameraOff: this.cameraOff,
        isHost: false
      });
    },
    handleJoinHost() {
      this.$emit("join-meeting", {
        channel:this.channel,
        mute:this.mute,
        cameraOff: this.cameraOff,
        isHost: true
      });
    },
    handleMpClick() {
      this.mute = !this.mute;
    },
    handleVideoClick() {
      this.cameraOff = !this.cameraOff;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../styles/main/index.styl"
</style>
