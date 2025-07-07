


const BASE_URL = "https://open.er-api.com/v6/latest"; // No need for @version or target currency path

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;

    select.append(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Update flag image
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Fetch & update exchange rate
const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = parseFloat(amountInput.value);
  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  msg.innerText = "Fetching exchange rate...";

  const baseCurrency = fromCurr.value;
  const targetCurrency = toCurr.value;
  const url = `${BASE_URL}/${baseCurrency}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch rates");

    const data = await res.json();
    const rate = data.rates[targetCurrency];

    if (!rate) throw new Error("Invalid currency pair");

    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${baseCurrency} = ${finalAmount} ${targetCurrency}`;
  } catch (err) {
    msg.innerText = `Error: ${err.message}`;
  }
};

btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", updateExchangeRate);
