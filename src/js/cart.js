// Cart functionality
class Cart {
	constructor() {
		this.items = this.loadCart();
		this.updateCartUI();
		this.bindEvents();
	}

	loadCart() {
		const savedCart = localStorage.getItem('cart');
		return savedCart ? JSON.parse(savedCart) : [];
	}

	saveCart() {
		localStorage.setItem('cart', JSON.stringify(this.items));
		this.updateCartUI();
		this.updateProductButtons();
	}

	updateProductButtons() {
		// Update all product buttons that show quantity
		document.querySelectorAll('[data-product-id]').forEach(button => {
			const productId = parseInt(button.dataset.productId);
			const cartItem = this.items.find(item => item.id === productId);
			
			// Find wrapper (product-info or parent)
			let wrapper = button.closest('.product-info');
			if (!wrapper) {
				wrapper = button.parentElement;
			}
			
			if (cartItem && cartItem.quantity > 0) {
				// Show quantity on button
				this.updateButtonState(button, cartItem.quantity, wrapper, productId);
			} else {
				// Restore original state
				this.restoreButtonState(button, wrapper);
			}
		});
	}

	updateButtonState(button, quantity, wrapper, productId) {
		const originalText = button.dataset.originalText || 'Купить';
		if (!button.dataset.originalText) {
			button.dataset.originalText = originalText;
		}
		
		// Check if controls already exist
		let controlsContainer = button.parentElement.querySelector('.product-info__controls');
		
		if (!controlsContainer) {
			// Store button dimensions to maintain layout
			const buttonRect = button.getBoundingClientRect();
			const buttonHeight = buttonRect.height || 32;
			
			// Create controls container with three blocks
			controlsContainer = document.createElement('div');
			controlsContainer.className = 'product-info__controls';
			controlsContainer.style.minHeight = buttonHeight + 'px';
			controlsContainer.style.flexShrink = '0';
			controlsContainer.style.flexGrow = '0';
			
			// Create minus button
			const minusBtn = document.createElement('button');
			minusBtn.className = 'product-info__control-btn';
			minusBtn.textContent = '−';
			minusBtn.type = 'button';
			minusBtn.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				const currentItem = this.items.find(item => item.id === productId);
				if (currentItem && currentItem.quantity > 1) {
					this.updateQuantity(productId, currentItem.quantity - 1);
				} else if (currentItem) {
					this.removeItem(productId);
				}
			};
			
			// Create quantity button
			const quantityBtn = document.createElement('button');
			quantityBtn.className = 'product-info__quantity-btn product-info__btn--added';
			quantityBtn.textContent = `×${quantity}`;
			quantityBtn.type = 'button';
			quantityBtn.style.pointerEvents = 'none';
			
			// Create plus button
			const plusBtn = document.createElement('button');
			plusBtn.className = 'product-info__control-btn';
			plusBtn.textContent = '+';
			plusBtn.type = 'button';
			plusBtn.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				const currentItem = this.items.find(item => item.id === productId);
				if (currentItem) {
					this.updateQuantity(productId, currentItem.quantity + 1);
				} else {
					const product = {
						id: productId,
						name: button.dataset.productName,
						price: parseInt(button.dataset.productPrice),
						image: button.dataset.productImage
					};
					this.addItem(product);
				}
			};
			
			controlsContainer.appendChild(minusBtn);
			controlsContainer.appendChild(quantityBtn);
			controlsContainer.appendChild(plusBtn);
			
			// Replace original button with controls container
			// Store button's computed styles to match
			const buttonStyle = window.getComputedStyle(button);
			controlsContainer.style.margin = buttonStyle.margin;
			controlsContainer.style.marginTop = buttonStyle.marginTop;
			controlsContainer.style.marginBottom = buttonStyle.marginBottom;
			controlsContainer.style.marginLeft = buttonStyle.marginLeft;
			controlsContainer.style.marginRight = buttonStyle.marginRight;
			
			button.style.display = 'none';
			button.after(controlsContainer);
			
