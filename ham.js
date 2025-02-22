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
    
    
    // Ensure only one hoverlay exists
    let hoverlay = document.getElementById('hsidebar-overlay');
    if (!hoverlay) {
        hoverlay = document.createElement('div');
        hoverlay.id = 'hsidebar-overlay';
        document.body.appendChild(hoverlay);
    }
    
    // Function to show hoverlay (applies uniform dimming)
    function showhoverlay(opacity = 0.9) {
        hoverlay.style.display = 'block';
        hoverlay.style.opacity = opacity; // Adjust opacity dynamically
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
    
    // Function to hide hoverlay
    function hidehoverlay() {
        hoverlay.style.display = 'none';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
    
    
    
    
    
    
    
    // Open Sidebar
    function openSidebar() {
        hsidebar.classList.add('open');
        showhoverlay(0.9); // Default dimming for sidebar
    }
    hamburgerButton.addEventListener('click', openSidebar);
    
    // sidebar-close-cross button
    function closeSidebar() {
        hsidebar.classList.remove('open');
        hidehoverlay();
    }
    document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
    
    // sidebar-close-outside
    document.addEventListener('click', (event) => {
        if (!hsidebar.contains(event.target) && !hamburgerButton.contains(event.target)) {
            closeSidebar();
        }
    }, true);
    
    
    
    // sidebar-close-Swipe Left to Close Sidebar (Mobile Gesture)
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
            closeSidebar();
            document.body.style.height = '';
            document.documentElement.style.height = '';
        }
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    // Add event listeners to all options  
    document.querySelectorAll('.hsidebar-option').forEach(option => {
        option.addEventListener('click', (event) => {           
            closeSidebar();          
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
    
    // QR-Close-cross button
    document.getElementById('close-qr-modal').addEventListener('click', () => {
        hideModal('qr');
    });
    
    // QR-Close-outside
    window.addEventListener('click', (event) => {
        if (event.target === qrCodeModal) {
            hideModal('qr');
        }
    });
    
    
    
    
    // Create Device Info Modal
    const deviceModal = document.createElement('div');
    deviceModal.id = 'device-modal';
    deviceModal.style.display = 'none';

    deviceModal.innerHTML = `
    <div class="modal-content" id="device-modal-content">
    <span id="close-device-modal" class="close-btn">&times;</span>
    <h2>Screen Information</h2>
    <div id="device-info-dynamic"></div>
    <button id="copy-device-info" class="copy-button">
    Copy Text
    </button>
    </div>
    `;
    document.body.appendChild(deviceModal);
    
    
    
    // info-click
    document.getElementById('device-screen-info').addEventListener('click', () => {
        showDeviceInfoModal(); // This should trigger everything
    });
    
    // info-close-cross button
    document.getElementById('close-device-modal').addEventListener('click', () => {
        hideModal('device');
        window.removeEventListener('resize', updateScreenInfo);
    });
    
    // Info-Close-outside
    window.addEventListener('click', (event) => {
        if (event.target === deviceModal) {
            hideModal('device');
        }
    });
    
    
    
    
    
    
    // Unified Esc close, sidebar-close-Esc, qr-close-esc, info-close-esc
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            // Check if any modal is open
            const qrDisplay = getComputedStyle(qrCodeModal).display;
            const deviceDisplay = getComputedStyle(deviceModal).display;
            
            if (qrDisplay !== 'none') {
                hideModal('qr');
                } else if (deviceDisplay !== 'none') {
                hideModal('device');
                } else {
                // If no modals are open, close the sidebar
                closeSidebar();
            }
        }
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // Unified Modal Management
    const modals = {
        qr: qrCodeModal,
        device: deviceModal
    }; 
    
    function showModal(type) {
        if (type === 'qr') {   
            hsidebar.classList.remove('open');
            qrCodeModal.style.display = 'block';
            } else if (type === 'device') {
            hsidebar.classList.remove('open');
            deviceModal.style.display = 'flex'; 
        }
    }
    
    function hideModal(type) {
        if (type === 'qr') {
            qrCodeModal.style.display = 'none';
            hidehoverlay();
            } else if (type === 'device') {
            deviceModal.style.display = 'none';
            hidehoverlay();
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
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
        const osName = getOSName();
        const browserVersion = getBrowserVersion();

        const dynamicContent = `
            <p><strong>Screen Resolution:</strong> ${screenWidth}x${screenHeight}</p>
            <p><strong>Viewport Size:</strong> ${innerWidth}x${innerHeight}</p>
            <p><strong>Device Pixel Ratio:</strong> ${pixelRatio}</p>
            <p><strong>Effective DPI/PPI:</strong> ${96 * pixelRatio} dpi</p>
            <p><strong>Device Type:</strong> ${deviceType}</p>
            <p><strong>Touch Events Support:</strong> ${isTouchDevice}</p>
            <p><strong>Operating System:</strong> ${osName}</p>
            <p><strong>Internet Browser:</strong> ${browserVersion}</p>
            <p><strong>Time Zone:</strong> ${timeZone}</p>
        `;
        
        document.getElementById('device-info-dynamic').innerHTML = dynamicContent;
    }
        
        
        // Add copy functionality each time modal opens
    document.getElementById('copy-device-info').addEventListener('click', function() {
        const text = document.getElementById('device-info-dynamic').innerText;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-device-info');
            btn.textContent = "Copied!";
            btn.style.backgroundColor = "#888";
            setTimeout(() => {
                btn.textContent = "Copy Text";
                btn.style.backgroundColor = "#4CAF50";
            }, 2000);
        });
    });
        
        
        // Initial update
        updateScreenInfo();
        
        // Show the modal
        showModal('device');
        
        
        // Add resize listener
        window.addEventListener('resize', updateScreenInfo);
    }
    
    
    } //hsidebar
    
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