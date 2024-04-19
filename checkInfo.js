// ==UserScript==
// @name         NGA优化摸鱼体验插件-信息加强
// @namespace    https://github.com/DelCrona/NGA_checkInfo
// @version      1.0.2
// @author       DelCrona
// @description  尝试修复一下获取属地回复等信息(希望作者早日修复)
// @license      MIT
// @require      https://cdn.staticfile.net/jquery/3.4.0/jquery.min.js
// @require      https://cdn.staticfile.net/spectrum/1.8.0/spectrum.js
// @require      https://cdn.staticfile.net/localforage/1.10.0/localforage.min.js
// @require      https://cdn.staticfile.net/echarts/5.4.2/echarts.min.js
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://g.nga.cn/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @run-at       document-start
// @inject-into  content
// ==/UserScript==

(function (registerPlugin) {
    'use strict';
    registerPlugin({
        name: 'checkInfo',  // 插件唯一KEY
        title: '信息增强',  // 插件名称
        desc: '修复查询端口被封的问题',  // 插件说明
        settings: [{
            key: 'textInput',
            title: '占位符',
            desc: '描述信息\n描述信息',
        }],
        beforeSaveSettingFunc(setting) {
            console.log(setting)
            // return 值则不会保存，并抛出错误
            return '拦截'
        },
        preProcFunc() {
            console.log('已运行: preProcFunc()')
        },
        initFunc() {
            console.log('已运行: initFunc()')
            console.log('插件ID: ', this.pluginID)
            console.log('插件配置: ', this.pluginSettings)
            console.log('主脚本: ', this.mainScript)
            console.log('主脚本引用库: ', this.mainScript.libs)
        },
        postProcFunc() {

        },
        renderThreadsFunc($el) {

        },
        renderFormsFunc($el) {
            var _this = this;
            const uid = parseInt($el.find('[name="uid"]').text())
            var userInfo = null
            //访问个人页获取uid和信息字符串
            $.ajax(`https://${window.location.host}/nuke.php?func=ucp&uid=${uid}`)
                .then(html => {
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(html, "text/html");
                    // 查找包含__UCPUSER项的<script>标签
                    var scriptTags = htmlDoc.querySelectorAll("script");
                    // console.log(scriptTags);
                    scriptTags.forEach(scr =>{
                        //获取标签里的内容
                        var scrText = scr.textContent;
                        if (scrText.includes("__UCPUSER")){
                            //console.log(scrText)
                            //获取用户信息的json文件并以正则提取
                            var match = scrText.match(/var __UCPUSER =(\{.*\});/);
                            userInfo = JSON.parse(match[1]);
                            // console.log(ipLoc);
                        }
                    })
                    //调用覆盖函数
                    displayInfo(userInfo);
                    // console.log(html);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
            //覆盖本体属地信息
            function displayInfo(userInfo){
                var flag = _this.mainScript.getModule('UserEnhance').getCountryFlag(userInfo.ipLoc);
                $el.find('.hld__user-location > span').replaceWith(flag);
                /*$el.find('.hld__user-location .hld__req-retry')
                    .text(`${userInfo.ipLoc}`)
                    .removeClass('hld__req-retry') // 移除旧样式
                    .addClass('hld__replace'); // 添加新样式;*/
            }
        },
        renderAlwaysFunc() {
            // console.log('循环运行: renderAlwaysFunc()')
        },
        asyncStyle() {
            return `#ngascript_plugin_${this.pluginID} {color: red}`
        },
        style: `
        #ngascript_plugin_test {color: red}
        `
    })

})(function(plugin) {
    plugin.meta = GM_info.script
    unsafeWindow.ngaScriptPlugins = unsafeWindow.ngaScriptPlugins || []
    unsafeWindow.ngaScriptPlugins.push(plugin)
});