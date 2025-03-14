// Cheat - Full menu - 3 finegr tap, Ctrl+Shift+E                
let threeFingerStartTime = 0;

document.addEventListener('touchstart', (e) => {
    const touches = e.touches;
    
    if (touches.length === 1) {
        // Record time when first finger touches
        threeFingerStartTime = Date.now();
        } else if (touches.length === 3) {
        // Check if three fingers landed within 300ms of the first touch
        const now = Date.now();
        if (threeFingerStartTime !== 0 && now - threeFingerStartTime <= 300) {
            activateCheatMode();
            threeFingerStartTime = 0; // Prevent multi-trigger
        }
    }
});

document.addEventListener('touchend', (e) => {
    // Reset timer when all fingers are lifted
    if (e.touches.length === 0) {
        threeFingerStartTime = 0;
    }
});

// Keyboard cheat: Ctrl + Shift + E
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault(); // Prevent browser conflicts
        activateCheatMode();
    }
});

// Cheat activation function
function activateCheatMode() {
     // 1. Clear search input and reset filters
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
   
    
    // Clear TAB filters
    setActiveTab("allButton");
    resetFilters();
    resetHeaders();
    // 1. Expand all categories and add borders
    document.querySelectorAll('.category-header').forEach(header => {
        const items = header.nextElementSibling;
        // Expand header
        header.style.fontSize = '6rem';
        header.querySelector('.right').style.display = 'inline';
        // Add border to header
        header.classList.add('visible-border');
        
        // Expand items and add border
        items.style.display = 'block';
        items.classList.add('visible-border');
    });
    
    // 2. Expand offers and show their borders
    // offersContainer.style.display = 'grid';
    // offersButton.querySelector('.arrow').textContent = '▲';
}











































// Development - 20 items and 4 offers
document.getElementById('devFill').addEventListener('click', () => {
    
    // Clear existing data
    // scrapItems = [];
    // offerCart = [];

    // Get all menu items from the DOM
    const menuItems = Array.from(document.querySelectorAll('.menu-item'));

    // Generate 20 random scrap items
    for (let i = 0; i < 20; i++) {
        const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        const colAB = randomItem.querySelector('.colAB').textContent.trim();
        const colCDE = randomItem.querySelector('.colCDE').textContent.trim();
        
        // Get category details
        const categoryHeader = randomItem.closest('.category-items').previousElementSibling;
        const categoryName = categoryHeader.querySelector('.left').textContent.split('(')[0].trim();
        const columnValues = {
            C: categoryHeader.dataset.columnC || '',
            D: categoryHeader.dataset.columnD || '',
            E: categoryHeader.dataset.columnE || ''
        };

        // Extract rate and column
        const rateMatch = colCDE.match(/(\d+)/);
        const rate = rateMatch ? rateMatch[0] : '0';
        const column = colCDE.includes(rate) 
            ? colCDE.split(' / ').findIndex(part => part.includes(rate)) + 1 
            : 1;
        const columnKey = ['C', 'D', 'E'][column] || 'C';

        // Build item name with category and column value
        const itemName = `${categoryName} - ${colAB.split('(')[0].trim()}`;
        const columnValue = columnValues[columnKey];
        const fullItemName = columnValue ? `${itemName} (${columnValue})` : itemName;

        scrapItems.push({
            name: fullItemName,
            rate: rate
        });
    }

    // Generate 4 random offers from offersData
    for (let i = 0; i < 4; i++) {
        const randomOffer = offersData[Math.floor(Math.random() * offersData.length)];
        if (!randomOffer) continue;

        offerCart.push({
            title: randomOffer[1],
            description: randomOffer[2],
            dates: [formatDate(randomOffer[0]) + (randomOffer[3] ? ` to ${formatDate(randomOffer[3])}` : '')],
            count: 1,
            dependent: randomOffer[5] === 'Yes',
            allowOnce: randomOffer[4] === 'Yes'
        });
    }

    // Update displays
    updateScrapListDisplay();
    updateCartDisplay();
    updateScrapButtonStatus();
    updateScrapCounter();
    handleScrapItemsChange();
           
        updateOfferAddButtons();
    showFeedback('DEV: Demo data loaded!');

    // Show both panels
    document.getElementById('scrapList').style.display = 'flex';
    document.getElementById('offer-cart').style.display = 'block';
    document.querySelector('.scrap-overlay').style.display = 'block';
});
















