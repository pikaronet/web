let width = "30vw";
let mobile_width = "100vw";
let desktop_width = "30vw";

// Create a MediaQueryList object
var x = window.matchMedia("(max-width: 800px)");

// Call listener function at run time
myFunction(x);

// Attach listener function on state changes
x.addEventListener("change", function () {
  myFunction(x);
});

/* Set the width of the side navigation */
function openNav() {
  if (document.getElementById("mySidenav").style.width == width) {
    closeNav();
    document.getElementById("menu-text").innerText = "menu";
  } else {
    document.getElementById("mySidenav").style.width = width;
    document.getElementById("menu-text").innerText = "close";
  }
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function myFunction(x) {
  if (x.matches) {
    // If media query matches
    if (document.getElementById("mySidenav").style.width == desktop_width) {
      width = mobile_width;
      document.getElementById("mySidenav").style.width = width;
    } else {
      width = mobile_width;
    }
  } else if (document.getElementById("mySidenav").style.width == mobile_width) {
    width = desktop_width;
    document.getElementById("mySidenav").style.width = width;
  } else {
    width = desktop_width;
  }
}

function ani() {
  let text = document.getElementById("click-start");
  const overlay = document.getElementById("black-overlay");
  var audio = new Audio("sounds/bells2.wav");
  audio.volume = 0.4;

  text.addEventListener("animationend", () => {
    overlay.innerHTML = "<img src='images/logo_x.png' id='click-start'>";
    let text = document.getElementById("click-start");
    text.style.animation = "raiseOpacityAnimation 0.5s linear 1";
    audio.play();
  });

  overlay.style.pointerEvents = "none";

  text.style.animation = "lowerOpacityAnimation 0.5s linear 1 forwards";

  overlay.style.animation = "lowerOpacityAnimation 2s 1s linear 1 forwards";
}
