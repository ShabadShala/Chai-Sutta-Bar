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


















// Cheat - Random item - 2 finegr long press, Ctrl+Shift+P
let longPressTimer = null; // Timer for long press detection

// Function to add a random item
function addRandomItem() {
    // Get all menu items from the DOM
    const menuItems = Array.from(document.querySelectorAll('.menu-item'));
    
    if (menuItems.length === 0) {
        showFeedback('No menu items found!');
        return;
    }
    
    // Select a random menu item
    const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
    
    // Extract item details
    const menuItemLine = randomItem.querySelector('.menu-item-line');
    const colAB = menuItemLine.querySelector('.colAB').textContent.trim();
    const colCDE = menuItemLine.querySelector('.colCDE').textContent.trim();
    
    // Extract rate (mimic your project's logic)
    const rateMatch = colCDE.match(/\d+/); // Find the first number in colCDE
    if (!rateMatch) {
        showFeedback('No rate found for this item!');
        return;
    }
    const rate = rateMatch[0];
    
    // Extract category details
    const categoryHeader = randomItem.closest('.category-items').previousElementSibling;
    const categoryLeft = categoryHeader.querySelector('.left').textContent.split('(')[0].trim();
    const categoryRight = categoryHeader.querySelector('.right').textContent.trim(); // Get the right side of the header
    
    // Extract item name
    const itemName = colAB.split('(')[0].trim();
    
    // Combine names (mimic your project's logic)
    let combinedName = `${categoryLeft} - ${itemName}`;
    
    // Extract the specific part of the header-right side that matches the rate
    if (categoryRight) {
        // Split the header-right side by "/" or other delimiters
        const rightParts = categoryRight.split('/').map(part => part.trim());
        
        // Find the corresponding part based on the rate column (C/D/E)
        const rateColumn = menuItemLine.querySelector('.colCDE').textContent.trim();
        const rateIndex = rateColumn.split(' / ').findIndex(part => part.includes(rate));
        
        // If a matching part is found, append it to the name
        if (rateIndex !== -1 && rightParts[rateIndex]) {
            combinedName += ` (${rightParts[rateIndex]})`;
        }
    }
    
    // Add to scrap list
    scrapItems.push({
        name: combinedName,
        rate: rate
    });

    
    // Animate the rate movement (mimic your project's logic)
    animateRateMovement(menuItemLine.querySelector('.colCDE'));
    
    // Update UI
    updateScrapListDisplay();
    updateScrapCounter();
    handleScrapItemsChange();
    updateScrapButtonStatus();
        showFeedback('DEV: Random item added!');    
}

// Keyboard shortcut: Ctrl + Shift + P
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault(); // Prevent browser conflicts
        addRandomItem(); // Call the function
    }
});

// Touch Gesture: Two-Finger Long Press (1 second)
document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) { // Detects two fingers
        longPressTimer = setTimeout(() => {
            addRandomItem(); // Trigger after 1 second
        }, 1000); // 1000ms = 1 second
    }
});

document.addEventListener('touchend', () => {
    clearTimeout(longPressTimer); // Cancel if fingers are lifted early
});





























