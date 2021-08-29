//此JS专门给 index_new_2.html 和 index_new_3.html 使用
//
////图片初始化
//function imgIntit() {
//	var imglazy = document.getElementsByClassName('lazy');
//	for (var i = 0; i < imglazy.length; i++) {
//		var w = parseInt(imglazy[i].getAttribute('width'));
//		var h = parseInt(imglazy[i].getAttribute('height'));
//
//		if (!(w > 0 && h > 0)) {
//			w = parseInt(imglazy[i].getAttribute('data-width'));
//			h = parseInt(imglazy[i].getAttribute('data-height'));
//		}
//		if (w > 0 && h > 0) {
//			var rdw = document.getElementById("content").clientWidth;
//			var rw = w < rdw ? w : rdw;
//			var rh = rw * (h / w);
//			imglazy[i].setAttribute('width', Math.ceil(rw));
//			imglazy[i].setAttribute('height', Math.ceil(rh));
//		}
//	}
//};
//imgIntit();
//
//
var  REAL_BASE_URL = 'https://'+ ((location.host == '121.9.213.58') ? 'app.myzaker.com' : location.host)+'/';
// 此对象给index_new_3.html使用
window.articleServConf = {
    data: {
        toast_init: true,
        scrollTop: 0,
        isNormalTemplate: false,
        userInfo: {},
        inRecomAreaStat:false, // 是否滚动到相关区域后发送了统计
        inCommentAreaStat: false, // 是否滚动到评论区域后发送了统计
    },
    tools: {
        debounce: function (fn, delay, fn2) {
            // 防抖函数
            var timer = null;
            return function () {
                var self = this, args = arguments;
                timer && clearTimeout(timer);
                fn2 && fn2.apply(self, args);
                timer = setTimeout(function () {
                    fn.apply(self, args);
                }, delay);
            }
        },
        getUrlName: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r !== null) return unescape(r[2]);
            return null;
        },
        formatTime: function (date, curTimestamp) {
            if(date) date = date.replace(/-/g, '/');
            var _date = new Date(date);
            var timestamp = _date.getTime();
            var year = _date.getFullYear();
            var month = _date.getMonth() + 1;
            var day = _date.getDate();
            if (!curTimestamp) curTimestamp = new Date().getTime();
            var s = curTimestamp - timestamp;
            if (s > 1000 * 60 * 60 * 24) {
                month = month < 10 ? "0" + month : month;
                day = day < 10 ? "0" + day : day;
                return month + '-' + day;
            } else if (s > 1000 * 60 * 60) {
                var hour = Math.floor(s / 60 / 60 / 1000);
                return hour + '小时前';
            } else if (s > 1000 * 60) {
                var min = Math.floor(s / 60 / 1000);
                return min + '分钟前';
            } else {
                return '刚刚';
            }
        },
        autoTextarea: function (elem, extra, maxHeight) {
            extra = extra || 0;
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                    elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                    var val = elem.currentStyle[name];

                    if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                            parseFloat(getStyle('paddingTop')) -
                            parseFloat(getStyle('paddingBottom')) + 'px';
                    };

                    return val;
                } : function (name) {
                    return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));

            elem.style.resize = 'none';

            var change = function () {
                var scrollTop, height,
                    padding = 0,
                    style = elem.style;

                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;

                if (!isFirefox && !isOpera) {
                    padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    };
                    style.height = height + extra + 'px';
                    // scrollTop += parseInt(style.height) - elem.currHeight;
                    // document.body.scrollTop = scrollTop;
                    // document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                };
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        },
        toast: function (message) {
            var toast_wrapper;
            if (articleServConf.data.toast_init) {
                toast_wrapper = document.createElement('div');
                toast_wrapper.setAttribute('id', 'toastBox')
                toast_wrapper.classList.add('toast');
                document.body.appendChild(toast_wrapper);
            } else {
                toast_wrapper = document.querySelector('#toastBox')
                toast_wrapper.classList.remove('show');
                clearTimeout(articleServConf.data.toast_timer);
            }
            var html = '<p>' + message + '</p>';

            toast_wrapper.innerHTML = html;
            var height = getComputedStyle(toast_wrapper).height;
            var marginTop = -height.substring(0, height.length - 2) / 2
            toast_wrapper.style.marginTop = marginTop + 'px';
            toast_wrapper.classList.add('show')
            articleServConf.data.toast_init = false
            toast_timer = setTimeout(function () {
                toast_wrapper.classList.remove('show')
            }, 2000)
        },
        getStorageData: function (key) {
            var storageData = window.localStorage.getItem(key);
            if (storageData) {
                storageData = JSON.parse(storageData);
            } else {
                storageData = {}
            }
            return storageData;
        },
        setStorageData: function (key, data) {
            var storageData = JSON.stringify(data);
            window.localStorage.setItem(key, storageData);
        },
        animationEase: function (start, end, rate, callback) {
            if (start == end || typeof start != 'number') {
                return;
            }
            end = end || 0;
            rate = rate || 2;

            var step = function () {
                start = start + (end - start) / rate;

                if (Math.abs(end - start) < 1) {
                    callback(end, true);
                    return;
                }
                callback(start, false);
                requestAnimationFrame(step);
            };
            step();
        },
        appType: function () {
            //wx, zaker, other
            var ua = navigator.userAgent.toLowerCase(),
                _uid = this.getUrlName("_uid"),
                _udid = this.getUrlName("_udid"),
                client = '';
            if(ua.match(/MicroMessenger/i) == "micromessenger" && (ua.match(/wxwork/i) == 'wxwork') ) {
                client = 'other'; // 企业微信当其他浏览器处理
            } else if (ua.match(/MicroMessenger/i) == "micromessenger") {
                client = 'wx';
            } else if (_uid || _udid) {
                client = 'zaker';
            } else {
                client = 'other';
            }
            return client;
        },
        setHost: function (api) {
            // 接口测试环境处理
            if (window.location.host == '121.9.213.58') {
                return api.replace('https://', 'http://121.9.213.58/')
            } else {
                return api.replace('https://', window.location.protocol + '//')
            }
        },
        goBack: function(url){
            // 返回前一页（或跳到参数链接）
            if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE
                if(history.length > 0){
                    window.history.go(-1);
                }else{
                    window.location.href = url;
                }
            }else{ //非IE浏览器
                if (navigator.userAgent.indexOf('Firefox') >= 0 ||
                    navigator.userAgent.indexOf('Opera') >= 0 ||
                    navigator.userAgent.indexOf('Safari') >= 0 ||
                    navigator.userAgent.indexOf('Chrome') >= 0 ||
                    navigator.userAgent.indexOf('WebKit') >= 0){
        
                    if(window.history.length > 1){
                        window.history.go(-1);
                    }else{
                        window.location.href = url;
                    }
                }else{ //未知的浏览器
                    window.history.go(-1);
                }
            }
        },
        stat: function(url) {
            new Image().src = url
        },
        get_ios_version: function() {
            var str = navigator.userAgent.toLowerCase(); 
            var ver = str.match(/cpu iphone os (.*?) like mac os/); 
            if(!ver){ 
                return null
            } else{ 
                return(ver[1].replace(/_/g,".")); 
            }
        }
    },
    // 评论配置
    commentConf: {
        data: {
            version: 8.50,
            api: {
                list: REAL_BASE_URL+'news/comment.php',
                like: REAL_BASE_URL+'news/comment.php?act=like',
                dele: REAL_BASE_URL+'news/comment.php?act=del',
                reply: REAL_BASE_URL+'news/comment.php?act=reply'
            },
            nextUrl: '',
            toast_timer: null,
            toast_init: true,
            likeSending: false,
            // userInfo: {
            //     name: '이찬생',
            //     uid: 12453734,
            //     icon: 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqp98MAhy0sVBl5FicDUuvbTWic2Wicu89zicXcDCgM2anR0TO5dWaqAjxZHUIPWiaPmcZZPzvFb47mkng/132'
            // },
            inputType: 'main', // main: 主评论, reply: 回复评论
            reply: {},
            mainCommentData: {}, // 详情页主楼数据
            isMainCommentPage: false, // 是否是详情页
            EmoticonParserConf: {}, // 表情包配置类实例
        },
        methods: {
            checkLogin: function(cb) {
                // 非微信不检查是否登录
                if(articleServConf.tools.appType() != 'wx') {
                    cb && cb()
                    return
                }
                // 判断是否登录过
                if(!$.fn.cookie('ZK_WAP_USER_INFO')) {
                    $.getJSON(window.checkLoginUrl, function(res) {
                        if(res.stat == 1) {
                            articleServConf.data.userInfo = res.data;
                            cb && cb()
                        } else {
                            window.location.href = res.data.login_url
                        }
                    })
                } else {
                    articleServConf.data.userInfo = JSON.parse($.fn.cookie('ZK_WAP_USER_INFO'));
                    cb && cb()
                }
            },
            showCommentSmBtn: function(type) {
                var $bar = $('.fixed-comment-bottom-bar');
                if(type == 'btn') {
                    $bar.find('.comment-out-box').removeClass('show');
                    $bar.find('.comment-btn').removeClass('input').addClass('show');
                    $bar.addClass('show-icon');
                    $bar.addClass('btn-type');
                } else if (type == 'comment') {
                    $bar.find('.comment-btn').addClass('show').addClass('input');
                    $bar.addClass('show-icon');
                    $bar.removeClass('btn-type');
                } else if (type == 'outZaker') {
                    $bar.find('.comment-btn').removeClass('show');
                    $bar.find('.comment-out-box').addClass('show');
                    $bar.removeClass('show-icon');
                    $bar.removeClass('btn-type');
                } else {
                    $bar.addClass('show-icon');
                    $bar.removeClass('btn-type');
                }
            },
            createCommentHtml: function (item) {
                // 1正常 2屏蔽 3有风险 5审核 11用户删除 15审核不通过
                var html = '', commConf = articleServConf.commentConf;
                var pk = articleServConf.tools.getUrlName('pk');
                if (item.stat == 1 || item.stat == 3 || item.stat == 5) {
                    html += '<div class="comment_list_item" data-cid="' + item.pk + '">';
                    html += '<a href="javascript:;" class="comment_item_avatar"><img src="' + item.auther.icon + '"></a>';
                    html += '<a href="javascript:;" class="reply_area"><div class="comment_item_top"><div class="comment_item_title">' + item.auther.name + '</div></div>';
                    html += '<div class="comment_item_content">';
                    if (item.stat == 1 || ((item.stat == 3 || item.stat == 5) && (articleServConf.data.userInfo && articleServConf.data.userInfo._uid && item.auther.uid == articleServConf.data.userInfo._uid))) {
                        if (item.reply_auther) {
                            html += '回复 <span style="color:#00abff;">' + item.reply_auther.name + '</span>: ';
                            html += '<span>' + commConf.data.EmoticonParserConf.parse(item.content) + '</span>';
                        } else {
                            html += '<p>' + commConf.data.EmoticonParserConf.parse(item.content) + '</p>';
                        }
                    }
                    html += '</div></a>';
                    if (item.isLike) {
                        html += '<div class="comment_item_tool zaned">';
                    } else {
                        html += '<div class="comment_item_tool">';
                    }
                    html += '<span class="comment_item_time">' + articleServConf.tools.formatTime(item.date + ' ' + item.time) + '</span>';
                    if (articleServConf.data.userInfo && articleServConf.data.userInfo._uid && articleServConf.data.userInfo._uid == item.auther.uid && item.stat != 2) {
                        html += '<a href="javascript:;" class="delete_btn">删除</a>';
                    }
                    html += '<a href="javascript:;" class="zan_btn"><span>' + item.like_num + '</span></a></div>';
                    if (item.child_list && item.child_list.length > 0) {
                        html += '<a href="'+ articleServConf.tools.setHost(REAL_BASE_URL+'news/comment.php?act=mainComment&pk=' + pk + '&root_comment_pk=' + item.pk + '&_uid=' + articleServConf.data.userInfo._uid+ '&skey=' + articleServConf.data.userInfo.skey+ '&token=' + articleServConf.data.userInfo.token+'&isWeb3Page='+CONFIG.isWeb3Page)+'" class="comment_item_sub">'
                        html += this.addReplyHtml(item.child_list, item)
                        html += '</a>';
                    }else{
                        html += '<a style="display: none;"  href="'+articleServConf.tools.setHost(REAL_BASE_URL+'news/comment.php?act=mainComment&pk=' + pk + '&root_comment_pk=' + item.pk + '&_uid=' + articleServConf.data.userInfo._uid+ '&skey=' + articleServConf.data.userInfo.skey+ '&token=' + articleServConf.data.userInfo.token)+'" class="comment_item_sub"></a>';
                    }
                    html += '</div>';
                }
                return html
            },
            createReplyCommentHtml: function (replyItem) {
                var html = '', commConf = articleServConf.commentConf;
                html += '<div class="sub_comment">';
                html += '<span style="color:#00abff;">' + replyItem.auther.name + '</span><span>';
                if (replyItem.reply_auther) {
                    html += '回复 <span style="color:#00abff;">' + replyItem.reply_auther.name + '</span>';
                }
                html += '<span style="color:#b3b3b3;">: </span>';
                html += '<span>' + commConf.data.EmoticonParserConf.parse(replyItem.content) + '</span></span></div>';
                return html;
            },
            addCommentHtml: function (arr) {
                if (!arr) return
                // 插入主评论
                var html = '', that = this;
                arr.forEach(function (item, index) {
                    html += that.createCommentHtml(item, articleServConf.commentConf)
                })
                $('#commentListWrapper').append($(html))
            },
            addReplyHtml: function (arr, commentItem) {
                // 插入回复评论
                var html = '', that = this;
                arr.forEach(function (replyItem, index) {
                    html += that.createReplyCommentHtml(replyItem);
                })
                if (commentItem.stat != 5 && commentItem.reply_num > 3) {
                    html += '<div class="sub_comment_more">查看全部' + commentItem.reply_num + '条回复</div>'
                }
                html += '</div>';
                return html
            },
            initLikeData: function (list) {
                // 初始化点赞配置
                if (list) {       
                    var storageLikeList = articleServConf.tools.getStorageData('ZKARTICLE_LIKE'), commConf = articleServConf.commentConf;
                    list = list.filter(function (item) {
                        return item.stat == '1' || item.stat == '5'
                    }).map(function (item) {
                        item.content = commConf.data.EmoticonParserConf.parse(item.content);
                        item.isLike = storageLikeList[item.pk] && storageLikeList[item.pk].isLike ? storageLikeList[item.pk].isLike : false
                        return item
                    })
                } else {
                    return list
                }
            },
            initMainComment: function () {
                var commConf = articleServConf.commentConf;
                var storageLikeList = articleServConf.tools.getStorageData('ZKARTICLE_LIKE');
                var $content = $('.main_comment_floor').find('.comment_item_content');
                var pk = $('.main_comment_floor').attr('data-cid');
                $content.html(commConf.data.EmoticonParserConf.parse($content.text()));
                if (storageLikeList[pk] && storageLikeList[pk].isLike) {
                    $('.main_comment_floor').find('.comment_item_tool').addClass('zaned')
                }
            },
            writeLikeToStorage: function (pk, like) {
                // 将点赞信息写入存储
                var likeData = articleServConf.tools.getStorageData('ZKARTICLE_LIKE');
                likeData[pk] = {
                    isLike: like
                }
                articleServConf.tools.setStorageData('ZKARTICLE_LIKE', likeData)
            },
            clickLike: function (cid, $ts) {
                var commConf = articleServConf.commentConf;
                // 点赞
                // if(commConf.data.likeSending) return
                var that = this
                // commConf.data.likeSending = true
                $ts.addClass('like');
                var count = $ts.find('span').text() - 0 + 1;
                $ts.find('span').text(count).parents('.comment_item_tool').addClass('zaned')
                that.writeLikeToStorage(cid, true)
                setTimeout(function () {
                    $ts.removeClass('like')
                }, 500)
                $.ajax({
                    url: commConf.data.api.like,
                    data: {
                        pk: articleServConf.tools.getUrlName('pk'),
                        cid: cid,
                        _version: commConf.data.version,
                        _uid: articleServConf.data.userInfo._uid,
                        skey: articleServConf.data.userInfo.skey,
                        token: articleServConf.data.userInfo.token
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.stat == '1') {
                        } else {
                            // articleServConf.tools.toast(res.msg)
                        }
                    },
                    error: function (err) {
                        // articleServConf.tools.toast('评论发送失败，请检查网络');
                        console.error(err)
                    },
                    complete: function () {
                        // commConf.data.likeSending = false
                    }
                })
            },
            clickDislike: function (cid, cb) {
                // 取消点赞
                this.writeLikeToStorage(cid, false);
                cb && cb();
            },
            showCommentModal: function () {    
                articleServConf.tools.stat(statUrl.Articlewap_Commentup_View);
                if(articleServConf.tools.appType() != 'wx' || window.articleData.no_comment == 'Y') return;
                articleServConf.data.scrollTop = $(window).scrollTop();
                $('.comment-modal-wrapper').find('textarea').focus();
                $('.comment-modal-wrapper').addClass('show');
                $('.fixed-comment-bottm-bar').hide();
                // setTimeout(function() {
                //    document.body && (document.body.scrollTop = document.body.scrollTop)
                // }, 300)
            },
            hideCommentModal: function () {
                $('.comment-modal-wrapper').removeClass('show').find('textarea').blur();
                $('.fixed-comment-bottm-bar').show();
                var iosVer = articleServConf.tools.get_ios_version()
                if(iosVer && iosVer.substring(0,1) == '9') {
                    window.scrollTo(0, articleServConf.data.scrollTop)
                }
            },
            scrollToEle: function(el, cb) {
                var doc = document.body.scrollTop ? document.body : document.documentElement;
                var top = el.offsetTop;
                articleServConf.tools.animationEase(doc.scrollTop, top, 4, function (value, isEnd) {
                    if (doc.scrollTop == 0) {
                        window.scrollTo(0, value)
                    } else {
                        doc.scrollTop = value;
                    }
                    if(isEnd) {
                        cb && cb()
                    }
                });
            },
            confirmModal(text, successCb) {
                text = text;
                var html = '<div class="comment_confirm_modal_wrapper">';
                html += '<div class="comment_confirm_modal_backdrop"></div>';
                html += '<div class="comment_confirm_modal">' + text;
                html += '<div class="comment_confirm_btns">';
                html += '<a href="javascript:;" class="comment_confirm_btn cancel">取消</a>';
                html += '<a href="javascript:;" class="comment_confirm_btn ok">删除</a>';
                html += '</div></div></div>';
                $('body').append($(html));
                // $('.comment_confirm_modal')
                //     .css({
                //         width: window.innerWidth*0.75 + 'px',
                //         marginLeft: -(window.innerWidth*0.75)/2 + 'px'
                //     })
                $('.comment_confirm_modal_wrapper').off().on('touchmove', function (e) {
                    e.preventDefault()
                })
                $('.comment_confirm_btn.cancel').one('click', function () {
                    $('.comment_confirm_modal_wrapper').remove()
                })
                $('.comment_confirm_btn.ok').one('click', function () {
                    successCb && successCb()
                    $('.comment_confirm_modal_wrapper').remove()
                })
            },
            setFriendship() {
                if(!friendshipUrl) return;
                $.getJSON(friendshipUrl, {
                    pk: articleServConf.tools.getUrlName('pk'),
                    uid: articleServConf.tools.getUrlName('uid'),
                    wfscode: articleServConf.tools.getUrlName('wfscode')
                },function(res) {
                   // console.log(res)
                })
            }
        },
        init: function (articleServConf) {
            var that = this, commConf = articleServConf.commentConf;
            commConf.data.api.list = articleServConf.tools.setHost(commConf.data.api.list);
            commConf.data.api.like = articleServConf.tools.setHost(commConf.data.api.like);
            commConf.data.api.dele = articleServConf.tools.setHost(commConf.data.api.dele);
            commConf.data.api.reply = articleServConf.tools.setHost(commConf.data.api.reply);
            
            //zaker内去掉下载按钮
            if(navigator.userAgent.match(/zaker/ig)){
                $('.fixed-comment-bottom-bar .comment-out-box').css({
                    'display': 'none!important'
                });
            }

            // 在微信发送请求设置用户关系链
            if(articleServConf.tools.appType() == 'wx' && articleServConf.tools.getUrlName('uid')) {
                this.methods.setFriendship();
            }

            // 如果用户没登录
            if(!$.fn.cookie('ZK_WAP_USER_INFO')) {
                $('.comment-modal-wrapper').addClass('nologin')
            } else {
                articleServConf.data.userInfo = JSON.parse($.fn.cookie('ZK_WAP_USER_INFO'));
            }
        
            // 评论按钮点击滑动
            $('.fixed-comment-bottom-bar .comment-btn-click-area').on('click', function() {
                if($('.comment-btn').hasClass('input')) {
                    showInputBox();
                    return;
                }
                articleServConf.tools.stat(statUrl.Articlewap_Commentps_Click);
                that.methods.scrollToEle($('.comment_list_wrapper').prev()[0], function() {
                    if($('.comment_list_wrapper').height()<130) {
                        that.methods.showCommentSmBtn('comment');
                    }
                })
            })

            /**
             * 处理iOS 键盘收起页面未下移bug
             */
            ;(/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener('blur', function(e){
                // 这里加了个类型判断，因为a等元素也会触发blur事件
                ['input', 'textarea'].includes(e.target.localName) && document.body && (document.body.scrollTop = document.body.scrollTop);
            }, true)

            // 表情包配置类
            var EmoticonParser = function() {
                this.reg = /(\[(.*?)\:([\u4e00-\u9fa5]+?)\])/g;
                this.emoji_pack_url = articleServConf.tools.setHost('https://app.myzaker.com/super_topic/_api/get_emoji_pack.php');
                this.emotionSeries = [];
                this.init();
            }

            EmoticonParser.prototype = {
                constructor: EmoticonParser,
                init: function() {
                    var packInfo = articleServConf.tools.getStorageData('ZK_SUPERTOPIC_EMOTION_PACK');
                    var now = new Date().getTime(), timeout = 1000*60*60*24*7;
                    if(JSON.stringify(packInfo) != '{}') {
                        if(now - packInfo.time > timeout) {
                            // 过期请求表情包配置信息
                            this.getEmotionPack()
                        } else {
                            // 未过期取本地
                            this.emotionSeries = JSON.parse(packInfo.packages)
                        }
                    } else {
                        this.getEmotionPack()
                    }
                },
                getEmotionPack: function() {
                    var that = this;
                    // 获取表情包配置信息
                    $.getJSON(that.emoji_pack_url, function(res) {
                        if (typeof res.error !== 'undefined' && res.error) {
                            var msg = '表情包配置获取失败';
                            console.error(msg)
                        } else {
                            var data = res.data;
                            if (res.stat == 1) {
                                that.emotionSeries = data.packages;
                                var packages = JSON.stringify(data.packages);
                                var time = new Date().getTime();
                                articleServConf.tools.setStorageData('ZK_SUPERTOPIC_EMOTION_PACK', {time: time, packages: packages});
                            } 
                            else {                
                                console.error(res.msg)
                            }
                        }
                    })
                },
                parse: function(content) {
                    var that = this;
                    return content.replace(that.reg, function (matchItem){
                        var imgUrl, emotionType, emotionIdx, emotionName;
                        matchItem.match(that.reg)
                        emotionType = RegExp.$2.split('_')[0].substring(1);
                        emotionName = RegExp.$3;
                        
                        if(that.emotionSeries.length > 0) {
                            that.emotionSeries.forEach(function(item) {
                                if(item.pk == emotionType) {
                                    item.emoticons.forEach(function(emticon) {
                                        if(emticon.code == (RegExp.$2).substring(1)) {
                                            matchItem = '<span><img class="icon" width="24" height="24" src="'+item.base_path+emticon.path+'"></span>';
                                        }
                                    })
                                }
                            })
                        }
                        return matchItem
                    });
                }
            }

            // 初始化表情包配置类
            that.data.EmoticonParserConf = new EmoticonParser();

            // 初始化评论
            var params = {};
            if (articleServConf.tools.getUrlName('root_comment_pk')) {
                if (articleServConf.tools.appType() == 'wx') {
                    $('.comment_list_wrapper').show();
                    $('.fixed-comment-bottom-bar').show();
                    that.methods.showCommentSmBtn('comment');
                    articleServConf.tools.stat(statUrl.Articlewap_Commentde_Wx_View);
                } else {
                    that.methods.showCommentSmBtn('outZaker');
                    articleServConf.tools.stat(statUrl.Articlewap_Commentde_Qt_View);
                }  
                commConf.data.isMainCommentPage = true;
                $('.back-btn').on('click', function(){
                    articleServConf.tools.stat(statUrl.Articlewap_Commentde_Return_Click);
                    window.history.go(-1);
                    //articleServConf.tools.goBack('http://app.myzaker.com/news/article.php?pk='+articleServConf.tools.getUrlName('pk'))
                })
                // params = {
                //     act: 'mainComment',
                //     pk: commConf.tools.getUrlName('pk'),
                //     root_comment_pk: commConf.tools.getUrlName('root_comment_pk'),
                //     _version: commConf.data.version,
                //     _uid: commConf.data.userInfo.uid
                // }   
                that.methods.initMainComment();
                $('.comment-btn .placeholder').text('回复 ' + $('.main_comment_floor').find('.comment_item_title').text());
                if (window.mainCommentData.stat == '1') {
                    var comments = window.mainCommentData.data.comments;
                    if (comments.length > 0) {
                        var _list = comments[0].list;
                        that.methods.initLikeData(_list);
                        commConf.data.nextUrl = comments[0].next_url;
                        if(comments[0].next_url) {
                            $('.comment_list_loading').show();
                        }
                        that.methods.addCommentHtml(_list);
                        $('.comment-btn .count').text(window.mainCommentData.data.comment_counts).addClass('loaded');
                    }
                }
            } else {
                that.methods.showCommentSmBtn('btn');
                params = {
                    act: 'get_comments',
                    pk: articleServConf.tools.getUrlName('pk'),
                    _version: commConf.data.version,
                    _uid: articleServConf.data.userInfo._uid,
                    skey: articleServConf.data.userInfo.skey,
                    token: articleServConf.data.userInfo.token
                }
                if(articleServConf.data.userInfo && articleServConf.data.userInfo._uid) params._uid = articleServConf.data.userInfo._uid;
                $.ajax({
                    url: commConf.data.api.list,
                    data: params,
                    dataType: 'json',
                    success: function (res) {
                        if (res.stat == 1) {
                            var comments = res.data.comments, list = [];
                            if (comments.length > 0) {
                                list = comments[0].list;
                                that.methods.initLikeData(list);
                                commConf.data.nextUrl = comments[0].next_url;
                                if(comments[0].next_url) {
                                    $('.comment_list_loading').show();
                                }
                                if(list.length == 0) {
                                    $('.comment_list_loading').hide();
                                    $('.comment_list_empty').show();
                                }
                            } else {
                                $('.comment_list_loading').hide();
                                $('.comment_list_empty').show();
                            }
                            if(res.data.comment_counts>0){
                                $('.comment-btn .count').text(res.data.comment_counts).addClass('loaded');
                            }
                            // commConf.data.api.like = res.data.info.comment_like_url;
                            // commConf.data.api.dele = res.data.info.comment_delete_url;
                            // commConf.data.api.reply = res.data.info.comment_reply_url;
                            that.methods.addCommentHtml(list);
                        } else if(res.stat == -1044) {
                            window.location.href = res.data.login_url;
                        }else {
                            articleServConf.tools.toast(res.msg);
                        }
               
                    },
                    error: function (err) {
                        articleServConf.tools.toast('评论加载失败，请检查网络');
                        console.error(err)
                    }
                })
            }
            
            // 瀑布流加载评论
            var wrapperHeight = window.innerHeight; // document.documentElement.clientHeight || document.body.clientHeight
            var offsetY = 50, isLoadingData=false;
            window.addEventListener('scroll', function () {
                var areaTop = $('.comment_list_wrapper').offset().top;
                var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
                if (scrollTop + wrapperHeight + offsetY >= scrollHeight) {
                    $('.comment_list_loading').removeClass('loading');
                    if (!commConf.data.nextUrl || isLoadingData) return
                    $('.comment_list_loading').addClass('loading');
                    isLoadingData = true
                    $.getJSON(commConf.data.nextUrl, {
                        _version: commConf.data.version,
                        // _uid: articleServConf.data.userInfo._uid,
                        // skey: articleServConf.data.userInfo.skey,
                        // token: articleServConf.data.userInfo.token
                    }, function (res) {
                        $('.comment_list_loading').removeClass('loading');
                        if (res.stat == 1) {
                            var list = res.data.comments[0].list
                            that.methods.initLikeData(list)
                            commConf.data.nextUrl = res.data.comments[0].next_url
                            if (!commConf.data.nextUrl) $('.comment_list_loading').addClass('end')
                            that.methods.addCommentHtml(list)
                        }
                        isLoadingData = false;
                    })
                }
                if (scrollTop + wrapperHeight > areaTop) {
                    if(!articleServConf.data.inCommentAreaStat && !commConf.data.isMainCommentPage) {
                        // 如果没统计过
                        var _statUrl = articleServConf.tools.appType() == 'wx'? window.statUrl.Articlewap_Comment_Wx_View:window.statUrl.Articlewap_Comment_Qt_View;
                        articleServConf.tools.stat(_statUrl);
                        articleServConf.data.inCommentAreaStat = true
                    }
                   // $('.comment-input-box').addClass('show');
                    // 非微信端外加载底部打开工具栏
                    if (articleServConf.tools.appType() == 'wx') {
                        if(articleData.no_comment == 'Y') {
                            that.methods.showCommentSmBtn('outZaker');
                        } else {
                            that.methods.showCommentSmBtn('comment');
                        }
                        // articleServConf.tools.stat(statUrl.Articlewap_Comment_Wx_View);
                    } else {     
                        // articleServConf.tools.stat(statUrl.Articlewap_Comment_Qt_View);
                        that.methods.showCommentSmBtn('outZaker');
                    }    
                } else {
                   articleServConf.data.inCommentAreaStat = false
                   commConf.methods.showCommentSmBtn('btn');
                }
                
                if($('#relateArea').length > 0) {
                    var relateAreaTop = $('#relateArea').offset().top;
                    if((scrollTop + wrapperHeight > relateAreaTop) && (scrollTop + wrapperHeight < (relateAreaTop + $('#relateArea').height() + wrapperHeight))) {
                        if(!articleServConf.data.inRecomAreaStat && !commConf.data.isMainCommentPage) {
                            // 如果没统计过
                            var _statUrl = articleServConf.tools.appType() == 'wx'? window.statUrl.Articlewap_Recommend_Wx_View:window.statUrl.Articlewap_Recommend_Qt_View;
                            articleServConf.tools.stat(_statUrl);
                            articleServConf.data.inRecomAreaStat = true
                        }
                    }else {
                        articleServConf.data.inRecomAreaStat = false
                    }
                }
            })

            // 输入框唤醒
            $(document).on('click', '.comment-btn.input', function() {
                showInputBox()
            });

            var showInputBox = function() {
                articleServConf.tools.stat(statUrl.Articlewap_Commentup_Wx_Click);
                if (commConf.data.isMainCommentPage) {
                    commConf.data.inputType = 'reply';
                    var mainName = $('.main_comment_floor').find('.comment_item_title').text();
                    var cid = $('.main_comment_floor').attr('data-cid');
                    $('.comment-modal-content textarea').attr('placeholder', '回复 ' + mainName);
                    $('.comment-modal-content textarea').attr('replyname', mainName);
                    commConf.data.reply = {
                        cid: cid
                    }
                } else {
                    commConf.data.inputType = 'main';
                    $('.comment-modal-content textarea').attr('placeholder', '我来说两句...');
                }
                that.methods.showCommentModal();
            }

            $('.comment-backdrop')
                .on('click, touchstart', function () {
                    that.methods.hideCommentModal();
                    return false
                })
            $('.comment-modal-btn.cancel').on('click', that.methods.hideCommentModal)

            // 防止背景滚动
            var tScrollY = 0;
            $('.comment-modal-content')
                .on('touchstart', function (e) {
                    tScrollY = $('textarea', this)[0].scrollTop
                })
                .on('touchmove', function (e) {
                    var $textarea = $('textarea', this);
                    var scrollHeight = $textarea[0].scrollHeight;
                    var height = $textarea.height();
                    if (scrollHeight <= height) {
                        e.preventDefault();
                    }
                    // else {
                    //     var scrollTop = $textarea[0].scrollTop;
                    //     if(scrollTop>tScrollY && (scrollTop+height >= scrollHeight)) {
                    //         e.preventDefault();
                    //     } else if(scrollTop<tScrollY && scrollTop == 0) {
                    //         e.preventDefault();
                    //     } 
                    //     tScrollY = $textarea[0].scrollTop
                    // }
                })
            $('.comment-modal-bg')
                .on('touchmove', function (e) {
                    e.preventDefault()
                })

            // 输入框
            var $inputCount = $('.comment-modal-footer').find('span');
            // articleServConf.tools.autoTextarea($('.comment-modal-content textarea')[0], 10)
            $('.comment-modal-content textarea')
                .on(
                    {
                        'input propertychange': function () {
                            var len = $(this).val().length
                            $inputCount.text(len)
                            if (len >= 500) {
                                $inputCount.css('color', '#fb4747')
                            } else {
                                $inputCount.css('color', '#AAACB3')
                            }
                            if(len > 0) {
                                $('.comment-modal-btn.publish').removeAttr('disabled');
                            } else {
                                $('.comment-modal-btn.publish').attr('disabled', 'true');
                            }
                        }
                })

            // 回复
            $(document).on('click', '.comment_list_item .reply_area, .comment_item_avatar', function () {
                articleServConf.tools.stat(statUrl.Articlewap_Comment_Click);
                if(articleServConf.tools.appType() != 'wx' || window.articleData.no_comment == 'Y') return;
                commConf.data.inputType = 'reply';
                var name = $(this).parents('.comment_list_item').find('.comment_item_title').text();
                name = name === $('.main_comment_floor .comment_item_title').text() ? '' : name;
                commConf.data.reply = {
                    index: $(this).parents('.comment_list_item').index(),
                    cid: $(this).parents('.comment_list_item').attr('data-cid'),
                    //uid: $(this).parents('.comment_list_item').attr('data-uid'),
                    name: name
                }
                that.methods.showCommentModal();
                $('.comment-modal-content textarea').attr('placeholder', '回复 ' + $(this).parents('.comment_list_item').find('.comment_item_title').text())
                $('.comment-modal-content textarea').attr('replyname', $(this).parents('.comment_list_item').find('.comment_item_title').text())
            })

            // 发送
            $(document).on('click', '.comment-modal-btn.publish', function () {        
                articleServConf.tools.stat(statUrl.Articlewap_Commentup_Report_Click);
                var content = $('.comment-modal-content textarea').val();
                if (content.replace(/\s+/g, "").length == 0) {
                    articleServConf.tools.toast('评论不能为空');
                    return
                }
                var params = {
                    pk: articleServConf.tools.getUrlName('pk'),
                    _version: commConf.data.version,
                    content: content,
                    _uid: articleServConf.data.userInfo._uid,
                    skey: articleServConf.data.userInfo.skey,
                    token: articleServConf.data.userInfo.token
                }
                if (commConf.data.inputType == 'reply') {
                    // 如果是回复评论
                    params.cid = commConf.data.reply.cid;
                    params.content = '回复@' + $('.comment-modal-content textarea').attr('replyname') + ':' + content
                    //params.reply_uid = commConf.data.reply.uid;
                }

                $.ajax({
                    url: commConf.data.api.reply,
                    type: 'POST',
                    data: params,
                    dataType: 'json',
                    success: function (res) {
                        if (res.stat == '1') {
                            if (!res.data) {
                                articleServConf.tools.toast(res.msg);
                                return;
                            }
                            // 插入新评论
                            var insertData = {
                                pk: res.data.pk,
                                auther: articleServConf.data.userInfo,
                                content: content,
                                like_num: 0,
                                stat: 5
                            }
                            insertData.auther.uid = insertData.auther._uid;
                            if (commConf.data.inputType == 'main') {
                                // 主评论类型
                                var html = that.methods.createCommentHtml(insertData)
                                $('#commentListWrapper').prepend(html)
                                $('.comment_list_empty').hide()
                                that.methods.scrollToEle($('.comment_list_wrapper').prev()[0])
                            } else if (commConf.data.inputType == 'reply') {
                                if (commConf.data.isMainCommentPage) {
                                    // 详情页回复评论
                                    if (!commConf.data.reply.name) {
                                        // 详情页无回复用户名默认回复主楼
                                        commConf.data.reply.cid = $('.main_comment_floor').attr('data-cid');
                                    } else {
                                        commConf.data.reply.cid = commConf.data.reply.cid;
                                        if (commConf.data.reply.name) {
                                            insertData.reply_auther = {
                                                name: commConf.data.reply.name
                                            }
                                        }
                                    }
                                    var html = that.methods.createCommentHtml(insertData);
                                    $('#commentListWrapper').prepend(html);
                                    that.methods.scrollToEle($('.comment_list_wrapper').prev()[0]);
                                } else {
                                    // 文章页回复评论
                                    var html = that.methods.createReplyCommentHtml(insertData);
                                    $('.comment_list_item').eq(commConf.data.reply.index).find('.comment_item_sub').css('display', 'block').prepend(html);
                                }

                            }
                            $('.comment-btn .count').text($('.comment-btn .count').text()-0+1);
                            that.methods.hideCommentModal()
                            $('.comment-modal-content textarea').val('');
                            $('.comment-modal-footer span').text('0');
                            $('.comment-modal-btn.publish').attr('disabled', 'true');
                            articleServConf.tools.toast(res.msg)
                        } else if(res.stat == '-1044') {
                            // 过期重新授权前将评论存储到本地
                            // window.localStorage.setItem('ZK_ARTICLE_COMMENT', content);
                            that.methods.checkLogin()
                        } else {
                            articleServConf.tools.toast(res.msg)
                        }
                    },
                    error: function (err) {
                        articleServConf.tools.toast('操作失败，请检查网络');
                        //console.error(err)
                    }
                })
            })

            // 点赞
            $(document).on('click', '.comment_item_tool .zan_btn', function () {
                var $ts = $(this);
                var cid = $ts.parents('.comment_list_item').attr('data-cid');

                if ($ts.parent().hasClass('zaned')) {
                    that.methods.clickDislike(cid, function () {
                        $ts.addClass('dislike');
                        var count = $ts.find('span').text() - 0;
                        count = count == 0 ? count : count - 1;
                        $ts.find('span').text(count).parents('.comment_item_tool').removeClass('zaned')
                        setTimeout(function () {
                            $ts.removeClass('dislike')
                        }, 500)
                    })
                } else {
                    that.methods.clickLike(cid, $ts)
                }
            })

            // 删除评论
            $(document).on('click', '.comment_item_tool .delete_btn', function () {
                articleServConf.tools.stat(statUrl.Articlewap_Comment_Delete_Click);
                var $ts = $(this);
                var cid = $ts.parents('.comment_list_item').attr('data-cid');
                that.methods.confirmModal('确认删除该条评论？', function () {
                    $.ajax({
                        url: commConf.data.api.dele,
                        data: {
                            pk: articleServConf.tools.getUrlName('pk'),
                            comment_pk: cid,
                            _uid: articleServConf.data.userInfo._uid,
                            skey: articleServConf.data.userInfo.skey,
                            token: articleServConf.data.userInfo.token
                        },
                        dataType: 'json',
                        success: function (res) {
                            if (res.stat == '1') {
                                $ts.parents('.comment_list_item').remove()
                                if ($('.comment_list_item').length == 0) {
                                    $('.comment_list_empty').show()
                                }
                                $('.comment-btn .count').text($('.comment-btn .count').text()-0-1);
                                articleServConf.tools.toast(res.msg)
                            } else if(res.stat == '-1044') {
                                that.methods.checkLogin()
                            } else {
                                articleServConf.tools.toast(res.msg)
                            }
                        },
                        error: function (err) {
                            articleServConf.tools.toast('操作失败，请检查网络');
                            console.error(err)
                        }
                    })
                });
            })

            // 微信登录
            $(document).on('click', '#wxLoginBtn', function() {
                $(this).text('登录中...')
                that.methods.checkLogin(function() {
                    if($.fn.cookie('ZK_WAP_USER_INFO')) {
                        $('.comment-modal-wrapper').removeClass('nologin')
                    } else {
                        $('.nologin-box p').text('登录失败，请重新登录')
                        $('#wxLoginBtn').text('微信登录')
                    }
                })
            })

            // 评论区跳转统计
            $(document).on('click', '.comment_item_sub', function () {
                articleServConf.tools.stat(statUrl.Articlewap_Commentde_Click);
                // var pk = articleServConf.tools.getUrlName('pk');
                // var rootPk = $(this).parents('.comment_list_item').attr('data-cid');
                // window.location.href = articleServConf.tools.setHost('https://app.myzaker.com/news/comment.php?act=mainComment&pk=' + pk + '&root_comment_pk=' + rootPk);
                // return false;
            })

            // 打开zaker
            if(articleServConf.tools.appType() != 'wx' || window.articleData.no_comment == 'Y') {
                $(document).on('click', '.comment-out-box>a', function() {
                    articleServConf.tools.stat(statUrl.Articlewap_Commentup_Qt_Click);
                    window.openlink()
                })
            }

            // 顶部打开zaker统计
            $(document).on('click', '.zk_top_bar_link', function() {
                if(articleServConf.tools.appType() == 'wx') {
                    articleServConf.tools.stat(statUrl.Articlewap_Open_Wx_Click)
                } else {
                    articleServConf.tools.stat(statUrl.Articlewap_Open_Qt_Click)
                }
            })
        },
    },
    // 大家都在看（精彩推荐）配置
    recommendConf: {
        data: {
            list: [],
            dspLen: 0,
            relLen: 0
        },
        methods: {
            addRelateHtml(data) {
                var html = '';
                html += '<div class="relate article">';
                html += '<a title="' + data.title + '" href="javascript:;" data-href="' + data.article.weburl + '">';
                html += '<span class="relate-title">';
                html += '<div class="topic-title">' + data.title + '</div>';
                html += '<div class="topic-source">' + data.article.auther_name + '&nbsp;&nbsp;' + articleServConf.tools.formatTime(data.article.date) + '</div>'
                html += '</span>';
                if (data.article.thumbnail_pic) {
                    html += '<div class="border"><img class="opacity_0 icon" style="object-fit: cover; opacity: 1;" src="' + data.article.thumbnail_pic + '"></div>';
                }
                html += '</a></div>';
                return html;
            }
        },
        init: function (data, dspLen, relLen) {
            if (!data.list && !data.list instanceof Array) return;
            var that = this, html = '';
            data.list.forEach(function (item, index) {
                if (index > 3) return;
                html += that.methods.addRelateHtml(item);
            })
            $('.relate_wrapper').append($(html))
            var total = 0;
            if (relLen <= 2) {
                total = relLen + (dspLen > 1 ? 1 : dspLen);
            } else {
                total = relLen + (dspLen > 2 ? 2 : dspLen);
            }
            if (total > 3) {
                $('#relateArea').show();
                $('.relate_wrapper').append($('<a href="javascript:;" class="check_more">查看更多<span class="arrow"></span></a>'));
            } else if (relLen == 0) {
                $('#relateArea').remove();
            } else {
                $('#relateArea').show();
            }

            $('.relate_wrapper .check_more').on('click', function () {
                articleServConf.tools.stat(statUrl.Articlewap_Recommend_More_Click);
                $('.relate_wrapper').addClass('show');
            });

            $(document).on('click', '.relate_wrapper .relate.article', function() {
                var that = this;
                var index = $('.relate.article').index(this) + 1;
                articleServConf.tools.stat(statUrl['Articlewap_Recommend0'+index+'_Click']);
                setTimeout(function() {
                    var referLink = document.createElement('a');   
                    referLink.href = $(that).find('a').attr('data-href');   
                    document.body.appendChild(referLink);   
                    referLink.click();   
                    // window.location.href = $(that).find('a').attr('data-href');
                }, 150)
            })
        }
    },
    init: function () {
        var that = this
        this.data.isNormalTemplate = true
        $('#relateArea').hide()
        if(this.tools.getUrlName('f') != 'xiongzhang') {
            if(this.tools.appType() == 'wx' && this.tools.getUrlName('root_comment_pk')) {
                $('.comment_list_wrapper').hide()
                $('.fixed-comment-bottom-bar').hide()
            }
            // 授权时机改为发评论时手动触发
            //this.commentConf.methods.checkLogin(function() {
                that.commentConf.init(that)
            //});
        }
    }
}

