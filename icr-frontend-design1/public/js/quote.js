const PROPERTY_TYPES = ["Residencial", "Comercial", "Otro"];
const BILL_RANGES = [
  "Menos de S/ 100",
  "S/ 100 - S/ 300",
  "S/ 300 - S/ 600",
  "Más de S/ 600"
];

function initQuotePage() {
  const root = document.getElementById("quote-page");
  if (!root) return;

  const stepsEl = root.querySelectorAll(".quote-step");
  const step1El = root.querySelector("#quote-step1");
  const step2El = root.querySelector("#quote-step2");
  const thanksEl = root.querySelector("#quote-thanks");
  const propertyGroup = root.querySelector("#property-type-group");
  const billGroup = root.querySelector("#bill-range-group");
  const step1Next = root.querySelector("#step1-next");
  const step2Back = root.querySelector("#step2-back");

  const form = { propertyType: "", monthlyBill: "" };

  PROPERTY_TYPES.forEach((type) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-chip";
    btn.textContent = type;
    btn.addEventListener("click", () => {
      form.propertyType = type;
      propertyGroup.querySelectorAll(".choice-chip").forEach((c) => c.classList.toggle("active", c === btn));
      updateStep1();
    });
    propertyGroup.appendChild(btn);
  });

  BILL_RANGES.forEach((range) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-chip";
    btn.textContent = range;
    btn.addEventListener("click", () => {
      form.monthlyBill = range;
      billGroup.querySelectorAll(".choice-chip").forEach((c) => c.classList.toggle("active", c === btn));
      updateStep1();
    });
    billGroup.appendChild(btn);
  });

  function updateStep1() {
    step1Next.disabled = !(form.propertyType && form.monthlyBill);
  }

  function setStep(n) {
    stepsEl.forEach((el) => {
      const num = Number(el.dataset.step);
      el.classList.toggle("active", num === n);
      el.classList.toggle("done", num < n);
      el.querySelector(".quote-step-num").innerHTML = num < n
        ? '<i class="bi bi-check2"></i>'
        : String(num);
    });
    step1El.hidden = n !== 1;
    step2El.hidden = n !== 2;
    thanksEl.hidden = n !== 3;
  }

  step1El.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.propertyType && form.monthlyBill) setStep(2);
  });

  step2Back.addEventListener("click", () => setStep(1));

  step2El.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(step2El);
    const firstName = data.get("firstName")?.trim();
    const lastName = data.get("lastName")?.trim();
    const email = data.get("email")?.trim();
    const phone = data.get("phone")?.trim();
    if (!firstName || !lastName || !email || !phone) return;

    thanksEl.querySelector(".quote-thanks-name").textContent = firstName;
    thanksEl.querySelector(".quote-thanks-phone").textContent = phone;
    thanksEl.querySelector(".quote-thanks-email").textContent = email;
    setStep(3);
  });

  const step2Inputs = step2El.querySelectorAll("input");
  const step2Submit = step2El.querySelector('button[type="submit"]');
  const updateStep2 = () => {
    step2Submit.disabled = Array.from(step2Inputs).some((input) => !input.value.trim());
  };
  step2Inputs.forEach((input) => input.addEventListener("input", updateStep2));

  updateStep1();
  updateStep2();
}

initQuotePage();
