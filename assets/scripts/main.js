// Created by sam mok 2015(Siso brand interactive team).

"use strict";

//  limit browser drag move
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
},true);

var app = {
    version: 'reporter',
    //version: 'person',

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
            'bg-paper.jpg',
            'bg-scene01.jpg',
            'bg-countdown.jpg',
            'new03-video02-poster.jpg',
            'video03-poster.jpg',
            'scene01-arrow.png',
            'scene01-throw-plan.png',
            'scene01-tips.png'
        ];
        var amount = images.length;
        var loaded = 0;

        images.forEach(function (path) {
            var img = new Image();
            img.addEventListener('load', preloadImg);
            img.src = "http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-" + path;

            function preloadImg () {
                //  check process
                loaded++;
                if (checkProcess()) {
                    prestartProcess();

                    //  init another
                    $('.bg').css({'background-image': 'url("http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-bg-scene01.jpg")'});
                    $('.scene01 .plain').attr('src', 'http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-scene01-throw-plan.png');
                    $('.scene01 .arrow').attr('src', 'http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-scene01-arrow.png');
                    $('.scene03').css({backgroundImage: 'url("http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-bg-scene03' + (app.version=="reporter"? "-reporter": "-person") + '.jpg")'});
                    if (app.browser.versions.ios) {
                        $('.throw-plain .tips img').attr('src', 'http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-scene01-tips.png');
                    } else {
                        $('.throw-plain .tips img').attr('src', 'http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-scene01-tips-android.png');
                    }
                }
            }

        });

        function checkProcess () {
            $('.loading-counter').text(Math.floor(loaded / amount * 100) + '%');
            return loaded / amount == 1;
        }

        //  event when resize
        $(window).on('load', resizeContent).on('resize', resizeContent);

        function resizeContent () {
            var cw = document.documentElement.clientWidth;
            var ch = document.documentElement.clientHeight;

            $('.videobox video').each(function () {
                $(this).css({minHeight: ch+1, maxHeight: ch+1});
            });

            $('body').css({"width": Math.floor((ch*0.6213592233009708))});
        }

        //  start button
        function prestartProcess () {
            $('.loading-counter').text('点击小飞机');
            $('.loading-text .status').text('Finished');

            $('.loading-plain').one('touchstart', function () {

                //  init video01
                $('.poster').addClass('show');
                $('.videobox01').addClass('active');
                var video01 = $('.video01')[0];
                video01.addEventListener("timeupdate", initVideo1, false);
                video01.play();

                //  play bgm
                $('.audio01')[0].play();

                function initVideo1(){
                    if (video01.currentTime > 0){
                        $('.loading').addClass('leave');
                        $('.video01')[0].pause();
                        $(".poster").hide().css({'background-image': 'url("http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-new03-video02-poster.jpg")'});
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


                //  if ios, shake device to throw plain,
                //  other os, click button to throw plain
                if (app.browser.versions.ios) {
                    var myShakeEvent = new Shake({
                        threshold: 5, // optional shake strength threshold
                        timeout: 700 // optional, determines the frequency of event generation
                    });
                    myShakeEvent.start();

                    window.addEventListener('shake', shakeHandler, false);

                    function shakeHandler () {
                        //  pause bgm
                        $('.audio01').remove();
                        !app.isStartScene02 && app.startScene02();
                        app.isStartScene02 = true;
                        window.removeEventListener('shake', shakeHandler, false);
                    }
                } else {
                    // bind start btn for scene02
                    $('.throw-plain').one('touchstart', function () {
                        //  pause bgm
                        $('.audio01').remove();
                        !app.isStartScene02 && app.startScene02();
                        app.isStartScene02 = true;
                    });
                }
            }, 900)
        });

        //  remove unused elements
        $('.loading').remove();
    },

    isStartScene02: false,

    startScene02: function () {
        $('.audio02')[0].play();

        //  init video02
        $('.poster').show();
        $('.videobox02').addClass('active');
        var video02 = $('.video02')[0];
        video02.addEventListener("timeupdate", initVideo2, false);
        $('.scene01').remove();
        //video02.playbackRate = 4;
        video02.play();

        var isInited = false;
        function initVideo2(){
            if (!isInited && video02.currentTime > 0){
                $('.video02')[0].pause();
                $(".poster").hide().css({'background-image': 'url("http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-video03-poster.jpg")'});
                isInited = true;

                setTimeout(function () {
                    $('.video02')[0].play();
                }, 200);
            }

            if (video02.currentTime > 19) {
                //  show arrow
                $('.page-arrow').addClass('active');
                //  bind start btn for scene03
                $('.videobox02').one('touchstart', app.startScene03);
            }
        }
    },

    startScene03: function () {
        $('.videobox02').addClass('leave');
        $('.scene03').addClass('active');

        //  remove arrow
        $('.page-arrow').remove();

        setTimeout(function () {
            $('.videobox02').remove();
        }, 900);

        //  init form
        initUI();
        window.addEventListener('resize', initUI);

        $(".name").on('keyup', function (e) {
            if (e.keyCode == 13) $('.phone').focus();
        });

        $(".phone").on('keyup', function (e) {
            if (e.keyCode == 13) $('.submit').focus();
        });

        $('.submit').on('touchstart', function () {
            $('.submit').focus();

            //  pause bgm
            $('.audio02')[0].pause();

            //  play bgm03
            $('.audio03')[0].play();

            //  verify data
            var nameReg = /[\u4e00-\u9fa5a-zA-Z ]+/;
            var phoneReg = /.{6,}/;
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

            //  send data to server
            if (app.version == 'reporter') {
                $.post('http://h5.stardo.com.cn/kaiyi201606/form-media.php?callback?', {
                    message: $('.message').val() || '',
                    username: $('.name').val() || '',
                    telephone: $('.phone').val() || ''
                }, function (response) {
                    console.log('data send:', response);
                });
            } else {
                $.post('http://h5.stardo.com.cn/kaiyi201606/form.php?callback?', {
                    username: $('.name').val() || '',
                    telephone: $('.phone').val() || ''
                }, function (response) {
                    console.log('data send:', response);
                });
            }
            //if (app.version == 'reporter') {
            //    $.post('http://sisobrand.com:1361/reporter', {
            //        message: $('.message').val() || '',
            //        name: $('.name').val() || '',
            //        phone: $('.phone').val() || ''
            //    }, function (response) {
            //        console.log('data send:', response);
            //    });
            //} else {
            //    $.post('http://sisobrand.com:1361/person', {
            //        name: $('.name').val() || '',
            //        phone: $('.phone').val() || ''
            //    }, function (response) {
            //        console.log('data send:', response);
            //    });
            //}

            //  init video03
            $('.scene03').addClass('leave').css({zIndex: 2000});
            $('.bg').css({'background-image': 'url("http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-video03-poster.jpg")'});
            $('.poster').show();
            $('.videobox03').addClass('active');
            var video03 = $('.video03')[0];
            video03.addEventListener("timeupdate", initVideo3, false);
            video03.play();

            function initVideo3(){
                if (video03.currentTime > 0){
                    $('.video03')[0].pause();
                    $('.audio02').remove();
                    $(".poster").hide();
                    $('.bg').removeClass('active').css({'background-image': 'url("http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-bg-countdown.jpg")'});
                    video03.removeEventListener("timeupdate", initVideo3);

                    // main
                    setTimeout(function () {
                        $('.bg').addClass('prepare');
                        $('.videobox02, .scene03').remove();
                        $('.video03')[0].play();
                    }, 1000)
                }
            }

            //  event when video02 end
            $('.video03').one('ended', function () {
                $('.counter, .bg').addClass('active');

                setTimeout(function () {
                    $('.videobox03').remove();
                }, 700);

                var day = $('.day');
                var hours = $('.hours');
                var minus = $('.minus');
                var seconds = $('.seconds');

                //  init UI
                initUI();
                window.addEventListener('resize', initUI);

                // new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
                countdown(new Date(2016,6-1,20, 19,45,0), day, hours, minus, seconds);
                window.setInterval(function(){countdown(new Date(2016,6-1,20, 19,45,0), day, hours, minus, seconds);}, 1000);

                function countdown(endDate, date, hours, minus, seconds) {
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

                function initUI () {
                    var heightRate = $('body')[0].clientHeight / 603;
                    var widthRate = $('body')[0].clientWidth / 375;
                    $('.counter span').css({
                        'top': (229 * heightRate + 'px'),
                        left: (182/2 * widthRate + 'px'),
                        width: (58/2 * widthRate + 'px'),
                        height: (58/2 * heightRate + 'px'),
                        lineHeight: (54/2 * heightRate + 'px'),
                        fontSize: (35/2 * heightRate + 'px')
                    });

                    hours.css({left: (281/2 * widthRate + 'px')});
                    minus.css({left: (379/2 * widthRate + 'px')});
                    seconds.css({left: (477/2 * widthRate + 'px')});
                }
            });
        });

        function initUI () {
            var heightRate = $('body')[0].clientHeight / 603;
            var widthRate = $('body')[0].clientWidth / 375;

            if (app.version == "reporter") {
                $('.message').show().css({
                    width: 522/2 * widthRate + 'px',
                    height: 195/2 * heightRate + 'px',
                    lineHeight: 42/2 * heightRate + 'px',
                    fontSize: 28/2 * heightRate + 'px',
                    marginTop: 255/2 * heightRate + 'px',
                    marginLeft: 112/2 * widthRate + 'px'
                });

                $('.name').css({
                    width: 260/2 * widthRate + 'px',
                    height: 87/2 * heightRate + 'px',
                    lineHeight: 87/2 * heightRate + 'px',
                    fontSize: 28/2 * heightRate + 'px',
                    marginTop: 90/2 * heightRate + 'px',
                    marginLeft: 315/2 * widthRate + 'px'
                });

                $('.phone').css({
                    width: 244/2 * widthRate + 'px',
                    height: 87/2 * heightRate + 'px',
                    lineHeight: 87/2 * heightRate + 'px',
                    fontSize: 28/2 * heightRate + 'px',
                    marginLeft: 315/2 * widthRate + 'px'
                });

            }

            else if (app.version == "person") {
                $('.name').css({
                    width: 214/2 * widthRate + 'px',
                    height: 57/2 * heightRate + 'px',
                    lineHeight: 57/2 * heightRate + 'px',
                    fontSize: 28/2 * heightRate + 'px',
                    marginTop: 318/2 * heightRate + 'px',
                    marginLeft: 326/2 * widthRate + 'px'
                });

                $('.phone').css({
                    width: 214/2 * widthRate + 'px',
                    height: 57/2 * heightRate + 'px',
                    lineHeight: 57/2 * heightRate + 'px',
                    fontSize: 28/2 * heightRate + 'px',
                    marginLeft: 326/2 * widthRate + 'px'
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
        }

    },

    debug: function (index) {
        var cw = document.documentElement.clientWidth;
        var ch = document.documentElement.clientHeight;

        $('.videobox video').each(function () {
            $(this).css({minHeight: ch+1, maxHeight: ch+1});
        });

        $('body').css({"width": Math.floor((ch*0.6213592233009708))});

        switch (index) {
          case 1:
              $('.scene01').css({zIndex: 1000}).addClass('active');
              break;
          case 2:
              break;
          case 3:
              $('.loading').remove();
              $('.scene03').css({zIndex: 1000}).addClass('active');

              //  init form
              initUI();
              window.addEventListener('resize', initUI);

              function initUI () {
                  var heightRate = $('body')[0].clientHeight / 603;
                  var widthRate = $('body')[0].clientWidth / 375;

                  if (app.version == "reporter") {
                      $('.message').show().css({
                          width: 522/2 * widthRate + 'px',
                          height: 195/2 * heightRate + 'px',
                          lineHeight: 42/2 * heightRate + 'px',
                          fontSize: 28/2 * heightRate + 'px',
                          marginTop: 255/2 * heightRate + 'px',
                          marginLeft: 112/2 * widthRate + 'px'
                      });

                      $('.name').css({
                          width: 260/2 * widthRate + 'px',
                          height: 87/2 * heightRate + 'px',
                          lineHeight: 87/2 * heightRate + 'px',
                          fontSize: 28/2 * heightRate + 'px',
                          marginTop: 90/2 * heightRate + 'px',
                          marginLeft: 315/2 * widthRate + 'px'
                      });

                      $('.phone').css({
                          width: 244/2 * widthRate + 'px',
                          height: 87/2 * heightRate + 'px',
                          lineHeight: 87/2 * heightRate + 'px',
                          fontSize: 28/2 * heightRate + 'px',
                          marginLeft: 315/2 * widthRate + 'px'
                      });

                  }
                  //  TODO: needs to rewrite below UI position
                  else if (app.version == "person") {
                      $('.name').css({
                          width: 214/2 * widthRate + 'px',
                          height: 57/2 * heightRate + 'px',
                          lineHeight: 57/2 * heightRate + 'px',
                          fontSize: 28/2 * heightRate + 'px',
                          marginTop: 318/2 * heightRate + 'px',
                          marginLeft: 326/2 * widthRate + 'px'
                      });

                      $('.phone').css({
                          width: 214/2 * widthRate + 'px',
                          height: 57/2 * heightRate + 'px',
                          lineHeight: 57/2 * heightRate + 'px',
                          fontSize: 28/2 * heightRate + 'px',
                          marginLeft: 326/2 * widthRate + 'px'
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
              }

              $(".name").on('keyup', function (e) {
                  if (e.keyCode == 13) $('.phone').focus();
              });

              $(".phone").on('keyup', function (e) {
                  if (e.keyCode == 13) $('.submit').focus();
              });
              break;
          case 'video01':
              $('.videobox01').addClass('active').css({zIndex: 10000});
              break;
          case 'counter':
              $('.counter').css({'background-image': 'url("http://7xp6iq.com1.z0.glb.clouddn.com/kaiyi-bg-countdown.jpg")'});
              var day = $('.day');
              var hours = $('.hours');
              var minus = $('.minus');
              var seconds = $('.seconds');

              var heightRate = $('body')[0].clientHeight / 603;
              var widthRate = $('body')[0].clientWidth / 375;
              $('.counter span').css({
                  'top': (229 * heightRate + 'px'),
                  left: (180/2 * widthRate + 'px'),
                  width: (58/2 * widthRate + 'px'),
                  height: (58/2 * heightRate + 'px'),
                  lineHeight: (54/2 * heightRate + 'px'),
                  fontSize: (35/2 * heightRate + 'px')
              });

              hours.css({left: (279/2 * widthRate + 'px')});
              minus.css({left: (378/2 * widthRate + 'px')});
              seconds.css({left: (479/2 * widthRate + 'px')});

              // new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
              window.setInterval(function(){countdown(new Date(2016,6-1,20, 19,45,0), day, hours, minus, seconds);}, 1000);
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
    //app.debug(3);
    console.log('app started success...');
});

