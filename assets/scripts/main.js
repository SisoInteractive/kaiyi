// Created by sam mok 2015(Siso brand interactive team).

"use strict";

//  limit browser drag move
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
},true);

var app = {
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

        $(window).on('load', resetVideoSize).on('resize', resetVideoSize);

        function resetVideoSize () {
            //  init video size
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
                $('.loading').addClass('leave');

                //  init video01
                $('.poster').addClass('show');
                $('.videobox01').addClass('active');
                var video01 = $('.video01')[0];
                video01.addEventListener("timeupdate", initVideo1, false);
                video01.play();

                //  play bgm
                $('#audio')[0].play();

                //  go to Create process
                setTimeout(function () {
                    $('.video01')[0].pause();

                    setTimeout(function () {
                        $('.loading').remove();
                        app.create();
                    }, 500)
                }, 200);

                function initVideo1(){
                    if (video01.currentTime > 0){
                        $(".poster").hide().css({'background-image': 'url("assets/images/video02-poster.png")'});
                        video01.removeEventListener("timeupdate", initVideo1);
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
        $('.scene01').remove();

        //  init video02
        $('.videobox02').addClass('active');
        var video02 = $('.video02')[0];
        video02.addEventListener("timeupdate", initVideo2, false);
        $('.poster').show();
        //video02.playbackRate = 4;
        video02.play();

        setTimeout(function () {
            $('.video02')[0].pause();

            setTimeout(function () {
                $('.video02')[0].play();
            }, 100)
        }, 200);


        var isInited = false;
        var isArrowShown = false;
        function initVideo2(){
            if (!isInited && video02.currentTime > 0){
                $(".poster").hide().css({'background-image': 'url("assets/images/video03-poster.png")'});
                isInited = true;
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

            setTimeout(function () {
                $('.video03')[0].pause();

                // main
                setTimeout(function () {
                    $('.videobox02, .scene03').remove();
                    $('.video03')[0].play();
                }, 100)
            }, 200);

            function initVideo3(){
                if (video03.currentTime > 0){
                    $(".poster").hide();
                    $('.bg').css({'background-image': 'url("assets/images/bg-countdown.jpg")'});
                    video03.removeEventListener("timeupdate", initVideo3);
                }
            }

            //  event when video02 end
            $('.video03').one('ended', function () {
                $('.videobox03').remove();

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

                // new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
                window.setInterval(function(){countdown(new Date(2016,5-1,26, 2,0,0));}, 1000);
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
      }
    },

    start: function (){
        this.preload();
    }
};


$(function (){
    // init app
    app.start();
    //app.debug('video01');
    console.log('app started success...');
});
