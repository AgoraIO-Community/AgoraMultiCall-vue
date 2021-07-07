<template>
  <div class="meet">
    <div class="local_player">
      <agora
        ref="ar"
        :channel="channel"
        :appid="appid"
        :token="token"
        :autoStart="true"
        :errorHandler="handleError"
        @user-joined="handleUserJoin"
        @user-published="handleUserPublished"
        @user-left="handleUserLeft"
        @join-success="handleJoinSuccess"
        @client-created="handleClientCreated"
        @stream-fallback="handleStreamFallback"
        enableDualStream
      >
        <agora-audio-sender
          :mute="mute"
          @track-created="handleAudioTrackCreated"
          ref="audioSender"
        ></agora-audio-sender>
        <agora-audio-receiver ref="audioReceiver" :refuse="refuseList" />
        <agora-video-sender
          :cameraOff="cameraIsClosed"
          customizationPlayer
          ref="videoSender"
          @video-ready="handleVideoReady"
          @video-close="handleVideoClose"
        ></agora-video-sender>
        <agora-video-receiver
          customizationPlayer
          @video-ready="handleRemoteVideoReady"
          :refuse="refuseList"
        ></agora-video-receiver>
      </agora>
      <agora
        v-if="openScreenSharing"
        :channel="channel"
        :appid="appid"
        :token="token"
        :uid="shareScreenUID"
        ref="screenAr"
      >
        <agora-video-sender
          customizationPlayer
          type="screen"
          @video-ready="handleScreenVideoReady"
          @video-close="handleScreenVideoClose"
          @video-create-failed="handleScreenVideoFailed"
        ></agora-video-sender>
      </agora>
    </div>
    <div
      class="player"
      :class="{
        'screen-share-player': youAreShareScreening || otherIsShareScreening
      }"
    >
      <div
        class="user-vision"
        :class="{
          'screen-share-vision': user_id === shareScreenUID,
          'screen-share-vision-pined':
            user_id === shareScreenUID && user_id === pinedUid
        }"
        v-for="user_id in userIdList"
        :key="user_id"
      >
        <div
          v-if="playList.find(e => e.uid === user_id)"
          v-player="playList.find(e => e.uid === user_id)"
          class="player-vision"
          v-show="!streamFallbackList.includes(user_id)"
        ></div>
        <div class="ban">
          <pin-button
            :couldHover="false"
            v-if="pined && user_id === pinedUid"
          />
          <voice-dot
            :level="
              audioStatusObj[user_id || uid] &&
              audioStatusObj[user_id || uid].level
                ? audioStatusObj[user_id || uid].level
                : 0
            "
            :mute="
              audioStatusObj[user_id || uid] &&
                audioStatusObj[user_id || uid].mute !== false
            "
          />
          <p>
            {{ user_id || "you"
            }}<span v-if="user_id === uid && inMeeting"> ( you ) </span>
          </p>
        </div>
        <avatar-audio
          avatar="../assets/yonghu.svg"
          :level="
            audioStatusObj[user_id || uid] &&
            audioStatusObj[user_id || uid].level
              ? audioStatusObj[user_id || uid].level
              : 0
          "
          :mute="
            audioStatusObj[user_id || uid] &&
              audioStatusObj[user_id || uid].mute !== false
          "
          :cameraOff="!playList.find(e => e.uid === user_id) || streamFallbackList.includes(user_id)"
        />
        <div class="central">
          <pin-button
            class="pin-button-local"
            :pined="
              pined && (user_id ? pinedUid === user_id : pinedUid === uid)
            "
            @click="handlePinUser(user_id || uid)"
          />
        </div>
      </div>
    </div>
    <div class="notify">
      <div class="remote-user" @click="handleExpandUserList">
        User: {{ users.length }}
      </div>
      <div class="local-user">
        <div class="local-camera-player">
          <voice-dot
            :mute="this.mute"
            :level="this.localVolumeLevel"
            class="voice-dot-local"
          />
          <video
            v-show="!cameraIsClosed"
            autoplay
            mute
            ref="localCameraPlayer"
          ></video>
          <img v-show="cameraIsClosed" src="../assets/yonghu.svg" alt="" />
        </div>
      </div>
    </div>
    <div class="user-list" v-show="showExpandUserList">
      <p @click="handleCustom">All users in the meeting :</p>
      <ul>
        <li v-for="(item, index) in users" :key="index">
          <voice-dot
            class="audio-dot-local"
            :level="
              audioStatusObj[item.uid || uid] &&
              audioStatusObj[item.uid || uid].level
                ? audioStatusObj[item.uid || uid].level
                : 0
            "
            :mute="
              audioStatusObj[item.uid || uid] &&
                audioStatusObj[item.uid || uid].mute !== false
            "
          />
          <pin-button
            class="pin-button-local"
            :pined="
              pined && (item.uid ? pinedUid === item.uid : pinedUid === uid)
            "
            @click="handlePinUser(item.uid || uid)"
          />
          {{ item.uid || item }}
        </li>
      </ul>
    </div>
    <div class="banner">
      <div class="test-button" @click="handleOpenNewPage">
        (test) open new page
      </div>
      <mp-button :class="microphoneClass" @click="handleMute" />
      <on-call-button v-if="!inMeeting" @click="handleCall" />
      <close-button v-if="inMeeting" @click="handleLeave" />
      <video-button :class="cameraClass" @click="handleCamera" />
      <div class="share-screen-button" @click="handleShareScreen">
        {{
          youAreShareScreening
            ? "You are Sharing"
            : otherIsShareScreening
            ? "Other is Sharing"
            : "Share Screen"
        }}
      </div>
    </div>
  </div>