var loading = false;
var show_comment_num_first = 5;
$(".pr").each(function (index) {
    if (index > show_comment_num_first - 1) {
        $(this).addClass('none');
    }
});
function makeUrlWithArg(url, arg) {
    if (url == null || typeof url == 'undefined') {
        return '';
    }

    var p = (url.indexOf('?') > 0) ? "&" : "?";
    var qstr = "";
    var tmp_p = "";
    $.each(arg, function (t_key, t_val) {
        if (t_key == "" || t_val == "") {
            return;
        }
        qstr += tmp_p + t_key + "=" + encodeURIComponent(t_val);
        tmp_p = "&";
    });
    if (qstr != "") {
        url += p + qstr;
    }

    return url;
}

var tempCommentArr = Array();
function getComment() {
    if (loading == true)
        return;
    if (tempCommentArr.length < 5) {
        loading = true;
        $(".changeTop").html('正在加载...');
        //var next_url = encodeURIComponent($("#next_url").val());
        //var c_url = "article_action.php?act=nextUrl&url="+next_url;
        var c_url = makeUrlWithArg(CONFIG['article_action_url'], { act: "nextUrl", url: $("#next_url").val() });
        $.getJSON(c_url, function (json) {
            if (json) {
                tempCommentArr = tempCommentArr.concat(json['list']);
                if (json['next_url']) {
                    $("#next_url").val(json['next_url']);
                } else {
                    $("#next_url").val("");
                    if (tempCommentArr.length <= 5)
                        $(".changeTop").remove();
                }

                addComment();
                loading = false;
                $(".changeTop").html('查看更多评论');
            }
        });
    } else {
        addComment();
        if ($("#next_url").val() == '') {
            $(".changeTop").remove();
        }
    }
}