			// Store reference to quantity button
			controlsContainer.quantityBtn = quantityBtn;
			controlsContainer.button = button;
		} else {
			// Update quantity text
			if (controlsContainer.quantityBtn) {
				controlsContainer.quantityBtn.textContent = `×${quantity}`;
			}
		}
	}

	restoreButtonState(button, wrapper) {
		const originalText = button.dataset.originalText || 'Купить';
		
		// Find controls container
		let controlsContainer = null;
		
		// Check if button is hidden and controls exist
		if (button.style.display === 'none') {
			controlsContainer = button.nextElementSibling;
			if (controlsContainer && controlsContainer.classList.contains('product-info__controls')) {
				controlsContainer.remove();
			}
		} else {
			controlsContainer = wrapper?.querySelector('.product-info__controls');
			if (controlsContainer) {
				controlsContainer.remove();
			}
		}
		
		// Restore button
		button.textContent = originalText;
		button.classList.remove('product-info__btn--added');
		button.style.backgroundColor = '';
		button.style.color = '';
		button.style.borderColor = '';
		button.style.display = '';
	}

	addItem(product) {
		const existingItem = this.items.find(item => item.id === product.id);
		
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			this.items.push({
				...product,
				quantity: 1
			});
		}
		
		this.saveCart();
	}

	removeItem(productId) {
		this.items = this.items.filter(item => item.id !== productId);
		this.saveCart();
	}

	clearCart() {
		this.items = [];
		this.saveCart();
	}

	updateQuantity(productId, quantity) {
		const item = this.items.find(item => item.id === productId);
		if (item) {
			item.quantity = Math.max(1, quantity);
			this.saveCart();
		}
	}

	getTotal() {
		return this.items.reduce((total, item) => {
			const price = parseInt(item.price);
			return total + (price * item.quantity);
		}, 0);
	}

	getTotalItems() {
		return this.items.reduce((total, item) => total + item.quantity, 0);
	}

	updateCartUI() {
		const cartItems = document.getElementById('cartItems');
		const cartTotal = document.getElementById('cartTotal');
		const cartBadge = document.getElementById('cartBadge');
		const cartBadgeHeader = document.getElementById('cartBadgeHeader');
		const totalItems = this.getTotalItems();
		const total = this.getTotal();

		// Update badges
		if (cartBadge) {
			cartBadge.textContent = totalItems || '';
		}
		if (cartBadgeHeader) {
			cartBadgeHeader.textContent = totalItems || '';
		}

		// Update total
		if (cartTotal) {
			cartTotal.textContent = `${formatPrice(total)} ₽`;
		}

		// Update clear button visibility
		const cartClear = document.getElementById('cartClear');
		if (cartClear) {
			cartClear.style.display = this.items.length > 0 ? 'block' : 'none';
		}

		// Update items
		if (cartItems) {
			if (this.items.length === 0) {
				cartItems.innerHTML = '<p class="cart__empty">Корзина пуста</p>';
			} else {
				cartItems.innerHTML = this.items.map(item => `
					<div class="cart__item">
						<img src="${item.image}" alt="${item.name}" class="cart__item-image" />
						<div class="cart__item-info">
							<div class="cart__item-name">${item.name}</div>
							<div class="cart__item-price">${formatPrice(item.price)} ₽ x ${item.quantity}</div>
							<div class="cart__item-controls">
								<button class="cart__item-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
								<span class="cart__item-quantity">${item.quantity}</span>
								<button class="cart__item-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
							</div>
						</div>
						<button class="cart__item-remove" onclick="cart.removeItem(${item.id})">×</button>
					</div>
				`).join('');
			}
		}
	}

	bindEvents() {
		// Cart icon buttons
		const cartIcon = document.getElementById('cartIcon');
		const cartIconHeader = document.getElementById('cartIconHeader');
		const cart = document.getElementById('cart');
		const cartClose = document.getElementById('cartClose');
		const cartOverlay = document.getElementById('cartOverlay');

		const openCart = () => {
			if (cart) cart.classList.add('active');
		};

		const closeCart = () => {
			if (cart) cart.classList.remove('active');
		};

		if (cartIcon) cartIcon.addEventListener('click', openCart);
		if (cartIconHeader) cartIconHeader.addEventListener('click', openCart);
		if (cartClose) cartClose.addEventListener('click', closeCart);
		if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

		// Clear cart button
		const cartClear = document.getElementById('cartClear');
		if (cartClear) {
			cartClear.addEventListener('click', () => {
				if (this.items.length > 0 && confirm('Вы уверены, что хотите очистить корзину?')) {
					this.clearCart();
				}
			});
		}

		// Checkout button
		const checkoutBtn = document.querySelector('.cart__checkout');
		if (checkoutBtn) {
			checkoutBtn.addEventListener('click', () => {
				if (this.items.length > 0) {
					alert('Заказ оформлен! Спасибо за покупку!');
					this.items = [];
					this.saveCart();
					closeCart();
				}
			});
		}
	}
}

// Initialize cart
const cart = new Cart();

// Add to cart buttons - use event delegation for dynamically added buttons
document.addEventListener('click', function(e) {
	// Find the button element (could be clicked on button itself or inside it)
	const button = e.target.closest('[data-product-id].product-info__btn');
	
	// Check if it's a product button
	if (!button) return;
	
	// Don't handle clicks on control buttons (+/-) or quantity display
	if (button.classList.contains('product-info__control-btn') || 
	    button.classList.contains('product-info__quantity-btn')) {
		return;
	}

	// Don't handle if button is hidden (replaced by controls)
	if (button.style.display === 'none') return;

	// Prevent default action and stop propagation
	e.preventDefault();
	e.stopPropagation();

	// Store original text if not stored yet
	if (!button.dataset.originalText) {
		button.dataset.originalText = button.textContent.trim();
	}

	const product = {
		id: parseInt(button.dataset.productId),
		name: button.dataset.productName,
		price: parseInt(button.dataset.productPrice),
		image: button.dataset.productImage
	};

	if (cart && typeof cart.addItem === 'function') {
		cart.addItem(product);
	}
}, true); // Use capture phase to handle before other handlers

