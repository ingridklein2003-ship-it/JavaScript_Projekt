/* Variabler og typer */
const burgerKnap = document.querySelector(".burger");      // Element (objekt)
const menuPanel = document.querySelector(".menu-panel");   // Element (objekt)
let menuErÅben = false;                                    // boolean

/* Arrays */
const linksNodeList = menuPanel.querySelectorAll("a");     // NodeList
const menuLinks = Array.from(linksNodeList);               // Array

/* Hjælpefunktion */
function opdaterMenu() {
  /* if / else + operatorer */
  if (menuErÅben === true) {
    menuPanel.classList.add("aktiv");
    burgerKnap.setAttribute("aria-expanded", "true");
    burgerKnap.setAttribute("aria-label", "Luk menu");
  } else {
    menuPanel.classList.remove("aktiv");
    burgerKnap.setAttribute("aria-expanded", "false");
    burgerKnap.setAttribute("aria-label", "Åbn menu");
  }

  /* Loop */
  for (let i = 0; i < menuLinks.length; i++) {
    // lille visuel detalje: marker sidste link lidt anderledes
    if (i === menuLinks.length - 1 && menuErÅben) {
      menuLinks[i].style.borderTop = "1px solid rgba(255,255,255,.18)";
      menuLinks[i].style.paddingTop = "14px";
    } else {
      menuLinks[i].style.borderTop = "none";
      menuLinks[i].style.paddingTop = "10px";
    }
  }
}

/* Klik på burger */
burgerKnap.addEventListener("click", () => {
  /* Operator */
  menuErÅben = !menuErÅben;
  opdaterMenu();
});

/* Klik på et link lukker menuen */
for (let i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener("click", () => {
    menuErÅben = false;
    opdaterMenu();
  });
}

/* Klik udenfor lukker menuen (desktop/mobil) */
document.addEventListener("click", (event) => {
  const klikIndeIMenu = menuPanel.contains(event.target);
  const klikPåBurger = burgerKnap.contains(event.target);

  if (menuErÅben === true && klikIndeIMenu === false && klikPåBurger === false) {
    menuErÅben = false;
    opdaterMenu();
  }
});

/* Starttilstand */
opdaterMenu();