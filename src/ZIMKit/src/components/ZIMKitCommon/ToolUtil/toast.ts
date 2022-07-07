// DIFF_MODULE:UI_Utils
import bus from './bus';
export const toastOperation = (
  type: boolean,
  toastData?: {
    text: string;
    textVariable?: any;
    name: string;
    type: string;
    duration?: boolean;
  },
): void => {
  bus.emit('toastOperation', type, toastData);
};
// 打开关闭dialog
export const dialogOperation = (
  type: boolean,
  dialogData?: {
    title?: string;
    desc: string;
    cancelText: string;
    confirmText?: string;
    hasCloseBtn: boolean;
    confirmFunc?: any;
    cancelFunc?: any;
  },
): void => {
  bus.emit('dialogOperation', type, dialogData);
};

export const groupUIOperation = (): void => {
  bus.emit('groupUIOperation');
};
