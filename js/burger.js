const burgerKnap = document.querySelector(".burger");
const menuPanel = document.querySelector(".menu-panel");
let menuErÅben = false;

const linksNodeList = menuPanel.querySelectorAll("a");
const menuLinks = Array.from(linksNodeList);

function opdaterMenu() {
  if (menuErÅben === true) {
    menuPanel.classList.add("aktiv");
    burgerKnap.setAttribute("aria-expanded", "true");
    burgerKnap.setAttribute("aria-label", "Luk menu");
  } else {
    menuPanel.classList.remove("aktiv");
    burgerKnap.setAttribute("aria-expanded", "false");
    burgerKnap.setAttribute("aria-label", "Åbn menu");
  }

  for (let i = 0; i < menuLinks.length; i++) {
    if (i === menuLinks.length - 1 && menuErÅben) {
      menuLinks[i].style.borderTop = "1px solid rgba(255,255,255,.18)";
      menuLinks[i].style.paddingTop = "14px";
    } else {
      menuLinks[i].style.borderTop = "none";
      menuLinks[i].style.paddingTop = "10px";
    }
  }
}

burgerKnap.addEventListener("click", () => {
  menuErÅben = !menuErÅben;
  opdaterMenu();
});

for (let i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener("click", () => {
    menuErÅben = false;
    opdaterMenu();
  });
}

document.addEventListener("click", (event) => {
  const klikIndeIMenu = menuPanel.contains(event.target);
  const klikPåBurger = burgerKnap.contains(event.target);

  if (menuErÅben === true && klikIndeIMenu === false && klikPåBurger === false) {
    menuErÅben = false;
    opdaterMenu();
  }
});

opdaterMenu();