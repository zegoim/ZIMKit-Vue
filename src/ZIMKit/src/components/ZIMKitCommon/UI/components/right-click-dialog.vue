<template>
  <div class="right-click-box" :style="`top: ${y}px;left: ${x}px`">
    <div class="item" @click="closeConversation">{{ $t('conversation_close_chat_w') }}</div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import ZIMKitConversationVM from '../../../ZIMKitConversation/VM/ZIMKitConversationVM';
export default Vue.extend({
  props: ['x', 'y', 'conversationItem'],
  data() {
    return {
      conversation: ZIMKitConversationVM.getInstance(),
    };
  },
  methods: {
    closeConversation() {
      this.conversation.deleteConversation(this.conversationItem.conversationID, this.conversationItem.type);
    },
  },
});
</script>
<style lang="less" scoped>
.right-click-box {
  position: absolute;
  padding: 8px 0;
  width: 128px;
  background: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1), 0px 6px 12px 0px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  .item {
    padding: 8px 0 8px 16px;
    font-size: 14px;
    font-weight: 400;
    color: #28292e;
    &:hover {
      cursor: pointer;
      color: #1169ff;
      background: #fafbfd;
    }
  }
}
</style>
