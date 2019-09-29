var defaultTeme = "light"

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (999 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

getThemeOposite = function (theme) {
    return theme == "dark" ? "light" : "dark";
}

removeThemeStyles = function (theme) {
    $("#" + theme).remove()
}

loadThemeStyles = function (theme) {
    if (theme == defaultTeme) return
    var link = document.createElement('link');
    link.id = theme
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = "/assets/css/" + theme + "-styles.css";
    document.getElementsByTagName('head')[0].appendChild(link);
}

loadThemeStyles(getCookie("theme"))


jQuery(document).ready(function ($) {
    var currentTheme = getCookie("theme");
    var toggleButton = $(".dark-mode-toggler")
    toggleButton.prop('checked', currentTheme == defaultTeme)
    toggleButton.click(function (event) {
        var currentTheme = getCookie("theme");
        var newTheme = getThemeOposite(currentTheme);
        setCookie("theme", newTheme);
        removeThemeStyles(currentTheme)
        loadThemeStyles(newTheme)
        loadDisqus()
    });

    $(".sections-wrapper").scroll(function () {
        if ($(this).scrollTop() > 10) toggleButton.hide(); else toggleButton.show();
    });
});
