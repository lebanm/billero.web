document.addEventListener("DOMContentLoaded", function () {
  let captchaAnswer;

  function refreshCaptcha() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    captchaAnswer = a + b;
    const span = document.getElementById("human-question");
    if (span) span.textContent = a + " + " + b;
    const input = document.getElementById("human");
    if (input) input.value = "";
  }

  refreshCaptcha();

  const form = document.getElementById("contact-form");
  if (!form) return;

  const humanInput = document.getElementById("human");
  const submitBtn = form.querySelector("button[type=submit]");
  const successMsg = document.getElementById("form-success");
  const errorMsg = document.getElementById("form-error");
  const submitLabel = submitBtn ? submitBtn.textContent : "";

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Clear previous errors
    if (errorMsg) errorMsg.style.display = "none";

    // Validate captcha
    if (humanInput && parseInt(humanInput.value.trim(), 10) !== captchaAnswer) {
      if (errorMsg) {
        errorMsg.textContent = form.dataset.humanError || "Wrong answer. Please try again.";
        errorMsg.style.display = "block";
      }
      refreshCaptcha();
      return;
    }

    const endpoint = form.getAttribute("action");

    // Fallback: if endpoint not configured, open mailto
    if (!endpoint || endpoint.includes("YOUR_FORM_ID")) {
      const name = (form.querySelector("#name") || {}).value || "";
      const msg = (form.querySelector("#message") || {}).value || "";
      window.location.href =
        "mailto:info@billero.app?subject=Kontakt: " + encodeURIComponent(name) +
        "&body=" + encodeURIComponent(msg);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "...";
    }

    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (resp.ok) {
        form.style.display = "none";
        if (successMsg) successMsg.style.display = "block";
      } else {
        const data = await resp.json().catch(() => ({}));
        throw new Error((data.errors || []).map(function (e) { return e.message; }).join(", ") || "Server error");
      }
    } catch (e) {
      if (errorMsg) {
        errorMsg.textContent = (form.dataset.sendError || "Napaka pri pošiljanju. Poskusi znova ali piši na info@billero.app.") + (e.message ? " (" + e.message + ")" : "");
        errorMsg.style.display = "block";
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }
      refreshCaptcha();
    }
  });
});
