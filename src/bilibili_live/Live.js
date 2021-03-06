/* globals ModuleStore,ModuleDom */
var Live = {options: {}, userInfo: {}};
Live.showID = (function() {
    return location.pathname.substr(1);
}());
Live.addScriptByFile = function(fileName) {
    let script = document.createElement('script');
    script.src = chrome.extension.getURL(fileName);
    document.head.appendChild(script);
};
Live.addScriptByText = function(text) {
    let script = document.createElement('script');
    script.innerHTML = text;
    document.head.appendChild(script);
};
Live.addStylesheetByFile = function(fileName) {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.extension.getURL(fileName);
    document.head.appendChild(link);
};
Live.getRoomID = function(showID, callback) {
    let rid = ModuleStore.roomID_get(showID);
    if(!rid) {
        $.get('/' + showID).done((result) => {
            let reg = new RegExp('var ROOMID = ([\\d]+)');
            rid = reg.exec(result)[1] || 0;
            ModuleStore.roomID_add(showID, rid);
        });
    }
    typeof callback == 'function' && callback(rid);
};
Live.getRoomInfo = function(roomID, callback) {
    let roomInfo = {};
    $.getJSON('/live/getInfo?roomid=' + roomID).done((result) => {
        if(result.code === 0) {
            roomInfo.nickname = result.data.ANCHOR_NICK_NAME;
        }
    });
    typeof callback == 'function' && callback(roomInfo);
};
Live.getUserInfo = function(callback) {
    $.getJSON('/user/getuserinfo').done((result) => {
        if(result.code == 'REPONSE_OK') {
            Live.userInfo.vip = result.data.vip || result.data.svip;

            $.getJSON('//space.bilibili.com/ajax/member/MyInfo').done((result) => {
                if(result.status == 'true') {
                    Live.userInfo.mobileVerified = result.data.mobile_verified;
                }
            });
        }
    });
    typeof callback == 'function' && callback();
};
Live.init = function(callback) {
    var init = 0;
    ModuleStore.init();
    Live.getRoomID(Live.showID, (roomID) => {
        Live.roomID = roomID;
        init++;
    });
    Live.getRoomInfo(Live.roomID, (roomInfo) => {
        Live.roomInfo = roomInfo;
        init++;
    });
    Live.getUserInfo(() => init++);
    Live.sendMessage({command: 'getOption'}, (result) => {
        Live.option = result;
        init++;
    });
    let interval = setInterval(() => {
        if(init == 4) {
            clearInterval(interval);
            ModuleDom.init();
            typeof callback == 'function' && callback();
        }
    }, 100);
};
