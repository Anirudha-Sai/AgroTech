// Add event listener to handle form submission
document.getElementById('itemForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const itemName = document.getElementById('itemName').value;
    const itemType = document.getElementById('itemType').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;

    // Send data to the backend using fetch
    fetch('http://localhost:3000/add-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            itemName: itemName,
            itemType: itemType,
            price: price,
            quantity: quantity
        })
    })
    .then(response => {
        if (response.ok) {
            return response.text();  // Handle success
        } else {
            throw new Error('Failed to add item');
        }
    })
    .then(data => {
        console.log(data);
        displayItems();  // Update the item list
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding item. Please try again.');
    });

    // Clear the form for the next input
    document.getElementById('itemForm').reset();
});

// Function to fetch and display all items
function displayItems() {
    fetch('http://localhost:3000/items')
        .then(response => {
            if (response.ok) {
                return response.json();  // Handle successful response
            } else {
                throw new Error('Failed to fetch items');
            }
        })
        .then(data => {
            const itemList = document.getElementById('itemList');
            itemList.innerHTML = ''; // Clear the list before displaying new items

            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `Item: ${item.name}, Type: ${item.type}, Price: ₹${item.price} per KG, Quantity: ${item.quantity} KG`;
                itemList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            alert('Error fetching items. Please try again later.');
        });
}

// Load the items when the page loads
window.onload = displayItems;
