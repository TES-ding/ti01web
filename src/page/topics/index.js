import './index.less';
import { forumUrl, mineUrl, topicsUrl } from '~/util/jumpTo';
import { sinceListener } from '~/util/sinceui';
import codes from '~/config/codeConfig';
import { getMyRank } from '~/ajax/topic_rank';
import { getTopicsNum, getMistakes } from '~/ajax/topics';

sinceListener('topics', topicsUrl);
sinceListener('forum', forumUrl);
sinceListener('mine', mineUrl);
sinceListener('net');
sinceListener('cpu');
sinceListener('link');
sinceListener('china');
sinceListener('os');
sinceListener('all');
sinceListener('todayQuestion', null, 'rgb(255, 245, 245)');
sinceListener('todayRank', '/page/topic_rank/index.html', 'rgb(255, 245, 245)');
// 获取本地刷题记录
let alreadyDid = localStorage.getItem('alreadyDid') ? JSON.parse(localStorage.getItem('alreadyDid')) : { cpu: [], net: [], link: [], china: [], os: [], all: [] };
// ================ 页面数据初始化 =================
init();
function init() {
    let topicsNum = document.querySelectorAll('.lesson b');
    console.log(topicsNum);
    let shoreupNum = document.getElementById('shoreupNum');
    let todayQuestionNum = document.getElementById('todayQuestionNum');
    let reportRank = document.getElementById('reportRank');
    // 初始化题目收藏数
    if (localStorage.getItem('starTopic')) {
        shoreupNum.innerText = Object.keys(JSON.parse(localStorage.getItem('starTopic'))).length
    }
    // console.log(todayBegin());
    // getQesByTime(todayBegin()).then((res) => {
    //     if (res.code == codes.success) {
    //         todayQuestionNum.innerText = res.data.length;
    //     } else if (res.code == codes.noNum) {
    //         todayQuestionNum.innerText = 0;
    //     }
    // });
    getMyRank().then((res) => {
        console.log(res);
        if (res.code == codes.success) {
            reportRank.innerText = res.data;
        }
    });
    getTopicsNum().then(res => {
        console.log(res.data)
        topicsNum[0].innerHTML = `${alreadyDid['net'].length}/${res.data['net']}`;
        topicsNum[1].innerHTML = `${alreadyDid['cpu'].length}/${res.data['cpu']}`;
        topicsNum[2].innerHTML = `${alreadyDid['link'].length}/${res.data['link']}`;
        topicsNum[3].innerHTML = `${alreadyDid['china'].length}/${res.data['china']}`;
        topicsNum[4].innerHTML = `${alreadyDid['os'].length}/${res.data['os']}`;
        topicsNum[5].innerHTML = `${alreadyDid['all'].length}/${res.data['all']}`;
    });
    getMistakes().then(res => {
        console.log(res);
        todayQuestionNum.innerHTML = res.data.length;
    })
}

// ================ 动态显示天数=================
let baiwei = document.querySelector('.item0'),
    shiwei = document.querySelector('.item1'),
    gewei = document.querySelector('.item2');

let today = new Date(),
    future = new Date(2020, 11, 26);

// 获取两个日期之间相差的天数
function getDays(today, futrue) {
    return parseInt((futrue.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

// 动态修改剩余天数
function changeDays() {
    let str = '' + getDays(today, future);
    str = str.length > 2 ? str : '0' + str;
    baiwei.innerText = str[0];
    shiwei.innerText = str[1];
    gewei.innerText = str[2];
}
changeDays();

// ===========================================

// ================ 动态显示日期=================
function myFunction() {
    let d = new Date();
    let weekday = new Array(7),
        Month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        day = ['', '一日', '二日', '三日', '四日', '五日', '六日', '七日', '八日', '九日', '十日', '十一日', '十二日', '十三日', '十四日', '十五日', '十六日', '十七日', '十八日', '十九日', '二十日', '二十一日', '二十二日', '二十三日', '二十四日', '二十五日', '二十六日', '二十七日', '二十八日', '二十九日', '三十日', '三十一日'];
    weekday[0] = '周日';
    weekday[1] = '周一';
    weekday[2] = '周二';
    weekday[3] = '周三';
    weekday[4] = '周四';
    weekday[5] = '周五';
    weekday[6] = '周六';
    let x = document.querySelector('.subjectiveb');
    x.innerHTML = `${Month[d.getMonth()]}${day[d.getDate()]}·${weekday[d.getDay()]}`;
}
myFunction();
// ===============================================

// ================ 从localStorage取刷题记录=================
function getLocalData() {

}
// =========================================================

// ================给科目注册跳转链接=================
function register() {
    let lessonAll = document.querySelector('.lessonAll');
    lessonAll.onclick = function (e) {
        let target = e.target || window.event.srcElement,
            parentNode = target.parentNode;// 'DIV'
        target = target.tagName === 'DIV' ? target : parentNode;
        switch (target.id) {
            case 'cpu':
                window.location.href = '../topic/index.html?lesson=cpu'
                break;
            case 'link':
                window.location.href = '../topic/index.html?lesson=link'
                break;
            case 'china':
                window.location.href = '../topic/index.html?lesson=china'
                break;
            case 'os':
                window.location.href = '../topic/index.html?lesson=os'
                break;
            case 'all':
                window.location.href = '../topic/index.html?lesson=all'
                break;
            case 'net':
                window.location.href = '../topic/index.html?lesson=net'
                break;
            default:
                break;
        }
    }
}
register();
// ===================================================
// 进入题目收藏页面
let todayTopic = document.getElementById('todayTopic');
todayTopic.addEventListener('click', todayTopicFn, false);
function todayTopicFn() {
    window.location.href = '../topicStar/index.html';
}
// 进入错题本
let todayQuestion = document.getElementById('todayQuestion');
todayQuestion.addEventListener('click', todayQuestionFn, false);
function todayQuestionFn() {
    window.location.href = '../mistakeBook/index.html';
}