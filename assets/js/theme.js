const themes = {
    dark: 'dark',
    light: 'light',
}

let ThemeController = function (toggleButton) {
    let themeRefreshListeners = []
    let getThemeOpposite = (theme) => theme === 'dark' ? 'light' : 'dark'
    toggleButton.prop('checked', this.theme === 'light')
    toggleButton.click(() => {
        cookie.set('theme', getThemeOpposite(this.theme))
        this.refreshTheme()
    })
    toggleButton.mousedown((event) => event.preventDefault())

    this.refreshTheme = () => {
        this.theme = cookie.get('theme') || themes.dark
        document.documentElement.setAttribute('data-theme', this.theme)
        themeRefreshListeners.forEach((listener) => listener(this.theme))
    }

    this.addThemeRefreshListener = (listener) => {
        themeRefreshListeners.push(listener)
    }

    this.removeThemeRefreshListener = (listener) => {
        themeRefreshListeners.splice(themeRefreshListeners.indexOf(listener), 1)
    }
}

jQuery(document).ready(function ($) {
    const toggleButton = $('.dark-mode-toggle')
    const themeController = new ThemeController(toggleButton)
    themeController.refreshTheme()

    $('.sections-wrapper').scroll(function () {
        if ($(this).scrollTop() > 10) {
            toggleButton.hide()
        } else {
            toggleButton.show()
        }
    })
})

