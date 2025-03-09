// cart.js

// Constants
const shippingCost = 5; // Example shipping cost

// Utility function to update the total amount
function updateTotals() {
    let subtotal = 0;
    const items = document.querySelectorAll('#cart-items tr');

    items.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity').value, 10);
        const price = parseFloat(item.querySelector('.price').textContent);
        const itemTotal = quantity * price;
        
        item.querySelector('.item-total').textContent = itemTotal.toFixed(2);

        subtotal += itemTotal;
    });

    const total = subtotal + shippingCost;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

// Event listener for quantity input changes
document.getElementById('cart-items').addEventListener('input', updateTotals);

// Event listener for remove buttons
document.getElementById('cart-items').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-btn')) {
        const row = event.target.closest('tr');
        row.remove();
        updateTotals();
    }
});

// Event listener for add item form
document.getElementById('add-item-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const itemName = document.getElementById('item-name').value;
    const itemPrice = parseFloat(document.getElementById('item-price').value);

    if (itemName && itemPrice >= 0) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${itemName}</td>
            <td><input type="number" class="quantity" value="0" min="0"></td>
            <td class="price">${itemPrice.toFixed(2)}</td>
            <td class="item-total">0.00</td>
            <td><button class="remove-btn">Remove</button></td>
        `;
        document.getElementById('cart-items').appendChild(newRow);
        updateTotals();
    }
});
