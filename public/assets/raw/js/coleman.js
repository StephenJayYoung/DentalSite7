// document is ready
jQuery(document).ready(function($){

    // setup revolution slider
    $('.tp-banner').show().revolution({
        sliderType: "standard",
        jsFileLocation: "assets/include/rs-plugin/js/",
        sliderLayout: "fullwidth",
        dottedOverlay: "none",
        delay: 6000,
        startwidth: 2000,
        startheight: 650,
        hideThumbs: 200,
        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 5,
        fullScreenAlignForce: "on",
        navigation: {
            keyboardNavigation: "off",
            keyboard_direction: "horizontal",
            mouseScrollNavigation: "off",
            onHoverStop: "off",
            touch:{
                touchenabled: "on",
                swipe_threshold: 75,
                swipe_min_touches: 1,
                swipe_direction: "horizontal",
                drag_block_vertical: false
            },
            arrows: {
                style: "hermes",
                enable: false,
                hide_onmobile: true,
                hide_onleave: true,
                tmp: '<div class="tp-arr-allwrapper">   <div class="tp-arr-imgholder"></div>    <div class="tp-arr-titleholder">{{title}}</div> </div>',
                left: {
                    h_align: "left",
                    v_align: "center",
                    h_offset: 10,
                    v_offset: 0
                },
                right: {
                    h_align: "right",
                    v_align: "center",
                    h_offset: 10,
                    v_offset: 0
                }
            }
        },
        touchenabled: "on",
        onHoverStop: "on",
        swipe_velocity: 0.7,
        swipe_min_touches: 1,
        swipe_max_touches: 1,
        drag_block_vertical: false,
        parallax: "mouse",
        parallaxBgFreeze: "on",
        parallaxLevels: [7,4,3,2,5,4,3,2,1,0],
        keyboardNavigation: "off",
        navigationHAlign: "center",
        navigationVAlign: "bottom",
        navigationHOffset: 0,
        navigationVOffset: 20,
        soloArrowLeftHalign: "left",
        soloArrowLeftValign: "center",
        soloArrowLeftHOffset: 20,
        soloArrowLeftVOffset: 0,
        soloArrowRightHalign: "right",
        soloArrowRightValign: "center",
        soloArrowRightHOffset: 20,
        soloArrowRightVOffset: 0,
        shadow: 0,
        fullWidth: "on",
        fullScreen: "off",
        spinner: "spinner4",
        stopLoop: "off",
        stopAfterLoops: -1,
        stopAtSlide: -1,
        shuffle: "off",
        autoHeight: "off",
        forceFullWidth: "on",
        hideTimerBar: "on",
        hideThumbsOnMobile: "on",
        hideNavDelayOnMobile: 1500,
        hideBulletsOnMobile: "on",
        hideArrowsOnMobile: "on",
        hideThumbsUnderResolution: 0,
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        startWithSlide: 0,
    });

    // team carousel
    var ocTeam = $("#oc-team-list");
    ocTeam.owlCarousel({
        items: 1,
        nav: true,
        navText : ['<i class="icon-angle-left"></i>','<i class="icon-angle-right"></i>'],
        dots: false,
        loop: true,
        touchDrag: false
    });

    // gallery scripts
    var $container = $('#portfolio');

    $container.isotope({ transitionDuration: '0.65s' });

    $('#portfolio-filter a').click(function(){
        $('#portfolio-filter li').removeClass('activeFilter');
        $(this).parent('li').addClass('activeFilter');
        var selector = $(this).attr('data-filter');
        $container.isotope({ filter: selector });
        return false;
    });

    $('#portfolio-shuffle').click(function(){
        $container.isotope('updateSortData').isotope({
            sortBy: 'random'
        });
    });

    $(window).resize(function() {
        $container.isotope('layout');
    });

    // tour scripts
    var relatedPortfolio = $("#related-portfolio");

    relatedPortfolio.owlCarousel({
        margin: 0,
        nav: true,
        navText: ['<i class="icon-angle-left"></i>','<i class="icon-angle-right"></i>'],
        autoplay: false,
        autoplayHoverPause: true,
        dots: false,
        loop: false,
        touchDrag: false,
        responsive:{
            0:{ items:1 },
            600:{ items:2 },
            1000:{ items:3 },
            1200:{ items:4 },
            1400:{ items:5 }
        }
    });

    // google maps script
    $('#google-map').gMap({

        address: '1800 SW 152nd Street, Suite 202, Burien, WA',
        maptype: 'ROADMAP',
        zoom: 16,
        markers: [
            {
                address: "1800 SW 152nd Street, Suite 202, Burien, WA",
                icon: {
                    image: "assets/images/icons/map-icon-red.png",
                    iconsize: [32, 39],
                    iconanchor: [32,39]
                }
            }
        ],
        doubleclickzoom: false,
        controls: {
            panControl: true,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            overviewMapControl: false,
            draggable: false
        }

    });
});