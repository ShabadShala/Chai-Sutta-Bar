                    
            // Update PWA
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/service-worker.js').then(reg => {
                    setInterval(() => {
                        reg.update().then(() => {
                            if (reg.installing || reg.waiting) {
                                console.log("New update found!");
                                showUpdateNotification(reg);
                            }
                        });
                    }, 5000); // Check every 5 seconds
                });
                
                
            }
            
            function showUpdateNotification(reg) {
                if (document.getElementById("update-notification")) {
                    return; // Prevent multiple notifications
                }
                
                let updateDiv = document.createElement("div");
                updateDiv.id = "update-notification";
                updateDiv.innerHTML = `
                <button id="refresh-btn" 
                style="position: fixed;
                left: 50%; /* Center horizontally */
                top: 50%; /* Center vertically */
                transform: translate(-50%, -50%); /* Adjust for exact center */
                background: #4CAF50;
                color: white;
                padding: 2rem;
                border: none;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19);
                cursor: pointer;
                font-size: 4rem;
                transition: transform 0.1s, box-shadow 0.1s;
                z-index: 1001;">
                Refresh<br>Updates
                </button>`;
                document.body.appendChild(updateDiv);
                
                document.getElementById("refresh-btn").addEventListener("click", function () {
                    console.log("Refresh button clicked!");
                    
                    // Check if a waiting service worker exists
                    if (reg.waiting) {
                        reg.waiting.postMessage({ action: "skipWaiting" });
                        
                        reg.waiting.addEventListener("statechange", () => {
                            if (reg.waiting.state === "activated") {
                                console.log("New Service Worker activated, reloading...");
                                window.location.reload();
                            }
                        });
                        
                        // Fallback: Force reload after 3 seconds if no statechange fires
                        setTimeout(() => {
                            console.log("Forcing reload as a fallback...");
                            window.location.reload();
                        }, 3000);
                        } else {
                        console.log("No waiting service worker found. Reloading...");
                        window.location.reload(); // Force refresh if no service worker is waiting
                    }
                });
            }
            
            