import i18n from '../../../plugin/i18n';
export function dateFormat(date: number | string, time: boolean): string {
  if (date === 0) return '--';
  const newDate = new Date(date);
  // 今天的零点
  const today = new Date(new Date().toDateString());

  const dayList: any = {
    1: i18n.t('common_monday'),
    2: i18n.t('common_tuesday'),
    3: i18n.t('common_wednesday'),
    4: i18n.t('common_thursday'),
    5: i18n.t('common_friday'),
    6: i18n.t('common_saturday'),
    0: i18n.t('common_sunday'),
  };

  const year = String(newDate.getFullYear());
  let month = String(newDate.getMonth() + 1);
  if (month.length < 1) {
    month = `0${month}`;
  }
  let day = String(newDate.getDate());
  if (day.length === 1) {
    day = `0${day}`;
  }

  let hours = String(newDate.getHours());
  if (hours.length === 1) {
    hours = `0${hours}`;
  }
  let minutes = String(newDate.getMinutes());
  if (minutes.length === 1) {
    minutes = `0${minutes}`;
  }
  let seconds = String(newDate.getSeconds());
  if (seconds.length === 1) {
    seconds = `0${seconds}`;
  }
  let result;
  // 消息时间与当天时间对比
  if (newDate.getFullYear() !== today.getFullYear()) {
    // 不同年
    if (time) {
      result = 'yyyy-MM-dd hh:mm'.replace(/yyyy/g, year).replace(/MM/g, month).replace(/dd/g, day).replace(/hh/g, hours).replace(/mm/g, minutes);
    } else {
      result = 'yyyy-MM-dd'.replace(/yyyy/g, year).replace(/MM/g, month).replace(/dd/g, day);
    }
  } else {
    // 同年
    // 本周以前的消息 6天前
    const lastWeek = today.getTime() - 518400000;
    if (date < lastWeek) {
      if (time) {
        result = 'MM-dd hh:mm'.replace(/MM/g, month).replace(/dd/g, day).replace(/hh/g, hours).replace(/mm/g, minutes);
      } else {
        result = 'MM-dd'.replace(/MM/g, month).replace(/dd/g, day);
      }
    } else {
      // 本周内
      // 24小时以前的消息
      const beforeYesterday = today.getTime() - 86400000;
      if (date < beforeYesterday) {
        if (time) {
          result = dayList[newDate.getDay()] + ' ' + 'hh:mm'.replace(/hh/g, hours).replace(/mm/g, minutes);
        } else {
          result = dayList[newDate.getDay()];
        }
      } else {
        // 今天以前的消息
        if (date < today.getTime()) {
          if (time) {
            result = i18n.t('common_yesterday') + ' ' + 'hh:mm'.replace(/hh/g, hours).replace(/mm/g, minutes);
          } else {
            result = i18n.t('common_yesterday');
          }
        } else {
          // 今天的消息
          result = 'hh:mm'.replace(/hh/g, hours).replace(/mm/g, minutes);
        }
      }
    }
  }
  return result;
  //  else {
  //    return ('yyyy-MM-dd hh:mm')
  //     .replace(/yyyy/g, year)
  //     .replace(/MM/g, month)
  //     .replace(/dd/g, day)

  //     .replace(/hh/g, hours)
  //     .replace(/mm/g, minutes)
  //     // .replace(/ss/g, seconds);
  //   }
}