// Development - 20 items and 4 offers
document.getElementById('devFill').addEventListener('click', () => {
    // Clear existing data
    // scrapItems = [];
    // offerCart = [];
    
    // Get all menu items from the DOM
    const menuItems = Array.from(document.querySelectorAll('.menu-item'));
    
    // Generate 20 random scrap items from real menu data
    for (let i = 0; i < 20; i++) {
        const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        const itemName = randomItem.querySelector('.colAB').textContent.trim();
        const itemRate = randomItem.querySelector('.colCDE').textContent.match(/\d+/)[0]; // Extract first number as rate
        
        scrapItems.push({
            name: itemName,
            rate: itemRate
        });
    }
    
    // Generate 4 random offers from real offer data
    const offerItems = Array.from(document.querySelectorAll('.offer-item'));
    for (let i = 0; i < 4; i++) {
        const randomOffer = offerItems[Math.floor(Math.random() * offerItems.length)];
        const offerTitle = randomOffer.querySelector('.offer-title').textContent.trim();
        const offerDescription = randomOffer.querySelector('.offer-description').textContent.trim();
        const offerDates = randomOffer.querySelector('.offer-dates').textContent.trim();
        const dependencies = randomOffer.querySelector('.add-offer-btn').dataset.dependencies === 'Yes';
        const allowOnce = randomOffer.querySelector('.add-offer-btn').dataset.allowOnce === 'Yes';
        
        offerCart.push({
            title: offerTitle,
            description: offerDescription,
            dates: [offerDates],
            count: 1,
            dependent: dependencies,
            allowOnce: allowOnce
        });
    }
    
    // Update displays
    updateScrapListDisplay();
    updateCartDisplay();
    updateScrapButtonStatus();
    updateScrapCounter();
    showFeedback('DEV: Random data loaded from real items!');
    
    // Show both panels
    document.getElementById('scrapList').style.display = 'flex';
    document.getElementById('offer-cart').style.display = 'block';
    document.querySelector('.scrap-overlay').style.display = 'block';
});




















// Cheat - Word Search - Double Finger Tap OR Ctrl+Shift+C
// cheat.js - Strict Activation Flow
let cheatActive = false;
let activationListenersAdded = false;

function getWordUnderPointer(event) {
    const x = event.clientX || (event.touches?.[0]?.clientX);
    const y = event.clientY || (event.touches?.[0]?.clientY);
    
    const element = document.elementFromPoint(x, y);
    if (!element?.classList?.contains('colAB')) return null;
    
    const range = document.caretRangeFromPoint(x, y);
    if (!range) return null;
    
    const textNode = range.startContainer;
    const offset = range.startOffset;
    const text = textNode.textContent || '';
    
    // Find word boundaries (including hyphenated words)
    let start = offset;
    while (start > 0 && /[^\s()-]/.test(text[start - 1])) start--; // Stop at spaces, ( , ) or -
    
    let end = offset;
    while (end < text.length && /[^\s()-]/.test(text[end])) end++; // Stop at spaces, ( , ) or -
    
    return text.slice(start, end).trim(); // Extract only the clicked word
}


function simulateSearchInput(word) {
    const searchInput = document.getElementById('searchInput');
    
    // Show search UI elements
    document.querySelector('.search-container').style.display = 'block';
    document.getElementById('filterContainer').style.display = 'flex';
    document.getElementById('clearButton').style.display = 'block';
    
    // Trigger search
    searchInput.value = word;
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function handleCheatInteraction(event) {
    if (!cheatActive) return;
    
    const word = getWordUnderPointer(event);
    if (word) {
        simulateSearchInput(word);
        showFeedback(`CHEAT: Filtering by "${word}"`);
    }
}

function addCheatListeners() {
    if (activationListenersAdded) return;
    
    // Add click handler for desktop
    document.addEventListener('click', (e) => {
        if (e.target.closest('.colAB')) {
            handleCheatInteraction(e);
        }
    });
    
    // Add touch handler for mobile
    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('.colAB')) {
            handleCheatInteraction(e);
        }
    });
    
    activationListenersAdded = true;
}

// Keyboard shortcut activation (Ctrl+Shift+C)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
        e.preventDefault();
        cheatActive = !cheatActive;
        
        if (cheatActive) {
            addCheatListeners();
            alert('Item Word Search activated, this may disturb menu browsing.\n\nTo deactivate it: press Ctrl+Shift+C or tap by 4-fingers');
            } else {
            alert('CHEAT MODE DEACTIVATED');
        }
        
    }
});

let lastTapTime = 0;

document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) { // Detect two-finger tap
        let currentTime = new Date().getTime();
        let tapInterval = currentTime - lastTapTime;

        if (tapInterval < 300 && tapInterval > 50) { // Detect double-tap within 300ms
            addCheatListeners();
        }

        lastTapTime = currentTime;
    }
});




        