function addComment() {
    var loop = tempCommentArr.length < 5 ? tempCommentArr.length : 5;
    var json = tempCommentArr;
    comment_list_html = "";
    for (var i = 0; i < loop; i++) {
        var tmp = json.shift();
        tmp['like_num'] = tmp['like_num'] == 0 ? '' : tmp['like_num'];
        if (tmp['reply_comment']) {
            tmp['reply'] = '<div class="reply">' + tmp['reply_comment']['auther_name'] + '：' + tmp['reply_comment']['content'] + '</div>';
        } else {
            tmp['reply'] = '';
        }

        tmp['data_original'] = 'src';
        comment_list_html += template($('#comment_li').val(), tmp);
    }

    $('.new_comment_box_all').append(comment_list_html);
    //$('.tx_r').append(comment_list_html);
}

if (!browser.versions.iPhone) {
    var pre_scroll = -1;
    var downFlag = true;
    var is_animate = false;
    $(window).scroll(function () {
        if ($(window).scrollTop() < 50) {
            showDownloadBtn();
            downFlag = true;
        } else {
            if ((pre_scroll - $(window).scrollTop()) > 0) {
                if (!downFlag && !is_animate) {
                    is_animate = true;
                    showDownloadBtn();
                }
                downFlag = true;
            } else {
                if (downFlag && !is_animate) {
                    is_animate = true;
                    hideDownloadBtn();
                }
                downFlag = false;
            }

            pre_scroll = $(window).scrollTop();
        }
    });
    var bt;
    var t;
    function touchEnd(event) {
        if (t)
            clearTimeout(t);
        t = setTimeout('touchendTimeOut()', 500);
    }

    var touchStarY;
    function touchendTimeOut() {
        if ($(window).scrollTop() < 50) {
            showDownloadBtn();
            downFlag = true;
        }
    }

    document.addEventListener("touchend", touchEnd, false);
} else {
    document.ontouchstart = function (e) {
        touchStarY = e.targetTouches[0].pageY;
    };
    document.ontouchmove = function (e) {
        nStartY = e.targetTouches[0].pageY;
        var distanceY = touchStarY - nStartY;
        if (Math.abs(distanceY) > 10) {
            if ($(window).scrollTop() > 50) {
                if (distanceY > 0) {
                    $("#downTips").css('top', "-42px");
                } else {
                    $("#downTips").css('top', "0");
                }
            } else {
                $("#downTips").css('top', "0");
            }
        }
    };
}

