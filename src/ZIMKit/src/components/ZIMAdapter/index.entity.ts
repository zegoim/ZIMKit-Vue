import { ZIMError, ZIM, ZIMEventOfTokenWillExpireResult, ZIMEventOfConnectionStateChangedResult, ZIMEventOfReceiveConversationMessageResult, ZIMEventOfConversationTotalUnreadMessageCountUpdatedResult, ZIMEventOfConversationChangedResult } from 'zego-zim-web';

// ZIMPlatformManage
export enum ZIMPlatform {
  Web,
}
// ZIMBase
export {
  ZIM,
  type ZIMEventHandler,
  type ZIMUserInfo,
  type ZIMTokenRenewedResult,
  type ZIMConversationQueryConfig,
  type ZIMConversationListQueriedResult,
  type ZIMGroupInfo,
  type ZIMGroupAdvancedConfig,
  type ZIMGroupCreatedResult,
  type ZIMMessage,
  ZIMMessageType,
  type ZIMMessageSendConfig,
  type ZIMMessageSentResult,
  ZIMMessageDirection,
  ZIMMessageSentStatus,
  type ZIMMessageQueryConfig,
  type ZIMMessageQueriedResult,
  ZIMConversationNotificationStatus,
  ZIMConversationType,
  type ZIMError,
  type ZIMEventOfConnectionStateChangedResult,
  type ZIMEventOfTokenWillExpireResult,
  type ZIMEventOfReceiveConversationMessageResult,
  type ZIMEventOfConversationTotalUnreadMessageCountUpdatedResult,
  type ZIMConversationUnreadMessageCountClearedResult,
  type ZIMConversationDeletedResult,
  ZIMConnectionState,
  type ZIMConversation,
  type ZIMGroupInfoQueriedResult,
  type ZIMGroupFullInfo,
  type ZIMGroupMemberQueryConfig,
  type ZIMGroupMemberListQueriedResult,
  type ZIMGroupJoinedResult,
  type ZIMGroupLeftResult,
  type ZIMGroupMemberInfo,
  type ZIMEventOfConversationChangedResult,
} from 'zego-zim-web';

export type { ZIMConversationDeleteConfig } from 'zego-zim-web';

export type ZIMErrorCallback = (zim: ZIM, errorInfo: ZIMError) => void;

export type ZIMConnectionStateChanged = (data: ZIMEventOfConnectionStateChangedResult) => void;

export type ZIMTokenWillExpire = (data: ZIMEventOfTokenWillExpireResult) => void;

export type ZIMReceivePeerMessage = (data: ZIMEventOfReceiveConversationMessageResult) => void;

export type ZIMReceiveGroupMessage = (data: ZIMEventOfReceiveConversationMessageResult) => void;

export type ZIMConversationTotalUnreadMessageCountUpdated = (data: ZIMEventOfConversationTotalUnreadMessageCountUpdatedResult) => void;

export type ZIMConversationChanged = (data: ZIMEventOfConversationChangedResult) => void;
