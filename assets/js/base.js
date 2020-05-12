function Cookie () {
    'use strict';
    this.set = function (name, value) {
        let date = new Date();
        date.setTime(date.getTime() + (999 * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    };

    this.get = function (name) {
        name = name + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let cookieParts = decodedCookie.split(';');
        for (let i = 0; i < cookieParts.length; i++) {
            let cookiePart = cookieParts[i];
            while (cookiePart.charAt(0) === ' ') {
                cookiePart = cookiePart.substring(1);
            }
            if (cookiePart.indexOf(name) === 0) {
                return cookiePart.substring(name.length, cookiePart.length);
            }
        }
        return null;
    };
}
