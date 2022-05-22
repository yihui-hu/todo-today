function toggleLight() {
    document.documentElement.setAttribute('data-theme', 'light');
    sessionStorage.setItem('theme', 'light');
}

function toggleBeige() {
    document.documentElement.setAttribute('data-theme', 'beige');
    sessionStorage.setItem('theme', 'beige');
}

function toggleWine() {
    document.documentElement.setAttribute('data-theme', 'wine');
    sessionStorage.setItem('theme', 'wine');
}

function toggleMidnight() {
    document.documentElement.setAttribute('data-theme', 'midnight');
    sessionStorage.setItem('theme', 'midnight');
}

function initialise() {
    let theme = sessionStorage.getItem('theme');
    if (theme === "light") {
        toggleLight();
    } else if (theme === "beige") {
        toggleBeige();
    } else if (theme === "wine") {
        toggleWine();
    } else {
        toggleMidnight();
    }
}

initialise();