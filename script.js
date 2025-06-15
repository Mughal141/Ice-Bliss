let selectedSize = "1kg";
let selectedPrice = 50;
let cart = [];

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  updateCupsPrice();
  updatePouchesPrice();
  createNotificationElement();
});

// Create notification element
function createNotificationElement() {
  const notification = document.createElement("div");
  notification.id = "notification";
  notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: #4fc1e9;
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        font-family: 'Open Sans', sans-serif;
    `;
  document.body.appendChild(notification);
}

// Show notification
function showNotification(message, isSuccess = true) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.backgroundColor = isSuccess ? "#4fc1e9" : "#ff7eb3";

  // Show notification
  notification.style.transform = "translateY(0)";
  notification.style.opacity = "1";

  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateY(100px)";
    notification.style.opacity = "0";
  }, 3000);
}

// Size selection for pouches
function selectSize(button) {
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");
  selectedSize = button.getAttribute("data-size");
  selectedPrice = parseInt(button.getAttribute("data-price"));
  updatePouchesPrice();
}

// Update cups price based on quantity
function updateCupsPrice() {
  const quantity = parseInt(document.getElementById("cups-quantity").value);
  const pricePerUnit = quantity >= 100 ? 17 : 20;
  const totalPrice = quantity * pricePerUnit;
  document.getElementById("cups-total-price").textContent = `PKR ${totalPrice}`;
}

// Update pouches price based on size and quantity
function updatePouchesPrice() {
  const quantity = parseInt(document.getElementById("pouches-quantity").value);
  let totalWeight;

  switch (selectedSize) {
    case "1kg":
      totalWeight = quantity * 1;
      break;
    case "2kg":
      totalWeight = quantity * 2;
      break;
    case "5kg":
      totalWeight = quantity * 5;
      break;
  }

  const discount = totalWeight >= 100 ? 0.15 : 0;
  const totalPrice = quantity * selectedPrice * (1 - discount);

  document.getElementById("total-weight").textContent = `${totalWeight}kg`;
  document.getElementById(
    "pouches-total-price"
  ).textContent = `PKR ${totalPrice.toFixed(2)}`;
}

// Add cups to cart
function addCupsToCart() {
  const quantity = parseInt(document.getElementById("cups-quantity").value);
  const pricePerUnit = quantity >= 100 ? 17 : 20;
  const totalPrice = quantity * pricePerUnit;

  const item = {
    name: "Ice Packed Cups",
    quantity: quantity,
    pricePerUnit: pricePerUnit,
    totalPrice: totalPrice,
    type: "cups",
  };

  addToCart(item);
}

// Add pouches to cart
function addPouchesToCart() {
  const quantity = parseInt(document.getElementById("pouches-quantity").value);
  let totalWeight;

  switch (selectedSize) {
    case "1kg":
      totalWeight = quantity * 1;
      break;
    case "2kg":
      totalWeight = quantity * 2;
      break;
    case "5kg":
      totalWeight = quantity * 5;
      break;
  }

  const discount = totalWeight >= 100 ? 0.15 : 0;
  const pricePerUnit = selectedPrice * (1 - discount);
  const totalPrice = quantity * selectedPrice * (1 - discount);

  const item = {
    name: `Ice Packed Pouches (${selectedSize})`,
    quantity: quantity,
    size: selectedSize,
    totalWeight: totalWeight,
    pricePerUnit: pricePerUnit.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    type: "pouches",
  };

  addToCart(item);
}

// Add item to cart
function addToCart(item) {
  cart.push(item);
  updateCartDisplay();
  showNotification(
    `${item.quantity} ${
      item.type === "cups" ? "cup(s)" : item.size + " pouch(es)"
    } added to cart!`
  );
}

// Update cart display
function updateCartDisplay() {
  const cartItemsElement = document.getElementById("cart-items");
  cartItemsElement.innerHTML = "";

  let cartTotal = 0;

  if (cart.length === 0) {
    cartItemsElement.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  } else {
    cart.forEach((item, index) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";

      cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-details">${item.quantity} ${
        item.type === "cups" ? "cup(s)" : "× " + item.size
      } ${item.type === "pouches" ? `(${item.totalWeight}kg total)` : ""}</p>
                </div>
                <div class="cart-item-price">
                    <p>PKR ${item.totalPrice}</p>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
            `;

      cartItemsElement.appendChild(cartItemElement);
      cartTotal += parseFloat(item.totalPrice);
    });
  }

  document.getElementById(
    "cart-total-price"
  ).textContent = `PKR ${cartTotal.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(index) {
  const removedItem = cart.splice(index, 1)[0];
  updateCartDisplay();
  showNotification(
    `${removedItem.quantity} ${
      removedItem.type === "cups" ? "cup(s)" : removedItem.size + " pouch(es)"
    } removed from cart`,
    false
  );
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    showNotification(
      "Your cart is empty. Please add some products before checkout.",
      false
    );
    return;
  }

  const orderSummary = cart
    .map(
      (item) =>
        `${item.name} - ${item.quantity} ${
          item.type === "cups" ? "cup(s)" : item.size
        } = PKR ${item.totalPrice}`
    )
    .join("\n");

  const total = document.getElementById("cart-total-price").textContent;

  const phone = "+923001234567";
  const message = `Order Details:\n\n${orderSummary}\n\nTotal: ${total}\n\nPlease confirm availability and provide payment details.`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, "_blank");

  cart = [];
  updateCartDisplay();
}

function setActiveNavigation() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const setActive = (links) => {
    links.forEach((link) => {
      link.classList.remove("active");
      let linkPath = link.getAttribute("href");
      if (linkPath.startsWith("/")) {
        linkPath = linkPath.substring(1);
      }
      if (
        (currentPath === "index.html" || currentPath === "") &&
        (linkPath === "" || linkPath === "index.html")
      ) {
        link.classList.add("active");
        return;
      }
      if (linkPath === currentPath) {
        link.classList.add("active");
      }
    });
  };
  setActive(document.querySelectorAll(".desktop-nav a"));
  setActive(document.querySelectorAll(".mobile-menu a"));
}
document.addEventListener("DOMContentLoaded", setActiveNavigation);
document
  .querySelector(".mobile-menu-button")
  ?.addEventListener("click", function () {
    setTimeout(setActiveNavigation, 50);
  });
