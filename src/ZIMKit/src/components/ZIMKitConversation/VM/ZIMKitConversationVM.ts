import ZIMKitManager from '../../ZIMKitCommon/VM/ZIMKitManager';
import ZIMKitEventHandler from '../../ZIMKitCommon/VM/ZIMKitEventHandler';
import { event } from '../../ZIMKitCommon/Constant/event';
import ZIMKitConversationModel from '../Model/ZIMKitConversationModel';
import { toastOperation } from '../../ZIMKitCommon/ToolUtil/toast';
import { ZIMConversation } from 'zego-zim-web';
export default class ZIMKitConversationVM {
  private static instance: ZIMKitConversationVM = {} as ZIMKitConversationVM;
  // private vm!: Vue;
  private zim = ZIMKitManager.getInstance().zim;
  private eventHandler = ZIMKitEventHandler.getInstance();
  public pagePullCount = 100;
  // public conversationList: ZIMKitConversationModel[] = [];
  public conversationList: Map<string, ZIMKitConversationModel> = new Map();
  public totalUnreadMessageCount = 0;
  public isAbnormal = false;
  public activeConversationID = '';
  loadStatus = 0; // 0 not loaded 1 loading 2 loaded
  constructor() {
    this.initListener();
  }
  public static getInstance(): ZIMKitConversationVM {
    if (Object.keys(ZIMKitConversationVM.instance).length === 0) {
      ZIMKitConversationVM.instance = new ZIMKitConversationVM();
    }
    return ZIMKitConversationVM.instance;
  }
  initListener(): void {
    this.eventHandler.addEventListener(event.zimConversationTotalUnreadMessageCountUpdated, this, (totalUnreadMessageCount: number) => {
      this.totalUnreadMessageCount = totalUnreadMessageCount;
    });
    this.eventHandler.addEventListener(event.zimConversationChanged, this, async (data: ZIMEventOfConversationChangedResult) => {
      if (!this.loadStatus) {
        return;
      }
      let updateListFlag = false;
      let updateCurrentConversationFlag = false;
      data.infoList.forEach((info) => {
        switch (info.event) {
          case 1:
            if (this.conversationList.size) {
              let isExist = false;
              this.conversationList.forEach((item: ZIMKitConversationModel) => {
                if (item.conversationID === info.conversation.conversationID) {
                  isExist = true;
                  this.conversationList.set(item.conversationID, info.conversation);
                  if (this.activeConversationID === info.conversation.conversationID) {
                    updateCurrentConversationFlag = true;
                  }
                  updateListFlag = true;
                }
              });
              if (!isExist) {
                this.conversationList.set(info.conversation.conversationID, info.conversation);
                updateListFlag = true;
                if (!this.activeConversationID) {
                  this.activeConversationID = info.conversation.conversationID;
                  updateCurrentConversationFlag = true;
                }
              }
            } else {
              this.conversationList.set(info.conversation.conversationID, info.conversation);
              updateListFlag = true;
            }
            break;
          case 0:
            this.conversationList.set(info.conversation.conversationID, info.conversation);
            updateListFlag = true;
            if (!this.activeConversationID) {
              this.activeConversationID = info.conversation.conversationID;
              updateCurrentConversationFlag = true;
            }
            break;
        }
        if (updateListFlag) {
          this.sortCvListHandle();
          this.eventHandler.actionListener(event.zimKitConversationListUpdate, this.conversationList);
        }
        if (updateCurrentConversationFlag) {
          const currentConversation = this.conversationList.get(this.activeConversationID);
          this.eventHandler.actionListener(event.zimKitCurrentConversationUpdate, currentConversation);
          currentConversation.unreadMessageCount && this.clearConversationUnreadMessageCount(currentConversation.conversationID, currentConversation.type);
        }
      });
    });
  }
  // 加载会话列表
  public async loadConversationList(): Promise<void> {
    if (this.loadStatus === 1) {
      return Promise.resolve();
    }
    this.loadStatus = 1;
    // 拉取会话列表
    const config = {
      nextConversation: undefined,
      count: localStorage.count || this.pagePullCount,
    };
    await ZIMKitManager.getInstance()
      .zim.queryConversationList(config)
      .then((res: any) => {
        this.loadStatus = 2;
        this.isAbnormal = false;
        this.conversationList = new Map();
        if (res.conversationList.length) {
          res.conversationList.forEach((item: ZIMKitConversationModel) => {
            if (item.type === 0 || item.type === 2) {
              this.conversationList.set(item.conversationID, item);
            }
          });
          this.sortCvListHandle();
          if (!this.activeConversationID) {
            this.activeConversationID = Array.from(this.conversationList)[0][0];
          }
          if (this.conversationList.get(this.activeConversationID)?.unreadMessageCount) {
            const conversation = this.conversationList.get(this.activeConversationID) as ZIMKitConversationModel;
            this.clearConversationUnreadMessageCount(conversation.conversationID, conversation.type);
          }
          this.eventHandler.actionListener(event.zimKitCurrentConversationUpdate, this.conversationList.get(this.activeConversationID));
        }
        this.eventHandler.actionListener(event.zimKitConversationListUpdate, this.conversationList);
      })
      .catch((err: any) => {
        this.isAbnormal = true;
        toastOperation(true, {
          name: '',
          duration: true,
          text: err.message,
          type: 'default',
        });
      });
  }
  // 加载下一页
  public async loadNextPage() {
    const config = {
      nextConversation: Array.from(this.conversationList)[this.conversationList.size - 1][1] as ZIMConversation,
      count: this.pagePullCount,
    };
    await ZIMKitManager.getInstance()
      .zim.queryConversationList(config)
      .then((res: any) => {
        if (res.conversationList.length) {
          res.conversationList.forEach((item: ZIMKitConversationModel) => {
            if (item.type === 0 || item.type === 2) {
              this.conversationList.set(item.conversationID, item);
            }
          });
          this.sortCvListHandle();
          this.eventHandler.actionListener(event.zimKitConversationListUpdate, this.conversationList);
        }
      });
  }
  // 删除会话
  public deleteConversation(conversationID: string, conversationType: number) {
    const config = { isAlsoDeleteServerConversation: true };
    ZIMKitManager.getInstance()
      .zim.deleteConversation(conversationID, conversationType, config)
      .then(async () => {
        this.conversationList.delete(conversationID);
        if (this.conversationList.size) {
          if (conversationID === this.activeConversationID) {
            this.activeConversationID = Array.from(this.conversationList)[0][0];
            this.eventHandler.actionListener(event.zimKitCurrentConversationUpdate, this.conversationList.get(Array.from(this.conversationList)[0][0]));
          }
        } else {
          this.activeConversationID = '';
        }
        this.eventHandler.actionListener(event.zimKitConversationListUpdate, this.conversationList);
        this.eventHandler.actionListener(event.zimKitDeleteConversation, conversationID);
      })
      .catch((err: any) => {
        toastOperation(true, {
          name: '',
          duration: true,
          text: err.message,
          type: 'default',
        });
      });
  }
  // 清除数据
  //   public removeData() {}
  // 清空会话未读数
  public clearConversationUnreadMessageCount(conversationID: string, conversationType: number) {
    ZIMKitManager.getInstance().zim.clearConversationUnreadMessageCount(conversationID, conversationType);
  }
  private sortCvListHandle() {
    const sortedArr = Array.from(this.conversationList.values()).sort((a, b) => b.orderKey - a.orderKey);
    this.conversationList = new Map(sortedArr.map((value) => [value.conversationID, value]));
  }
  registerIsLoggedInCallback(callback: () => void) {
    this.eventHandler.addEventListener(event.zimKitIsLoggedIn, this, callback);
  }
  unInit() {
    this.conversationList = new Map();
    this.totalUnreadMessageCount = 0;
    this.isAbnormal = false;
    this.activeConversationID = '';
    this.loadStatus = 0;
  }
}
