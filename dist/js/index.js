$(document).ready(function () {
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'vertical',
        loop: true,
        pagination: '.swiper-pagination',  // 如果需要分页器
        onInit: function(swiper){
            swiperAnimateCache(swiper); //隐藏动画元素
            swiperAnimate(swiper); //初始化完成开始动画
        },
        onSlideChangeEnd: function(swiper){
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        }
    });
});
