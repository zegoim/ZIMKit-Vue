import { ZIMMessageType, ZIMConversationType, ZIMMessageDirection, ZIMMessageSentStatus } from '../../ZIMAdapter/index.entity';
export default class ZIMKitMessage {
  public type: ZIMMessageType | ZIMKitMessageType;
  public messageID: string;
  public timestamp: number;
  public message: string | Uint8Array;
  public senderUserID: string;
  public conversationID: string;
  public conversationType: ZIMConversationType;
  public direction: ZIMMessageDirection;
  public sentStatus: ZIMMessageSentStatus;
  public orderKey: number;
  public conversationSeq: number;
  constructor(message: ZIMKitMessage) {
    this.type = message.type;
    this.messageID = message.messageID;
    this.timestamp = message.timestamp;
    this.message = message.message;
    this.senderUserID = message.senderUserID;
    this.conversationID = message.conversationID;
    this.conversationType = message.conversationType;
    this.direction = message.direction;
    this.sentStatus = message.sentStatus;
    this.orderKey = message.orderKey;
    this.conversationSeq = message.conversationSeq;
  }
}

export enum ZIMKitMessageType {
  Tip = 99,
}
