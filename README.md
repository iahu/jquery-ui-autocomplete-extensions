## jQuery ui autocomplete 组件扩展

代码利用 `String.prototype.localeCompare` 来取汉字的声母。
如果浏览器不支持此API，可以在source中传一个sm来指定声母。

##可选扩展
中文不合适把source的value作为展示结果。这里通过在标签上设置data-for="select"来关联一个隐藏域的方式来展示中文，提交source的id