var likeArr = [];
function zan(obj) {
    var cid = $(obj).parent().find("input[name=cid]").val();
    var _this = obj;
    if (likeArr.indexOf(cid) == -1) {
        //var c_url = "article_action.php?act=like_com&cid="+cid+"&pk="+CONFIG['pkid'];
        var c_url = makeUrlWithArg(CONFIG['article_action_url'], { act: "like_com", cid: cid, pk: CONFIG['pkid'] });
        $.getJSON(c_url, function (json) {
            if (json.stat == 1) {
                var num = Number($(_this).parent().find(".like_num").html());
                var like_num = $(_this).parent().find(".like_num");
                $(like_num).show();
                if (!isNaN(num)) {
                    $(like_num).html(num + 1);
                }
                $(_this).css("border-color", "#fb4747");
                $(_this).css("color", "#fb4747");
                $(_this).addClass("active");
                $(_this).find("img").attr("src", "dist/images/like_bg_2.png");
                $(_this).find(".like").addClass("active");
                likeArr.push(cid);
            } else {
                alert(json.msg);
            }
        });
    }
}

function stopBubble(e) {
    var e = e ? e : window.event;
    if (window.event) { // IE  
        e.cancelBubble = true;
    } else { // FF  
        e.stopPropagation();
    }
}

