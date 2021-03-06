Live.format = (template, data) => {
    let keys = Object.keys(data);
    let dataList = keys.map((key) => data[key]);
    return new Function(keys.join(','), 'return `' + template + '`;').apply(null, dataList); //jshint ignore:line
};
Live.localize = {
    helper: 'Bilibili助手',
    enabled: '已启用',
    init: '初始化中...',
    times: '次',
    sign: {
        title: '自动签到',
        action: {
            award: '签到成功, 获得${award}',
            exist: '今日已签到'
        }
    },
    treasure: {
        title: '自动领瓜子',
        action: {
            award: '已领取${award}瓜子',
            exist: '已在直播间${showID}启动',
            awarding: '领取中...',
            totalSilver: '总瓜子:${silver}',
            noLogin: '未登录',
            end: '领取完毕'
        }
    },
    smallTV: {
        title: '自动小电视',
        statinfoTitle: '小电视抽奖',
        noStatinfo: '没有获奖记录',
        action: {
            award: '获得${awardNumber}个${awardName}',
            exist: '已在直播间${showID}启动',
            joinSuccess: '参加成功',
            joinError: '参加失败, ${msg}'
        }
    }
};

Live.countdown = function(endTime, callback, element) {
    if(!(this instanceof Live.countdown)) {
        return new Live.countdown(endTime, callback, element);
    }
    if(!endTime || (!(endTime instanceof Date) && isNaN(endTime))) {
        console.error('倒计时时间设置错误!');
        return;
    }
    if(!isNaN(endTime)) {
        let time = new Date();
        time.setSeconds(time.getSeconds() + endTime);
        endTime = time;
    }
    let countdown = setInterval(() => {
        let dateNow = new Date();
        let time = Math.round((endTime.getTime() - dateNow.getTime()) / 1000);
        if(element instanceof jQuery) {
            let min = Math.floor(time / 60);
            let sec = Math.floor(time % 60);
            min = min < 10 ? '0' + min : min;
            sec = sec < 10 ? '0' + sec : sec;
            element.text(min + ':' + sec);
        }
        if(time === 0) {
            clearInterval(countdown);
            typeof callback == 'function' && callback();
        }
    }, 1000);
    this.countdown = countdown;
};
Live.countdown.prototype.clearCountdown = () => clearInterval(this.countdown);

Live.timer = function(ms, callback) {
    if(!(this instanceof Live.timer)) {
        return new Live.timer(ms, callback);
    }
    this.timer = setInterval(() => {
        typeof callback == 'function' && callback();
    }, ms);
    typeof callback == 'function' && callback();
};
Live.timer.prototype.clearTimer = () => clearInterval(this.timer);

Live.sendMessage = (msg, callback) => chrome.runtime.sendMessage(msg, (response) => typeof callback == 'function' && callback(response));
Live.getMessage = (callback) => chrome.runtime.onMessage.addListener((request, sender, sendResponse) => typeof callback == 'function' && callback(request, sender, sendResponse));