</template>

<script>
import MpButton from "./buttons/mp-button";
import CloseButton from "./buttons/close-button";
import OnCallButton from "./buttons/on-call-button";
import VideoButton from "./buttons/video-button";
import VoiceDot from "./voice-dot/main";
import AvatarAudio from "./avatar-audio/main";
import PinButton from "./pin-button/main";

export default {
  name: "Meet",
  components: {
    MpButton,
    CloseButton,
    OnCallButton,
    VideoButton,
    VoiceDot,
    AvatarAudio,
    PinButton
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
    },
    preMute: {
      type: Boolean,
      default: false
    },
    preCameraOff: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mute: false,
      handleError: error => {
        this.$message.error(error.message || error);
      },
      uid: null,
      cameraIsClosed: false,
      inMeeting: false,
      remoteUsers: [],
      showExpandUserList: false,
      localDirective: null,
      localScreenDirective: null,
      localVolumeLevel: 0,
      remoteVolumeLevelList: [],
      remoteDirectiveList: [],
      remoteMuteStatus: [],
      pined: false,
      pinedUid: null,
      openScreenSharing: false,
      youAreShareScreening: false,
      shareScreenUID: 99991234,
      streamFallbackList: []
    };
  },
  computed: {
    refuseList() {
      return this.openScreenSharing ? [this.shareScreenUID] : [];
    },
    microphoneClass() {
      return this.mute ? "mp-mute" : "mp-normal";
    },
    cameraClass() {
      return this.cameraIsClosed ? "video-mute" : "video-normal";
    },
    users() {
      let result = [...this.remoteUsers];
      result.unshift(this.uid ? this.uid + "(you)" : "you");
      this.youAreShareScreening && result.unshift(this.shareScreenUID);
      return result;
    },
    userList() {
      let result = [...this.remoteUsers];
      this.uid && result.unshift(this.uid);
      this.youAreShareScreening && result.unshift(this.shareScreenUID);
      return result;
    },
    unpinedUserIdList() {
      let result = [...this.remoteUsers.map(user => user.uid)];
      this.uid && result.unshift(this.uid);
      this.youAreShareScreening && result.unshift(this.shareScreenUID);
      return result;
    },
    userIdList() {
      if (this.pined) {
        return [this.pinedUid];
      }
      return this.unpinedUserIdList;
    },
    playList() {
      let result = [...this.remoteDirectiveList];
      this.localDirective && result.unshift(this.localDirective);
      this.localScreenDirective && result.unshift(this.localScreenDirective);
      return result;
    },
    remoteAudioStatusObj() {
      const volumeLevel = Object.assign(
        {},
        ...this.remoteVolumeLevelList.map(e => ({ [e.uid]: e.result }))
      );
      const muteStatus = Object.assign(
        {},
        ...this.remoteMuteStatus.map(e => ({ [e.uid]: e.result }))
      );
      return Object.assign(
        {},
        ...this.remoteUsers
          .map(user => user.uid)
          .map(k => ({
            [k]: {
              level: volumeLevel[k] || 0,
              mute: muteStatus[k] !== false
            }
          }))
      );
    },
    audioStatusObj() {
      return this.localVolumeLevel || this.localVolumeLevel === 0
        ? {
            ...{
              [this.uid]: { level: this.localVolumeLevel, mute: this.mute }
            },
            ...this.remoteAudioStatusObj
          }
        : {
            ...this.remoteAudioStatusObj
          };
    },
    otherIsShareScreening() {
      return (
        !this.youAreShareScreening &&
        this.unpinedUserIdList.includes(this.shareScreenUID)
      );
    }
  },
  watch: {
    cameraIsClosed(newV) {
      if (!newV && this.$refs.videoSender && this.$refs.localCameraPlayer) {
        this.playLocalVideoOnTopBanner();
      }
    }
  },
  created() {
    this.mute = this.preMute;
    this.cameraIsClosed = this.preCameraOff;
  },
  methods: {
    handleOpenNewPage() {
      window.open(window.location.href);
    },
    handleCustom() {
      const tracks = this.$refs.ar.getLocalTracks();
      console.log(tracks);
    },
    handleJoinSuccess(uid) {
      this.inMeeting = true;
      this.uid = uid;
      this.$message.success("Join the meeting successfully");
    },
    handleClientCreated() {
      window._agMeet = this;
      window._client = this.$refs.ar.getClient();
      window._AgoraRTC = this.$refs.ar.getAgoraRtc();
      window._sClient = this.$refs?.screenAr?.getClient();
      // client.setStreamFallbackOption()
    },
    handleMute() {
      this.mute = !this.mute;
      this.$message(`Microphone Turned ${this.mute ? "OFF" : "ON"}`);
    },
    playLocalVideoOnTopBanner() {
      const videoTrack = this.$refs.videoSender
        .getTrack()
        .getMediaStreamTrack();
      this.$refs.localCameraPlayer.srcObject = new MediaStream([videoTrack]);
    },
    handleCall() {
      if (this.inMeeting) {
        this.$message.error("You are already in the meeting");
        return;
      }
      this.$refs.ar.start().then(({ result, message }) => {
        if (!result) {
          this.$message.error("join channel error", message);
        }
      });
    },
    handleLeave() {
      if (!this.inMeeting) {
        this.$message.error("You have not joined any meetings");
        return;
      }
      this.$refs.ar.leave().then(() => {
        this.inMeeting = false;
        this.remoteUsers = [];
        this.uid = null;
        this.$message.success("Left the meeting successfully");
        this.$emit("leave-meeting");
      });
    },
    handleCamera() {
      this.cameraIsClosed = !this.cameraIsClosed;
      this.$message(`Camera Turned ${this.cameraIsClosed ? "OFF" : "ON"}`);
    },
    handleUserJoin(user) {
      this.$message(`${user.uid} join meeting`);

      // weak net fallback
      this.$refs.ar.getClient().setStreamFallbackOption(user.uid, 2);

      // if you are sharing your screen,
      // you need not subscribe the screen video of yourself.
      this.remoteUsers = this.$refs.ar
        .getRemoteUsers()
        .filter(
          user => !this.openScreenSharing || user.uid !== this.shareScreenUID
        );
      this.handleCheckRemoteUserAudioMuteStatus();
    },
    handleUserPublished(user, mediaType) {
      console.log("user published ", mediaType, user.uid);

      if (mediaType === "audio") {
        this.handleGetRemoteVolumeLevelList();
      }
    },
    handleUserLeft(user, reason) {
      this.$message(`${user.uid} left meeting because ${reason}`);
      this.remoteUsers = this.$refs.ar
        .getRemoteUsers()
        .filter(
          user => !this.openScreenSharing || user.uid !== this.shareScreenUID
        );

      if (user.uid === this.pinedUid) {
        this.pined = false;
        this.pinedUid = null;
      }
    },
    handleExpandUserList() {
      this.showExpandUserList = !this.showExpandUserList;
    },
    handleVideoReady(localVideo, info) {
      console.log("video-ready trigger:", info);
      this.localDirective = localVideo;
      this.playLocalVideoOnTopBanner();
    },
    handleScreenVideoReady(screenVideo) {
      this.youAreShareScreening = true;
      this.localScreenDirective = screenVideo;
    },
    handleVideoClose() {
      this.localDirective = null;
    },
    handleScreenVideoClose() {
      this.youAreShareScreening = false;
      this.localScreenDirective = null;
    },
    handleScreenVideoFailed() {
      this.handleScreenVideoClose();
      this.openScreenSharing = false;
    },
    handleRemoteVideoReady(remoteUserList) {
      this.remoteDirectiveList = remoteUserList;
    },
    handleAudioTrackCreated() {
      let id = undefined;
      const audioSender = this.$refs.audioSender;
      const callback = () => {
        try {
          const track = audioSender.getTrack();
          if (track && track.getVolumeLevel) {
            this.localVolumeLevel = track.getVolumeLevel();
          } else {
            this.localVolumeLevel = 0;
          }
          id = window.requestAnimationFrame(callback);
        } catch (e) {
          console.error(e);
        }
      };
      id = window.requestAnimationFrame(callback);
      this.$once("hook:beforeDestroy", () => {
        window.cancelAnimationFrame(id);
      });
    },
    handleGetRemoteVolumeLevelList() {
      let id = undefined;
      const audioReceiver = this?.$refs?.audioReceiver;
      const callback = () => {
        this.remoteVolumeLevelList = audioReceiver?.getVolumeLevel();
        id = window.requestAnimationFrame(callback);
      };
      id = window.requestAnimationFrame(callback);
      this.$once("hook:beforeDestroy", () => {
        window.cancelAnimationFrame(id);
      });
    },
    handleCheckRemoteUserAudioMuteStatus() {
      let id = undefined;
      const audioReceiver = this?.$refs?.audioReceiver;
      const callback = () => {
        this.remoteMuteStatus = audioReceiver?.getUserMuteStatus();
        id = window.requestAnimationFrame(callback);
      };
      id = window.requestAnimationFrame(callback);
      this.$once("hook:beforeDestroy", () => {
        window.cancelAnimationFrame(id);
      });
    },
    handlePinUser(uid) {
      if (this.pined && this.pinedUid === uid) {
        this.pined = false;
        this.pinedUid = null;
      } else {
        this.pinedUid = uid;
        this.pined = true;
      }
    },
    handleShareScreen() {
      if (!this.youAreShareScreening) {
        if (this.otherIsShareScreening) {
          this.$message.warning(`other is sharing, and you will replace him.`);
        }
      } else {
        this.$message(`you will quit screen sharing.`);
      }
      this.openScreenSharing = !this.openScreenSharing;
    },
    handleStreamFallback(uid, type) {
      const list = this.streamFallbackList;
      console.log(`[Agora Web Multi-party Call Demo.Vue] : stream fallback: uid ${uid}, type: ${type}`)
      if (type === "recover") {
        this.streamFallbackList = list.filter(e => e !== uid);
      } else if (type === "fallback") {
        this.streamFallbackList = [...new Set([...list, uid])];
      } else {
        this.$message.error("stream fallback type error");
      }
    }
  }
};
</script>

<style lang="stylus">
video.agora_video_player
  object-fit: contain !important
</style>

<style scoped lang="stylus">
@import "../styles/meet/index.styl"
</style>
