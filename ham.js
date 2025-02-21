                    
                    
                    function setupHamburgerMenu() {
                        // Create Hamburger Button
                        const hamburgerButton = document.createElement('div');
                        hamburgerButton.id = 'hamburger-button';
                        hamburgerButton.innerHTML = `
                        <div class="hamburger-lines">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        </div>
                        `;
                        
                        // Create hsidebar container
                        const hsidebarContainer = document.createElement('div');
                        hsidebarContainer.className = 'hsidebar-container';
                        
                        // Append it to the header
                        document.querySelector('.header').appendChild(hamburgerButton);
                        
                        // Create Sidebar (fixed missing close button and footer)
                        const hsidebar = document.createElement('div');
                        hsidebar.id = 'hsidebar';
                        hsidebar.innerHTML = `
                        <div class="hsidebar-content">
                        
                        <div id="close-sidebar" class="close-btn">&times;</div>
                        
                        <div class="hsidebar-option" id="likeContainer">
                        <div style="display: flex; align-items: center; gap: 3rem;">
                        <img src="icons/like.svg" alt="Like Icon" class="menu-icon invert-icon" id="likeIcon">
                        <span id="likeCounter"></span>
                        </div>
                        <div id="feedback"></div>
                        </div>
                        
                        <div class="hsidebar-option" id="install-app">
                        <img src="icons/install.svg" alt="Install Icon" class="menu-icon invert-icon">
                        Install CSB App
                        </div>
                        <div class="hsidebar-option" id="share-app-link">
                        <img src="icons/share.svg" alt="Share Icon" class="menu-icon green-icon">
                        Share App Link
                        </div>
                        <div class="hsidebar-option" id="show-qrcode">
                        <img src="icons/qr-code.svg" alt="Install Icon" class="menu-icon green-icon">
                        App QR Code
                        </div>
                        <div class="hsidebar-option" id="device-screen-info">
                        <img src="icons/display.svg" alt="Install Icon" class="menu-icon invert-icon">
                        Screen Info
                        </div>
                        
                        <div class="footer-text" id="footer-info">
                        <div class="footer-content">
                        <img src="icon-192.png" alt="CSB Logo" class="footer-logo">
                        <div>
                        Chai Sutta Bar - BPA<br>Version 1.20.3 x64<br>Developed by Brar
                        </div>
                        </div>
                        </div>                        
                        </div>`;
                        
                        hsidebarContainer.appendChild(hsidebar);
                        document.body.appendChild(hsidebarContainer);
                        
                        // pwa
                        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
                            const installOption = document.getElementById('install-app');
                            installOption.classList.add('disabled-option');
                            installOption.onclick = null;  // Remove click handler
                        }
                        
                        // Create Backdrop
                        const overlay = document.createElement('div');
                        overlay.id = 'hsidebar-overlay';
                        document.body.appendChild(overlay);
                        
                        
                        // Open Sidebar
                        hamburgerButton.addEventListener('click', () => {
                            hsidebar.classList.add('open');
                            overlay.style.display = 'block';
                            document.body.style.overflow = 'hidden'; 
                            document.documentElement.style.overflow = 'hidden'; 
                        });
                        
                        // Close Sidebar when clicking outside
                        document.addEventListener(
                        'click',
                        (event) => {
                            if (!hsidebar.contains(event.target) && !hamburgerButton.contains(event.target)) {
                                hsidebar.classList.remove('open');
                                overlay.style.display = 'none';
                                document.body.style.overflow = ''; // Unlock scrolling
                                document.documentElement.style.overflow = ''; // Unlock scrolling
                            }
                        },
                        true // Use capture phase
                        );
                        
                        // Close Sidebar on Escape Key
                        document.addEventListener('keydown', (e) => {
                            if (e.key === "Escape") {
                                hsidebar.classList.remove('open');
                                overlay.style.display = 'none';
                                document.body.style.overflow = '';
                                document.documentElement.style.overflow = ''; // Unlock scrolling on html
                            }
                        });
                        
                        // Close Sidebar when clicking on the cross button
                        document.getElementById('close-sidebar').addEventListener('click', () => {
                            hsidebar.classList.remove('open');
                            overlay.style.display = 'none';
                            document.body.style.overflow = ''; // Unlock scrolling
                            document.documentElement.style.overflow = ''; // Unlock scrolling
                        });
                        
                        // Swipe Left to Close Sidebar (Mobile Gesture)
                        let startX;
                        let startY;
                        
                        hsidebar.addEventListener('touchstart', (e) => {
                            const touchStart = e.touches[0];
                            startX = touchStart.clientX;
                            startY = touchStart.clientY;
                        });
                        
                        hsidebar.addEventListener('touchend', (e) => {
                            const touchEnd = e.changedTouches[0];
                            const deltaX = touchEnd.clientX - startX;
                            const deltaY = touchEnd.clientY - startY;
                            
                            if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -50) {
                                hsidebar.classList.remove('open');
                                overlay.style.display = 'none';
                                document.body.style.overflow = '';
                                document.documentElement.style.overflow = '';
                                document.body.style.height = '';
                                document.documentElement.style.height = '';
                            }
                        });
                        
                        
                        
                        
                        // Add event listeners to options to activate overlay and lock scrolling
                        const options = document.querySelectorAll('.hsidebar-option');
                        options.forEach(option => {
                            option.addEventListener('click', () => {
                                overlay.style.display = 'block';
                                document.body.style.overflow = 'hidden'; 
                                document.documentElement.style.overflow = 'hidden'; 
                            });
                        });
                        
                        // Install App
                        document.getElementById('install-app').addEventListener('click', () => {
                            if (deferredPrompt) {
                                deferredPrompt.prompt();
                                deferredPrompt.userChoice.then((choiceResult) => {
                                    console.log(choiceResult.outcome === 'accepted' ? 'User accepted' : 'User dismissed');
                                    deferredPrompt = null;
                                });
                            }
                        });
                        
                        // Add Share functionality
                        document.getElementById('share-app-link').addEventListener('click', () => {
                            const appLink = "https://shabadshala.github.io/Chai-Sutta-Bar/";
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Chai Sutta Bar',
                                    url: appLink
                                }).catch(console.error);
                                } else {
                                navigator.clipboard.writeText(appLink).then(() => {
                                    showFeedback('Link copied');
                                });
                            }
                        });
                        
                        // Create QR Code Modal
                        const qrCodeModal = document.createElement('div');
                        qrCodeModal.id = 'qr-code-modal';
                        qrCodeModal.innerHTML = `
                        <div class="modal-content">
                        <span id="close-qr-modal">&times;</span>
                        <img src="qrcode.png" alt="QR Code">
                        </div>
                        `;
                        document.body.appendChild(qrCodeModal);
                        
                        // Fixed QR Code handler
                        document.getElementById('show-qrcode').addEventListener('click', () => {
                            hsidebar.classList.remove('open');
                            overlay.style.display = 'none';
                            qrCodeModal.style.display = 'block'; // Use the already defined variable
                        });
                        
                        // Close QR Code Modal
                        document.getElementById('close-qr-modal').addEventListener('click', () => {
                            qrCodeModal.style.display = 'none';
                            document.body.style.overflow = ''; // Unlock scrolling
                            document.documentElement.style.overflow = ''; // Unlock scrolling
                        });
                        
                        // Close QR Code Modal on Click Outside
                        window.addEventListener('click', (event) => {
                            if (event.target === qrCodeModal) {
                                qrCodeModal.style.display = 'none';
                                document.body.style.overflow = ''; // Unlock scrolling
                                document.documentElement.style.overflow = ''; // Unlock scrolling
                            }
                        });
                        
                        // Show Device Screen Info
                        document.getElementById('device-screen-info').addEventListener('click', function() {
                            showDeviceInfoModal();
                        });
                        
                        
                    } //hdidebar
                    
                    // Call the setup function
                    setupHamburgerMenu();
                    
                    
                    
                    
                    
                    function showDeviceInfoModal() {
                        // Hide the sidebar when showing the modal
                        const hsidebar = document.getElementById('hsidebar');
                        const overlay = document.getElementById('hsidebar-overlay');
                        hsidebar.classList.remove('open');
                        overlay.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                        
                        // Create modal container
                        const modalContainer = document.createElement('div');
                        modalContainer.style.position = 'fixed';
                        modalContainer.style.top = '0';
                        modalContainer.style.left = '0';
                        modalContainer.style.width = '100%';
                        modalContainer.style.height = '100%';
                        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        modalContainer.style.display = 'flex';
                        modalContainer.style.justifyContent = 'center';
                        modalContainer.style.alignItems = 'center';
                        modalContainer.style.zIndex = '1000';
                        
                        // Create modal content container
                        const modalContent = document.createElement('div');
                        modalContent.style.padding = '20px';
                        modalContent.style.fontFamily = 'Arial, sans-serif';
                        modalContent.style.backgroundColor = '#fff';
                        modalContent.style.color = '#333';
                        modalContent.style.borderRadius = '8px';
                        modalContent.style.width = '80%';
                        modalContent.style.maxWidth = '500px';
                        modalContent.style.fontSize = '13px';
                        modalContent.style.position = 'relative';
                        modalContent.style.textAlign = 'center';
                        
                        // Function to update screen info dynamically
                        function updateScreenInfo() {
                            const screenWidth = window.screen.width;
                            const screenHeight = window.screen.height;
                            const innerWidth = window.innerWidth;
                            const innerHeight = window.innerHeight;
                            const pixelRatio = window.devicePixelRatio;
                            const isTouchDevice = 'ontouchstart' in window ? "Touch device" : "Non-touch device";
                            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                            const deviceType = (innerWidth <= 767) ? "Mobile or Tablet" : "Desktop";
                            
                            // Get OS and Browser
                            const osName = getOSName();
                            const browserVersion = getBrowserVersion();
                            
                            modalContent.innerHTML = `
                            <style>
                            #modal-content p {
                            margin-bottom: 3rem;
                            }
                            </style>
                            <div id="modal-content">
                            <h3 style="font-size: 6rem; font-weight: bold; margin-bottom: 20px;">Screen Info</h3>
                            <p><strong>Screen Resolution:</strong> ${screenWidth} x ${screenHeight}</p>
                            <p><strong>Viewport Size:</strong> ${innerWidth} x ${innerHeight}</p>
                            <p><strong>Device Pixel Ratio:</strong> ${pixelRatio}</p>
                            <p><strong>Effective DPI/PPI:</strong> ${96 * pixelRatio} dpi</p>
                            <p><strong>Device Type:</strong> ${deviceType}</p>
                            <p><strong>Touch Events Support:</strong> ${isTouchDevice}</p>
                            <p><strong>Operating System:</strong> ${osName}</p>
                            <p><strong>Internet Browser:</strong> ${browserVersion}</p>
                            <p><strong>Time Zone:</strong> ${timeZone}</p>
                            <button id="copy-button" style="margin-top: 20px; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy Text</button>
                            <button id="close-modal" style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; background-color: transparent; color: #333; border: 1px solid #333; border-radius: 50%; font-size: 18px; cursor: pointer;">&times;</button>
                            </div>
                            `;
                            
                            
                            // Copy text functionality
                            const copyButton = modalContent.querySelector('#copy-button');
                            copyButton.addEventListener('click', function (event) {
                                event.stopPropagation();
                                const text = modalContent.innerText;
                                navigator.clipboard.writeText(text).then(() => {
                                    copyButton.textContent = "Text Copied";
                                    copyButton.style.backgroundColor = "gray";
                                    copyButton.style.cursor = "not-allowed";
                                    copyButton.disabled = true;
                                }).catch(err => console.error('Failed to copy:', err));
                            });
                            
                            
                            // Close modal functionality
                            modalContent.querySelector('#close-modal').addEventListener('click', closeModal);
                        }
                        
                        // Append modal content and add to DOM
                        modalContainer.appendChild(modalContent);
                        document.body.appendChild(modalContainer);
                        updateScreenInfo(); // Initial call to set data
                        
                        // Update screen info dynamically on resize
                        window.addEventListener('resize', updateScreenInfo);
                        
                        // Function to close modal
                        function closeModal() {
                            document.body.removeChild(modalContainer);
                            document.body.style.overflow = '';
                            window.removeEventListener('resize', updateScreenInfo); // Cleanup event listener
                        }
                        
                        // Close modal on clicking outside
                        modalContainer.addEventListener('click', function (event) {
                            if (event.target === modalContainer) {
                                closeModal();
                            }
                        });
                        
                        // Close modal on Escape key
                        window.addEventListener('keydown', function (event) {
                            if (event.key === 'Escape') {
                                closeModal();
                            }
                        });
                    }
                    
                    // Functions to detect OS and Browser
                    function getOSName() {
                        let ua = navigator.userAgent;
                        if (ua.indexOf("Windows NT 10.0") !== -1) return "Windows 10/11";
                        if (ua.indexOf("Windows NT 6.3") !== -1) return "Windows 8.1";
                        if (ua.indexOf("Windows NT 6.2") !== -1) return "Windows 8";
                        if (ua.indexOf("Windows NT 6.1") !== -1) return "Windows 7";
                        if (ua.indexOf("Mac OS X") !== -1) return "macOS";
                        if (ua.indexOf("Android") !== -1) return "Android";
                        if (ua.indexOf("Linux") !== -1) return "Linux";
                        if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) return "iOS";
                        return "Unknown OS";
                    }
                    
                    function getBrowserVersion() {
                        let ua = navigator.userAgent;
                        let browserInfo = "Unknown Browser";
                        
                        let edgeMatch = ua.match(/Edg\/(\d+\.\d+)/);
                        let chromeMatch = ua.match(/Chrome\/(\d+\.\d+)/);
                        let firefoxMatch = ua.match(/Firefox\/(\d+\.\d+)/);
                        let safariMatch = ua.match(/Version\/(\d+\.\d+).*Safari/);
                        let operaMatch = ua.match(/OPR\/(\d+\.\d+)/);
                        
                        if (edgeMatch) {
                            browserInfo = "Edge " + edgeMatch[1];
                            } else if (chromeMatch) {
                            browserInfo = "Chrome " + chromeMatch[1];
                            } else if (firefoxMatch) {
                            browserInfo = "Firefox " + firefoxMatch[1];
                            } else if (safariMatch) {
                            browserInfo = "Safari " + safariMatch[1];
                            } else if (operaMatch) {
                            browserInfo = "Opera " + operaMatch[1];
                        }
                        
                        return browserInfo;
                    }
                    
                    
                    
                    
                    
                    let deferredPrompt; // Variable to hold the deferred prompt event
                    
                    // Listen for the beforeinstallprompt event
                    window.addEventListener("beforeinstallprompt", (e) => {
                        e.preventDefault(); // Prevent the default prompt from showing automatically
                        deferredPrompt = e; // Store the event so we can trigger it later
                        
                        // Optionally, show a custom install button here if needed
                        // document.getElementById('install-button').style.display = 'block'; 
                        
                        // Automatically trigger the prompt after a delay
                        setTimeout(() => {
                            deferredPrompt.prompt(); // Show the install prompt
                            deferredPrompt.userChoice.then((choiceResult) => {
                                // Handle the user's response
                                if (choiceResult.outcome === "accepted") {
                                    console.log("User accepted the install prompt");
                                    } else {
                                    console.log("User dismissed the install prompt");
                                }
                                deferredPrompt = null; // Reset the deferred prompt
                            });
                        }, 3000); // Adjust delay as needed (e.g., 3 seconds)
                    });