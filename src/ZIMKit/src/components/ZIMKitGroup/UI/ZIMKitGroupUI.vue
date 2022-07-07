<template>
  <div class="group-container" v-if="show">
    <div class="form-box">
      <div class="id">
        <div class="label">{{ $t('group_group_id') }}</div>
        <div class="value">{{ this.group.groupInfo.groupID }}</div>
      </div>
      <div class="btn copy-btn" @click="copy">{{ $t('group_copy') }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import ZIMKitGroupVM from '../VM/ZIMKitGroupVM';
import { toastOperation } from '../../ZIMKitCommon/ToolUtil/toast';
export default Vue.extend({
  props: ['show'],
  data() {
    return {
      group: ZIMKitGroupVM.getInstance(),
    };
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.group.groupInfo.groupID);
      toastOperation(true, {
        name: '',
        duration: true,
        text: 'group_copy_success',
        type: 'default',
      });
    },
  },
});
</script>
<style lang="less" scoped>
.group-container {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 40px 32px 65px;
  width: 272px;
  height: 664px;
  background-color: #fff;
  border-radius: 0 0 8px 0;
  .form-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .id {
      .label {
        font-size: 14px;
        font-weight: 500;
        color: #394256;
        line-height: 20px;
      }
      .value {
        padding-left: 12px;
        width: 208px;
        height: 44px;
        background-color: #f4f5f8;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 400;
        color: #18191a;
        line-height: 44px;
      }
    }
    .copy-btn {
      width: 208px;
      height: 44px;
      line-height: 44px;
    }
  }
}
</style>
