if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker Registered"));
}

let productMap = JSON.parse(localStorage.getItem("productMap")) || {};

const splash = document.getElementById("splash");
const dashboard = document.getElementById("dashboard");
const orderSection = document.getElementById("orderSection");
const editSection = document.getElementById("editSection");
const productSection = document.getElementById("productSection");

setTimeout(() => {
  splash.classList.add("hidden");
  dashboard.style.display = "flex";
}, 1500);

function showOrder() {
  dashboard.style.display = "none";
  orderSection.style.display = "flex";
}

function showEdit() {
  dashboard.style.display = "none";
  editSection.style.display = "flex";
}

function showProducts() {
  dashboard.style.display = "none";
  productSection.style.display = "flex";
  const tbody = document.getElementById("productListBody");
  tbody.innerHTML = "";
  Object.entries(productMap).forEach(([name, price]) => {
    const row = `<tr><td>${name}</td><td>${price}</td></tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

function goToDashboard() {
  orderSection.style.display = "none";
  editSection.style.display = "none";
  productSection.style.display = "none";
  dashboard.style.display = "flex";
}

function saveProducts() {
  localStorage.setItem("productMap", JSON.stringify(productMap));
}

function uploadCSV() {
  const file = document.getElementById("csvFile").files[0];
  if (!file) return alert("Choose a CSV file");
  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.trim().split("\n");
    lines.forEach(line => {
      const [name, price] = line.split(",");
      if (name && price) productMap[name.trim()] = price.trim();
    });
    saveProducts();
    alert("CSV Uploaded!");
  };
  reader.readAsText(file);
}

function addSingleProduct() {
  const name = document.getElementById("newProductName").value.trim();
  const price = document.getElementById("newProductPrice").value.trim();
  if (name && price) {
    productMap[name] = price;
    saveProducts();
    alert("Product added!");
    document.getElementById("newProductName").value = "";
    document.getElementById("newProductPrice").value = "";
  } else {
    alert("Please enter product name and price.");
  }
}

function filterProducts() {
  const search = document.getElementById("productSearch").value.toLowerCase();
  const results = document.getElementById("productResults");
  results.innerHTML = "";
  Object.keys(productMap).forEach(name => {
    if (name.toLowerCase().includes(search)) {
      const div = document.createElement("div");
      div.textContent = name;
      div.onclick = () => {
        document.getElementById("productSearch").value = name;
        document.getElementById("price").value = productMap[name];
        results.innerHTML = "";
      };
      results.appendChild(div);
    }
  });
}

function addProduct() {
  const name = document.getElementById("productSearch").value;
  const qty = document.getElementById("qty").value;
  const bouns = document.getElementById("bouns").value;
  if (!name || !qty) return alert("Fill all fields");
  const row = `<tr><td>${name}</td><td>${qty}</td><td>${bouns}</td><td><button onclick="this.parentNode.parentNode.remove()">Remove</button></td></tr>`;
  document.querySelector("#summaryTable tbody").insertAdjacentHTML("beforeend", row);
  document.getElementById("productSearch").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("bouns").value = "";
  document.getElementById("price").value = "";
}

function sendWhatsApp() {
  let customer = document.getElementById("customer").value;
  let rows = document.querySelectorAll("#summaryTable tbody tr");
  let text = `Customer: ${customer}\n`;
  rows.forEach(row => {
    let cols = row.querySelectorAll("td");
    text += `${cols[0].textContent} - Qty: ${cols[1].textContent}, Bouns: ${cols[2].textContent}\n`;
  });
  let url = "https://wa.me/?text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}

function clearOrder() {
  document.getElementById("summaryTable").querySelector("tbody").innerHTML = "";
  document.getElementById("customer").value = "";
  document.getElementById("productSearch").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("bouns").value = "";
  document.getElementById("price").value = "";
}

function clearProductList() {
  productMap = {};
  saveProducts();
  alert("Product list cleared!");
}
