
let width = "30vw";
let mobile_width = "100vw";
let desktop_width = "30vw";

/* Set the width of the side navigation */
function openNav() {


    if (document.getElementById("mySidenav").style.width == width) {
        closeNav();
        document.getElementById("menu-text").innerText = "menu";
    }
    else {
        document.getElementById("mySidenav").style.width = width;
        document.getElementById("menu-text").innerText = "close";
    }

}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function myFunction(x) {
    if (x.matches) { // If media query matches
        if (document.getElementById("mySidenav").style.width == desktop_width) {
            width = mobile_width;
            document.getElementById("mySidenav").style.width = width;
        }
        else {
            width = mobile_width;
        }
    } else if (document.getElementById("mySidenav").style.width == mobile_width) {
        width = desktop_width;
        document.getElementById("mySidenav").style.width = width;

    }
    else {
        width = desktop_width;
    }
}

// Create a MediaQueryList object
var x = window.matchMedia("(max-width: 800px)")

// Call listener function at run time
myFunction(x);

// Attach listener function on state changes
x.addEventListener("change", function () {
    myFunction(x);
}); 