var reply_str = '';
function showInput(obj) {
    var cid = '';
    if (obj) {
        var author = $(obj).find('.author').text();
        var content = $(obj).find('.con').text();
        $("#comment-input-id").attr("placeholder", '回复:' + author);
        cid = $(obj).find("input[name=cid]").val();
        $("#reply_cid").val(cid);
        reply_str = author + ':' + content;
    }

    $("#comment-input-id").focus()
}

if (browser.versions.isPc) {
    $(".div-like").one('click', function (e) {
        addLikeFun(this);
        $(this).addClass("active");
    })
} else {
    $(".div-like").one('touchend', function (e) {
        addLikeFun(this);
        $(this).addClass("active");
    })
}

function addLikeFun() {
    //var c_url = "article_action.php?act=like_art&pk="+CONFIG['pkid']+"&app_id="+CONFIG['app_id'];
    var c_url = makeUrlWithArg(CONFIG['article_action_url'], { act: "like_art", app_id: CONFIG['app_id'], pk: CONFIG['pkid'] });
    $.getJSON(c_url);
    $('#add_like').css('display', '-webkit-box');
    $('#add_like').animate({ 'translateY': '-200%' }, 400, function (e) {
        $('#add_like').hide();
    })
}

var inputDom = $("#comment-input-id");
var focusFlag = false;
inputDom.focus(function () {
    focusFlag = true;
});
document.addEventListener('touchmove', function (e) {
    if (focusFlag) {
        focusFlag = false;
        inputDom.attr("placeholder", "我也评论一句");
        $("#reply_cid").val('');
        document.activeElement.blur();
    }
}, false);
$("#comment-input-btn").click(function (e) {

    if (inputDom.val() !== '') {
        var obj = {};
        obj['auther_icon'] = 'https://sns.myzaker.com/images/noavatar_middle.png';
        obj['auther_name'] = '我';
        obj['like_num'] = '';
        obj['ctime'] = '刚刚';
        obj['content'] = inputDom.val();
        if ($("#reply_cid").val()) {
            obj['reply'] = '<div class="reply">' + reply_str + '</div>';
        } else {
            obj['reply'] = '';
        }

        obj['data_original'] = 'src';
        var comment_list_html = template($('#comment_li2').val(), obj);
        $('.comment-input-box').after(comment_list_html).show();
        var distance = $('.comment-input-box').offset().top;
        $('body').animate({ scrollTop: distance }, 500, function () {
            inputDom.focus();
        });
        //var c_url = "article_action.php?act=commentPost&pk="+CONFIG['pkid'];
        var c_url = makeUrlWithArg(CONFIG['article_action_url'], { act: "commentPost", pk: CONFIG['pkid'] });
        $.post(c_url, { content: inputDom.val(), cid: $("#reply_cid").val() });
        inputDom.attr("placeholder", "我也评论一句");
        inputDom.val('');
        $("#reply_cid").val('');
    }

});
function template(_str, _arr) {
    //替换模板变量
    var reCat = /<{(\w+)}>/gi;
    return _str.replace(reCat, function () {
        return _arr[arguments[1]];
    });
}

