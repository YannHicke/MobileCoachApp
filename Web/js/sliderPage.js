var sliderPageJS = (function (window, document) {
    var mySwiper = null;
    var init = function () {
        var aniamtionSpeed = 300;
        mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            spaceBetween: 40,
            autoHeight: true,
            speed: aniamtionSpeed,

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });

        registerEventListener()
    };

    var registerEventListener = function () {
        console.log(mySwiper)
        mySwiper.on('slideChangeTransitionStart', changeScrollPosition)
    };

    var changeScrollPosition = function (e) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0
    };

    return {
        init: init
    }
})(window, document);

window.onload = sliderPageJS.init;
