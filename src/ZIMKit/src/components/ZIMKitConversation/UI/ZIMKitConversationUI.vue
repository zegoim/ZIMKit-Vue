<template>
  <div class="conversation">
    <div class="left-banner">
      <div class="top">
        <div class="item">
          <div class="icon message-icon"></div>
          <div class="text">{{ $t('conversation_message_total_count') }}</div>
          <!-- <div class="text">消息总数</div> -->
          <div class="total" v-if="conversation.totalUnreadMessageCount">
            {{ conversation.totalUnreadMessageCount > 99 ? '99+' : conversation.totalUnreadMessageCount }}
          </div>
        </div>
        <div class="item" @click="triggerDialog">
          <div class="icon create-chat-icon"></div>
          <div class="text create-chat-text">{{ $t('conversation_start_chat_w') }}</div>
          <!-- <div class="text create-chat-text">发起聊天</div> -->
        </div>
      </div>
      <div class="item" @click="logout">
        <div class="icon exit-icon"></div>
        <div class="text exit-text">{{ $t('common_logout') }}</div>
        <!-- <div class="text exit-text">退出</div> -->
      </div>
    </div>
    <template v-if="!conversation.isAbnormal">
      <div v-if="conversationList.size" class="conversation-content" @scroll="listScroll()">
        <div class="conversation-item" :class="{ actived: conversation.activeConversationID === item.conversationID }" v-for="(item, index) in conversationList.values()" :key="index" @click="switchConversation(item)" @click.right.prevent="operationConversation($event, item)">
          <div class="head-portrait">
            {{ item.type === 0 ? nameFormat(item) : 'G' }}
            <div class="unread-count" v-if="item.unreadMessageCount">
              {{ item.unreadMessageCount > 99 ? '99+' : item.unreadMessageCount }}
            </div>
          </div>
          <div class="conversation-info">
            <div class="info-top">
              <div class="item-name">
                {{ item.conversationName || item.conversationID }}
              </div>
              <div v-if="item.lastMessage" class="item-date">
                {{ dateFormat(item.lastMessage.timestamp) }}
              </div>
            </div>
            <div v-if="item.lastMessage" class="item-message">
              <div v-if="item.lastMessage.sentStatus === 2" class="err-icon"></div>
              <div class="message-text">{{ item.lastMessage.message }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="default-content">
        <!-- <div class="text">{{ $t('conversation_empty') }}</div> -->
        <div class="text">
          {{ $t('conversation_empty') }}
        </div>
      </div>
    </template>
    <template v-else>
      <div class="abnormal-content">
        <div class="btn reload-btn" @click="ZIMKitConversationVM.getInstance().loadConversationList()">
          {{ $t('conversation_reload') }}
        </div>
      </div>
    </template>
    <CreatChatDialog v-if="createChatDialog" @closeDialog="closeDialog" @createChat="createChat" @createGroupChat="createGroupChat" @joinGroup="joinGroup"></CreatChatDialog>
    <RightClickDialog v-if="rightClickDialog" :x="x" :y="y" :conversationItem="conversationItem"></RightClickDialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ZIMKitConversationVM from '../VM/ZIMKitConversationVM';
import ZIMKitGroupVM from '../../ZIMKitGroup/VM/ZIMKitGroupVM';
import ZIMKitManager from '../../ZIMKitCommon/VM/ZIMKitManager';
import CreatChatDialog from '../../ZIMKitCommon/UI/components/create-chat-dialog.vue';
import RightClickDialog from '../../ZIMKitCommon/UI/components/right-click-dialog.vue';
import { dateFormat } from '../../ZIMKitCommon/ToolUtil/dateFormat';
import { dialogOperation, toastOperation, groupUIOperation } from '../../ZIMKitCommon/ToolUtil/toast';
import ZIMKitConversationModel from '../Model/ZIMKitConversationModel';
import { event } from '../../ZIMKitCommon/Constant/event';
import eventHandler from '../../ZIMKitCommon/VM/ZIMKitEventHandler';
export default Vue.extend({
  components: {
    CreatChatDialog,
    RightClickDialog,
  },
  data() {
    return {
      conversation: ZIMKitConversationVM.getInstance(),
      createChatDialog: false,
      group: ZIMKitGroupVM.getInstance(),
      zimkit: ZIMKitManager.getInstance(),
      rightClickDialog: false,
      x: 0,
      y: 0,
      conversationItem: {},
      eventHandler: eventHandler.getInstance(),
      conversationList: new Map(),
    };
  },
  async mounted() {
    window.addEventListener('click', this.handleClick);
    eventHandler.getInstance().addEventListener(event.zimKitConversationListUpdate, this, (conversationList: Map<string, ZIMKitConversationModel>) => {
      this.conversationList = new Map(conversationList);
    });
    ZIMKitConversationVM.getInstance().registerIsLoggedInCallback(async () => {
      await ZIMKitConversationVM.getInstance().loadConversationList();
    });
    if (ZIMKitManager.getInstance().isLoggedIn) {
      await ZIMKitConversationVM.getInstance().loadConversationList();
    }
  },
  beforeDestroy() {
    ZIMKitConversationVM.getInstance().unInit();
    window.removeEventListener('click', this.handleClick);
  },
  methods: {
    nameFormat(item: ZIMKitConversationModel) {
      if (item.conversationName) {
        return item.conversationName.substr(0, 1).toLowerCase();
      } else {
        return item.conversationID.substr(0, 1).toLowerCase();
      }
    },
    dateFormat(time: string) {
      if (time) {
        return dateFormat(time, false);
      } else {
        return '';
      }
    },
    async switchConversation(item: ZIMKitConversationModel) {
      this.conversation.activeConversationID = item.conversationID;
      if (item.unreadMessageCount) {
        this.conversation.clearConversationUnreadMessageCount(item.conversationID, item.type);
      }
      this.eventHandler.actionListener(event.zimKitCurrentConversationUpdate, item);
    },
    triggerDialog() {
      this.createChatDialog = true;
    },
    closeDialog() {
      this.createChatDialog = false;
    },
    createChat(userID: string) {
      this.createChatDialog = false;
      const conversationItem = this.conversationList.get(userID);
      if (conversationItem) {
        this.conversation.activeConversationID = conversationItem.conversationID;
        this.eventHandler.actionListener(event.zimKitCurrentConversationUpdate, conversationItem);
      } else {
        const conversation = {
          conversationID: userID,
          conversationName: userID,
          type: 0,
        } as ZIMKitConversationModel;
        this.conversation.activeConversationID = '';
        this.eventHandler.actionListener(event.zimKitCurrentConversationUpdate, conversation);
      }
    },
    createGroupChat(groupName: string, userIDList: string) {
      const userIDListArr = userIDList.split(';');
      ZIMKitGroupVM.getInstance()
        .createGroup('', groupName, userIDListArr)
        .then((data: any) => {
          const { groupInfo, errorUserList } = data;
          const { baseInfo } = groupInfo;
          if (errorUserList.length) {
            const errorUserIDList = errorUserList.map((item: any) => item.userID).join(' ');
            dialogOperation(true, {
              desc: `${this.$t('message_user_not_exit_please_again').replace('%s', errorUserIDList)}`,
              cancelText: `${this.$t('common_return')}`,
              hasCloseBtn: false,
            });
            return;
          } else {
            this.createChatDialog = false;
            const conversation = {
              conversationID: baseInfo.groupID,
              conversationName: baseInfo.groupName,
              type: 2,
            } as ZIMKitConversationModel;
            this.conversation.activeConversationID = '';
            this.eventHandler.actionListener(event.zimKitCurrentConversationUpdate, conversation);
          }
        });
    },
    operationConversation(e: any, item: any) {
      this.rightClickDialog = true;
      this.x = e.layerX;
      this.y = e.layerY;
      this.conversationItem = item;
    },

    logout() {
      ZIMKitManager.getInstance().logout();
    },
    // 监听页面滚动
    async listScroll() {
      const msgElement = document.querySelector('.conversation-content') as HTMLDivElement;
      const scrollTop = Math.round(msgElement.scrollTop);
      const scrollHeight = msgElement.scrollHeight;
      const clientHeight = msgElement.clientHeight;
      if (scrollTop >= scrollHeight - clientHeight) {
        this.conversation.loadNextPage();
      }
      if (scrollTop == 0) {
        // todo reload
      }
    },
    // 滚动到最底部
    scrollToBottom() {
      const msgElement = document.querySelector('.message-content') as HTMLDivElement;
      const scrollTop = Number(msgElement.scrollHeight) - Number(msgElement.clientHeight);
      msgElement.scrollTop = scrollTop;
    },
    joinGroup(groupID: string) {
      this.group
        .joinGroup(groupID)
        .then((res: any) => {
          if (res) {
            this.createChatDialog = false;
            const conversation = {
              conversationID: res.groupInfo.baseInfo.groupID,
              conversationName: res.groupInfo.baseInfo.groupName,
              type: 2,
            } as ZIMKitConversationModel;
            this.conversation.activeConversationID = '';
            this.eventHandler.actionListener(event.zimKitCurrentConversationUpdate, conversation);
          }
        })
        .catch((err: any) => {
          switch (err.code) {
            case 6000523:
              {
                dialogOperation(true, {
                  // desc: `${this.$t('group_group_id') + ' ' + groupID + ' ' + this.$t('group_group_id_not_exit_w')}`,
                  desc: `${this.$t('group_group_id_not_exit').replace('%s', groupID)}`,
                  cancelText: `${this.$t('common_return')}`,
                  hasCloseBtn: false,
                });
              }
              break;
            default:
              {
                toastOperation(true, {
                  name: '',
                  duration: true,
                  text: err.message,
                  type: 'default',
                });
              }
              break;
          }
        });
    },
    handleClick(e: any) {
      if (e.target.parentNode.className !== 'right-click-box') {
        if (e.target.parentNode?.parentNode?.className !== 'right-click-box') {
          this.rightClickDialog = false;
        } else {
          this.rightClickDialog = !this.rightClickDialog;
        }
      } else {
        this.rightClickDialog = !this.rightClickDialog;
      }

      if (e.target.className !== 'more-icon') {
        const group = document.querySelector('.group-container');
        let flag = false;
        e.path.forEach((item: any) => {
          if (item.className === 'group-container') {
            flag = true;
          }
        });
        if (group && !flag) {
          groupUIOperation();
        }
      } else {
        groupUIOperation();
      }
    },
  },
});
</script>

<style lang="less" scoped>
.conversation {
  display: flex;
  width: 350px;
  height: 720px;
  background-color: #fff;
  border-radius: 0 0 0 8px;
  .left-banner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px 8px;
    width: 70px;
    height: 100%;
    background-color: #f2f2f2;
    border-radius: 0 0 0 8px;
    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 24px;
      padding: 8px 0 6px;
      width: 54px;
      // height: 54px;
      background-color: #fff;
      border-radius: 4px;
      cursor: pointer;
      .icon {
        width: 24px;
        height: 24px;
        background-size: cover;
      }
      .message-icon {
        background-image: url('../UI/assets/images/message-default.png');
      }
      .create-chat-icon {
        background-image: url('../UI/assets/images/create-chat-default.png');
      }
      .exit-icon {
        background-image: url('../UI/assets/images/exit-default.png');
      }
      &:hover {
        .create-chat-text {
          color: #3478fc;
        }
        .create-chat-icon {
          background-image: url('../UI/assets/images/create-chat-hover.png');
        }
        .exit-text {
          color: #ff4a50;
        }
        .exit-icon {
          background-image: url('../UI/assets/images/exit-hover.png');
        }
      }
      .text {
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        color: #666666;
        line-height: 16px;
      }
      .total {
        position: absolute;
        top: -16px;
        right: -14px;
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        background-color: #ff4a50;
        font-size: 18px;
        font-weight: 500;
        color: #fff;
        border-radius: 50%;
        transform: scale(0.5);
        line-height: 40px;
        text-align: center;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .conversation-content {
    // display: flex;
    // flex-direction: column;
    padding: 8px 8px 0 8px;
    width: 280px;
    overflow-y: auto;
    .conversation-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      width: 100%;
      height: 68px;
      border-radius: 5px;

      &.actived {
        background: linear-gradient(270deg, #64b0fe 0%, #3478fc 100%);
        .conversation-info {
          .item-message {
            .message-text {
              color: #fff;
            }
          }
        }
        .conversation-info {
          .info-top {
            .item-name,
            .item-date {
              color: #fff;
            }
          }
        }
      }
      &:hover {
        cursor: pointer;
        background-color: #f2f2f2;
      }
      .head-portrait {
        position: relative;
        flex-shrink: 0;
        margin-right: 10px;
        text-align: center;
        width: 44px;
        height: 44px;
        line-height: 42px;
        border-radius: 8px;
        background-color: #fff;
        border: 1px solid #ccc;
        .unread-count {
          position: absolute;
          top: -18px;
          right: -16px;
          width: 40px;
          height: 40px;
          background-color: #ff4a50;
          font-size: 18px;
          font-weight: 500;
          color: #fff;
          border-radius: 50%;
          transform: scale(0.5);
          line-height: 40px;
          text-align: center;
        }
      }
      .conversation-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        .info-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          .item-name {
            max-width: 110px;
            font-size: 16px;
            font-weight: 500;
            color: #18191a;
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .item-date {
            font-size: 12px;
            font-weight: 400;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #b8b8b8;
            line-height: 17px;
          }
        }
        .item-message {
          display: flex;
          align-items: center;
          margin-top: 4px;
          .message-text {
            max-width: 160px;
            height: 18px;
            font-size: 12px;
            font-weight: 500;
            color: #b1b4bb;
            line-height: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .default-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    color: #394256;
    .text {
      line-height: 22px;
      text-align: center;
      white-space: pre-wrap;
    }
  }
  .abnormal-content {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .reload-btn {
      margin-top: 620px;
      width: 100px;
      height: 36px;
      line-height: 36px;
    }
  }
  .err-icon {
    margin-right: 4px;
    width: 12px;
    height: 12px;
  }
}
</style>
