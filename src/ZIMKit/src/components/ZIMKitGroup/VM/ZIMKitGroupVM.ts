import ZIMKitManager from '../../ZIMKitCommon/VM/ZIMKitManager';
import { ZIMKitGroupMember, ZIMKitGroupInfo } from '../Model/ZIMKitGroupMember';
import ZIMKitEventHandler from '../../ZIMKitCommon/VM/ZIMKitEventHandler';
import ZIMKitConversationModel from '../../ZIMKitConversation/Model/ZIMKitConversationModel';
import { event } from '../../ZIMKitCommon/Constant/event';
export default class ZIMKitGroupVM {
  private static instance: ZIMKitGroupVM = {} as ZIMKitGroupVM;
  //   private vm!: Vue;
  public memberList: ZIMKitGroupMember[] = [];
  public groupInfo: ZIMKitGroupInfo;
  public eventHandler = ZIMKitEventHandler.getInstance();
  public showView = false;
  constructor() {
    this.initListener();
  }
  public static getInstance(): ZIMKitGroupVM {
    if (Object.keys(this.instance).length === 0) {
      this.instance = new ZIMKitGroupVM();
    }
    return this.instance;
  }
  initListener() {
    // this.eventHandler.addEventListener('createGroup', this, (groupInfo: { groupName: string; userIDList: string }) => {});
    this.eventHandler.addEventListener(event.zimKitCurrentConversationUpdate, this, (conversation: ZIMKitConversationModel) => {
      if (conversation.type === 2) {
        this.groupInfo = {
          groupID: conversation.conversationID,
          groupName: conversation.conversationName,
        };
        this.queryGroupMemberList(conversation.conversationID);
      }
    });
  }
  // 创建群组
  public createGroup(groupID: string, groupName: string, userIDList: string[]) {
    const groupInfo = {
      groupID,
      groupName,
    };
    const config = {
      groupNotice: '',
      groupAttributes: {},
    };
    return ZIMKitManager.getInstance().zim.createGroup(groupInfo, userIDList, config);
  }
  public queryGroupMemberList(groupID: string) {
    const config = { count: 100, nextFlag: 0 };
    return ZIMKitManager.getInstance()
      .zim.queryGroupMemberList(groupID, config)
      .then((res: any) => {
        this.memberList = res.userList;
      });
  }
  // 加入群组
  public joinGroup(groupID: string) {
    return ZIMKitManager.getInstance().zim.joinGroup(groupID);
  }
  // 离开群组
  public leaveGroup(groupID: string) {
    return ZIMKitManager.getInstance().zim.leaveGroup(groupID);
  }
  // 解散群组
  //   public dismissGroup(groupID: string, callBack: Function) {}
  // 邀请成员加入群组
  //   public inviteUsersJoinGroup(userIDList: [], groupID: string, callBack: Function) {}
  // 把成员踢出群组
  //   public kickGroupMembers(userIDList: [], groupID: string, callBack: Function) {}
  // 查询群组信息
  public queryGroupInfo(groupID: string) {
    return ZIMKitManager.getInstance().zim.queryGroupInfo(groupID);
  }
}
