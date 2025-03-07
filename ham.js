(function() {
    function setupHamburgerMenu() {
        // Create Hamburger Button
        // Prevent duplicate hamburger button
        let hamburgerButton = document.getElementById('hamburger-button');
        if (!hamburgerButton) {
            hamburgerButton = document.createElement('div');
            hamburgerButton.id = 'hamburger-button';function buildList(items, level = 0) {
                if (!items) return '';
                return `<ul class="feature-list level-${level}">${items.map(item => {
                    const hasChildren = item.children && Object.keys(item.children).length > 0;
                    const indent = level * 10;
                    
                    return `
                    <li style="padding-left: ${indent}px;">
                    <div class="toggle ${hasChildren ? 'has-children' : ''}" data-level="${level}">
                    <span class="feature-name">${item.name}</span>
                    ${hasChildren ? '<span class="toggle-icon">▶</span>' : ''}
                    </div>
                    ${hasChildren ? `
                        <div class="sub-items-container">
                        ${buildList(Object.values(item.children), level + 1)}
                        </div>
                    ` : ''}
                    </li>
                    `;
                }).join('')}</ul>`;
            }
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
        
        
        
        <!-- FAQ -->
        <div class="hsidebar-option" id="faq-option">
        <img src="icons/faq.svg" alt="FAQ Icon" class="menu-icon invert-icon">
        FAQs
        </div>
        
        <hr style="border: 1px solid rgba(255, 255, 255, 0.1); margin: 8px 0;">
        
        
        <!-- Settings Section -->
        <div class="settings-section">
        <div class="settings-header hsidebar-option">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <div style="display: flex; align-items: center; gap: 10px;">
        <img src="icons/settings.svg" alt="Settings" class="menu-icon invert-icon">
        <span>Settings</span>
        </div>
        <span class="toggle-icon">▶</span>
        </div>
        </div>
        
        <div class="settings-options" style="display: none;">
        
        <!-- Starry Background Toggle -->
        <div class="hsidebar-option" id="toggle-starry-background">
        <img src="icons/stars.svg" alt="Starry Background" class="menu-icon invert-icon">
        <span>Starry Back: On</span>
        </div>
        
        
        <!-- Word Search -->
        <div class="hsidebar-option" id="cheatToggleButton">
        <img src="icons/lens.svg" alt="Word Search" class="menu-icon invert-icon">
        <span> Word Search: Inactive</span>
        </div>
        
        <!-- Child Lock -->
        <div class="hsidebar-option" id="childLockButton">
        <img src="icons/lock.svg" alt="Child Lock" class="menu-icon invert-icon">
        <span>Child Lock: Disabled</span>
        </div>                    
        
        <!-- Clear Cache -->
        <div class="hsidebar-option" id="clear-storage">
        <img src="icons/trash.svg" alt="Clear Icon" class="menu-icon invert-icon">
        Clear Cache
        </div>
        </div>
        </div>
        
        </div>
        
        
        
        <!-- Footer -->
        <div class="footer-text" id="footer-info">
        <div class="footer-content">
        <img src="icons/dashboard.svg" alt="Counters" class="footer-logo invert-icon">
        
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
            // Close all other modals first
            document.querySelectorAll('.modal').forEach(otherModal => {
                if (otherModal.id !== modalId) {
                    otherModal.style.display = 'none';
                }
            });
            
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                modal.style.top = '0';
                modal.style.left = '0';
                showOverlay(0.9);
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
            if (modalId !== "pinModal") {
                modal.addEventListener("click", (e) => {
                    if (e.target === modal && modal.style.display !== "none") {
                        closeModal();
                    }
                });
            }  
            
            // 1️⃣ Close on clicking the cancel button
            modal.querySelector(".cancel-btn")?.addEventListener("click", closeModal);
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        // Share App
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
        document.getElementById('share-link').addEventListener('click', async () => {
            const text = 'Scan this QR code to open and install CSB-BPA app.';
            const url = 'https://shabadshala.github.io/Chai-Sutta-Bar/';
            
            // Copy text manually
            try {
                await navigator.clipboard.writeText(`${text}`);
                console.log('Text copied to clipboard.');
                } catch (err) {
                console.log('Failed to copy text:', err);
            }
            
            // Proceed with sharing
            navigator.share({
                title: 'Share CSB-BPA Link',
                url: url, // Only the URL is passed
            }).catch(error => console.log('Error sharing link:', error));
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
        
        
        
        // Share QR Image
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
            
            
            
            // Print the QR image
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
                    @page { 
                    size: A4; 
                    margin: 20mm; 
                    }
                    body { 
                    text-align: center; 
                    padding: 20px; 
                    }
                    img { 
                    max-width: 100%; 
                    height: auto; 
                    }
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // App Features
        const featuresModal = document.createElement('div');
        featuresModal.id = 'features-modal';
        featuresModal.className = 'modal';
        featuresModal.innerHTML = `
        <div class="modal-content">
        <div class="close-btn">&times;</div>
        <h3 class="modal-header">App Features</h3>
        <div id="features" class="features-container"></div>
        <div class="modal-footer">
        <button class="expand-all-btn" title="Expand All">
        <img src="icons/expand-all.svg" alt="Expand">
        </button>
        <button class="collapse-all-btn" title="Collapse All">
        <img src="icons/collapse-all.svg" alt="Collapse">
        </button>
        <button class="copy-btn" title="Copy Features">
        <img src="icons/copy.svg" alt="Copy">
        </button>
        </div>
        </div>`;
        document.body.appendChild(featuresModal);
        
        // Add event listener for the menu option
        document.getElementById('app-features').addEventListener('click', () => {
            toggleSidebar(false);
            openModalStandalone('features-modal');
            loadFeatures();
        });
        
        setupModalTriggers('features-modal');
        
        // Updated data processing functions        
        async function loadFeatures() {
            const container = document.getElementById('features');
            
            // Disable footer buttons initially
            document.querySelector('.expand-all-btn').disabled = true;
            document.querySelector('.collapse-all-btn').disabled = true;
            document.querySelector('.copy-btn').disabled = true;
            
            // Add loading spinner
            const loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'loading-animation';
            loadingIndicator.innerHTML = `<div class="loading-spinner"></div>`;
            container.innerHTML = '';
            container.appendChild(loadingIndicator);
            
            try {
                const baseUrl = scriptUrl;
                const requestUrl = `${baseUrl}?sheet=features`;
                
                const response = await fetch(requestUrl);
                const data = await response.json();
                
                if (Array.isArray(data) && data.length > 0) {
                    const groupedData = {};
                    
                    data.forEach(item => {
                        const keys = Object.keys(item);
                        const featureKey = keys[0]; // 1st column
                        const subFeatureKey = keys[1]; // 2nd column
                        const thirdColKey = keys[2]; // 3rd column (info text)
                        const fourthColKey = keys[3]; // 4th column (existing logic)
                        
                        const feature = item[featureKey]?.trim();
                        const subFeature = item[subFeatureKey]?.trim();
                        const thirdColValue = item[thirdColKey]?.trim() || '';
                        const fourthColValue = item[fourthColKey]?.trim() || '';
                        
                        if (feature) {
                            if (!groupedData[feature]) {
                                groupedData[feature] = {
                                    fourthColValue: '',
                                    thirdColValue: '',
                                    subfeatures: {}
                                };
                            }
                            
                            if (subFeature) {
                                groupedData[feature].subfeatures[subFeature] = {
                                    name: subFeature,
                                    fourthColValue: fourthColValue,
                                    thirdColValue: thirdColValue,
                                    children: {}
                                };
                                } else {
                                groupedData[feature].fourthColValue = fourthColValue;
                                groupedData[feature].thirdColValue = thirdColValue;
                            }
                        }
                    });
                    
                    const transformedData = Object.entries(groupedData).map(([category, data]) => ({
                        name: category,
                        fourthColValue: data.fourthColValue,
                        thirdColValue: data.thirdColValue,
                        children: Object.values(data.subfeatures).map(sub => ({
                            name: sub.name,
                            fourthColValue: sub.fourthColValue,
                            thirdColValue: sub.thirdColValue,
                            children: sub.children
                        }))
                    }));
                    
                    container.innerHTML = buildList(transformedData);
                    addToggleListeners();
                    addInfoButtonListeners();
                    
                    // Enable footer buttons
                    document.querySelector('.expand-all-btn').disabled = false;
                    document.querySelector('.collapse-all-btn').disabled = true;
                    document.querySelector('.copy-btn').disabled = false;
                    } else {
                    container.innerHTML = '⚠ Features list not available.';
                }
                } catch (error) {
                console.error('Error loading features:', error);
                container.innerHTML = '❌ Failed to load features';
                } finally {
                const loadingElem = document.getElementById('loading-animation');
                if (loadingElem) loadingElem.remove();
            }
            
            // Updated buildList function
            function buildList(items, level = 0) {
                if (!items) return '';
                return `<ul class="feature-list level-${level}">${items.map(item => {
                    const hasChildren = item.children && item.children.length > 0;
                    const indent = level * 10;
                    
                    
                    // Determine strikethrough
                    let shouldStrike = false;
                    if (level === 0) { // Top-level feature
                        shouldStrike = (item.fourthColValue === '' && !hasChildren);
                        } else { // Subfeature
                        shouldStrike = (item.fourthColValue === '');
                    }
                    
                    const strikeClass = shouldStrike ? 'strikethrough' : '';
                    
                    return `
                    <li style="padding-left: ${indent}px;">
                    <div class="toggle ${hasChildren ? 'has-children' : ''}" data-level="${level}">
                    <div class="feature-content">
                    <span class="feature-name ${strikeClass}">${item.name}</span>
                    ${item.thirdColValue ? 
                    `<button class="info-btn" data-info="${item.thirdColValue.replace(/"/g, '&quot;')}">i</button>` : ''}
                    </div>
                    ${hasChildren ? '<span class="toggle-icon">▶</span>' : ''}
                    </div>
                    ${hasChildren ? `
                        <div class="sub-items-container">
                        ${buildList(item.children, level + 1)}
                        </div>
                    ` : ''}
                    </li>`;
                }).join('')}</ul>`;
            }
            
            
        }
        
        
        // Add info button handlers
        function addInfoButtonListeners() {
            document.querySelectorAll('.info-btn').forEach(button => {
                button.addEventListener('click', function (e) {
                    e.stopPropagation();
                    
                    // Remove any existing tooltips before showing a new one
                    document.querySelectorAll('.info-tooltip').forEach(tip => tip.remove());
                    
                    // Create new tooltip
                    const tooltip = document.createElement('div');
                    tooltip.className = 'info-tooltip';
                    tooltip.textContent = this.dataset.info;
                    
                    // Position tooltip
                    const rect = this.getBoundingClientRect();
                    tooltip.style.left = `${rect.left}px`;
                    tooltip.style.top = `${rect.bottom + 4}px`;
                    
                    document.body.appendChild(tooltip);
                    
                    // Function to close tooltip
                    function closeTooltip(event) {
                        tooltip.remove();
                        document.removeEventListener('click', closeTooltip);
                        window.removeEventListener('scroll', closeTooltip, true);
                        window.removeEventListener('touchmove', closeTooltip, true);
                    }
                    
                    // ✅ Close on outside click
                    document.addEventListener('click', closeTooltip);
                    
                    // ✅ Close on scroll (Desktop & Touch Devices)
                    window.addEventListener('scroll', closeTooltip, true);
                    window.addEventListener('touchmove', closeTooltip, true); // 🔥 Ensures it works on touch devices
                });
            });
        }
        
        
        
        
        
        // Keep the rest of your existing functions unchanged (buildList, addToggleListeners, etc.)        
        function transformGoogleData(features) {
            return Object.keys(features).map(category => ({
                name: category,
                children: features[category].map(feature => ({
                    name: feature,
                    children: []
                }))
            }));
        }
        
        
        
        function addToggleListeners() {
            document.querySelectorAll('.toggle.has-children').forEach(toggle => {
                toggle.addEventListener('click', function() {
                    const icon = this.querySelector('.toggle-icon');
                    const container = this.parentElement.querySelector('.sub-items-container');
                    
                    // Collapse all other open items
                    document.querySelectorAll('.sub-items-container.open').forEach(otherContainer => {
                        if (otherContainer !== container) {
                            otherContainer.classList.remove('open');
                            const otherIcon = otherContainer.parentElement.querySelector('.toggle-icon.open');
                            if (otherIcon) {
                                otherIcon.classList.remove('open');
                            }
                        }
                    });
                    
                    // Toggle current item
                    container.classList.toggle('open');
                    icon.classList.toggle('open');
                    
                    updateButtonsState();
                });
            });
        }
        
        // New utility functions
        function expandAll() {
            document.querySelectorAll('.sub-items-container').forEach(container => container.classList.add('open'));
            document.querySelectorAll('.toggle-icon').forEach(icon => icon.classList.add('open'));
            updateButtonsState();
        }
        
        function collapseAll() {
            document.querySelectorAll('.sub-items-container').forEach(container => container.classList.remove('open'));
            document.querySelectorAll('.toggle-icon').forEach(icon => icon.classList.remove('open'));
            updateButtonsState();
        }
        
        function copyToClipboard() {
            const lines = [];
            const htmlLines = [];
            
            document.querySelectorAll('.feature-name').forEach(feature => {
                const level = parseInt(feature.closest('.toggle').dataset.level);
                const prefix = '-'.repeat(level);
                
                // Detect if the feature has strikethrough (from CSS)
                const isStrikethrough = window.getComputedStyle(feature).textDecoration.includes("line-through");
                
                // Plain text: Unicode strikethrough
                let text = feature.textContent.trim();
                if (isStrikethrough) {
                    text = text.split('').map(char => char + '\u0336').join('');
                }
                lines.push(prefix + text);
                
                // HTML format: Wrap with <s> for strikethrough
                htmlLines.push(isStrikethrough ? `${prefix}<s>${feature.textContent.trim()}</s>` : prefix + feature.textContent.trim());
            });
            
            // Create an HTML format for the clipboard
            const htmlContent = `<html><body>${htmlLines.join('<br>')}</body></html>`;
            const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
            const textBlob = new Blob([lines.join('\n')], { type: 'text/plain' });
            
            // Use Clipboard API to copy both plain text & HTML
            navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': htmlBlob,  // Rich text (MS Word, Gmail, etc.)
                    'text/plain': textBlob   // Unicode strikethrough for Notepad, etc.
                })
            ]).catch(err => console.error("Clipboard copy failed:", err));
            
            // Add animation effect
            const copyBtn = document.querySelector('.copy-btn');
            copyBtn.classList.add('clicked');
            setTimeout(() => copyBtn.classList.remove('clicked'), 200);
        }
        
        
        
        function updateButtonsState() {
            const expandAllBtn = document.querySelector('.expand-all-btn');
            const collapseAllBtn = document.querySelector('.collapse-all-btn');
            
            const allContainers = document.querySelectorAll('.sub-items-container');
            const expandedContainers = document.querySelectorAll('.sub-items-container.open');
            
            // Disable "Expand All" if all items are already expanded
            expandAllBtn.disabled = allContainers.length > 0 && allContainers.length === expandedContainers.length;
            
            // Disable "Collapse All" if all items are already collapsed
            collapseAllBtn.disabled = expandedContainers.length === 0;
        }
        
        // Add footer button functionality
        document.querySelector('.expand-all-btn').addEventListener('click', expandAll);
        document.querySelector('.collapse-all-btn').addEventListener('click', collapseAll);
        document.querySelector('.copy-btn').addEventListener('click', copyToClipboard);
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // FAQ Modal
        const faqModal = document.createElement('div');
        faqModal.id = 'faq-modal';
        faqModal.className = 'modal';
        faqModal.innerHTML = `
        <div class="modal-content">
        <div class="close-btn">&times;</div>
        <h3 class="modal-header">Frequently Asked Questions</h3>
        <input type="text" id="faq-search" class="faq-search" placeholder="Search questions...">
        <div class="faq-container" id="faq-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading FAQs...</div>
        </div>
        <div class="modal-footer">
        <button class="expand-all-btn" title="Expand All">
        <img src="icons/expand-all.svg" alt="Expand">
        </button>
        <button class="collapse-all-btn" title="Collapse All">
        <img src="icons/collapse-all.svg" alt="Collapse">
        </button>
        </div>
        </div>`;
        document.body.appendChild(faqModal);
        
        // Add search box styles
        const searchStyle = document.createElement('style');
        searchStyle.textContent = `
        .faq-search {
        width: 75%;
        padding: 8px 16px;
        margin: 10px auto;
        display: block;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
        }
        `;
        document.head.appendChild(searchStyle)
        
        
        // Search functionality
        function filterFAQs(searchTerm) {
            const faqItems = document.querySelectorAll('#faq-container .faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question').textContent.toLowerCase();
                item.style.display = question.includes(searchTerm) ? 'block' : 'none';
            });
        }
        
        document.getElementById('faq-search')?.addEventListener('input', function(e) {
            filterFAQs(e.target.value.toLowerCase());
        });
        
        // Modified FAQ option click handler
        document.getElementById('faq-option')?.addEventListener('click', () => {
            toggleSidebar(false);
            openModalStandalone('faq-modal');
            document.getElementById('faq-search').value = ''; // Reset search on open
            loadFAQs();
        });
        
        
        // Add event listener for the FAQ option
        document.getElementById('faq-option')?.addEventListener('click', () => {
            toggleSidebar(false);
            openModalStandalone('faq-modal');
            loadFAQs();
        });
        
        setupModalTriggers('faq-modal');
        
        
        
        
        async function loadFAQs() {
            const container = document.getElementById('faq-container');
            container.innerHTML = '<div class="loading-spinner"></div> Loading FAQs...';
            
            // Add toast styling dynamically
            const style = document.createElement('style');
            style.textContent = `
            .copy-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: fadeInOut 2s ease-in-out;
            }
            
            @keyframes fadeInOut {
            0%,100% { opacity: 0; }
            15%,85% { opacity: 1; }
            }
            `;
            document.head.appendChild(style);
            
            try {
                const response = await fetch('faq.json');
                if (!response.ok) throw new Error('Failed to fetch FAQs');
                const faqs = await response.json();
                
                container.innerHTML = '';
                let activeFaq = null;
                
                faqs.forEach((faq, index) => {
                    const faqItem = document.createElement('div');
                    faqItem.className = 'faq-item';
                    faqItem.innerHTML = `
                    <div class="faq-question">
                    ${faq.question}
                    <span class="toggle-arrow">▼</span>
                    </div>
                    <div class="faq-answer">${faq.answer}</div>
                    `;
                    
                    const questionElement = faqItem.querySelector('.faq-question');
                    const answerElement = faqItem.querySelector('.faq-answer');
                    let pressTimer;
                    
                    // Long-press copy functionality
                    const handleTouchStart = (e) => {
                        if (!faqItem.classList.contains('active')) return;
                        
                        e.preventDefault();
                        pressTimer = setTimeout(() => {
                            navigator.clipboard.writeText(answerElement.textContent.trim())
                            .then(() => showToast('Answer copied to clipboard!'))
                            .catch(() => showToast('Failed to copy text'));
                        }, 500);
                    };
                    
                    const handleTouchEnd = (e) => {
                        e.preventDefault();
                        clearTimeout(pressTimer);
                    };
                    
                    answerElement.addEventListener('touchstart', handleTouchStart);
                    answerElement.addEventListener('touchend', handleTouchEnd);
                    answerElement.addEventListener('touchcancel', handleTouchEnd);
                    
                    questionElement.addEventListener('click', () => {
                        if (faqItem === activeFaq) {
                            faqItem.classList.remove('active');
                            activeFaq = null;
                            } else {
                            if (activeFaq) activeFaq.classList.remove('active');
                            faqItem.classList.add('active');
                            activeFaq = faqItem;
                        }
                        updateFAQButtonsState();
                        faqItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                    
                    container.appendChild(faqItem);
                });
                
                // Initialize button states
                updateFAQButtonsState();
                
                function showToast(message) {
                    const toast = document.createElement('div');
                    toast.className = 'copy-toast';
                    toast.textContent = message;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2000);
                }
                // After populating FAQs
                const searchTerm = document.getElementById('faq-search').value.toLowerCase();
                if (searchTerm) filterFAQs(searchTerm);
                } catch (error) {
                console.error('Error loading FAQs:', error);
                container.innerHTML = '<div class="error-message">❌ Failed to load FAQs. Please try again later.</div>';
            }
            
        }
        
        
        function expandAllFAQs() {
            document.querySelectorAll('.faq-item').forEach(item => item.classList.add('active'));
            updateFAQButtonsState();
        }
        
        function collapseAllFAQs() {
            document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
            updateFAQButtonsState();
        }
        
        function updateFAQButtonsState() {
            const allFAQs = document.querySelectorAll('.faq-item');
            const expandedFAQs = document.querySelectorAll('.faq-item.active');
            const expandBtn = document.querySelector('#faq-modal .expand-all-btn');
            const collapseBtn = document.querySelector('#faq-modal .collapse-all-btn');
            
            expandBtn.disabled = expandedFAQs.length === allFAQs.length;
            collapseBtn.disabled = expandedFAQs.length === 0;
        }
        
        
        // Add after FAQ modal creation
        document.querySelector('#faq-modal .expand-all-btn').addEventListener('click', expandAllFAQs);
        document.querySelector('#faq-modal .collapse-all-btn').addEventListener('click', collapseAllFAQs);
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // Initialize settings in collapsed state
        const settingsSection = document.querySelector('.settings-section');
        const settingsOptions = settingsSection.querySelector('.settings-options');
        const toggleIcon = settingsSection.querySelector('.toggle-icon');
        
        // Function to collapse settings
        function collapseSettings() {
            settingsOptions.classList.remove('show');
            settingsOptions.style.height = '0';
            toggleIcon.classList.remove('rotated');
        }
        
        // Toggle settings on header click
        settingsSection.querySelector('.settings-header').addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpening = !settingsOptions.classList.contains('show');
            
            if (isOpening) {
                settingsOptions.classList.add('show');
                settingsOptions.style.height = `${settingsOptions.scrollHeight}px`;
                toggleIcon.classList.add('rotated');
                } else {
                collapseSettings();
            }
        });
        
        // Collapse settings when clicking anywhere else in the sidebar
        document.querySelector('.hsidebar-content').addEventListener('click', function(e) {
            if (!settingsSection.contains(e.target)) {
                collapseSettings();
            }
        });
        
        
        // Initialize settings in collapsed state when sidebar opens
        document.getElementById('hamburger-button').addEventListener('click', function() {
            collapseSettings();
        });
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // Toggle Starry Background
        const toggleStarryBg = document.getElementById('toggle-starry-background');
        if (toggleStarryBg) {
            // Initialize from localStorage or set default to false if not set
            let isEnabled = localStorage.getItem('starryBackgroundEnabled');
            if (isEnabled === null) {
                // First-time installation: Set default to false
                isEnabled = false;
                localStorage.setItem('starryBackgroundEnabled', isEnabled);
                } else {
                // Convert stored string to boolean
                isEnabled = isEnabled === 'true';
            }
            
            // Apply the initial state
            const starryBg = document.querySelector('.starry-background');
            starryBg?.classList.toggle('disabled', !isEnabled);
            toggleStarryBg.querySelector('span').textContent = `Starry Back: ${isEnabled ? 'On' : 'Off'}`;
            
            // Click handler
            toggleStarryBg.addEventListener('click', function() {
                isEnabled = !starryBg.classList.toggle('disabled');
                this.querySelector('span').textContent = `Starry Back: ${isEnabled ? 'On' : 'Off'}`;
                localStorage.setItem('starryBackgroundEnabled', isEnabled);
                
                // Close the sidebar when toggling the starry background
                toggleSidebar(false);
            });
            
            
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // Create Child Lock Modal Elements
        const pinModal = document.createElement('div');
        pinModal.id = 'pinModal';
        pinModal.className = 'modal';
        pinModal.innerHTML = `
        <div class="modal-content" style="max-width: 300px">
        <div class="close-btn">&times;</div>
        <h3 class="modal-header">Child Lock</h3>
        <div id="pinMessage" class="pin-message"></div>
        <input type="number" 
        id="pinInput" 
        class="pin-input" 
        placeholder="Enter 5-digit PIN" 
        maxlength="5" 
        inputmode="numeric">
        <div class="modal-buttons">
        <button id="confirmPin" class="confirm-btn">Confirm</button>
        <button id="cancel-btn" class="cancel-btn">Cancel</button>
        </div>
        <div class="modal-buttons restart-container">
        <button id="restartPin" class="restart-btn">
        <img src="icons/startover.svg" 
        alt="Restart" 
        class="icon invert-icon">
        Start Again
        </button>
        </div>
        </div>`;
        
        document.body.appendChild(pinModal);
        
        // Add this with the other sidebar option event listeners
        document.getElementById('childLockButton')?.addEventListener('click', () => {
            toggleSidebar(false);
            openModalStandalone('pinModal');
        });
        
        setupModalTriggers('pinModal'); 
        
        
        
        // Child Lock Implementation
        let childLockState = JSON.parse(localStorage.getItem('childLock') || '{"pin": null, "isEnabled": false}');
        
        document.addEventListener('DOMContentLoaded', () => {
            childLockState = JSON.parse(localStorage.getItem('childLock')) || { 
                pin: null, 
                isEnabled: false 
            };
            updateChildLockDisplay();
            disableElements();
            
            const modal = document.getElementById('pinModal');
            const closeButton = document.querySelector('#pinModal .close-btn');
            const cancelButton = document.getElementById('cancelPin');
            
            if (closeButton) closeButton.addEventListener('click', () => modal.style.display = 'none');
            if (cancelButton) cancelButton.addEventListener('click', () => modal.style.display = 'none');
            
            
        });
        
        document.getElementById('childLockButton').addEventListener('click', toggleChildLock);
        
        function toggleChildLock() {
            childLockState.isEnabled ? showPinModal('disable') : showPinModal('enable');
        }
        
        function showPinModal(action) {
            const modal = document.getElementById('pinModal');
            const message = document.getElementById('pinMessage');
            const pinInput = document.getElementById('pinInput');
            const confirmBtn = document.getElementById('confirmPin');
            const restartBtn = document.getElementById('restartPin');
            
            if (restartBtn) restartBtn.style.display = 'none'; // Hide restart button
            
            pinInput.value = '';
            pinInput.disabled = false;
            message.textContent = action === 'enable' ? 'Set 5-digit PIN:' : 'Enter PIN to disable:';
            confirmBtn.disabled = true;
            
            modal.style.display = 'flex';
            
            confirmBtn.replaceWith(confirmBtn.cloneNode(true));
            pinInput.replaceWith(pinInput.cloneNode(true));
            
            const newConfirmBtn = document.getElementById('confirmPin');
            const newPinInput = document.getElementById('pinInput');
            
            newPinInput.focus();
            
            if (action === 'enable') {
                newConfirmBtn.onclick = () => handleFirstPinEntry(newPinInput, message, modal);
                } else {
                newConfirmBtn.onclick = () => handlePinSubmit(action, newPinInput, message, modal);
            }
            
            newPinInput.onkeypress = (e) => {
                if (e.key === 'Enter' && newPinInput.value.length === 5) newConfirmBtn.click();
            };
            
            newPinInput.oninput = () => {
                newPinInput.value = newPinInput.value.replace(/\D/g, '').slice(0, 5);
                newConfirmBtn.disabled = newPinInput.value.length !== 5;
            };
        }
        
        function handleFirstPinEntry(pinInput, message, modal) {
            const firstPin = pinInput.value;
            if (firstPin.length !== 5 || isNaN(firstPin)) {
                message.textContent = 'Invalid PIN! Must be 5 digits';
                return;
            }
            pinInput.value = '';
            message.textContent = 'Confirm 5-digit PIN:';
            document.getElementById('confirmPin').disabled = true;
            
            pinInput.focus();
            
            document.getElementById('confirmPin').onclick = () => handleConfirmPinEntry(pinInput, message, modal, firstPin);
        }
        
        function handleConfirmPinEntry(pinInput, message, modal, firstPin) {
            const secondPin = pinInput.value;
            
            if (secondPin.length !== 5) {
                message.textContent = 'Invalid PIN! Must be 5 digits';
                return;
            }
            
            if (secondPin !== firstPin) {
                message.textContent = 'PINs do not match!';
                pinInput.disabled = true;
                document.getElementById('confirmPin').disabled = true;
                
                // Show Restart Button when PIN mismatch
                const restartBtn = document.getElementById('restartPin');
                restartBtn.style.display = 'block';
                restartBtn.onclick = () => showPinModal('enable');
                
                return;
            }
            
            childLockState = { pin: secondPin, isEnabled: true };
            localStorage.setItem('childLock', JSON.stringify(childLockState));
            
            message.textContent = 'PIN set! Lock enabled';
            updateChildLockDisplay();
            disableElements();
            
            setTimeout(() => {
                modal.style.display = 'none';
                hideOverlay(); // Add this line
            }, 1000);
            
        }
        
        function handlePinSubmit(action, pinInput, message, modal, firstPin = null) {
            const pin = pinInput.value;
            
            if (action === 'enable') {
                if (pin !== firstPin) {
                    pinInput.value = 'PINs do not match!';
                    pinInput.disabled = true; // Disable input to prevent further typing
                    document.getElementById('confirmPin').disabled = true;
                    
                    // Create "Start Again" button
                    let restartBtn = document.createElement('button');
                    restartBtn.textContent = "Start Again";
                    restartBtn.onclick = () => showPinModal('enable');
                    
                    message.innerHTML = ''; // Clear existing message
                    message.appendChild(restartBtn);
                    
                    return;
                }
                childLockState = { pin: pin, isEnabled: true };
                message.textContent = 'PIN set! Lock enabled';
                } else {
                if (pin !== childLockState.pin) {
                    message.textContent = 'Incorrect PIN!';
                    return;
                }
                childLockState = { pin: null, isEnabled: false };
                message.textContent = 'Lock disabled';
            }
            
            localStorage.setItem('childLock', JSON.stringify(childLockState));
            updateChildLockDisplay();
            disableElements();
            
            setTimeout(() => {
                modal.style.display = 'none';
                hideOverlay(); // Add this line
            }, 1000);
        }
        
        
        function updateChildLockDisplay() {
            const btn = document.getElementById('childLockButton');
            const img = btn.querySelector('img');
            const textSpan = btn.querySelector('span');
            
            if (childLockState.isEnabled) {
                img.src = "icons/lock.svg";
                textSpan.textContent = "Child Lock: Enabled";
                } else {
                img.src = "icons/unlock.svg";
                textSpan.textContent = "Child Lock: Disabled";
            }
        }
        
        function disableElements() {
            document.querySelectorAll('.child-lock-restricted').forEach(element => {
                element.classList.toggle('child-locked', childLockState.isEnabled);
                if (element.tagName === 'BUTTON') {
                    element.disabled = childLockState.isEnabled;
                }
            });
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // Clear Storage Modal
        const clearStorageModal = document.createElement('div');
        clearStorageModal.id = 'clear-storage-modal';
        clearStorageModal.className = 'modal';
        clearStorageModal.innerHTML = `
        <div class="modal-content">
        <div class="close-btn">&times;</div>
        <h3 class="modal-header">Warning!</h3>
        <div class="modal-body">
        This will permanently delete all app data including:<br>
        - Last Order<br>
        - Child Lock PIN<br>
        - Settings<br>
        (The app will be restarted)<br>
        Are you sure you want to continue?
        </div>
        <div class="modal-buttons">
        <button id="confirm-clear" class="danger-btn">
        <img src="icons/trash.svg" alt="Clear" width="14" height="14" class="invert-icon">
        Clear
        </button>
        <button class="cancel-btn">Cancel</button>
        </div>
        </div>
        `;
        document.body.appendChild(clearStorageModal);
        
        // Add this with the other sidebar option event listeners
        document.getElementById('clear-storage')?.addEventListener('click', () => {
            toggleSidebar(false);
            openModalStandalone('clear-storage-modal');
        });
        
        setupModalTriggers('clear-storage-modal'); 
        
        
        // Add confirmation handler
        document.getElementById('confirm-clear')?.addEventListener('click', () => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload(true);
        });
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // Update modal counters
        function updateModalCounters() {
            document.getElementById('modal-visitorCounter').textContent = 
            document.getElementById('visitorCounter').querySelector('span').textContent;
            
            document.getElementById('modal-viewsCounter').textContent = 
            document.getElementById('viewsCounter').querySelector('span').textContent;
            
            document.getElementById('modal-likeCounter').textContent = 
            document.getElementById('likeCounter').textContent;
            
            // Fetch order number from server
            fetch(`${scriptUrl}?sheet=counter&action=getOrders`)
            .then(res => res.json())
            .then(data => {
                document.getElementById('modal-orderNumber').textContent = 
                String(data.count).padStart(4, '0');
            });
            
             // Add installs counter
            fetch(`${scriptUrl}?sheet=counter&action=getInstalls`)
            .then(res => res.json())
            .then(data => {
                document.getElementById('modal-installsCounter').textContent = 
                String(data.count).padStart(4, '0');
            });
        }
        
        // Show counters modal when footer is clicked
        document.getElementById('footer-info').addEventListener('click', () => {
            // Open modal using universal function
            toggleSidebar(false);
            openModalStandalone('counters-modal');
            
            // Update counters after modal is opened
            updateModalCounters();
        });
        
        setupModalTriggers('counters-modal'); 
        
        
        
        
        


        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
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


























































// Deep Search
let cheatActive = false;
let activationListenersAdded = false;
let touchStartPoints = []; // Track multiple touch points

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
    
    // Find word boundaries
    let start = offset;
    while (start > 0 && !/\s/.test(text[start - 1])) start--;
    
    let end = offset;
    while (end < text.length && !/\s/.test(text[end])) end++;
    
    return text.slice(start, end)
    .trim()  // First remove whitespace
    .replace(/^[()]+|[()]+$/g, '');  // Then remove surrounding parentheses
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
    
    activationListenersAdded = true;
}





// Add event listener for the cheat toggle button
document.getElementById('cheatToggleButton')?.addEventListener('click', function() {
    cheatActive = !cheatActive;
    
    // Update button text
    const statusText = cheatActive ? 'Active' : 'Inactive';
    this.querySelector('span').textContent = `Item Search: ${statusText}`;
    
    if (cheatActive) {
        addCheatListeners();
        alert('Item Search feature activated.');
        } else {
        alert('Item Search feature deactivated');
    }
});






















