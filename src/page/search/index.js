import './index.less';

import {
    getSearchHot
} from '~/ajax/search';

let hotArr = []; // 热搜数据
getSearchHot().then(res => {
    if (res.code == '0') {
        hotArr = res.data.slice(0, 8);
        mapALLquestion();
    }
});

// 将返回的所有结果渲染到页面上
function mapALLquestion() {
    for (let i = 0; i < hotArr.length; i++) {
        $('#hot_list').append(`<div class="list_item">
                                    <span class="num">` + (i + 1) + `</span>
                                    <div class="content">
                                        <div class="title">` + hotArr[i].word + `</div>
                                        <div class="desc">` + hotArr[i].type + `</div>
                                    </div>
                                </div>`);
    }
    $('#hot_list .list_item').each(function (i) {
        $(this).click(() => {
            window.location.href = '/page/forum_detail/index.html?id=' + hotArr[i].id;
        })
    })
}

let searchArr = []; // 本地保存的历史搜索记录 存放的数组
let isEmpty = true; // flag 判断是否显示清空按钮
window.onload = function () {
    if (localStorage.getItem('serarch_History') !== null) {
        searchArr = JSON.parse(localStorage.getItem('serarch_History'));
        if (searchArr.length != 0) {
            isEmpty = false;
        }
    } else {
        const li = [];
        localStorage.setItem('serarch_History', JSON.stringify(li));
    }
    isEmptyHistory();
    mapSearchArr();
}

// 清空按钮事件
let clearAllBtn = document.getElementsByClassName('clearBtn')[0];
clearAllBtn.onclick = function () {
    searchArr = [];
    isEmpty = true;
    localStorage.setItem('serarch_History', JSON.stringify(searchArr));
    isEmptyHistory();
    mapSearchArr();
}
// 通过判断isEmpty 确定是否显示清空按钮以及无历史记录tip
let noneHistory = document.getElementById('none');

function isEmptyHistory() {
    if (isEmpty) {
        clearAllBtn.style.display = 'none';
        noneHistory.style.display = 'flex';
    } else {
        clearAllBtn.style.display = 'block';
        noneHistory.style.display = 'none';
    }
}
// 搜索框enter触发事件
let searchInput = document.getElementById('searchInput');
searchInput.onkeydown = function (e) {
    let evt = window.event || e;
    if (evt.keyCode == 13) {
        if (searchInput.value == '') {
            return;
        }
        let serarch_History = JSON.parse(localStorage.getItem('serarch_History'));
        if (serarch_History == null) {
            let li = [];
            li.unshift({
                value: searchInput.value,
                timestamp: new Date().getTime(),
            });
            localStorage.setItem('serarch_History', JSON.stringify(li));
            isEmpty = false;
        } else {
            let obj = JSON.parse(localStorage.getItem('serarch_History'));
            if (!obj.find((v) => v.value === searchInput.value)) {
                if (searchArr.length > 9) {
                    searchArr.pop();
                }
                let li = searchArr;
                li.unshift({
                    value: searchInput.value,
                    timestamp: new Date().getTime(),
                });
                localStorage.setItem('serarch_History', JSON.stringify(li));
                isEmpty = false;
            }
        }
        isEmptyHistory();
        mapSearchArr();
        // 跳转到搜索结果页
        window.location.href = '/page/search_result/index.html?word=' + searchInput.value;
    }
}
// 渲染历史搜索记录
function mapSearchArr() {
    $('#history_list').empty();
    if (searchArr != null) {
        for (let i = 0; i < searchArr.length; i++) {
            $('#history_list').append(`<div class="list_item history_list_item" id='sos'> 
                                            <i class="icontime icon"></i> 
                                            <p class="content">` + searchArr[i].value + `</p>
                                            <i class="iconclose icon" id="clearBtn"></i>
                                        </div>`);
        }
    }
    let list = document.getElementsByClassName('history_list_item');
    for (let j = 0; j < list.length; j++) {
        list[j].onclick = function () {
            window.location.href = '/page/search_result/index.html?word=' + searchArr[j].value;
        }
    }
}

// 删除选中的历史记录
$('#history_list').on('click', '#clearBtn', (e) => {
    e.stopPropagation();
    let index = $(e.target.parentNode).index();
    for (let i = 0; i < searchArr.length; i++) {
        if (index == i) {
            searchArr.splice(i, 1);
        }
    }
    let li = searchArr;
    localStorage.setItem('serarch_History', JSON.stringify(li));
    if (li == '') {
        isEmpty = true;
    }
    isEmptyHistory();
    mapSearchArr();
})

let backBtn = document.getElementById('backBtn');
backBtn.onclick = function () {
    window.history.back();
}
