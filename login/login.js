document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("back");

  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.history.back();
    });
  }
});
