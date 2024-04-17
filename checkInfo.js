// ==UserScript==
// @name         NGA优化摸鱼体验插件-信息加强
// @namespace    【YOUR_PLUGIN_URL】
// @version      1.0.0
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
        name: '【YOUR_PLUGIN_UNIQUE_KEY】',  // 插件唯一KEY
        title: '【YOUR_PLUGIN_TITLE】',  // 插件名称
        desc: '【YOUR_PLUGIN_DESC】',  // 插件说明
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
            console.log('已运行: postProcFunc()')
        },
        renderThreadsFunc($el) {
            console.log('列表项 (JQuery) => ', $el)
            console.log('列表项 (JS) => ', $el.get(0))
        },
        renderFormsFunc($el) {
            const uid = parseInt($el.find('[name="uid"]').text())
            var userInfo = null
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
                    displayInfo(uid, userInfo);
                    // console.log(html);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
            function displayInfo(uid, userInfo){ 
                const $userEnhanceContainer = $(`<div class="hld__user-enhance hld__user-enhance-${uid}"></div>`);
                const $node = $el.find('.posterinfo div.stat .clickextend').siblings('div:first-child');
                $node.after($userEnhanceContainer)
                $userEnhanceContainer.append(`<div><span style="display: inline-flex;align-items: center;" class="hld__user-location">新增属地: <span class="numeric userval" name="regday">${userInfo.ipLoc}</span></span></div>`)
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