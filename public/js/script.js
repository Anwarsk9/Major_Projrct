// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

let taxSwitch = document.querySelector(".form-check-input");
if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    let taxEl = document.querySelectorAll("#show-gst");
    taxEl.forEach((el) => {
      el.classList.toggle("gst-tax");
    });
  });
}
