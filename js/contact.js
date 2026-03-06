document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    const humanInput = document.getElementById("human");
    if (!humanInput) return;

    const expectedAnswer = form.dataset.humanAnswer || "7";
    const errorMessage =
      form.dataset.humanError ||
      "Please answer the human verification question correctly (3 + 4 = 7).";
    const value = humanInput.value.trim();
    if (value !== expectedAnswer) {
      event.preventDefault();
      alert(errorMessage);
      humanInput.focus();
    }
  });
});

