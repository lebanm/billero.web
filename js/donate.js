document.addEventListener("DOMContentLoaded", function () {
  const copyBtns = document.querySelectorAll(".copy-btn");
  copyBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetId = btn.getAttribute("data-target");
      const el = document.getElementById(targetId);
      if (!el) return;

      const text = el.textContent || el.innerText;
      if (!text || text.indexOf("VAŠ_") >= 0 || text.indexOf("YOUR_") >= 0) {
        btn.textContent = "Vnesi naslov";
        setTimeout(function () {
          btn.textContent = "Kopiraj";
        }, 1500);
        return;
      }

      navigator.clipboard
        .writeText(text)
        .then(function () {
          btn.textContent = "Kopirano!";
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = "Kopiraj";
            btn.classList.remove("copied");
          }, 1500);
        })
        .catch(function () {
          btn.textContent = "Napaka";
          setTimeout(function () {
            btn.textContent = "Kopiraj";
          }, 1500);
        });
    });
  });
});