function executeCheatOrder() {
    try {
        const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
        if (!lastOrder?.items?.length) {
            showFeedback('No last order found!');
            return;
        }

        // Reconstruct full item names with C column values
        const processedItems = lastOrder.items.map(item => {
            // Original logic for combining category C column with item name
            const match = item.name.match(/(.*) - (.*)( \(.*\))?/);
            if (match) {
                const [_, category, baseName, colC] = match;
                // Reconstruct with C column value if exists
                return { 
                    ...item,
                    name: colC ? `${category} - ${baseName} ${colC}` : item.name
                };
            }
            return item;
        });

        const itemMap = processedItems.reduce((acc, item) => {
            const key = `${item.name}-${item.rate}`;
            acc[key] = (acc[key] || { ...item, qty: 0 });
            acc[key].qty++;
            return acc;
        }, {});

        const sortedItems = Object.values(itemMap).sort((a, b) => {
            const cleanA = a.name.replace(/[^a-zA-Z]/g, '').toLowerCase();
            const cleanB = b.name.replace(/[^a-zA-Z]/g, '').toLowerCase();
            return cleanA.localeCompare(cleanB);
        });

        // Rest of the order logic remains the same
        const totalAmount = sortedItems.reduce((sum, item) => 
            sum + (Number(item.rate) * item.qty), 0);
        const totalQty = sortedItems.reduce((sum, item) => sum + item.qty, 0);
        const totalItems = sortedItems.length;

        const foodEmojis = ['🌶','🫑','🌽','🍔','🍟','🍕','🥙','🌮','🥗','🍿','🍎','🍋','🍓','🍞','🥘','🍱','🍧','🍹'];
        const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
        
        let message = `${randomEmoji}\n*Order No. ${cachedOrderNumber + 1}*\n${'-'.repeat(30)}\n`;
        
        // Preserve original formatting with C column values
        message += sortedItems.map(item => {
            const itemTotal = item.qty * Number(item.rate);
            return item.qty > 1 
                ? `*${item.qty}x* ${item.name} @ ₹${item.rate} - ₹${itemTotal}`
                : `*${item.qty}x* ${item.name} - ₹${itemTotal}`;
        }).join('\n');

        message += `\n${'-'.repeat(30)}\n*${totalItems} ${totalItems === 1 ? 'item' : 'items'} - Qty ${totalQty} - ₹${Math.round(totalAmount)}*`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappOfferNumber}?text=${encodedMessage}`, '_blank');

        // Update order number state
        cachedOrderNumber++;
        updateCounter('updateOrders');
    } catch (error) {
        console.error('Cheat order failed:', error);
        showFeedback('Cheat order failed!');
    }
}


// Original keyboard listener with proper modifier checks
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        if (document.getElementById('loadingOverlay').style.display === 'none') {
            executeCheatOrder();
        }
    }
});



// ScrapButton Cheat Gesture (Long Press + Swipe Up)
const scrapBtn = document.getElementById('scrapButton');
let gestureState = {
    longPressActive: false,
    startY: 0,
    swipeProgress: 0,
    longPressTimer: null
};

// Visual Feedback Elements
const createGestureUI = () => {
    const ui = document.createElement('div');
    ui.id = 'cheatGestureUI';
    ui.innerHTML = `
        <div class="longpress-indicator"></div>
        <div class="swipe-indicator"></div>
    `;
    ui.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 99999;
        display: none;
    `;
    document.body.appendChild(ui);
};
createGestureUI();

scrapBtn.addEventListener('touchstart', function(e) {
    if (e.touches.length !== 1) return;
    
    gestureState = {
        longPressActive: true,
        startY: e.touches[0].clientY,
        swipeProgress: 0
    };

    const ui = document.getElementById('cheatGestureUI');
    const rect = scrapBtn.getBoundingClientRect();
    ui.style.display = 'block';
    ui.style.left = `${rect.left + rect.width/2}px`;
    ui.style.top = `${rect.top + rect.height/2}px`;

    // Long Press Timeout (1.5 seconds)
    gestureState.longPressTimer = setTimeout(() => {
        ui.querySelector('.longpress-indicator').style.backgroundColor = '#00ff00';
    }, 1500);
});

scrapBtn.addEventListener('touchmove', function(e) {
    if (!gestureState.longPressActive || !gestureState.longPressTimer) return;

    const touch = e.touches[0];
    const ui = document.getElementById('cheatGestureUI');
    
    // Calculate swipe progress (minimum 100px upward)
    const swipeDelta = gestureState.startY - touch.clientY;
    gestureState.swipeProgress = Math.min(swipeDelta / 100, 1);
    
    // Update swipe indicator
    ui.querySelector('.swipe-indicator').style.transform = 
        `translateY(${-gestureState.swipeProgress * 50}px)`;

    // Activate if both conditions met
    if (gestureState.swipeProgress === 1 && 
        Date.now() - gestureState.longPressTimer._idleStart >= 1500) {
        executeCheatOrder();
        resetGesture();
    }
});

scrapBtn.addEventListener('touchend', resetGesture);

function resetGesture() {
    clearTimeout(gestureState.longPressTimer);
    gestureState.longPressActive = false;
    document.getElementById('cheatGestureUI').style.display = 'none';
}

// Add to CSS
const style = document.createElement('style');
style.textContent = `
.longpress-indicator {
    width: 60px;
    height: 60px;
    border: 3px solid #fff;
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    animation: pulse 1.5s infinite;
}

.swipe-indicator {
    width: 30px;
    height: 30px;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="%2300ff00" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
    position: absolute;
    transform: translate(-50%, -50%);
    transition: transform 0.3s;
}

@keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}
`;
document.head.appendChild(style);
