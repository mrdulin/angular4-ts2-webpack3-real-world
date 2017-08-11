# API

参数 | 说明 | 类型 | 默认值
----|------|-----|------
options | 渲染整个组件以及option项  | object[] object: {<br>&ensp;value:&nbsp;any,<br>&ensp;label:&nbsp;any,<br>&ensp;checked?:&nbsp;boolean,<br>&ensp;disabeld?:&nbsp;boolean<br>} | []
value | 指定对应checkbox，打上checked标志  | any[]| []
disabled | 组件是否禁用  | boolean| false
onChange | checkbox改变时触发的函数  | Function(selectedValue)| 无
formControlName|响应式表单绑定的值|string|无