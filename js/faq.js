const faqItems = document.querySelectorAll(".faqItem");

for (let i = 0; i < faqItems.length; i++) {
  const item = faqItems[i];
  const button = item.querySelector(".faqQuestion");
  button.addEventListener("click", function () {
    item.classList.toggle("active");
  });
}

document.addEventListener("click", function (event) {
  if (!event.target.closest(".faqItem")) {
    for (let i = 0; i < faqItems.length; i++) {
      faqItems[i].classList.remove("active");
    }
  }
});
