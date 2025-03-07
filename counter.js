 // Counters
                    async function updateCounter(type) {
                        try {
                            const response = await fetch(`${scriptUrl}?sheet=counter&action=${type}`);
                            return await response.json();
                            } catch (error) {
                            console.error(`Error updating ${type} counter:`, error);
                        }
                    }
                    
                    
                    
                    function setupViewsCounter() {
                        if (typeof Storage !== 'undefined') {
                            const viewsKey = 'csb_views';
                            if (!localStorage.getItem(viewsKey)) {
                                // If the user is new, update the views counter
                                localStorage.setItem(viewsKey, '1');
                                updateCounter('updateViews').then(data => {
                                    document.getElementById('viewsCounter').innerHTML = `<span style="color: white;">${String(data.count).padStart(4, '0')}</span> views`;
                                    
                                    document.getElementById('modal-viewsCounter').textContent = 
  String(data.count).padStart(4, '0');
                                });
                                } else {
                                // If the user is returning, just fetch the current views count
                                updateCounter('getViews').then(data => {
                                    document.getElementById('viewsCounter').innerHTML = `<span style="color: white;">${String(data.count).padStart(4, '0')}</span> views`;
                                    
                                });
                            }
                        }
                    }
                    
                    async function updateViewCounter() {
                        try {
                            await fetch(`${scriptUrl}?sheet=counter&action=updateViews`);
                            } catch (error) {
                            console.error("Error updating view counter:", error);
                        }
                    }
                    
                    async function getViews() {
                        try {
                            const response = await fetch(`${scriptUrl}?sheet=counter&action=getViews`);
                            const data = await response.json();
                            return data.count; // Return the views count
                            } catch (error) {
                            console.error('Error fetching views:', error);
                            return 0; // Fallback to 0 if the request fails
                        }
                    }
                    
                    
                    
                    function setupVisitorCounter() {
                        if (typeof Storage !== 'undefined') {
                            const visitorKey = 'csb_visitor';
                            if (!localStorage.getItem(visitorKey)) {
                                localStorage.setItem(visitorKey, '1');
                                updateCounter('updateVisitors').then(data => {
                                    document.getElementById('visitorCounter').innerHTML = `<span style="color: white;">${String(data.count).padStart(4, '0')}</span> users`;
                                    
document.getElementById('modal-visitorCounter').textContent = 
  String(data.count).padStart(4, '0');                                    
                                });
                                } else {
                                updateCounter('getVisitors').then(data => {
                                    document.getElementById('visitorCounter').innerHTML = `<span style="color: white;">${String(data.count).padStart(4, '0')}</span> users`;
                                    
                                });
                            }
                        }
                    }
                    
                    
                    function setupLikeButton() {
                        const likeIcon = document.getElementById('likeIcon');
                        const likeCounterElement = document.getElementById('likeCounter');
                        const likeKey = 'csb_like';
                        
                        updateCounter('getLikes').then(data => {
                            likeCounterElement.textContent = String(data.count).padStart(3, '0');
                        });
                        
                        if (localStorage.getItem(likeKey)) {
                            likeIcon.classList.add('liked');
                        }
                        
                        document.getElementById('likeContainer').addEventListener('click', () => {
                            if (!localStorage.getItem(likeKey)) {
                                localStorage.setItem(likeKey, 'true');
                                likeIcon.classList.add('liked');
                                startBlinking(likeCounterElement);
                                
                                updateCounter('incrementLikes').then(data => {
                                    stopBlinking(likeCounterElement);
                                    animateCounter(likeCounterElement, String(data.count).padStart(3, '0'));
                                    showFeedback('Thank you!');
                                });
                                
                                document.getElementById('modal-likeCounter').textContent = 
  String(data.count).padStart(3, '0');
                                } else {
                                localStorage.removeItem(likeKey);
                                likeIcon.classList.remove('liked');
                                startBlinking(likeCounterElement);
                                
                                updateCounter('decrementLikes').then(data => {
                                    stopBlinking(likeCounterElement);
                                    animateCounter(likeCounterElement, String(data.count).padStart(3, '0'));
                                });
                            }
                        });
                    }
                    
                    // Apply existing pop animation
                    function animateCounter(element, newValue) {
                        element.classList.remove('like-animate');
                        void element.offsetWidth; // Trigger reflow
                        element.textContent = newValue;
                        element.classList.add('like-animate');
                    }
                    
                    // Start blinking animation
                    function startBlinking(element) {
                        element.classList.add('blinking');
                    }
                    
                    // Stop blinking animation
                    function stopBlinking(element) {
                        element.classList.remove('blinking');
                    }
                    
                    
                    async function initializeOrderNumber() {
                        try {
                            const response = await fetch(`${scriptUrl}?sheet=counter&action=getOrders`);
                            const data = await response.json();
                            cachedOrderNumber = data.count; // Store the current order number
                            } catch (error) {
                            console.error('Failed to fetch order number:', error);
                            cachedOrderNumber = 0; // Fallback to 0 if the request fails
                        }
                    }
                    
                    
              
              
              
              
              
              
              
              
              
              
              
              
              
              
function setupInstallsCounter() {
    // 1. Check if app is installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (!isInstalled) return;

    // 2. IndexedDB setup
    const DB_NAME = 'CSBInstallsDB';
    const STORE_NAME = 'installStore';
    const KEY = 'installRecorded';

    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
        }
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        
        // 3. Check existing record
        store.get(KEY).onsuccess = function(e) {
            const hasRecord = !!e.target.result;
            
            // 4. Only increment if no existing record
            if (!hasRecord) {
                fetch(`${scriptUrl}?sheet=counter&action=updateInstalls`)
                    .then(() => {
                        // 5. Mark as recorded AFTER successful increment
                        store.put(true, KEY);
                    })
                    .catch(console.error);
            }
            
            // 6. Always update display counter
            fetch(`${scriptUrl}?sheet=counter&action=getInstalls`)
                .then(res => res.json())
                .then(data => {
                    document.getElementById('modal-installsCounter').textContent = 
                        String(data.count).padStart(4, '0');
                });
        };
        
        tx.oncomplete = () => db.close();
    };
}


 
                    
                    // Initialize counters when the page loads
                    document.addEventListener('DOMContentLoaded', () => {
                        
                        setupViewsCounter();
                        updateViewCounter();
                        
                        setupVisitorCounter();
                        
                        setupLikeButton();
                        
                        initializeOrderNumber();
                        
                          setupInstallsCounter();
                        
                    });
                    