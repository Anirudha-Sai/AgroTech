// script.js

// Set initial values
const pricePerItem = 10; // Example price per item

// Get elements
const quantityInput = document.getElementById('quantity');
const totalAmountElement = document.getElementById('totalAmount');

// Function to update the total amount
function updateTotalAmount() {
    const quantity = parseInt(quantityInput.value, 10);
    const totalAmount = pricePerItem * quantity;
    totalAmountElement.textContent = totalAmount;
}

// Add event listener to the quantity input
quantityInput.addEventListener('input', updateTotalAmount);

// Initial call to set the correct amount on page load
updateTotalAmount();
