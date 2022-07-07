import ZIMKitManager from '../../ZIMKitCommon/VM/ZIMKitManager';
import ZIMKitMessageModel from '../Model/ZIMKitMessageModel';
import ZIMKitEventHandler from '../../ZIMKitCommon/VM/ZIMKitEventHandler';
import ZIMKitConversationModel from '../../ZIMKitConversation/Model/ZIMKitConversationModel';
import { toastOperation } from '../../ZIMKitCommon/ToolUtil/toast';
import { event } from '../../ZIMKitCommon/Constant/event';
import i18n from '../../../plugin/i18n';
export default class ZIMKitMessageVM {
  private static instance: ZIMKitMessageVM = {} as ZIMKitMessageVM;
  private eventHandler = ZIMKitEventHandler.getInstance();
  public currentMessageList: ZIMKitMessageModel[] = [];
  public messageCount = 30;
  public currentChat: ZIMKitConversationModel = {} as ZIMKitConversationModel;
  constructor() {
    this.initListener();
  }
  public static getInstance(): ZIMKitMessageVM {
    if (Object.keys(ZIMKitMessageVM.instance).length === 0) {
      ZIMKitMessageVM.instance = new ZIMKitMessageVM();
    }
    return ZIMKitMessageVM.instance;
  }
  initListener(): void {
    this.eventHandler.addEventListener('receivePeerMessage', this, (res: any) => {
      if (this.currentChat.conversationID === res.fromConversationID) {
        res.messageList.forEach((item: any) => {
          this.currentMessageList.push(new ZIMKitMessageModel(item));
        });
        this.eventHandler.actionListener(event.zimKitCurrentChatUpdated, this.currentChat);
        this.eventHandler.actionListener(event.zimKitCurrentMessageListUpdated, this.currentMessageList);
      }
    });
    this.eventHandler.addEventListener('receiveGroupMessage', this, (res: any) => {
      if (this.currentChat.conversationID === res.fromConversationID) {
        res.messageList.forEach((item: any) => {
          this.currentMessageList.push(new ZIMKitMessageModel(item));
        });
        this.eventHandler.actionListener(event.zimKitCurrentChatUpdated, this.currentChat);
        this.eventHandler.actionListener(event.zimKitCurrentMessageListUpdated, this.currentMessageList);
      }
    });
    this.eventHandler.addEventListener(event.zimKitCurrentConversationUpdate, this, async (conversation: ZIMKitConversationModel) => {
      if (this.currentChat.conversationID !== conversation.conversationID) {
        this.currentChat = conversation;
        this.messageCount = 30;
        await this.queryHistoryMessage(this.currentChat.conversationID, this.currentChat.type);
      } else {
        this.currentChat = conversation;
      }
      this.eventHandler.actionListener(event.zimKitCurrentChatUpdated, this.currentChat);
    });
    this.eventHandler.addEventListener(event.zimKitDeleteConversation, this, (conversationID) => {
      if (conversationID === this.currentChat.conversationID) {
        this.currentMessageList = [];
        this.currentChat = {} as ZIMKitConversationModel;
        this.eventHandler.actionListener(event.zimKitCurrentChatUpdated, this.currentChat);
        this.eventHandler.actionListener(event.zimKitCurrentMessageListUpdated, this.currentMessageList);
      }
    });
  }
  // 发送单聊消息
  public async sendPeerMessage(message: any) {
    const config = {
      priority: 1,
    };
    await ZIMKitManager.getInstance()
      .zim.sendPeerMessage(message, this.currentChat.conversationID, config)
      .then((res: any) => {
        this.currentMessageList.push(new ZIMKitMessageModel(res.message));
      })
      .catch((err: any) => {
        const msg = {
          type: 1,
          messageID: String(new Date().getTime()),
          message: message.message,
          timestamp: new Date().getTime(),
          senderUserID: JSON.parse(localStorage.userInfo).userID,
          conversationID: '',
          conversationType: 0,
          direction: 0,
          sentStatus: 2,
          orderKey: 0,
          conversationSeq: 0,
        };
        this.currentMessageList.push(new ZIMKitMessageModel(msg));
        switch (err.code) {
          case 6000204:
            {
              const tipMsg = {
                type: 99,
                messageID: String(new Date().getTime()),
                message: `${i18n.t('message_user_not_exit_please_again').replace('%s', this.currentChat.conversationID)}`,
                timestamp: new Date().getTime(),
                senderUserID: JSON.parse(localStorage.userInfo).userID,
                conversationID: '',
                conversationType: 0,
                direction: 0,
                sentStatus: 2,
                orderKey: 0,
                conversationSeq: 0,
              };
              this.currentMessageList.push(new ZIMKitMessageModel(tipMsg));
            }
            break;
        }
      })
      .finally(() => {
        this.eventHandler.actionListener(event.zimKitCurrentChatUpdated, this.currentChat);
        this.eventHandler.actionListener(event.zimKitCurrentMessageListUpdated, this.currentMessageList);
      });
  }
  // 发送群组消息
  public async sendGroupMessage(message: any) {
    const config = {
      priority: 1,
    };
    await ZIMKitManager.getInstance()
      .zim.sendGroupMessage(message, this.currentChat.conversationID, config)
      .then((res: any) => {
        this.currentMessageList.push(new ZIMKitMessageModel(res.message));
      })
      .catch((err: any) => {
        switch (err.code) {
          case 6000203:
            {
              const msg = {
                type: 1,
                messageID: String(new Date().getTime()),
                message: message.message,
                timestamp: new Date().getTime(),
                senderUserID: JSON.parse(localStorage.userInfo).userID,
                conversationID: '',
                conversationType: 0,
                direction: 0,
                sentStatus: 2,
                orderKey: 0,
                conversationSeq: 0,
              };
              this.currentMessageList.push(new ZIMKitMessageModel(msg));
            }
            break;
        }
        toastOperation(true, {
          name: '',
          duration: true,
          text: err.message,
          type: 'default',
        });
      })
      .finally(() => {
        this.eventHandler.actionListener(event.zimKitCurrentChatUpdated, this.currentChat);
        this.eventHandler.actionListener(event.zimKitCurrentMessageListUpdated, this.currentMessageList);
      });
  }
  // 查询历史消息
  public async queryHistoryMessage(conversationID: string, conversationType: number) {
    // 从后往前查询会话历史消息，每次查询 30 条
    const config = {
      nextMessage: undefined, // 首次查询时 nextMessage 为 null
      count: this.messageCount,
      reverse: true,
    };
    await ZIMKitManager.getInstance()
      .zim.queryHistoryMessage(conversationID, conversationType, config)
      .then((res: any) => {
        this.currentMessageList = [];
        if (res.messageList.length) {
          res.messageList.forEach((item: ZIMKitMessageModel) => {
            this.currentMessageList.push(new ZIMKitMessageModel(item));
            this.currentMessageList.sort((a, b) => a.timestamp - b.timestamp);
          });
        }
        this.eventHandler.actionListener(event.zimKitCurrentMessageListUpdated, this.currentMessageList);
      });
  }
  registerCurrentChatUpdatedCallback(callback: (currentChat: ZIMKitConversationModel) => void) {
    this.eventHandler.addEventListener(event.zimKitCurrentChatUpdated, this, callback);
  }
  registerMessageListUpdatedCallback(callback: (messageList: ZIMKitMessageModel[]) => void) {
    this.eventHandler.addEventListener(event.zimKitCurrentMessageListUpdated, this, callback);
  }
  registerLoginUserUpdatedCallback(callback: (userInfo: ZIMUserInfo) => void) {
    this.eventHandler.addEventListener(event.zimKitLoginUserUpdate, this, callback);
  }
  unInit() {
    this.currentMessageList = [];
    this.messageCount = 30;
    this.currentChat = {} as ZIMKitConversationModel;
  }
}
