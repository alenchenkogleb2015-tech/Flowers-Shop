// Product page functionality
document.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id');

	const product = productsData[productId];

	if (product) {
		document.getElementById('productName').textContent = product.name;
		document.getElementById('productPrice').textContent = `${formatPrice(product.price)} ₽`;
		document.getElementById('productImage').src = product.image;
		document.getElementById('productImage').alt = product.name;
		document.getElementById('productDescription').textContent = product.description;

		// Add to cart button
		const addToCartBtn = document.getElementById('addToCartBtn');
		
		// Store original text
		if (!addToCartBtn.dataset.originalText) {
			addToCartBtn.dataset.originalText = addToCartBtn.textContent.trim();
		}
		
		// Set data attributes for cart functionality
		addToCartBtn.setAttribute('data-product-id', productId);
		addToCartBtn.setAttribute('data-product-name', product.name);
		addToCartBtn.setAttribute('data-product-price', product.price);
		addToCartBtn.setAttribute('data-product-image', product.image);
		
		addToCartBtn.addEventListener('click', () => {
			const productData = {
				id: parseInt(productId),
				name: product.name,
				price: product.price,
				image: product.image
			};

			cart.addItem(productData);
		});
		
		// Update button state on page load
		setTimeout(() => {
			cart.updateProductButtons();
		}, 100);
	} else {
		// Product not found
		document.querySelector('.product-detail').classList.add('product-not-found');
		document.querySelector('.product-detail__content').innerHTML = `
			<div class="product-not-found__content">
				<h2 class="product-not-found__title">Товар не найден</h2>
				<a href="./index.html" class="product-not-found__btn">Вернуться к каталогу</a>
			</div>
		`;
	}
});

