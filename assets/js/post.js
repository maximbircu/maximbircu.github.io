jQuery(document).ready(function ($) {
    'use strict';
    let sections = $('.sections-wrapper');
    sections.stop().animate({scrollTop: cookie.get('post-scroll')}, 1000, 'swing', null);
    sections.scroll(function () {
        cookie.set('post-scroll', sections.scrollTop());
    });
});