var topHeight = $("#downTips").height();
function showDownloadBtn() {
    if (browser.versions.iPhone) {
        $('#downTips').show();
        is_animate = false;
    } else {
        $('#downTips').animate({ opacity: 1 }, 'slow', function (e) {
            is_animate = false;
        });
    }
}

function hideDownloadBtn() {
    //  $('#downTips').hide();
    if (browser.versions.iPhone) {
        $('#downTips').hide();
        is_animate = false;
    } else {
        $('#downTips').animate({ opacity: 0 }, 'slow', function (e) {
            is_animate = false;
        });
    }
}


$(".changeTop").on('click', function (e) {
    $(".pr.none").each(function (index) {
        if (index < 5) {
            $(this).removeClass('none');
        }
    });
    if ($(".pr.none").length == 0)
        getComment();
});
function ucShare(config) {
    if (window.navigator.userAgent.indexOf("UCBrowser") !== -1) {
        var fn = function (origin) {
            var isIOS = window.navigator.userAgent.indexOf('iPhone') !== -1,
                isAndroid = window.navigator.userAgent.indexOf('Android') !== -1,
                tmppc1 = document.getElementById("news_template_04_banner"),
                tmppc2 = document.getElementById("id_imagebox_0"),
                picId = tmppc1 ? tmppc1 : tmppc2 ? tmppc2 : '';
            if (isIOS) {
                var target = origin == 'friend' ? 'kWeixin' : 'kWeixinFriend';
                linkPlus = origin == 'friend' ? '&f=weixin_uc_friend' : '&f=weixin_uc_timeline';
                ucbrowser.web_share(config.title, config.desc, config.link + linkPlus, target, '', '', picId.id);
            } else if (isAndroid) {
                var target = origin == 'friend' ? 'WechatFriends' : 'WechatTimeline';
                linkPlus = origin == 'friend' ? '&f=weixin_uc_friend' : '&f=weixin_uc_timeline',
                    getPos = {
                        getTop: function (e) {
                            var offset = e.offsetTop;
                            if (e.offsetParent != null)
                                offset += getPos.getTop(e.offsetParent);
                            return offset;
                        },
                        getLeft: function (e) {
                            var offset = e.offsetLeft;
                            if (e.offsetParent != null)
                                offset += getPos.getLeft(e.offsetParent);
                            return offset;
                        },
                        getNodeInfoById: function (e) {
                            var myNode = document.getElementById(e);
                            if (myNode) {
                                var
                                    pos = [getPos.getLeft(myNode), getPos.getTop(myNode), myNode.offsetWidth, myNode.offsetHeight]
                                return (pos)
                            } else {
                                return false
                            }
                        }
                    }

                ucweb.startRequest('shell.page_share', [config.title, config.desc, config.link + linkPlus, target, '', '', getPos.getNodeInfoById(picId.id)])
            }
        };
        $(".share-wxfriend").on('touchstart', function () {
            $(this).addClass("active");
        }).on('touchend', function () {
            $(this).removeClass("active");
            fn('friend');
        });
        $(".share-wxtimeline").on('touchstart', function () {
            $(this).addClass("active");
        }).on('touchend', function () {
            $(this).removeClass("active");
            fn('timeline');
        });
    }
}

var do_wx_share_stat = function () {
    var stat_url = CONFIG['wx_share_stat_url'];
    if (stat_url) {
        var img = new Image();
        img.src = stat_url;
    }
}

setTimeout(function () {
    if (window.navigator.userAgent.indexOf("MicroMessenger") >= 0) {
        var scriptdom = document.createElement('script');
        scriptdom.type = 'text/javascript';
        // scriptdom.src = 'https://app.myzaker.com/tools/wx.php?v=1';
        scriptdom.src = 'https://app.myzaker.com/tools/wx_serv.php?v=1';
        document.body.appendChild(scriptdom);
        var _this = this;
        scriptdom.onload = function () {
            wxShare.init(CONFIG['wx_share_title'], CONFIG['wx_share_desc'], CONFIG['wx_share_link'], CONFIG['img_url'], do_wx_share_stat);

            //微信图片预览
            $(document).on('click', '#content .perview_img_div', function (event) {
                var imgArray = [];
                var curImageSrc = $(this).children("img").attr('data-original') ? $(this).children("img").attr('data-original') : $(this).children("img").attr('src');
                var oParent = $(this).children("img").parent();
                if (curImageSrc && !oParent.attr('href')) {
                    $('#content .perview_img_div img').each(function (index, el) {
                        var itemSrc = $(this).attr('data-original') ? $(this).attr('data-original') : $(this).attr('src');
                        imgArray.push(itemSrc);
                });
                    wx.previewImage({
                        current: curImageSrc,
                        urls: imgArray
                    });
            }
            });

                    }
                }

    ucShare({ title: CONFIG['wx_share_title'], desc: CONFIG['wx_share_desc'], link: CONFIG['wx_share_link'], img: CONFIG['img_url'] });
}, 500);

