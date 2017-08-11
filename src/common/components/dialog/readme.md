# API
## import&ensp;{&ensp;ComfirmDialogService&ensp;}&ensp;from&ensp;'../path'

### ComfirmDialogService&ensp;拥有俩个方法
### open()&ensp;打开dialog的方法
参数 | 说明 | 类型 | 默认值
----|------|-----|------
title | dialog的头部文案  | string | 提示
width | content的宽度  | string| 400px
height | content的高度  | string| 100px
msg | content的内容  | string| 无
onConfirm|点击确定的触发函数|Function|无
onConfirmText | 确定按钮文案  | string| 确定
onCancelText | 取消按钮文案  | string| 取消

### close()&ensp;关闭dialog的方法，直接调用，无参数