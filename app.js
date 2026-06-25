const GLOBAL_CONFIG = {
    whatsappNumber: "66866110121",
    currencySymbol: "฿",
    shopName: "India Kitchen",
    vat: 0 // Set VAT percentage here (e.g., 7 for 7%). Set to 0 to hide completely.
};

const WHATSAPP_NUMBER = GLOBAL_CONFIG.whatsappNumber;
let menuData = [];
let cart = [];
let currentCategory = 'all'; 

function initApp() {
    const navTitle = document.getElementById('nav-shop-name');
    if (navTitle) navTitle.innerText = GLOBAL_CONFIG.shopName;
    fetchMenu();
}

async function fetchMenu() {
    try {
        const response = await fetch('menu.json');
        if (!response.ok) throw new Error('File read failure.');
        menuData = await response.json();
        renderMenu(menuData);
    } catch (error) {
        console.error(error);
        document.getElementById('menu-grid').innerHTML = `<p class="error-msg">Please run this project on a local server environment (like VS Code Live Server) to bypass browser JSON restrictions.</p>`;
    }
}

function renderMenu(items) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    if(items.length === 0) {
        menuGrid.innerHTML = `<p class="loader">No items available in this category yet.</p>`;
        return;
    }

    items.forEach((item, index) => {
        const isVeg = item.type === 'veg';
        const typeColor = isVeg ? '#00b300' : '#cc0000';
        
        // Formulate spice level chilis
        let spiceChilis = '';
        for(let i = 0; i < 3; i++) {
            if (i < item.spice) {
                spiceChilis += `<i class="fas fa-pepper-hot chili-icon active"></i>`;
            } else {
                spiceChilis += `<i class="fas fa-pepper-hot chili-icon disabled"></i>`;
            }
        }

        const cartItem = cart.find(c => c.id === item.id);
        const currentQty = cartItem ? cartItem.quantity : 0;

        const card = document.createElement('div');
        card.className = 'menu-card';
        card.style.setProperty('--card-index', index);
        
        card.innerHTML = `
            <div class="card-img-wrapper">
                <span class="menu-tag">${item.tag}</span>
                <div class="diet-indicator" style="border-color: ${typeColor}">
                    <div class="diet-dot" style="background-color: ${typeColor}"></div>
                </div>
                <img id="img-target-${item.id}" src="${item.image}" alt="${item.name}">
            </div>
            <div class="card-content">
                <h3>${item.name}</h3>
                <p class="description">${item.description}</p>
                
                <div class="spice-row">
                    ${spiceChilis}
                </div>

                <div class="card-footer-row">
                    <span class="price">${GLOBAL_CONFIG.currencySymbol}${item.price}</span>
                    <div class="action-wrapper" id="action-wrapper-${item.id}">
                        </div>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
        
        // Render button state layout cleanly for this card
        updateMenuCardButtonDOM(item.id, currentQty);
    });
}

// TARGETED UPDATE FIX: Updates only the button container inside the card instead of refreshing the full grid
function updateMenuCardButtonDOM(id, quantity) {
    const wrapper = document.getElementById(`action-wrapper-${id}`);
    if (!wrapper) return;

    if (quantity > 0) {
        wrapper.innerHTML = `
            <div class="menu-qty-controls">
                <button class="menu-qty-btn decrease" onclick="updateQuantityFromMenu(${id}, -1)">-</button>
                <span class="menu-qty-display">${quantity}</span>
                <button class="menu-qty-btn increase" onclick="animateAndAdd(${id}, this)">+</button>
            </div>
        `;
    } else {
        wrapper.innerHTML = `
            <button class="add-to-cart-btn" onclick="animateAndAdd(${id}, this)">
                <i class="fas fa-plus"></i> Add
            </button>
        `;
    }
}

function filterMenu(category, btnElement) {
    currentCategory = category;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    
    // When switching top categories, a full grid refresh is expected and necessary
    if (currentCategory === 'all') {
        renderMenu(menuData);
    } else {
        const filtered = menuData.filter(item => item.category === currentCategory);
        renderMenu(filtered);
    }
}

// Flying Parabolic Clone Animation
function animateAndAdd(id, buttonElement) {
    const imgTarget = document.getElementById(`img-target-${id}`);
    const cartNavBtn = document.getElementById('cart-nav-btn');

    if (imgTarget && cartNavBtn) {
        const clone = imgTarget.cloneNode();
        clone.classList.add('flying-clone');
        document.body.appendChild(clone);

        const imgRect = imgTarget.getBoundingClientRect();
        const cartRect = cartNavBtn.getBoundingClientRect();

        clone.style.width = `${imgRect.width}px`;
        clone.style.height = `${imgRect.height}px`;
        clone.style.left = `${imgRect.left + window.scrollX}px`;
        clone.style.top = `${imgRect.top + window.scrollY}px`;

        setTimeout(() => {
            clone.style.left = `${cartRect.left + window.scrollX + 15}px`;
            clone.style.top = `${cartRect.top + window.scrollY + 10}px`;
            clone.style.width = '30px';
            clone.style.height = '30px';
            clone.style.opacity = '0.1';
        }, 20);

        setTimeout(() => {
            clone.remove();
            cartNavBtn.classList.add('bump-cart');
            setTimeout(() => cartNavBtn.classList.remove('bump-cart'), 400);
            addToCart(id);
        }, 800);
    } else {
        addToCart(id);
    }
}

function addToCart(id) {
    const product = menuData.find(item => item.id === id);
    const existingItem = cart.find(item => item.id === id);
    let targetQty = 1;

    if (existingItem) {
        existingItem.quantity += 1;
        targetQty = existingItem.quantity;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    // Smoothly swap only the button layout inside this card
    updateMenuCardButtonDOM(id, targetQty); 
    
    const countBadge = document.getElementById('cart-count');
    if(countBadge) {
        countBadge.classList.remove('pop-alert');
        void countBadge.offsetWidth; 
        countBadge.classList.add('pop-alert');
    }
}

function updateQuantityFromMenu(id, change) {
    updateQuantity(id, change);
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    
    item.quantity += change;
    const workingQty = item.quantity;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }
    
    updateCartUI();
    // Smoothly swap only the button layout inside this card
    updateMenuCardButtonDOM(id, workingQty); 
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalCount = document.getElementById('cart-count');
    const totalAmount = document.getElementById('cart-total');
    
    container.innerHTML = '';
    let totalItems = 0, subtotalPrice = 0;

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-msg">Your cart is empty.</p>`;
        totalCount.innerText = "0";
        totalAmount.innerHTML = `<span>Total Amount:</span><span>${GLOBAL_CONFIG.currencySymbol}0</span>`;
        return;
    }

    cart.forEach(item => {
        totalItems += item.quantity;
        subtotalPrice += (item.price * item.quantity);

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>${GLOBAL_CONFIG.currencySymbol}${item.price} × ${item.quantity}</span>
            </div>
            <div class="qty-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        container.appendChild(cartItem);
    });

    totalCount.innerText = totalItems;

    let finalHTML = '';
    let grandTotal = subtotalPrice;

    if (GLOBAL_CONFIG.vat > 0) {
        const vatAmount = (subtotalPrice * GLOBAL_CONFIG.vat) / 100;
        grandTotal = subtotalPrice + vatAmount;

        finalHTML += `
            <div class="summary-row"><span>Subtotal:</span> <span>${GLOBAL_CONFIG.currencySymbol}${subtotalPrice.toFixed(2)}</span></div>
            <div class="summary-row"><span>VAT (${GLOBAL_CONFIG.vat}%):</span> <span>${GLOBAL_CONFIG.currencySymbol}${vatAmount.toFixed(2)}</span></div>
            <hr class="summary-divider">
        `;
    }

    finalHTML += `
        <div class="summary-row grand-total-row"><strong>Total Amount:</strong> <strong>${GLOBAL_CONFIG.currencySymbol}${grandTotal.toFixed(2)}</strong></div>
    `;

    totalAmount.parentElement.innerHTML = `<div id="cart-total" style="width: 100%;">${finalHTML}</div>`;
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

function sendWhatsAppOrder() {
    if (cart.length === 0) return alert("Your cart is empty!");
    
    let message = `*✨ New Order from ${GLOBAL_CONFIG.shopName}! ✨*\n\n`;
    let subtotal = 0;
    
    cart.forEach((item, i) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `${i + 1}. *${item.name}* (x${item.quantity}) - ${GLOBAL_CONFIG.currencySymbol}${itemTotal}\n`;
    });
    
    message += `\n---------------------------\n`;
    
    if (GLOBAL_CONFIG.vat > 0) {
        const vatAmount = (subtotal * GLOBAL_CONFIG.vat) / 100;
        const grandTotal = subtotal + vatAmount;
        
        message += `📋 *Subtotal:* ${GLOBAL_CONFIG.currencySymbol}${subtotal.toFixed(2)}\n`;
        message += `🌾 *VAT (${GLOBAL_CONFIG.vat}%):* ${GLOBAL_CONFIG.currencySymbol}${vatAmount.toFixed(2)}\n`;
        message += `---------------------------\n`;
        message += `💰 *Total Bill:* ${GLOBAL_CONFIG.currencySymbol}${grandTotal.toFixed(2)}\n`;
    } else {
        message += `💰 *Total Bill:* ${GLOBAL_CONFIG.currencySymbol}${subtotal.toFixed(2)}\n`;
    }
    
    message += `---------------------------\n\nPlease confirm and process my order!`;

    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`, '_blank');
}

window.addEventListener('scroll', () => {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.onload = initApp;