function addHtml() {
    if (topJson == null) {
        return;
    }
    var html = "";
    var tmpArr = Array();
    var more = 0;
    var fix_position;

    if (topJson.topic && topJson.topic instanceof Array) {
        if (topJson.topic.length == 0) {
            more++;
        } else {
            var topic = topJson.topic.shift();
            if (topic) {
                html += "<div class='relate'>";
                html += "<a href='" + makeUrlWithArg(topic.url, { f: CONFIG['req_f'] }) + "'>";
                html += "<span class='relate-title'><div class='topic-title'>" + topic.title + "(" + topic.timeline + ")</div><img class='topic-icon' src='//zkres.myzaker.com/data/image/mark/topic_2x.png' width='23'></span>";
                html += "<div class='border'><div class='icon' style='background-image:url(" + topic.img_url + ");'></div></div>";
                html += "</a></div>";
                tmpArr.push(html);
            }
        }

    }

    if (topJson.local && topJson.local instanceof Array) {
        var loop = topJson.local.length < 3 ? topJson.local.length : 3;
        if (topJson.local.length < 3) {
            more = more + (3 - topJson.local.length);
        } else if (topJson.top.length > 7) {
            for (var i = 0; i < loop; i++) {
                var local = topJson.local.shift();
                if (local) {
                    if (local.id == CONFIG['pkid'])
                        continue;
                    html = "<div class='relate'>";
                    html += "<a href='" + makeUrlWithArg(local.url, { f: CONFIG['req_f'] }) + "'>";
                    html += "<span class='relate-title'><div class='topic-title'>" + local.title + "</div><div  class='topic-source'>" + local.author + "&nbsp;&nbsp;" + local.time + "&nbsp;&nbsp;<img class='topic-icon' src='dist/images/icon_local.png' width='23'></div></span>";
                    html += "<div class='border'><div class='icon' style='background-image:url(" + local.img + ");'></div></div>";
                    html += "</a></div>";
                    tmpArr.push(html);
                }
            }
        }
    }

    var topArr = Array();
    if (topJson.top && topJson.top instanceof Array) {

        var loop = topJson.top.length < 7 ? topJson.top.length : 7 + more;
        for (var i = 0; i < loop; i++) {
            var top = topJson.top.shift();
            if (top) {
                if (top.pk == CONFIG['pkid'])
                    continue;
                topArr.push(top);
            }
        }

        //小图模板
        for (var i = 0; i < topArr.length; i++) {
            var top = topArr[i];
            if (top) {
                html = "<div class='relate'>";
                html += "<a href='" + makeUrlWithArg(top.url, { f: CONFIG['req_f'] }) + "'>";
                html += "<span class='relate-title'><div class='topic-title'>" + top.title + "</div><div  class='topic-source'>" + top.author + "&nbsp;&nbsp;" + top.time + "</div></span>";
                if (top.cover.url) {
                    html += "<div class='border'><div class='icon' style='background-image:url(" + top.cover.url + ");'></div></div></a></div>";
                } else {
                    html += "<div class='border'><div class='icon' style='background-color:" + top.cover.color + ";background-size: cover;'>" + top.cover.font + "</div></div></a></div>";
                }



                tmpArr.push(html);
            }
        }
    }

    var newTopArr = Array();
    if (topJson.newtop && topJson.newtop instanceof Array) {

        for (var i = 0; i < topJson.newtop.length; i++) {
            var newtop = topJson.newtop[i];
            if (newtop.fix_position == 1) {
                fix_position = newtop;
                break;
            }
        }

        var loop = 32;//topJson.newtop.length;
        for (var i = 0; i < loop; i++) {
            var newtop = topJson.newtop.shift();
            if (newtop) {
                if (newtop.pk == CONFIG['pkid'])
                    continue;
                newTopArr.push(newtop);
            }
        }

        //小图模板
        for (var i = 0; i < newTopArr.length; i++) {
            var newtop = newTopArr[i];
            if (newtop) {
                html = "<div class='relate'>";
                html += "<a href='" + makeUrlWithArg(newtop.url, { f: CONFIG['req_f'] }) + "'>";
                html += "<span class='relate-title'><div class='topic-title'>" + newtop.title + "</div><div  class='topic-source'>" + newtop.author + "&nbsp;&nbsp;" + newtop.time + "</div></span>";
                if (newtop.cover.url) {
                    // html += "<div class='border'><div class='icon' style='background-image:url(" + newtop.cover.url + ");'></div></div></a></div>";
                    // 图片懒加载
                    html += "<div class='border'><img class='lazy opacity_0 icon' style='object-fit: cover;' data-original='" + newtop.cover.url + "' /></div></a></div>"
                } else {
                    html += "<div class='border'><div class='icon' style='background-color:" + newtop.cover.color + ";background-size: cover;'>" + newtop.cover.font + "</div></div></a></div>";
                }



                tmpArr.push(html);
            }
        }
    }
    //实现3个相关文章，第四个广告
    var dspArr = Array();
    if (topJson.dsp && topJson.dsp instanceof Array) {
        var loop = topJson.dsp.length;
        // 默认模板走新逻辑，其余不变
        if(articleServConf.data.isNormalTemplate) {
            // dsp广告位置输出固定, 最多只输出两条
            loop = articleServConf.recommendConf.data.relLen >= 2 ? 2 : articleServConf.recommendConf.data.relLen;
            if (articleServConf.recommendConf.data.relLen <= 2) {
                //0＜文章数≤2，固定显示在【末位】
                topJson.ad_position = [articleServConf.recommendConf.data.relLen];
                topJson.dsp = [topJson.dsp[0]];
            } else {
                //2＜文章数≤4，固定显示在【第3位、末位】
                topJson.ad_position = ['2', articleServConf.recommendConf.data.relLen + 1];
            }
        }
        for (var i = 0; i < loop; i++) {
            var dsp = topJson.dsp.shift();
            var pos = topJson.ad_position.shift();

            if (dsp) {
                html = "<div class='relate'>";

                // 默认广告tag地址
                var tagImg = '//zkres.myzaker.com/data/image/mark2/ad_2x.png';

                switch (dsp.item_type) {
                    case "3_b":
                        html = "<div class='relate three_pic'>";
                        break;
                    case "1_b":
                        html = "<div class='relate big_pic'>";
                        break;
                    case "1_f":
                        html = "<div class='relate big_pic_notitle'>";
                        tagImg = dsp.tag_image;
                        break;
                    case 1:
                    case "1":
                    default:
                }

                var dsp_stat_info = dsp.dsp_stat_info;

                var id_name = "dsp_id_" + Math.floor(Math.random() * 100000000000);

                html += "<a href='" + dsp.web_url + "' id='" + id_name + "'>";

                // 通过点击统计
                (function (id_name, dsp_stat_info) {
                    setTimeout(function () {
                        $('#' + id_name).click(function () {
                            if (!dsp_stat_info.click_stat_urls) {
                                return;
                            }
                            // 为了防止a标签跳链接导致的统计失败，先统计后走a标签默认逻辑
                            var request = new XMLHttpRequest();
                            request.open('GET', dsp_stat_info.click_stat_urls, false);
                            request.send(null);
                        });

                        // 绑定window的scroll事件，在滚动到当前区域的时候曝光
                        var isTime = 0;
                        var scrollFun = function () {
                            if (isTime) {
                                return;
                            }
                            // 目标元素
                            var tarEle = $('#' + id_name);

                            // 获取元素定位
                            var positionTop = tarEle.parent('.relate').position().top;

                            // 获取元素高度
                            var eleHeight = tarEle.parent('.relate').height();

                            // 当前滚动值
                            var scrolltop = window.scrollTop;

                            // 获取屏幕高度
                            var winHeight = $(window).height();

                            // 当达到滚动值时，添加曝光统计
                            if ((scrolltop + winHeight > eleHeight + positionTop) && (scrolltop < positionTop)) {
                                (new Image()).src = (dsp.stat_read_url || dsp_stat_info.show_stat_urls || "");
                                $(window).off("scroll", scrollFun);
                            }

                            isTime = 1;
                            setTimeout(function () {
                                isTime = 0;
                            }, 500);
                        };
                        $(window).on("scroll", scrollFun);

                        // 曝光逻辑分离
                        // (new Image()).src = (dsp.stat_read_url || dsp_stat_info.show_stat_urls);
                    }, 10);
                })(id_name, dsp_stat_info);

                // html += "<span class='relate-title'><div class='topic-title'>" + dsp.title + "</div><img src='" + (dsp.stat_read_url || dsp_stat_info.show_stat_urls) + "' style='display:none' ><img class='topic-icon' src='"+ tagImg +"' width='23'></span>";
                html += "<span class='relate-title'><div class='topic-title'>" + dsp.title + "</div><img class='topic-icon' src='" + tagImg + "' width='23'></span>";

                if (dsp.img) {
                    // 图片懒加载
                    html += "<div class='border'><img class='lazy opacity_0 icon' style='object-fit: cover;' data-original='" + dsp.img + "' /></div></a></div>";
                    // html += "<div class='border'><div class='icon' style='background:url(" + dsp.img + ");background-size: cover;'></div></div></a></div>";
                } else if (dsp.thumbnail_medias && dsp.thumbnail_medias.length) {
                    dsp.thumbnail_medias.forEach(function (e) {
                        // 图片懒加载
                        // html += "<div class='border'><div class='icon' style='background-image:url(" + e.url + ")'></div></div>";
                        html += "<div class='border'><img class='lazy opacity_0 icon' style='object-fit: cover;' data-original='" + e.url + "' /></div>";
                    });
                } else if (dsp.cover) {
                    html += "<div class='border'><div class='icon' style='background-color:" + dsp.cover.color + ";background-size: cover;'>" + dsp.cover.font + "</div></div></a></div>";
                }

                // 添加收尾
                html += "</a></div>";

                //topJson.top.push(top);
                // dspArr.push(html);
                if(articleServConf.data.isNormalTemplate) {
                    $(html).insertAfter($('#top5').find('.relate').eq(pos - 1));
                } else {
                    $(html).insertBefore($('#top5').find('.relate').eq(pos - 0))
                }
            }
        }
    }

    //相关文章
    var relArr = Array();

    if (topJson.rel && topJson.rel instanceof Array) {

        var loop = 3;
        for (var i = 0; i < loop; i++) {
            var rel = topJson.rel.shift();

            if (rel) {
                html = "<div class='relate'>";
                html += "<a href='" + rel.article.weburl + "'>";
                html += "<span class='relate-title'><div class='topic-title'>" + rel.title + "</div><div  class='topic-source'>" + rel.author + "&nbsp;&nbsp;" + rel.time + "</div></span>";
                if (rel.img) {
                    html += "<div class='border'><div class='icon' style='background:url(" + rel.img + ");background-size: cover;'></div></div></a></div>";
                } else {
                    html += "<div class='border'><div class='icon' style='background-color:" + rel.cover.color + ";background-size: cover;'>" + rel.cover.font + "</div></div></a></div>";
                    //   html += "<div class='border'><div class='icon' style='background-color:#ff6363;background-size: cover;'>光</div></div>";//缺少参数
                }


                relArr.push(html);
            }
        }
    }

    if (tmpArr.length > 0) {
        tmpArr.sort(function () {
            return 0.5 - Math.random()
        });
        if (relArr.length > 0) {

            for (var i = 0; i < relArr.length; i++) {
                tmpArr.splice(i, 0, relArr[i]);
            }

        }
        if (dspArr.length > 0) {
            // 获取位置
            var ad_position = topJson.ad_position;

            // 根据定位设定广告的位置
            if (ad_position && ad_position.length) {
                ad_position.forEach(function (e, i) {
                    tmpArr.splice(e - 1, 0, dspArr[i]);
                });
            } else {
                // 旧的添加位置逻辑
                for (var i = 0; i < dspArr.length; i++) {
                    tmpArr.splice(3 + i * 2, 0, dspArr[i]);
                }
            }
        }

        if (fix_position) {
            var newtop = fix_position;
            var html = "<div class='relate'>";
            html += "<a href='" + makeUrlWithArg(newtop.url, { f: CONFIG['req_f'] }) + "'>";
            html += "<span class='relate-title'><div class='topic-title'>" + newtop.title + "</div><div  class='topic-source'>" + newtop.author + "&nbsp;&nbsp;" + newtop.time + "</div></span>";
            if (newtop.cover.url) {
                html += "<div class='border'><div class='icon' style='background-image:url(" + newtop.cover.url + ");'></div></div></a></div>";
            } else {
                html += "<div class='border'><div class='icon' style='background-color:" + newtop.cover.color + ";background-size: cover;'>" + newtop.cover.font + "</div></div></a></div>";
            }

            tmpArr.splice(3, 1, html);
        }

        html = tmpArr.join("");
        //$("#top5").append(html);
    }

    //    else {
    $('.loading').remove();
    $('.uc-addtop-btn').remove();
    //    }
}

//青柠浏览器的评论框要置顶
if (CONFIG['f'] == 'mycheering') {
    $(".commentInputBox").removeClass('addbottom');
    $(".commentInputBox").addClass('addtop');
}

setTimeout(function () {
    var img = new Image();
    img.src = CONFIG['stat_url'];
}, 1000);
setTimeout(function () {
    var img = new Image();
    img.src = CONFIG['baiduHm'];
}, 1200);
setTimeout(function () {
    var img = new Image();
    img.src = CONFIG['cnzz'];
}, 1400);
//懒加载触犯
setTimeout(function () {
    if ($(window).scrollTop == 0) {
        window.scrollTo(0, 0);
    }
}, 500);


//add by liujinwei 合拼广告接口
var topJson = {};
if (CONFIG['isShowAds']) {


    setTimeout(function () {
        $.ajax({
            type: 'GET',
            url: CONFIG['ad_url'],
            dataType: 'jsonp',
            timeout: 2000,
            success: function (data) {

                getDspAd(data.data.article_bottom.list[0].js_url);

                if (data.data.recommend.length > 0) {
                    var loop = data.data.recommend.length;
                    for (var i = 0; i < loop; i++) {
                        var recommendData = data.data.recommend.shift();
                        if (recommendData.rd_id == 'dsp') {
                            var dspRecommend = recommendData;
                        } else {
                            var relRecommend = recommendData;
                        }
                    }
                    // 默认模板
                    if(articleServConf.data.isNormalTemplate) {
                        var dspLen = articleServConf.recommendConf.data.dspLen = dspRecommend ? (dspRecommend.list ? dspRecommend.list.length : 0) : 0;
                        var relLen = articleServConf.recommendConf.data.relLen = relRecommend ? (relRecommend.list ? relRecommend.list.length : 0) : 0;
                        articleServConf.recommendConf.init(recommendData, dspLen, relLen);
                    }
                }


                if (CONFIG['isTop5']) {
                    setTimeout(function () {

                        if ($.fn.cookie("zaker_my_city_2")) {
                            getLocal($.fn.cookie("zaker_my_city_2"));
                            //getRecommend();
                            getRelateAt(relRecommend);
                            getDspRecommend(dspRecommend);
                        } else {
                            //var url = "article_recommend.php?act=city";
                            var url = makeUrlWithArg(CONFIG['article_recommend_url'], { act: "city" });
                            $.get(url, function (cityname) {
                                var date = new Date();
                                date.setTime(date.getTime() + (2 * 60 * 60 * 1000));
                                $.fn.cookie("zaker_my_city_2", cityname, { path: '/', expires: date });
                                getLocal(cityname);
                                //getRecommend();
                                getRelateAt(relRecommend);
                                getDspRecommend(dspRecommend);
                            })
                        }


                    }, 200);
                }

                if (CONFIG['isRelate']) {
                    $.getJSON(CONFIG['article_relate_url'], function (article) {

                        getRelatedList(article, dspRecommend);
                    });
                }

                if (CONFIG['isWonderful']) {
                    $.getJSON(CONFIG['article_wonderful_url'], function (article) {
                        appendHtmlWonderfulList(article, dspRecommend);
                    });
                }

            },
            error: function (xhr, type) {
                setTimeout(function () {

                    if ($.fn.cookie("zaker_my_city_2")) {
                        getLocal($.fn.cookie("zaker_my_city_2"));
                        getRecommend();

                    } else {
                        //var url = "article_recommend.php?act=city";
                        var url = makeUrlWithArg(CONFIG['article_recommend_url'], { act: "city" });
                        $.get(url, function (cityname) {
                            var date = new Date();
                            date.setTime(date.getTime() + (2 * 60 * 60 * 1000));
                            $.fn.cookie("zaker_my_city_2", cityname, { path: '/', expires: date });
                            getLocal(cityname);
                            getRecommend();

                        })
                    }


                }, 200);
            }
        });
    }, 700);
} else {
    if (CONFIG['isWonderful']) {
        $.getJSON(CONFIG['article_wonderful_url'], function (article) {
            appendHtmlWonderfulList(article, '');
        });
    } else {
        setTimeout(function () {

            if ($.fn.cookie("zaker_my_city_2")) {
                getLocal($.fn.cookie("zaker_my_city_2"));
                //getRecommend();

            } else {
                //var url = "article_recommend.php?act=city";
                var url = makeUrlWithArg(CONFIG['article_recommend_url'], { act: "city" });
                $.get(url, function (cityname) {
                    var date = new Date();
                    date.setTime(date.getTime() + (2 * 60 * 60 * 1000));
                    $.fn.cookie("zaker_my_city_2", cityname, { path: '/', expires: date });
                    getLocal(cityname);
                    // getRecommend();

                })
            }


        }, 200);
    }
}

