import './index.less';
import {
    getDetail,
    likeQes,
    getComment,
    addComment,
    collectQes,
    getIsLike,
    getIsCollect,
    deleteLike,
    deleteCollect,
} from '~/ajax/forum_detail'

import {
    formatDate,
    isPicEmpty,
    setNum,
    getQueryVariable
}
from '../../../public/js/filters'

import {
    autoTextarea
}
from '../../../public/js/autoTextArea'

let id = getQueryVariable('id');
let detail = [];
let commentList = [];
// 获取数据
getDetail(id).then((res) => {
    if (res.code == '0') {
        detail = res.data;
        addDtailHtml();
    }
});

// 获取该问题的评论列表
function getComments() {
    $('.comment .no-comment').remove();
    getComment(id).then((res) => {
        if (res.code == '0') {
            commentList = res.data;
            addCommentList();
        } else {
            $('.comment').append(`<div class="no-comment"> 
                                    <i class="iconinteractive icon"></i>
                                    <p> 还没有回答 <br> 第一个发表评论吧 </p>
                                  </div>
                                `);
        }
    });
}
getComments();

// 添加模板
function addDtailHtml() {
    // 添加用户头像
    $('.top_box .uimg').css({
        'backgroundImage': 'url(' + isPicEmpty(detail.image) + ')'
    })

    // 添加用户名
    $('.top_box .uname').text(detail.name);

    // 添加用户个签 // 此功能 以后再接入
    // $('.top_box .udesc').text(detail.desc);

    // 添加问题图片
    if (detail.qimage) {
        $('.content #qimage').attr('src', detail.qimage);
    } else {
        $('.content .card .questionImg').css('marginBottom', 0);
    }

    // 添加问题内容
    $('.content .textarea').html(detail.word);

    // 添加时间
    $('.foot .time').text('发布于 ' + formatDate(new Date(Number(detail.uptime)), 'yyyy-MM-dd'));

    // 添加科目
    $('.foot .type').text(detail.type);

    // 点击问题图片 放大
    $('#qimage').click(function () {
        let imgsrc = $(this).attr('src');
        console.log(imgsrc);
        let opacityBottom = '<div class="opacityBottom" style = "display:none"><img class="bigImg" src="' + imgsrc + '"></div>';
        $(document.body).append(opacityBottom);
        toBigImg(); // 变大函数
    })

    $('#likeNum').text('点赞 ' + setNum(detail.gnum));
    $('#commentNum').text('评论 ' + setNum(detail.cnum));
}

// 添加 评论列表
function addCommentList() {
    $('.comment .list .list-item').remove();
    for (let i = 0; i < commentList.length; i++) {
        $('.comment .list').append(`<div class="list-item">
                                        <div class="replayerImg">
                                            <img src="` + isPicEmpty(commentList[i].image) + `" alt="">
                                        </div>
                                        <div class="replayerInfo">
                                            <div class="replayer">
                                                <span class="name">` + commentList[i].name + `</span>
                                                <span class="time">` + formatDate(new Date(Number(commentList[i].uptime)), 'yyyy-MM-dd') + `</span>
                                            </div>
                                            <div class="replay">` + commentList[i].aword + `</div>
                                        </div>
                                    </div>`);
    }
}


// 图片全屏变大函数
function toBigImg() {
    $('.opacityBottom').addClass('opacityBottom'); // 添加遮罩层
    $('.opacityBottom').show();
    $('html,body').addClass('none-scroll'); // 下层不可滑动
    $('.bigImg').addClass('bigImg'); // 添加图片样式
    $('.opacityBottom').click(function () { // 点击关闭
        $('html,body').removeClass('none-scroll');
        $('.opacityBottom').remove();
    });
}

// 判断当前用户是否已经点赞
let isLike = false;

function getIsLikeQ(params) {
    getIsLike(id).then(res => {
        if (res.code == '0') {
            isLike = true;
            $('#likeNum').text('点赞 ' + setNum(detail.gnum));
            $('.footer .likeBtn').addClass('isLike'); // 添加点赞后的样式
        } else {
            isLike = false;
            $('.footer .likeBtn').removeClass('isLike'); // 删除点赞后的样式
        }
        $('#likeNum').text('点赞 ' + setNum(detail.gnum));
    })
}

// 判断当前用户是否已经收藏
let isCollect = false;

function getIsCollectQ(params) {
    getIsCollect(id).then(res => {
        if (res.code == '0') {
            isCollect = true;
            $('.collectionBtn').addClass('isCollect');
            $('.iconlike').removeClass('iconlike').addClass('iconlike_fill'); // 添加收藏后的样式
        } else if (res.code == '1') {
            isCollect = false;
            $('.collectionBtn').removeClass('isCollect');
            $('.iconlike_fill').removeClass('iconlike_fill').addClass('iconlike'); // 移除收藏后的样式
        }
    })
}
getIsLikeQ();
getIsCollectQ();
// 点赞问题
$('.footer .likeBtn').click(function () {
    if (isLike == true) {
        deleteLike(id).then(res => {
            if (res.code == '0') {
                detail.gnum--;
                getIsLikeQ();
            }
        })
    } else {
        likeQes(id).then((res) => {
            if (res.code == '0') {
                detail.gnum++;
                getIsLikeQ();
            }
        })
    }
});

// 收藏问题
$('.collectionBtn').click(function () {
    if (isCollect == true) {
        deleteCollect(id).then(res => {
            if (res.code == '0') {
                getIsCollectQ();
            }
        })
    } else {
        collectQes(id).then((res) => {
            if (res.code == '0') {
                getIsCollectQ();
            }
        })
    }
})

// 后退按钮
$('#backBtn').click(function () {
    window.history.back();
});

autoTextarea(document.getElementById('textarea'), 0, 90);

// 添加评论方法
function addComments(word, img) {
    addComment(word, id, img).then(() => {
        getComments();
    })
}

// 点击按钮添加评论
$('.submit').click(() => {
    let word = $('#textarea').val().replace(/\n/g, '<br/>');
    let img = '';
    if (word != '') {
        addComments(word, img);
        $('#textarea').val('')
    }
})
