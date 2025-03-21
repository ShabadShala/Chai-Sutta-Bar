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























// Direct Last order, Ctrl+Shift+O

function executeCheatOrder() {
    let originalScrapItems = [...scrapItems];
    
    try {
        const lastOrderData = localStorage.getItem('lastOrder');
        const lastOfferCartData = localStorage.getItem('lastOfferCart');
        
        if (lastOrderData) {
            const parsedOrder = JSON.parse(lastOrderData);
            console.log('Parsed lastOrder:', parsedOrder);
            
            scrapItems = parsedOrder.items || [];
            
            if (typeof updateScrapListDisplay === 'function') {
                updateScrapListDisplay();
                handleScrapItemsChange();
            }
            } else {
            console.warn('No last order data found.');
            showFeedback('No last order found!');
            scrapItems = [];
            
            if (typeof updateScrapListDisplay === 'function') {
                updateScrapListDisplay();
                handleScrapItemsChange();
            }
        }
        
        if (lastOfferCartData) {
            const parsedOfferCart = JSON.parse(lastOfferCartData);
            console.log('Parsed lastOfferCart:', parsedOfferCart);
            
            const currentDate = new Date();
            offerCart = parsedOfferCart.items.filter(offer => {
                const dateRange = offer.dates[0];
                const endDateString = dateRange.split(' to ')[1];
                const endDate = new Date(endDateString);
                return endDate >= currentDate;
            });
            
            const offerCartElement = document.getElementById('offer-cart');
            if (offerCartElement) {
                offerCartElement.style.display = 'block';
            }
            
            saveOfferCart();
            } else {
            console.warn('No last offer cart data found.');
            offerCart = [];
        }
        
        // Mock form data with cheat indicators (update as needed)
        const formData = {};
        
        // Use existing order pipeline
        sendCombinedOrder(formData);
        
        } catch (error) {
        console.error('Cheat order failed:', error);
        showFeedback('Cheat order failed!');
        } finally {
        // Restore original scrap items
        scrapItems = originalScrapItems;
        if (typeof updateScrapListDisplay === 'function') {
            updateScrapListDisplay();
            handleScrapItemsChange();
        }
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
    
    
    
    
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   // Clear Favourites by Ctrl+Shift+F

function clearAllFavorites() {
    // Clear localStorage favorites
    localStorage.removeItem('favorites');
    
    // Reset all star elements
    document.querySelectorAll('.favorite-star').forEach(star => {
        star.classList.remove('active');
        star.innerHTML = '☆';
    });
    
    // Update favorite count
    updateFavoriteCount();
    
    // Refresh favorites tab if active
    if (activeTab === 'fav') {
        filterFavorites();
    }
    
    // Show feedback
    showFeedback('Favorites cleared!');
}

// Keyboard shortcut listener
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        clearAllFavorites();
    }
});



































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







































