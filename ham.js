(function() {
    function setupHamburgerMenu() {
        // Create Hamburger Button
        // Prevent duplicate hamburger button
        let hamburgerButton = document.getElementById('hamburger-button');
        if (!hamburgerButton) {
            hamburgerButton = document.createElement('div');
            hamburgerButton.id = 'hamburger-button';
            hamburgerButton.innerHTML = `
            <div class="hamburger-lines">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            </div>`;
        }
        
        // Create hsidebar container
        const hsidebarContainer = document.createElement('div');
        hsidebarContainer.className = 'hsidebar-container';
        
        // Append it to the header
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(hamburgerButton);
            } else {
            console.warn("Header element not found! Cannot append hamburger button.");
        }
        
        
        // Create Sidebar
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
        Install App
        </div>
        
        <div class="hsidebar-option" id="share-app">
        <img src="icons/share.svg" alt="Share Icon" class="menu-icon green-icon">
        Share App
        </div>
        
        <div class="footer-text" id="footer-info">
        <div class="footer-content">
        <img src="icon-192.png" alt="CSB Logo" class="footer-logo">
        <div>
        Chai Sutta Bar - BPA<br>Version 1.20.3 x64<br>Developed by ShabadShala
        </div>
        </div>
        </div>                        
        </div>`;
        
        hsidebarContainer.appendChild(hsidebar);
        if (!document.body.contains(hsidebarContainer)) {
            document.body.appendChild(hsidebarContainer);
        }
        
        
        
        // sidebar-close-cross    
        hsidebar.querySelector('#close-sidebar').addEventListener('click', () => toggleSidebar(false));
        
        // sidebar-close-outside
        document.addEventListener('click', (event) => {
            if (!hsidebar.contains(event.target) && !hamburgerButton.contains(event.target) && hsidebar.classList.contains('open')) {
                setTimeout(() => toggleSidebar(false), 10);
            }
        });
        
        
        // sidebar-close-Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                toggleSidebar(true);
            }
        });
        
        // sidebar-close-Swipe Left to Close Sidebar (Mobile Gesture)
        let startX, startY;
        hsidebar.addEventListener('touchstart', (e) => {
            const touchStart = e.touches[0];
            startX = touchStart.clientX;
            startY = touchStart.clientY;
        });
        
        hsidebar.addEventListener('touchend', (e) => {
            const touchEnd = e.changedTouches[0];
            const deltaX = touchEnd.clientX - startX;
            const deltaY = touchEnd.clientY - startY;
            
            if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 30 && deltaX < 0) {
                toggleSidebar(false);
            }
        });
        
        // sidebar-close-Back button on touch    
        window.addEventListener("popstate", function () {
            if (hsidebar.classList.contains("open")) {
                toggleSidebar(false);
                if (history.state && history.state.sidebarOpen) {
                    history.back();
                    } else {
                    history.replaceState(null, "", location.href);
                }
            }
        });
        
        // Ensure a new history state is added when the sidebar is opened (For back button)
        // Open-Close Sidebar
        function toggleSidebar(forceClose = false) {
            const sidebar = document.getElementById('hsidebar');
            if (!sidebar) return;
            const isOpen = sidebar.classList.contains('open');
            
            if (isOpen || forceClose) {
                sidebar.classList.remove('open');
                hideOverlay();
                if (history.state && history.state.sidebarOpen) {
                    history.back(); // Properly navigate back if sidebar was opened
                    } else {
                    history.replaceState(null, "", location.href);
                }
                } else {
                sidebar.classList.add('open');
                showOverlay(0.9);
                history.pushState({ sidebarOpen: true }, "", location.href);
            }
        }
        
        
        // Update event listeners:
        hamburgerButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent body click event from closing instantly
            toggleSidebar();
        });
        
        
        
        
        
        
        
        
        
        
        function showOverlay(opacity = 0.9) {
            const hoverlay = document.getElementById('hsidebar-overlay') || createOverlay();
            hoverlay.style.display = 'block';
            hoverlay.style.opacity = opacity;
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
        
        function hideOverlay() {
            const hoverlay = document.getElementById('hsidebar-overlay');
            if (hoverlay) {
                hoverlay.style.display = 'none';
            }
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        
        function createOverlay() {
            const hoverlay = document.createElement('div');
            hoverlay.id = 'hsidebar-overlay';
            document.body.appendChild(hoverlay);
            return hoverlay;
        }
        
        
        
        
        
        
        
        
        
        
        
        
        // opening modals inside the sidebar
        function openModal(modalId, keepSidebar = false) {
            document.getElementById(modalId).style.display = 'block';
            showOverlay(0.9);
            toggleSidebar(keepSidebar);
        }
        
        // opening modals separately
        function openModalStandalone(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex'; // Use flex to center the modal
                modal.style.top = '0'; // Reset top position
                modal.style.left = '0'; // Reset left position
                showOverlay(0.9); // Show the overlay
            }
        }
        
        
        
        
        
        
        
        
        
        function setupModalTriggers(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            function closeModal() {
                modal.style.display = "none";
                hideOverlay();
                history.back(); // Support Android back button
            }
            
            // 1️⃣ Close on clicking the close button (X)
            modal.querySelector(".close-btn")?.addEventListener("click", closeModal);
            
          // 2️⃣ Close on pressing the Escape key
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && modal.style.display != "none") closeModal();
            });
            
            // 3️⃣ Close on clicking outside the modal
    modal.addEventListener("click", (e) => {
        if (e.target === modal && modal.style.display != "none") { // Ensures it only closes when clicking the backdrop
            closeModal();
        }
    });
            
            // 4️⃣ Close on swipe (Mobile)
            let startX;
            modal.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
            modal.addEventListener("touchend", (e) => {
                if (startX - e.changedTouches[0].clientX > 50) closeModal(); // Swipe left to close
            });
            
            // 5️⃣ Close on Android back button
            window.addEventListener("popstate", () => {
                if (modal.style.display === "block") closeModal();
            });
            
            // Open Modal Function
            window.openModal = function (modalId) {
                document.getElementById(modalId).style.display = "block";
                showOverlay();
                history.pushState({ modalOpen: true }, "", location.href);
            };
        }
        
        
        
        
        
        
        
        
        
        
        // Install App
        const installAppButton = document.getElementById('install-app');
        if (installAppButton) {
            installAppButton.addEventListener('click', () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        console.log(choiceResult.outcome === "accepted" ? "User installed the app" : "User dismissed the install prompt");
                        deferredPrompt = null;
                    });
                    } else {
                    alert("App installation is not available at the moment.");
                }
            });
        }
        
        
        
        // Disable pwa buton is installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            const installOption = document.getElementById('install-app');
            if (installOption) {
                installOption.classList.add('disabled-option');
                installOption.replaceWith(installOption.cloneNode(true)); // Remove event listeners
            }
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        const shareModal = document.createElement('div');
        shareModal.id = 'share-modal';
        shareModal.className = 'modal';
        shareModal.innerHTML = `
        <div class="modal-content">
        <div class="close-btn">&times;</div>
        <h2>Share App</h2>
        <div class="qrcode-container">
        <img src="qrcode.png" alt="QR Code" class="qrcode">
        </div>
        <div class="modal-buttons">
        <button id="share-qr-code">Share Code</button>
        <button id="share-link">Share Link</button>
        </div>
        </div>
        `;
        document.body.appendChild(shareModal);
        
        
        
        
document.body.addEventListener('click', (event) => {
    if (event.target.closest('#share-app')) {
        toggleSidebar(false); // Close the sidebar
        openModalStandalone('share-modal'); // Open the share modal
    }
});
        
        document.getElementById('share-qr-code').addEventListener('click', () => {
            // Logic to share the QR code image
            if (navigator.share) {
                navigator.share({
                    files: [new File(['qrcode.png'], 'qrcode.png', { type: 'image/png' })],
                    title: 'Share QR Code',
                }).then(() => console.log('QR Code shared successfully'))
                .catch((error) => console.log('Error sharing QR code:', error));
                } else {
                alert('Sharing not supported on this device.');
            }
        });
        
        document.getElementById('share-link').addEventListener('click', () => {
            // Logic to share the link
            if (navigator.share) {
                navigator.share({
                    url: 'https://shabadshala.github.io/Chai-Sutta-Bar/',
                    title: 'Share Link',
                }).then(() => console.log('Link shared successfully'))
                .catch((error) => console.log('Error sharing link:', error));
                } else {
                alert('Sharing not supported on this device.');
            }
        });
        
    
        
        
        
       setupModalTriggers('share-modal'); 
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    } //hsidebar
    
    // Call the setup function
    setupHamburgerMenu();
    
})(); // IIFE Ends






























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
