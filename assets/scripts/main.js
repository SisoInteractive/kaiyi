// Created by sam mok 2015(Siso brand interactive team).

"use strict";

//  limit browser drag move
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
},true);

var app = {
    version: 'reporter',

    browser: {
        versions: function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                webKit: u.indexOf('AppleWebKit') > -1,
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                weixin: u.indexOf('MicroMessenger') > -1,
                txnews: u.indexOf('qqnews') > -1,
                sinawb: u.indexOf('weibo') > -1,
                mqq   : u.indexOf('QQ') > -1
            };
        }(),
        language:(navigator.browserLanguage || navigator.language).toLowerCase()
    },

    preload: function () {
        //  preload images
        var images = [
            'bg-paper.png',
            'bg-scene01.jpg',
            'bg-scene03.jpg',
            'bg-countdown.jpg',
            'video02-poster.png',
            'video03-poster.png',
            'scene01-arrow.png',
            'scene01-throw-plan.png',
            'scene01-tips.png'
        ];
        var amount = images.length;
        var loaded = 0;

        images.forEach(function (path) {
            var img = new Image();
            img.addEventListener('load', preloadImg);
            img.src = "assets/images/" + path;

            function preloadImg () {
                //  check process
                loaded++;
                if (checkProcess()) {
                    $('.loading-text .counter').text('点击小飞机');
                    $('.loading-text .status').text('Finished');
                    startProcess();
                    $('.bg').css({'background-image': 'url("assets/images/bg-scene01.jpg")'});
                    $('.scene01 .plain').attr('src', 'assets/images/scene01-throw-plan.png');
                    $('.scene01 .tips img').attr('src', 'assets/images/scene01-tips.png');
                    $('.scene01 .arrow').attr('src', 'assets/images/scene01-arrow.png');
                }
            }

        });

        function checkProcess () {
            $('.loading-text  .counter').text(Math.floor(loaded / amount * 100) + '%');
            return loaded / amount == 1;
        }

        //  event when resize
        $(window).on('load', resizeContent).on('resize', resizeContent);

        function resizeContent () {
            var cw = document.documentElement.clientWidth;
            var ch = document.documentElement.clientHeight;

            $('.videobox video').each(function () {
                $(this).css({minHeight: ch, maxHeight: ch});
            });

            $('body').css({"width": Math.floor((ch*0.6213592233009708))});
        }

        //  start button
        function startProcess () {
            $('.loading-plain').one('touchstart', function () {

                //  init video01
                $('.poster').addClass('show');
                $('.videobox01').addClass('active');
                var video01 = $('.video01')[0];
                video01.addEventListener("timeupdate", initVideo1, false);
                video01.play();

                //  play bgm
                $('#audio')[0].play();

                function initVideo1(){
                    if (video01.currentTime > 0){
                        $('.loading').addClass('leave');
                        $('.video01')[0].pause();
                        $(".poster").hide().css({'background-image': 'url("assets/images/video02-poster.png")'});
                        video01.removeEventListener("timeupdate", initVideo1);

                        //  go to Create process
                        setTimeout(function () {
                            $('.loading').remove();
                            app.create();
                        }, 900);
                    }
                }
            });
        }
    },

    create: function (){
        var video01 = $('.video01')[0];
        //video01.playbackRate = 4;
        video01.play();

        //  call when video01 end
        $('.video01').one('ended', function () {
            $('.videobox01').addClass('leave');
            $('.bg').addClass('active');

            setTimeout(function () {
                $('.videobox01').remove();
                $('.scene01').addClass('active');

                // bind start btn for scene02
                $('.tips').one('touchstart', app.startScene02);
            }, 900)
        });

        //  remove unused elements
        $('.loading').remove();
    },

    startScene02: function () {
        //  init video02
        $('.videobox02').addClass('active');
        var video02 = $('.video02')[0];
        video02.addEventListener("timeupdate", initVideo2, false);
        $('.poster').show();
        $('.scene01').remove();
        //video02.playbackRate = 4;
        video02.play();

        var isInited = false;
        var isArrowShown = false;
        function initVideo2(){
            if (!isInited && video02.currentTime > 0){
                $('.video02')[0].pause();
                $(".poster").hide().css({'background-image': 'url("assets/images/video03-poster.png")'});
                isInited = true;

                setTimeout(function () {
                    $('.video02')[0].play();
                }, 300);
            }

            if (!isArrowShown && video02.currentTime > 18) {
                //  show arrow
                $('.page-arrow').addClass('active');
                isArrowShown = true;
                //  bind start btn for scene03
                $('.video02').one('touchstart', app.startScene03);
            }
        }

        //  event when video02 end
        //$('.video02').one('ended', function () {
        //
        //});
    },

    startScene03: function () {
        $('.videobox02').addClass('leave');
        $('.scene03').addClass('active');

        //  remove arrow
        $('.page-arrow').removeClass('active');

        setTimeout(function () {
            $('.videobox02').remove();
        }, 900);

        //  init form
        var heightRate = $('body')[0].clientHeight / 603;
        var widthRate = $('body')[0].clientWidth / 375;

        if (app.version == "reporter") {
            $('.message').css({
                width: 470/2 * widthRate + 'px',
                height: 175/2 * heightRate + 'px',
                lineHeight: 42/2 * heightRate + 'px',
                fontSize: 32/2 * heightRate + 'px',
                marginTop: 257/2 * heightRate + 'px',
                marginLeft: 133/2 * widthRate + 'px'
            });

            $('.name').css({
                width: 244/2 * widthRate + 'px',
                height: 42/2 * heightRate + 'px',
                lineHeight: 42/2 * heightRate + 'px',
                fontSize: 28/2 * heightRate + 'px',
                marginTop: 107/2 * heightRate + 'px',
                marginLeft: 300/2 * widthRate + 'px'
            });

            $('.phone').css({
                width: 244/2 * widthRate + 'px',
                height: 42/2 * heightRate + 'px',
                lineHeight: 42/2 * heightRate + 'px',
                fontSize: 28/2 * heightRate + 'px',
                marginLeft: 300/2 * widthRate + 'px'
            });

        } else if (app.version == "person") {
            $('.name').css({
                width: 244/2 * widthRate + 'px',
                height: 42/2 * heightRate + 'px',
                lineHeight: 42/2 * heightRate + 'px',
                fontSize: 28/2 * heightRate + 'px',
                marginTop: 107/2 * heightRate + 'px',
                marginLeft: 300/2 * widthRate + 'px'
            });

            $('.phone').css({
                width: 244/2 * widthRate + 'px',
                height: 42/2 * heightRate + 'px',
                lineHeight: 42/2 * heightRate + 'px',
                fontSize: 28/2 * heightRate + 'px',
                marginLeft: 300/2 * widthRate + 'px'
            });
        }

        $('.submit').css({
            width: 255/2 * widthRate + 'px',
            height: 255/2 * heightRate + 'px',
            lineHeight: 42/2 * heightRate + 'px',
            fontSize: 28/2 * heightRate + 'px',
            bottom: 118/2 * heightRate + 'px',
            left: 227/2 * widthRate + 'px'
        });

        $('.submit').on('touchstart', function () {
            //  verify data
            var nameReg = /[\u4e00-\u9fa5a-zA-Z ]+/;
            var phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (!nameReg.test($('.name').val())) {
                alert("您输入的姓名格式有误");
                $('.name').focus();
                return ;
            }
            if (!phoneReg.test($('.phone').val())) {
                alert("您输入的手机格式有误");
                $('.phone').focus();
                return;
            }

            //  TODO: send data to server
            //

            //  init video03
            $('.scene03').addClass('leave');
            $('.videobox03').addClass('active');
            var video03 = $('.video03')[0];
            video03.addEventListener("timeupdate", initVideo3, false);
            $('.bg').css({'background-image': 'url("assets/images/video03-poster.png")'});
            $('.poster').show();
            video03.play();

            function initVideo3(){
                if (video03.currentTime > 0){
                    $('.video03')[0].pause();
                    $(".poster").hide();
                    $('.bg').css({'background-image': 'url("assets/images/bg-countdown.jpg")'});
                    video03.removeEventListener("timeupdate", initVideo3);

                    // main
                    setTimeout(function () {
                        $('.videobox02, .scene03').remove();
                        $('.video03')[0].play();
                    }, 100)
                }
            }

            //  event when video02 end
            $('.video03').one('ended', function () {
                $('.videobox03').remove();
                $('.counter').addClass('active');

                var day = $('.day');
                var hours = $('.hours');
                var minus = $('.minus');
                var seconds = $('.seconds');

                //  init counter ui
                var heightRate = $('body')[0].clientHeight / 603;
                var widthRate = $('body')[0].clientWidth / 375;
                $('.counter span').css({
                    'top': (261 * heightRate + 'px'),
                    fontSize: (35/2 * heightRate + 'px'),
                    left: (185/2 * widthRate + 'px'),
                    width: (58/2 * widthRate + 'px'),
                    height: (58/2 * heightRate + 'px'),
                    lineHeight: (54/2 * heightRate + 'px')
                });

                hours.css({left: (282/2 * widthRate + 'px')});
                minus.css({left: (380/2 * widthRate + 'px')});
                seconds.css({left: (477/2 * widthRate + 'px')});

                //  run countdown
                // new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
                window.setInterval(function(){countdown(new Date(2016,5-1,26, 2,0,0));}, 1000);

                function countdown(endDate)
                {
                    var now = new Date();
                    var leftTime = endDate.getTime()-now.getTime();
                    var leftsecond = parseInt(leftTime/1000);
                    var day = Math.floor(leftsecond/(60*60*24));
                    var hour = Math.floor((leftsecond-day*24*60*60)/3600);
                    var minute = Math.floor((leftsecond-day*24*60*60-hour*3600)/60);
                    var second = Math.floor(leftsecond-day*24*60*60-hour*3600-minute*60);
                    console.log("还有："+day+"天"+hour+"小时"+minute+"分"+second+"秒");
                }
            });
        });
    },

    debug: function (index) {
      switch (index) {
          case 1:
              $('.scene01').css({zIndex: 1000}).addClass('active');
              break;
          case 2:
              break;
          case 3:
              $('.scene03').css({zIndex: 1000}).addClass('active');
              break;
          case 'video01':
              $('.videobox01').addClass('active').css({zIndex: 10000});
              break;
          case 'counter':
              var cw = document.documentElement.clientWidth;
              var ch = document.documentElement.clientHeight;

              $('.videobox video').each(function () {
                  $(this).css({minHeight: ch, maxHeight: ch});
              });

              $('body').css({"width": Math.floor((ch*0.6213592233009708))});

              $('.counter').css({'background-image': 'url("assets/images/bg-countdown.jpg")'});
              var day = $('.day');
              var hours = $('.hours');
              var minus = $('.minus');
              var seconds = $('.seconds');

              var heightRate = $('body')[0].clientHeight / 603;
              var widthRate = $('body')[0].clientWidth / 375;
              $('.counter span').css({
                  'top': (261 * heightRate + 'px'),
                  fontSize: (35/2 * heightRate + 'px'),
                  left: (185/2 * widthRate + 'px'),
                  width: (58/2 * widthRate + 'px'),
                  height: (58/2 * heightRate + 'px'),
                  lineHeight: (54/2 * heightRate + 'px')
              });

              hours.css({left: (282/2 * widthRate + 'px')});
              minus.css({left: (380/2 * widthRate + 'px')});
              seconds.css({left: (477/2 * widthRate + 'px')});

              // new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
              window.setInterval(function(){countdown(new Date(2016,5-1,30, 2,0,0), day, hours, minus, seconds);}, 1000);
              break;
      }

        function countdown(endDate, date, hours, minus, seconds)
        {
            var now = new Date();
            var leftTime = endDate.getTime()-now.getTime();
            var leftsecond = parseInt(leftTime/1000);
            var day = Math.floor(leftsecond/(60*60*24));
            var hour = Math.floor((leftsecond-day*24*60*60)/3600);
            var minute = Math.floor((leftsecond-day*24*60*60-hour*3600)/60);
            var second = Math.floor(leftsecond-day*24*60*60-hour*3600-minute*60);
            date.text(day);
            hours.text(hour);
            minus.text(minute);
            seconds.text(second);
        }
    },

    start: function (){
        this.preload();
    }
};


$(function (){
    // init app
    app.start();
    //app.debug('counter');
    console.log('app started success...');


});