function appendHtmlWonderfulList(article, dspRecommend) {
    var html = '';

    var wonderfulArticles = article.data;
    for (var index = 0; index < wonderfulArticles.length; index++) {
        //精彩推荐文章
        var val = wonderfulArticles[index];

        if (val) {
            html += "<div class='relate'>";
            html += "<a href='" + makeUrlWithArg(val.url, { f: CONFIG['req_f'] }) + "'>";
            if (val.cover) {
                html += "<span class='relate-title'><div class='topic-title'>" + val.title + "</div><div class='topic-source'>" + val.author + "</div></span>";
            }

            html += "<div class='border'><div class='icon' style='background-image: url(" + val.cover + ");'></div></div></a></div>";
        }
    }

    //dsp广告
    if (dspRecommend.list && dspRecommend.list instanceof Array) {
        var loop = 1;
        for (var i = 0; i < loop; i++) {
            var dsp = dspRecommend.list.shift();

            if (dsp) {
                html += "<div class='relate'>";
                html += "<a href='" + dsp.web_url + "'>";
                html += "<span class='relate-title'><div class='topic-title'>" + dsp.title + "</div><img src='" + dsp.stat_read_url + "' style='display:none' ><img class='topic-icon' src='//zkres.myzaker.com/data/image/mark/ad_2x.png' width='23'></span>";
                if (dsp.img) {
                    html += "<div class='border'><div class='icon' style='background:url(" + dsp.img + ");background-size: cover;'></div></div>";
                } else {
                    html += "<div class='border'><div class='icon' style='background-color:" + dsp.cover.color + ";background-size: cover;'>" + dsp.cover.font + "</div></div>";
                    // html += "<div class='border'><div class='icon' style='background-color:#ff6363;background-size: cover;'>光</div></div>";   //缺少参数
                }

                html += "</div>";

            }
        }
    }

    $('#top5').append(html);
    $('.loading').remove();
    $('.uc-addtop-btn').remove();
}

//获取大图广告
function getDspAd(ad_url) {
    var adScriptdom = document.createElement('script');
    adScriptdom.type = 'text/javascript';
    adScriptdom.src = ad_url;
    document.body.appendChild(adScriptdom);
}
//相关推荐列表
function getRelatedList(article, dspRecommend) {
    var html = '';
    //dsp广告
    if (dspRecommend.list && dspRecommend.list instanceof Array) {
        var loop = 1;
        for (var i = 0; i < loop; i++) {
            var dsp = dspRecommend.list.shift();

            if (dsp) {
                html += "<div class='relate'>";
                html += "<a href='" + dsp.web_url + "'>";
                if (dsp.img) {
                    html += "<div class='border'><div class='icon' style='background:url(" + dsp.img + ");background-size: cover;'></div></div>";
                } else {
                    html += "<div class='border'><div class='icon' style='background-color:" + dsp.cover.color + ";background-size: cover;'>" + dsp.cover.font + "</div></div>";
                    // html += "<div class='border'><div class='icon' style='background-color:#ff6363;background-size: cover;'>光</div></div>";   //缺少参数
                }

                html += "<span class='relate-title'><div class='topic-title'>" + dsp.title + "</div><img src='" + dsp.stat_read_url + "' style='display:none' ><img class='topic-icon' src='//zkres.myzaker.com/data/image/mark/ad_2x.png' width='23'></span></a></div>";

            }
        }
    }

    //相关文章
    if (article.rel && article.rel instanceof Array) {

        var loop = article.rel.length;
        for (var i = 0; i < loop; i++) {
            var rel = article.rel.shift();

            if (rel) {
                html += "<div class='relate'>";
                html += "<a href='" + makeUrlWithArg(rel.url, { f: CONFIG['req_f'] }) + "'>";
                if (rel.cover.url) {
                    html += "<div class='border'><div class='icon' style='background-image:url(" + rel.cover.url + ");'></div></div>";
                } else {
                    html += "<div class='border'><div class='icon' style='background-color:" + rel.cover.color + ";background-size: cover;'>" + rel.cover.font + "</div></div>";
                }

                html += "<span class='relate-title'><div class='topic-title'>" + rel.title + "</div></span></a></div>";
            }
        }
    }

    $("#relate5").append(html);
    $('.loading').remove();
    $('.uc-addtop-btn').remove();
}

//相关文章
function getRelateAt(data) {
    //改造新top5
    return '';
    if (data) {
        topJson.rel = data.list;
    } else {
        topJson.rel = [];
    }

    getFinish();
}
function getLocal(cityname) {
    //var url = "article_recommend.php?act=local&name="+cityname;
    //暂停本地文章
    return;
    var url = makeUrlWithArg(CONFIG['article_recommend_url'], { act: "local", name: cityname });
    $.getJSON(url, function (data) {
        topJson.local = data.local;
        getFinish();
    })
}

function getRecommend() {
    //var url = "article_recommend.php";
    var url = makeUrlWithArg(CONFIG['article_recommend_url'], { act: "relate", pk: CONFIG['pkid'], app_id: CONFIG['app_id'] });
    $.getJSON(url, function (data) {
        //改造新top5
        //            topJson.top = data.top;
        //            topJson.topic = data.topic;

        topJson.newtop = data.newtop;
        getFinish();
    });
}

function getDspRecommend(data) {

    if (data) {
        topJson.dsp = data.list;

        // 判断是否有位置信息
        if (data.ad_position) {
            topJson.ad_position = data.ad_position;
        }

    } else {
        topJson.dsp = [];

    }
    getFinish();
}

function getFinish() {
    if (((topJson.top || topJson.topic) && topJson.local) || true) {
        //打乱数组
        if (topJson.rel && typeof (topJson.rel) != 'undefined') {
            topJson.rel.sort(function () {
                return 0.5 - Math.random()
            });

        }


        if (topJson.topic && typeof (topJson.topic) != 'undefined') {
            var first = topJson.topic.shift();
            topJson.topic.sort(function () {
                return 0.5 - Math.random()
            });
            topJson.topic.unshift(first);
        }

        if (topJson.top && typeof (topJson.top) != 'undefined') {
            topJson.top.sort(function () {
                return 0.5 - Math.random()
            });

        }
        if (topJson.local && typeof (topJson.local) != 'undefined') {
            topJson.local.sort(function () {
                return 0.5 - Math.random()
            });
        }

        if (topJson.picture && typeof (topJson.picture) != 'undefined') {
            if (topJson.picture[0] && topJson.picture[1]) {
                var r0 = parseInt(topJson.picture[0].length * Math.random());
                var r1 = parseInt(topJson.picture[1].length * Math.random());
                topJson.picture[0] = topJson.picture[0][r0];
                topJson.picture[1] = topJson.picture[1][r1];
            }
        }

        addHtml();
        if (!CONFIG['isTopBtn']) {
            $(window).scroll(function () {
                if ($(document).height() - $(this).scrollTop() - document.body.clientHeight < 100) {
                    //addHtml();
                }
            })
        } else {
            $(".uc-addtop-btn").click(function () {
                addHtml();
            })
        }
    }
}

$(function(){
    // H5打开小程序，需要微信环境 7.0.12 以上
    if(checkWechatVersion('7.0.12')){
        // 用高度的方式隐藏，有可能 zkTopBar_v2.js 执行比这里慢
        $('.zk_top_barwrap').css({'height':'0','overflow':'hidden'});
        $(".fixed-comment-bottom-bar").hide()

        // 显示底部黑色条 打开小程序部分
        $("#openapplest").show()

        window.onresize = function(){
            // ix 微信环境下，有底部返回条的时候 innerHeight 为 721
            if(isIphonex() && window.innerHeight >= 725){
                $("#openapplest").addClass('padding-bottom')
            }else{
                $("#openapplest").removeClass('padding-bottom')
            }
        }
        if(isIphonex() && window.innerHeight >= 725){
            $("#openapplest").addClass('padding-bottom')
        }

        // 评论区添加class标识 打开小程序用
        $("#commentListWrapper").addClass('openapplest')
        
        // 评论弹窗 - 打开小程序
        // 继续沿用nologin的样式，加了一层判断
        $(".comment-modal-wrapper").addClass('nologin').addClass('openapplest').find('textarea').hide()
    }
})

function isIphonex() {
    if (typeof window !== 'undefined' && window) {
      return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
    }
    return false;
}


/**
 * 检测微信版本号
 * @param {*} version 要判断的版本号  非必填  不填则返回是否微信环境
 * 版本号可以指定最大的版本，比如微信版本7以上的，传入7即可
 */
function checkWechatVersion(version) {
    // 添加调试判断
    
    var ua = navigator.userAgent.toLowerCase();
    var isWechat = ua.match(/MicroMessenger/i) == "micromessenger";
    if(isWechat && version){
        var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)
        var wechatVersion = []
        var versionArr = version.split('.')
        if(wechatInfo instanceof Array){
            wechatVersion = wechatInfo[1].split('.')
        }

        var versionWeights = 0
        var wechatWeights = 0
        
        // 最高的权限由最长的版本号决定 
        // 比如 7.0.0  和 7.0.0.12 版本对比，根据7.0.0.12生成权重。这样才能保证权重的10位够除
        var versionLength = versionArr.length > wechatVersion.length ? versionArr.length : wechatVersion.length
        var weights = Math.pow(10, versionLength)
        
        for(var i = 0; i < versionLength; i++){
            var verItem = parseInt(versionArr[i] || '0')
            var weItem = parseInt(wechatVersion[i] || '0')
            // 2个版本号相等的情况2边都不增加权重
            if(verItem > weItem) versionWeights += weights
            else if(weItem > verItem) wechatWeights += weights
            weights = weights / 10
        }

        // 微信版本权重高于传入的版本，则表示已经达到最低运行版本要求
        return wechatWeights >= versionWeights
    }
    return isWechat
}

