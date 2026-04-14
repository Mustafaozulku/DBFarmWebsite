// --- STATE ---
let cart = [];

// --- GLOBAL FUNCTIONS ---
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    // Open the cart automatically when item added
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    
    renderCart();
}

function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    renderCart();
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalAmt = document.getElementById('cartTotalAmt');
    const cartBadge = document.getElementById('cartBadge');
    
    // Calculate total qty
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalQty;
    
    // Show/hide cart badge depending on qty
    cartBadge.style.display = totalQty > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart">Sepetiniz şu an boş.</div>';
        cartTotalAmt.textContent = '0 ₺';
        return;
    }

    let itemsHtml = '';
    let totalAmt = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmt += itemTotal;

        itemsHtml += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-price">${itemTotal} ₺</span>
                </div>
                <div class="cart-controls">
                    <button class="cart-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="cart-qty">${item.quantity}</span>
                    <button class="cart-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = itemsHtml;
    cartTotalAmt.textContent = totalAmt + ' ₺';
}

function checkout() {
    if (cart.length === 0) {
        alert("Sepetiniz boş.");
        return;
    }

    let message = "Merhaba DB Farm, sipariş vermek istiyorum:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.quantity} adet ${item.name} (${item.price * item.quantity} ₺)\n`;
        total += item.price * item.quantity;
    });

    message += `\nToplam Tutar: ${total} ₺`;
    
    const encodedMessage = encodeURIComponent(message);
    // Replace with the actual phone number in international format (+90555...)
    const whatsappUrl = `https://wa.me/905551234567?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}


// --- INITIALIZATION & DOM EVENTS ---
document.addEventListener('DOMContentLoaded', () => {
    
    renderCart(); // Init call for UI

    // --- Cart Sidebar Toggles ---
    const cartOpenBtn = document.getElementById('cartOpenBtn');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartOpenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });

    [cartCloseBtn, cartOverlay].forEach(el => {
        el.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
    });

    checkoutBtn.addEventListener('click', checkout);

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if(navLinks.classList.contains('active')) {
            menuIcon.classList.remove('ri-menu-3-line');
            menuIcon.classList.add('ri-close-line');
        } else {
            menuIcon.classList.remove('ri-close-line');
            menuIcon.classList.add('ri-menu-3-line');
        }
    });

    document.querySelectorAll('.nav-links a:not(.cart-icon-btn)').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('ri-close-line');
            menuIcon.classList.add('ri-menu-3-line');
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.fade-in-section');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => appearOnScroll.observe(el));
});
