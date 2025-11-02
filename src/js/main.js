// Main page functionality - initialize button states
document.addEventListener('DOMContentLoaded', () => {
	// Initialize button states with quantities from cart
	if (typeof cart !== 'undefined') {
		// Wait for cart to be initialized and products to be loaded
		setTimeout(() => {
			cart.updateProductButtons();
		}, 300);
	}

	// Burger menu functionality
	const navBurger = document.getElementById('navBurger');
	const navList = document.getElementById('navList');
	const navLinks = document.querySelectorAll('.nav_list-item-link');

	if (navBurger && navList) {
		navBurger.addEventListener('click', () => {
			navBurger.classList.toggle('active');
			navList.classList.toggle('active');
			document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
		});

		// Close menu when clicking on a link
		navLinks.forEach(link => {
			link.addEventListener('click', () => {
				navBurger.classList.remove('active');
				navList.classList.remove('active');
				document.body.style.overflow = '';
			});
		});

		// Close menu when clicking outside
		document.addEventListener('click', (e) => {
			if (navList.classList.contains('active') && 
				!navList.contains(e.target) && 
				!navBurger.contains(e.target)) {
				navBurger.classList.remove('active');
				navList.classList.remove('active');
				document.body.style.overflow = '';
			}
		});
	}
});

