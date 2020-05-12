const cookie = new Cookie();

const themes = {
    dark: 'dark',
    light: 'light',
};

const defaultTheme = themes.dark;

getCurrentTheme = function () {
    'use strict';
    return cookie.get('theme') || defaultTheme;
};

getThemeOpposite = function (theme) {
    'use strict';
    return theme === 'dark' ? 'light' : 'dark';
};

removeThemeStyles = function (theme) {
    'use strict';
    $('#' + theme).remove();
};

loadThemeStyles = function (theme) {
    'use strict';
    let link = document.createElement('link');
    link.id = theme;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/assets/css/' + theme + '-styles.css';
    document.getElementsByTagName('head')[0].appendChild(link);
};

loadThemeStyles(getCurrentTheme());

jQuery(document).ready(function ($) {
    'use strict';
    let toggleButton = $('.dark-mode-toggler');
    toggleButton.prop('checked', getCurrentTheme() === themes.light);
    toggleButton.click(function () {
        let currentTheme = getCurrentTheme();
        let newTheme = getThemeOpposite(currentTheme);
        cookie.set('theme', newTheme);
        removeThemeStyles(currentTheme);
        loadThemeStyles(newTheme);
        loadDisqus();
    });

    $('.sections-wrapper').scroll(function () {
        if ($(this).scrollTop() > 10) {
            toggleButton.hide();
        } else {
            toggleButton.show();
        }
    });
});

