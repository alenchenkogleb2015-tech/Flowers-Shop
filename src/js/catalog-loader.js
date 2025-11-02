// Catalog loader - dynamically loads product cards from productsData
document.addEventListener('DOMContentLoaded', () => {
	// Category mappings
	const categoryMappings = {
		'flowers': [201, 202, 203, 204, 205, 206],
		'bouquets': [1, 2, 3, 4, 5, 6, 7, 8, 9],
		'baskets': [101, 102, 103, 104, 105, 106, 107, 108, 109],
		'bride-bouquets': [301, 302, 303, 304, 305]
	};

	// Function to create a product card
	function createProductCard(productId, product) {
		const card = document.createElement('a');
		card.href = `./product.html?id=${productId}`;
		card.className = 'catalog__list-item';

		// Extract image filename from path
		const imageName = product.image.split('/').pop();
		const altText = product.name;

		card.innerHTML = `
			<img src="${product.image}" width="350" alt="${altText}" />
			<div class="product-info">
				<div class="product-info__content">
					<p class="product-info__name">${product.name}</p>
					<p class="product-info__price">${formatPrice(product.price)} ₽</p>
				</div>
				<button class="product-info__btn btn" data-product-id="${productId}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">Купить</button>
			</div>
		`;

		return card;
	}

	// Load products for each category
	Object.keys(categoryMappings).forEach(categoryId => {
		const section = document.getElementById(categoryId);
		if (!section) return;

		const catalogList = section.querySelector('.catalog__list');
		if (!catalogList) return;

		// Clear existing items (except menu items)
		const existingItems = catalogList.querySelectorAll('.catalog__list-item:not(.catalog-menu__item)');
		existingItems.forEach(item => item.remove());

		// Add products for this category
		categoryMappings[categoryId].forEach(productId => {
			const product = productsData[productId];
			if (product) {
				const card = createProductCard(productId, product);
				catalogList.appendChild(card);
			}
		});
	});

	// Initialize button states after loading
	if (typeof cart !== 'undefined') {
		setTimeout(() => {
			cart.updateProductButtons();
		}, 200);
	}
});

