# API
### `目前支持单文件上传` 
参数 | 说明 | 类型 | 默认值
----|------|-----|------
disabled | 组件是否禁用  | boolean | false
src | 组件默认图片uid  | string| 无
text | 组件提示文案  | string| Upload
limit | 上传文件限制数量  | number| 1
maxSize|上传文件最大大小|number|无
timeout | 超时时间  | number| 确定
beforeUpload | 上传之前的触发函数  | Function(file)| 无
onSuccess | upload成功回调  | Function(object)| 无
