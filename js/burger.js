/* Variabler og typer */
const burgerKnap = document.querySelector(".burger");   // objekt
const mobilMenu = document.querySelector(".mobil-menu"); // objekt
let menuErÅben = false; // boolean

/* Array */
const menuLinks = mobilMenu.querySelectorAll("a"); // NodeList (bruges som array)

/* Klik-event */
burgerKnap.addEventListener("click", () => {

  /* Operator */
  menuErÅben = !menuErÅben;

  /* if / else */
  if (menuErÅben === true) {
    mobilMenu.classList.add("aktiv");
  } else {
    mobilMenu.classList.remove("aktiv");
  }

  /* Loop */
  for (let i = 0; i < menuLinks.length; i++) {
    if (menuErÅben) {
      menuLinks[i].style.opacity = "1";
    } else {
      menuLinks[i].style.opacity = "0.8";
    }
  }
});

/* Luk menuen når man klikker på et link */
for (let i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener("click", () => {
    menuErÅben = false;
    mobilMenu.classList.remove("aktiv");
  });
}