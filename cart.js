//Checking if page is loaded
if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', ready);
} else {
	ready();
}

function ready() {
	//Adding event listeners to shop buttons.
	var addToCartButtons = document.getElementsByClassName(
		'catalogue-item-button'
	);
	for (var i = 0; i < addToCartButtons.length; i++) {
		var button = addToCartButtons[i];
		button.addEventListener('click', addToCartClicked);
	}

	// Restore cart state after a browser refresh (items and total amount)
	if (
		sessionStorage.getItem('savedItems') &&
		sessionStorage.getItem('savedTotal')
	) {
		var savedItems = sessionStorage.getItem('savedItems');
		var savedTotal = sessionStorage.getItem('savedTotal');
		document.getElementById('cart-total').innerHTML = savedTotal;
		document.getElementById('cart-items').innerHTML = savedItems;
		var cartItems = document.getElementsByClassName('cart-item');
		for (var i = 0; i < cartItems.length; i++) {
			document
				.getElementsByClassName('cart-remove-button')
				[i].addEventListener('click', removeCartItem);
			document
				.getElementsByClassName('item-quantity-input')
				[i].addEventListener('change', quantityChanged);
			document.getElementsByTagName('input')[i].value = sessionStorage.getItem(
				document.getElementsByTagName('input')[i].id
			);
		}
	}

	//Add event listener to Buy button
	// var buyButton = document.getElementsByClassName('cart-buy-button');
	// buyButton.addEventListener('click', buyButtonClicked);
}

//If ADD TO CART button is clicked, add item to cart.
function addToCartClicked(event) {
	var button = event.target;
	var item = button.parentElement.parentElement;
	var image = item.getElementsByClassName('catalogue-item-image')[0].src;
	var title = item.getElementsByClassName('catalogue-item-title')[0].innerText;
	var price = item.getElementsByClassName('catalogue-item-price')[0].innerText;
	addItemToCart(image, title, price);
	updateCartTotal();
}

function addItemToCart(image, title, price) {
	var cartItems = document.getElementsByClassName('cart-items')[0];
	var cartItem = document.createElement('div');
	// Check if item is already in cart, if yes notify the user
	var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
	for (var i = 0; i < cartItemNames.length; i++) {
		if (cartItemNames[i].innerText == title) {
			alert('This item is already in cart');
			return;
		}
	}

	// Creates new cart item element and appends it to cart
	var cartItemContents = `
		<div class="cart-row grid-container">
						<div class="cart-item">
							<img
								class="cart-item-image"
								src="${image}"
								width="100"
								height="100"
							/>
							<span class="cart-item-title">${title}</span>
						</div>
						<span class="cart-item-price">${price}</span>
						<div class="cart-item-quantity">
							<input class="item-quantity-input" id="${title}" type="number" value="1" oninput="saveValues(this)"/>
							<button class="cart-remove-button">REMOVE</button>
						</div>
					</div>`;
	cartItem.innerHTML = cartItemContents;
	cartItems.append(cartItem);

	// Adding Event Listener for new cart item button and quantity.
	cartItem
		.getElementsByClassName('cart-remove-button')[0]
		.addEventListener('click', removeCartItem);
	cartItem
		.getElementsByClassName('item-quantity-input')[0]
		.addEventListener('change', quantityChanged);
}

// Removes Cart item when REMOVE button is clicked
function removeCartItem(event) {
	var buttonClicked = event.target;
	console.log(event.target);
	buttonClicked.parentElement.parentElement.parentElement.remove();
	updateCartTotal();
}

//Updates Cart total amount
function updateCartTotal() {
	var cartItemContainer = document.getElementsByClassName('cart-items')[0];
	var cartRows = cartItemContainer.getElementsByClassName('cart-row');
	var total = 0;
	for (var i = 0; i < cartRows.length; i++) {
		var cartRow = cartRows[i];
		var priceElement = cartRow.getElementsByClassName('cart-item-price')[0];
		var quantityElement = cartRow.getElementsByClassName(
			'item-quantity-input'
		)[0];
		var price = parseFloat(priceElement.innerText.replace('€', ''));
		var quantity = quantityElement.value;
		total = total + price * quantity;
	}
	total = total.toFixed(2);
	if (total > 100) {
		document.getElementsByClassName('cart-total-title')[0].innerText =
			'TOTAL WITH 10% DISCOUNT:';
		var discount = (total - total * 0.1).toFixed(2);
		document.getElementsByClassName('cart-total-amount')[0].innerText =
			discount;
		saveCartState();
		return;
	}
	document.getElementsByClassName('cart-total-title')[0].innerText = 'TOTAL:';
	document.getElementsByClassName('cart-total-amount')[0].innerText =
		total + '€';
	saveCartState();
}

// Checks items quantity input and updates Cart total amount.
function quantityChanged(event) {
	var input = event.target;
	if (isNaN(input.value) || input.value <= 0) {
		input.value = 1;
	}
	updateCartTotal();
}

// Saving Cart state between browser refresh
function saveCartState(data) {
	var cartItems = document.getElementById('cart-items').innerHTML;
	var cartTotal = document.getElementById('cart-total').innerHTML;
	sessionStorage.setItem('savedTotal', cartTotal);
	sessionStorage.setItem('savedItems', cartItems);
}
// Saving Cart item quantities between browser refresh
function saveValues(data) {
	if (data.value == NaN) {
		data.value = 1;
	}
	var id = data.id;
	var value = data.value;
	sessionStorage.setItem(id, value);
}

// Creating XML file and clearing the cart
function buyButtonClicked() {
	var doc = document.implementation.createDocument('', '', null);
	var cartElement = doc.createElement('cart');
	var cartItems = document.getElementsByClassName('cart-item');
	for (i = 0; i < cartItems.length; i++) {
		var itemElement = doc.createElement('item');
		var title = document.getElementsByClassName('cart-item-title')[i].innerText;
		var price = document.getElementsByClassName('cart-item-price')[i].innerText;
		var quantity = document.getElementsByClassName('item-quantity-input')[i]
			.value;
		itemElement.setAttribute('item-title', title);
		itemElement.setAttribute('item-price', price);
		itemElement.setAttribute('item-quantity', quantity);
		cartElement.appendChild(itemElement);
	}
	doc.appendChild(cartElement);
	console.log(doc);
}
