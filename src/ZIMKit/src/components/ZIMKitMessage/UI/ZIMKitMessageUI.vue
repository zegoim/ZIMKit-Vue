<template>
  <div class="chat">
    <template v-if="currentChat.conversationID">
      <div class="header">
        <div class="title">{{ currentChat.conversationName || currentChat.conversationID }}</div>
        <div v-if="currentChat.type === 2" class="more-icon"></div>
      </div>
      <div class="message-content" @scroll="listScroll()">
        <div class="message-item" v-for="(item, index) in currentMessageList" :key="item.messageID">
          <div v-if="dateFormat(item, currentMessageList[index - 1])" class="time-box">
            {{ dateFormat(item, currentMessageList[index - 1]) }}
          </div>
          <!-- 接收的消息 -->
          <template v-if="item.senderUserID !== userInfo.userID">
            <div class="left-msg">
              <div class="head-portrait">
                {{ item.conversationType === 2 ? getGroupUserName(item.senderUserID).substr(0, 1).toLowerCase() : currentChat.conversationName.substr(0, 1).toLowerCase() }}
              </div>
              <div class="message-box">
                <div v-if="item.conversationType === 2" class="send-name">{{ getGroupUserName(item.senderUserID) }}</div>
                <div class="msg-text">{{ item.message }}</div>
              </div>
            </div>
          </template>
          <!-- 提示错误消息 -->
          <template v-else-if="item.type === 99">
            <div class="center-msg">
              {{ item.message }}
            </div>
          </template>
          <!-- 发送的消息 -->
          <template v-else>
            <div class="right-msg">
              <div v-if="item.type !== 99 && item.sentStatus === 2" class="err-icon"></div>
              <div class="message-box">
                <!-- <div v-if="item.conversationType === 2" class="send-name">{{ userInfo.userName }}</div> -->
                <div class="msg-text">{{ item.message }}</div>
              </div>
              <div class="head-portrait">{{ userInfo.userName.substr(0, 1).toLowerCase() }}</div>
            </div>
          </template>
        </div>
      </div>
      <div class="send-box">
        <div class="tool-box"></div>
        <textarea ref="textarea" class="text-area" v-model="message"></textarea>
        <button class="btn send-button" @click="sendMessage" :disabled="!message">{{ $t('message_send_w') }}</button>
        <!-- <button class="btn send-button" @click="sendMessage" :disabled="!message">发送</button> -->
      </div>
    </template>
    <template v-else>
      <div class="default-content">
        <div class="img"></div>
        <div class="text">{{ $t('message_empty_w') }}</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ZIMKitManager from '../../ZIMKitCommon/VM/ZIMKitManager';
