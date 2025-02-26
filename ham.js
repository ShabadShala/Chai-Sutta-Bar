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
        <!-- Close Button -->
        <div id="close-sidebar" class="close-btn">&times;</div>
        
        <!-- Header -->
        <div class="sidebar-header">
        <img src="icon-192.png" alt="CSB Logo" class="header-logo">
        <div class="header-text">
        <div class="header-title">Chai Sutta Bar</div>
        <div class="header-subtitle">Bagha Purana (Moga)</div>
        </div>
        </div>
        
        <!-- Scrollable Content Area -->
        <div class="scrollable-content">
        <!-- Like Container -->
        <div class="hsidebar-option" id="likeContainer">
        <div style="display: flex; align-items: center; gap: 3rem;">
        <img src="icons/like.svg" alt="Like Icon" class="menu-icon invert-icon" id="likeIcon">
        <span id="likeCounter"></span>
        </div>
        <div id="feedback"></div>
        </div>
        
        <!-- Install App -->
        <div class="hsidebar-option" id="install-app">
        <img src="icons/install.svg" alt="Install Icon" class="menu-icon invert-icon">
        Install App
        </div>
        
        <!-- Share App -->
        <div class="hsidebar-option" id="share-app">
        <img src="icons/share.svg" alt="Share Icon" class="menu-icon green-icon">
        Share App
        </div>
        </div>
        
        <!-- Footer -->
        <div class="footer-text" id="footer-info">
        <div class="footer-content">
        <img src="icon-192.png" alt="CSB Logo" class="footer-logo">
        <div>
        Version 1.20.3 x64<br>Developed by ShabadShala
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
                    alert("App installation is not available. Possible reasons may be:\n- App is already installed\n- You're trying this option on Desktop.");
                    
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
        
        <div class="qrcode-container">
        <img src="qrcode.png" alt="QR Code" class="qrcode" id="qr-code-img">
        </div>
        <div class="modal-buttons">
        <button id="share-qr-code">
        <img src="icons/share.svg" alt="Code" width="14" height="14" class="invert-icon" style="margin-right: 3px; vertical-align: middle;">
        Code
        </button>
        <button id="save-qr-code">
        <img src="icons/save.svg" alt="Save" width="14" height="14" class="invert-icon" style="margin-right: 3px; vertical-align: middle;">
        Save
        </button>
        <button id="print-qr-code">
        <img src="icons/print.svg" alt="Print" width="14" height="14" class="invert-icon" style="margin-right: 3px; vertical-align: middle;">
        Print
        </button>
        <button id="share-link">
        <img src="icons/share.svg" alt="Link" width="14" height="14" class="invert-icon" style="margin-right: 3px; vertical-align: middle;">
        Link
        </button>
        </div>
        </div>`;
        
        document.body.appendChild(shareModal);
        
        
        
        
        document.body.addEventListener('click', (event) => {
            if (event.target.closest('#share-app')) {
                toggleSidebar(false); // Close the sidebar
                openModalStandalone('share-modal'); // Open the share modal
            }
        });
        
        setupModalTriggers('share-modal'); 
        
        
        
        
        
        
        // Share link
        document.getElementById('share-link').addEventListener('click', () => {
            // Logic to share the link
            if (navigator.share) {
                navigator.share({
                    url: 'https://shabadshala.github.io/Chai-Sutta-Bar/',
                    title: 'Share CSB-BPA Link',
                }).then(() => console.log('Link shared successfully'))
                .catch((error) => console.log('Error sharing link:', error));
                } else {
                alert('Sharing not supported on this device.');
            }
        });
        
        
        //Save QR code image to local storage
        document.getElementById('save-qr-code').addEventListener('click', async () => {
            try {
                const imgElement = document.getElementById('qr-code-img');
                if (!imgElement) throw new Error('QR Code image element not found');
                
                let blob;
                if (imgElement.src.startsWith('data:')) {
                    // If the image is already a data URL, convert it to a blob
                    blob = dataURLtoBlob(imgElement.src);
                    } else {
                    // Fetch the image from the file path
                    const response = await fetch(imgElement.src);
                    if (!response.ok) throw new Error('Failed to fetch QR code');
                    blob = await response.blob();
                }
                
                // Create a URL for the blob
                const url = URL.createObjectURL(blob);
                
                // Create a temporary anchor element to trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Chai-Sutta-Bar-BPA-QR-Code.png'; // Set the filename
                document.body.appendChild(a);
                a.click(); // Trigger the download
                document.body.removeChild(a); // Clean up
                URL.revokeObjectURL(url); // Release the object URL
                
                console.log('QR code saved successfully');
                } catch (error) {
                console.error('Save failed:', error);
                alert(`Save failed: ${error.message}`);
            }
        });
        
        
        
        
        
        
        
        

        document.addEventListener("DOMContentLoaded", function () {
            // Function to share the QR Code
            function shareQRCode() {
                const qrImg = document.getElementById("qr-code-img");
                if (!qrImg) {
                    alert("QR Code not found!");
                    return;
                }
                
                // Convert QR code image to a Blob URL
                fetch(qrImg.src)
                .then(response => response.blob())
                .then(blob => {
                    const file = new File([blob], "qrcode.png", { type: blob.type });
                    
                    if (navigator.share) {
                        navigator.share({
                            title: "Scan this QR Code",
                            text: "Scan this QR code to access the app.",
                            files: [file],
                        })
                        .then(() => console.log("Successfully shared"))
                        .catch(err => console.error("Error sharing:", err));
                        } else {
                        alert("Web Share API not supported. Please download and share manually.");
                    }
                })
                .catch(err => console.error("Error fetching QR Code:", err));
            }
            
            // Function to print the QR Code
function printQRCode() {
    const qrImg = document.getElementById("qr-code-img");
    if (!qrImg) {
        alert("QR Code not found!");
        return;
    }

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
        <html>
        <head>
        <title>Print QR Code</title>
        <style>
        body { text-align: center; padding: 20px; }
        img { max-width: 100%; height: auto; }
        </style>
        </head>
        <body>
        
        <img src="${qrImg.src}" alt="QR Code">
        
        <script>
        window.onload = function() { window.print(); };
        </script>
        
        </body>
        </html>
    `);

    printWindow.document.close();
}

            
            
            // Attach event listeners
            document.getElementById("share-qr-code")?.addEventListener("click", shareQRCode);
            document.getElementById("print-qr-code")?.addEventListener("click", printQRCode);
        });
        
        
        
        
        
        
        
        
        
        
        
        
    } //hsidebar
    
    // Call the setup function
    setupHamburgerMenu();
    
    })(); // IIFE Ends
    
    
    
    
    
    
    
    
    
    
    
    //Hide the Save (save-qr-code) button from project
    document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("save-qr-code");
    if (saveButton) {
    saveButton.style.display = "none"; // Completely hide the button
    }
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
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
    
    
        