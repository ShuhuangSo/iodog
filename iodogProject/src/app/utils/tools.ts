/*
* Created by shuhuang So
* Created Date: 2018/5/25
*/

// 截取长文字
export function sliceName(tag: string, num: number): string {
  const isLongTag = tag.length > num;
  return isLongTag ? `${tag.slice(0, num)}...` : tag;
}