import ZIMKitMessageVM from '../VM/ZIMKitMessageVM';
import ZIMKitMessageModel from '../Model/ZIMKitMessageModel';
import ZIMKitGroupVM from '../../ZIMKitGroup/VM/ZIMKitGroupVM';
import { dateFormat } from '../../ZIMKitCommon/ToolUtil/dateFormat';
@Component({
  components: {},
})
export default class Message extends Vue {
  currentChat = {};
  message = '';
  userInfo = ZIMKitManager.getInstance().userInfo;
  oldScrollHeight = 0;
  newScrollHeight = 0;
  currentMessageList = [] as ZIMKitMessageModel[];
  mounted() {
    ZIMKitMessageVM.getInstance().registerLoginUserUpdatedCallback((userInfo) => {
      this.userInfo = userInfo;
    });
    ZIMKitMessageVM.getInstance().registerCurrentChatUpdatedCallback((currentChat) => {
      this.currentChat = currentChat;
      this.message = '';
      this.$nextTick(() => {
        this.scrollToBottom();
        const textarea = document.getElementsByClassName('text-area')[0] as HTMLTextAreaElement;
        textarea && textarea.focus();
      });
    });
    ZIMKitMessageVM.getInstance().registerMessageListUpdatedCallback((currentMessageList) => {
      this.currentMessageList = currentMessageList;
    });
  }
  beforeDestroy() {
    ZIMKitMessageVM.getInstance().unInit();
  }
  sendMessage() {
    const messageObj = {
      type: 1,
      message: this.message,
    };
    if (ZIMKitMessageVM.getInstance().currentChat.type === 2) {
      // 群组消息
      ZIMKitMessageVM.getInstance().sendGroupMessage(messageObj);
    } else {
      ZIMKitMessageVM.getInstance().sendPeerMessage(messageObj);
    }
    // 清空消息
    this.message = '';
  }
  getGroupUserName(userID: string) {
    if (ZIMKitGroupVM.getInstance().memberList.length && ZIMKitGroupVM.getInstance().memberList.some((item) => item.userID === userID)) {
      const arr = ZIMKitGroupVM.getInstance().memberList.filter((item) => item.userID === userID)[0];
      return arr.userName;
    } else {
      return userID;
    }
  }
  dateFormat(item: ZIMKitMessageModel, previousItem: ZIMKitMessageModel) {
    if (previousItem && item.timestamp - previousItem.timestamp > 300000) {
      return dateFormat(item.timestamp, true);
    }
    if (item.messageID === ZIMKitMessageVM.getInstance().currentMessageList[0].messageID) {
      return dateFormat(item.timestamp, true);
    }
  }
  // 监听页面滚动
  async listScroll() {
    const msgElement = document.querySelector('.message-content') as HTMLDivElement;
    const scrollTop = Math.round(msgElement.scrollTop);
    const scrollHeight = msgElement.scrollHeight;
    if (scrollTop == 0) {
      // 拉取历史消息
      if (ZIMKitMessageVM.getInstance().messageCount <= ZIMKitMessageVM.getInstance().currentMessageList.length) {
        ZIMKitMessageVM.getInstance().messageCount = ZIMKitMessageVM.getInstance().currentMessageList.length + 30;
        await ZIMKitMessageVM.getInstance().queryHistoryMessage(ZIMKitMessageVM.getInstance().currentChat.conversationID, ZIMKitMessageVM.getInstance().currentChat.type);
        // 更新滚动位置
        this.oldScrollHeight = scrollHeight;
        this.$nextTick(() => {
          this.newScrollHeight = msgElement.scrollHeight;
          msgElement.scrollTop = this.newScrollHeight - this.oldScrollHeight;
        });
      }
    }
  }
  // 滚动到最底部
  scrollToBottom() {
    const msgElement = document.querySelector('.message-content') as HTMLDivElement;
    if (msgElement) {
      const scrollTop = Number(msgElement.scrollHeight) - Number(msgElement.clientHeight);
      msgElement.scrollTop = scrollTop;
    }
  }
}
</script>
<style lang="less" scoped>
.chat {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 680px;
  height: 720px;
  background-color: #f2f2f2;
  border-radius: 0 0 8px 0;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
    width: 100%;
    height: 56px;
    .title {
      margin-left: 24px;
      font-size: 16px;
      font-weight: 500;
      color: #18191a;
      line-height: 56px;
    }
    .more-icon {
      margin-right: 8px;
      width: 40px;
      height: 40px;
      background-image: url('./assets/images/more-default.png');
      background-size: cover;
      &:hover {
        cursor: pointer;
        background-image: url('./assets/images/more-hover.png');
      }
    }
  }
  .message-content {
    flex-grow: 1;
    padding: 16px 12px 0 12px;
    height: 200px;
    overflow-y: scroll;
    .message-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 8px 0 16px 0;
      .time-box {
        align-self: center;
        margin-bottom: 16px;
        font-size: 12px;
        font-weight: 500;
        color: #b1b4bb;
      }
      .left-msg {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
      }
      .right-msg {
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        width: 100%;
        .msg-text {
          background-color: #3478fc;
          color: #fff;
        }
        .message-box {
          align-items: flex-end;
          word-break: break-all;
        }
        .err-icon {
          align-self: center;
        }
      }
      .center-msg {
        align-self: center;
      }
      .head-portrait {
        flex-shrink: 0;
        align-self: flex-start;
        text-align: center;
        margin: 0 12px;
        width: 36px;
        height: 36px;
        line-height: 34px;
        border-radius: 8px;
        background-color: #fff;
        border: 1px solid #ccc;
      }
      .message-box {
        display: flex;
        flex-direction: column;
        max-width: 320px;
        .send-name {
          margin-bottom: 4px;
          font-size: 12px;
          font-weight: 400;
          color: #394256;
        }
      }
      .msg-text {
        padding: 11px 12px;
        background-color: #fff;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 400;
        color: #2a2a2a;
        white-space: pre-wrap;
        word-break: break-word;
      }
    }
  }
  .send-box {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #e6e6e6;
    width: 100%;
    height: 156px;
    .tool-box {
      height: 49px;
    }
    .text-area {
      padding: 0 16px;
      width: 100%;
      height: 50px;
      background-color: #f2f2f2;
      font-size: 14px;
      font-weight: 400;
      color: #2a2a2a;
      border: none;
      resize: none;
      outline: none;
    }
    .send-button {
      align-self: flex-end;
      margin-top: 8px;
      margin-right: 24px;
      width: 72px;
      height: 32px;
      line-height: 32px;
    }
  }
  .default-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .img {
      background-image: url('../UI/assets/images/chat-default.png');
      background-size: cover;
      width: 95px;
      height: 89px;
    }
    .text {
      margin-top: 16px;
      font-size: 16px;
      font-weight: 400;
      color: #b1b4bb;
      line-height: 22px;
    }
  }
}
</style>
