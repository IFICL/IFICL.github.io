jQuery(function () {
    "use strict";
    new WOW().init();

    jQuery('#main-navigation a[href^="#"]').on('click', function () {
        if (jQuery('#main-navigation').hasClass('in')) {
            jQuery('#main-navigation').collapse('hide');
        }
    });
});
