<template>
  <div id="zegoim">
    <div class="zego-im-container">
      <div class="top-banner">ZEGO IM</div>
      <div class="box">
        <Conversation></Conversation>
        <Message></Message>
        <Group :show="showGroupUI"></Group>
      </div>
      <toast :showToast.sync="showToast" :toastData="toastData"></toast>
      <BaseDialog v-show="showBaseDialog" :dialogData="dialogData" :show.sync="showBaseDialog"></BaseDialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import '../UI/assets/css/common.less';
import Toast from './components/Toast.vue';
import BaseDialog from '../../ZIMKitCommon/UI/components/dialog.vue';
import bus from '../ToolUtil/bus';
import Conversation from '../../ZIMKitConversation/UI/ZIMKitConversationUI.vue';
import Message from '../../ZIMKitMessage/UI/ZIMKitMessageUI.vue';
import Group from '../../ZIMKitGroup/UI/ZIMKitGroupUI.vue';
export default Vue.extend({
  components: {
    Toast,
    BaseDialog,
    Conversation,
    Message,
    Group,
  },
  data() {
    return {
      toastData: {
        text: '', // 请使用多语言中的key
        name: '', // 请使用多语言中的key
        type: 'default', // 或者error 背景颜色不同 loading 中间提示且背景不可点击
      },
      showToast: false,
      dialogData: {
        title: '', // 请使用多语言中的key
        desc: '', // 请使用多语言中的key
        cancelText: '', // 请使用多语言中的key
        confirmText: '', // 请使用多语言中的key
        hasCloseBtn: false,
      },
      showBaseDialog: false,
      showGroupUI: false,
    };
  },
  mounted() {
    bus.on('toastOperation', (type, toastData) => {
      this.toastData = toastData;
      this.showToast = type;
    });
    bus.on('dialogOperation', (type, dialogData) => {
      this.dialogData = dialogData;
      this.showBaseDialog = type;
    });
    bus.on('groupUIOperation', () => {
      this.showGroupUI = !this.showGroupUI;
    });
  },
});
</script>
<style lang="less">
* {
  margin: 0;
  font-family: PingFangSC-Medium, PingFang SC;
  box-sizing: border-box;
}
</style>
<style lang="less" scoped>
#zegoim {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.zego-im-container {
  display: flex;
  flex-direction: column;
  width: 1030px;
  height: 770px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  .top-banner {
    padding-left: 24px;
    text-align: left;
    font-size: 16px;
    font-weight: 500;
    line-height: 50px;
    color: #fff;
    width: 100%;
    height: 50px;
    background-color: #3478fc;
    border-radius: 8px 8px 0 0;
  }
  .box {
    position: relative;
    display: flex;
    width: 100%;
    height: 720px;
  }
}
</style>
