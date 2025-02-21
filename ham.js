

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
    
    
    // pwa
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        const installOption = document.getElementById('install-app');
        installOption.classList.add('disabled-option');
        installOption.onclick = null;  // Remove click handler
    }
    
    
    
    
    
    
    
    
    
    
    
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
    
    
    
    // QR-Click
    document.getElementById('show-qrcode').addEventListener('click', () => {
        showModal('qr');
    });
    
    
    // QR-Close button
    document.getElementById('close-qr-modal').addEventListener('click', () => {
        hideModal('qr');
    });
    
    // QR-Close-outside
    window.addEventListener('click', (event) => {
        if (event.target === qrCodeModal) {
            qrCodeModal.style.display = 'none';
            document.body.style.overflow = ''; // Unlock scrolling
            document.documentElement.style.overflow = ''; // Unlock scrolling
        }
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // Create Device Info Modal
    const deviceModal = document.createElement('div');
deviceModal.id = 'device-modal';
deviceModal.style.display = 'none'; // Start hidden
deviceModal.innerHTML = `
  <div class="modal-content" style="padding: 20px; font-family: Arial, sans-serif; background-color: #2b2b2b; color: #f5f5f5; border-radius: 8px; width: 80%; max-width: 500px; font-size: 14px; position: relative; text-align: center; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);">
    <span id="close-device-modal" style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; background-color: #444; color: #f5f5f5; border: none; border-radius: 50%; font-size: 18px; cursor: pointer;">&times;</span>
    <h2 style="font-size: 22px; font-weight: bold; margin-bottom: 10px;">Screen Info</h2>
    <div id="device-modal-content" style="font-size: 14px;"></div>
  </div>
`;


    document.body.appendChild(deviceModal);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // Unified Modal Management
    const modals = {
        qr: qrCodeModal,
        device: deviceModal
    }; 
    
function showModal(type) {
    hsidebar.classList.remove('open');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    if (type === 'qr') {
        qrCodeModal.style.display = 'block';
    } else if (type === 'device') {
        // Change this line to use flex display
        deviceModal.style.display = 'flex'; // Instead of 'block'
    }
}
    
function hideModal(type) {
    if (type === 'qr') {
        qrCodeModal.style.display = 'none';
    } else if (type === 'device') {
        deviceModal.style.display = 'none';
    }
    
    // CORRECTED: Check actual display status for both modals
    const isQRVisible = qrCodeModal.style.display !== 'none';
    const isDeviceVisible = deviceModal.style.display !== 'none';
    
    if (!isQRVisible && !isDeviceVisible) {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}
    
    // Device Info Handler
    document.getElementById('device-screen-info').addEventListener('click', () => {
        showDeviceInfoModal(); // This should trigger everything
    });
    
    
    
    
    
    // Unified Close Handler Close-Esc
function handleModalClose(e) {
    // Get actual displayed state using computed styles
    const qrDisplay = getComputedStyle(qrCodeModal).display;
    const deviceDisplay = getComputedStyle(deviceModal).display;

    // Handle ESC key
    if (e.key === "Escape") {
        if (qrDisplay !== 'none') hideModal('qr');
        if (deviceDisplay !== 'none') hideModal('device');
    }
    
    // Handle overlay clicks
    if (e.target === overlay) {
        if (qrDisplay !== 'none') hideModal('qr');
        if (deviceDisplay !== 'none') hideModal('device');
    }
}
    
    // Event Listeners
    document.addEventListener(
        'click',
        (event) => {
            const isDeviceModalOpen = deviceModal.style.display === 'block';
            const isQRModalOpen = qrCodeModal.style.display === 'block';
            
            if (hsidebar.classList.contains('open') && 
                !hsidebar.contains(event.target) && 
                !hamburgerButton.contains(event.target) &&
                !isDeviceModalOpen &&
                !isQRModalOpen) {
                hsidebar.classList.remove('open');
                overlay.style.display = 'none';
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        },
        true
    );
    document.addEventListener('keydown', handleModalClose);            
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    function showDeviceInfoModal() {
        
        
        // Create modal content container
        const modalContent = document.getElementById('device-modal-content');
        
        
        
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
            <h3 style="margin-bottom: 20px;"></h3>
            <p><strong>Screen Resolution:</strong> ${screenWidth}x${screenHeight}</p>
            <p><strong>Viewport Size:</strong> ${innerWidth}x${innerHeight}</p>
            <p><strong>Device Pixel Ratio:</strong> ${pixelRatio}</p>
            <p><strong>Effective DPI/PPI:</strong> ${96 * pixelRatio} dpi</p>
            <p><strong>Device Type:</strong> ${deviceType}</p>
            <p><strong>Touch Events Support:</strong> ${isTouchDevice}</p>
            <p><strong>Operating System:</strong> ${osName}</p>
            <p><strong>Internet Browser:</strong> ${browserVersion}</p>
            <p><strong>Time Zone:</strong> ${timeZone}</p>
            <button id="copy-button" style="margin-top: 20px; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy Text</button>
            `;
            
            
            // Add copy functionality
            document.getElementById('copy-button').addEventListener('click', () => {
                const text = modalContent.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    const btn = document.getElementById('copy-button');
                    btn.textContent = "Copied!";
                    btn.style.backgroundColor = "#888";
                });
            });
        }
        
        
        // Initial update
        updateScreenInfo();
        
        // Show the modal
        showModal('device');
        
        // info-close button
        document.getElementById('close-device-modal').addEventListener('click', () => {
            hideModal('device');
            window.removeEventListener('resize', updateScreenInfo);
        });
        
        
    
    // Info-Close-outside
    window.addEventListener('click', (event) => {
        if (event.target === deviceModal) {
            deviceModal.style.display = 'none';
            document.body.style.overflow = ''; // Unlock scrolling
            document.documentElement.style.overflow = ''; // Unlock scrolling
        }
    });
        
        
        
        
        
        
        
        // Add resize listener
        window.addEventListener('resize', updateScreenInfo);
    }
    
    
} //hdidebar

// Call the setup function
setupHamburgerMenu();


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