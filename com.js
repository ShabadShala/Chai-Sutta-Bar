// Get references to sidebar and phone icon
let sidebar = document.getElementById('sidebar');
let phoneIcon = document.querySelector('.phone-icon'); // Select existing phone.svg icon

// Function to toggle sidebar
function toggleSidebar(event) {
    event.stopPropagation(); // Prevent immediate closing when clicking phone icon
    sidebar.classList.toggle('open');
}

// Stop click inside the sidebar from closing it
sidebar.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent bubbling up to document click event
});

// Close sidebar when clicking outside
document.addEventListener("click", function(event) {
    if (!sidebar.contains(event.target) && !event.target.matches(".open-btn")) {
        sidebar.classList.remove("open");
    }
});

// Add event listeners
phoneIcon.addEventListener('click', toggleSidebar);

const miscUrl = scriptUrl + "?sheet=misc&raw=true";    

fetch(miscUrl)
.then(response => response.json())
.then(data => {
    if (data && data.length >= 2) {
        // Fetch delivery phone number from B3 cell
        let deliveryPhone = data[3][1]; // Assuming B2 is in the 2nd row, 2nd column (0-indexed)
        if (deliveryPhone) {
            deliveryPhone = deliveryPhone.replace(/-/g, ""); // Remove dashes
            const formattedDeliveryPhone = `tel:+91${deliveryPhone}`; // Add country code
            
            // Update the delivery phone link
            const deliveryLinkElement = document.getElementById('delivery-link');
            if (deliveryLinkElement) {
                deliveryLinkElement.href = formattedDeliveryPhone;
            }
        }
        
        // Fetch WhatsApp phone number from B4 cell (3rd row, 2nd column, 0-indexed)
        let chatNumber = data[4][1];
        if (chatNumber) {
            chatNumber = chatNumber.replace(/-/g, ""); // Remove dashes
        }
        
        // Fetch WhatsApp message from B5 cell (4th row, 2nd column, 0-indexed)
        let message = data[5][1]; 
        if (!message || message.trim() === "") {
            message = "Hello Chai Sutta Bar!"; // Default message
        }
        
        // URL-encode the message for the WhatsApp link
        const encodedMessage = encodeURIComponent(message);
        
        // Construct the full WhatsApp link dynamically
        const whatsappLink = `https://wa.me/+91${chatNumber}?text=${encodedMessage}`;
        
        // Update the href attribute of the anchor tag with the new link
        const whatsappLinkElement = document.getElementById('whatsapp-link');
        if (whatsappLinkElement) {
            whatsappLinkElement.href = whatsappLink;
        }
        
        // Fetch phone number from B6 cell (5th row, 2nd column, 0-indexed)
        let contactPhone = data[6][1]; 
        if (contactPhone) {
            contactPhone = contactPhone.replace(/-/g, ""); // Remove dashes
            const formattedContactPhone = `tel:+91${contactPhone}`; // Add country code
            
            // Update the phone link dynamically
            const phoneLinkElement = document.getElementById("phone-link");
            if (phoneLinkElement) {
                phoneLinkElement.href = formattedContactPhone;
            }
        }
        
        // Fetch WhatsApp offer number from B8 cell
        let offerWhatsappNumber = data[7][1]; // B8 is 8th row (index 7), 2nd column (index 1)
        if (offerWhatsappNumber) {
            offerWhatsappNumber = offerWhatsappNumber.replace(/-/g, ""); // Remove dashes
            whatsappOfferNumber = '+91' + offerWhatsappNumber; // Add country code
        }
        
        // Extract Open and Close times from Google Sheets
        const openTimeStr = data[0][1]; // Example: "09.30am"
        const closeTimeStr = data[1][1]; // Example: "10.45pm"
        
        // Validate time format
        if (!/^\d{1,2}\.\d{2}(am|pm)$/i.test(openTimeStr) || !/^\d{1,2}\.\d{2}(am|pm)$/i.test(closeTimeStr)) {
            console.error('Invalid time format detected');
            return;
        }
        
        // Parse times once
        const openTime = parseCustomTime(openTimeStr);
        const closeTime = parseCustomTime(closeTimeStr);
        const openTimeInMinutes = openTime.getHours() * 60 + openTime.getMinutes();
        const closeTimeInMinutes = closeTime.getHours() * 60 + closeTime.getMinutes();
        
        // Function to update status in real-time
        function updateStatus() {
            const now = new Date();
            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const currentTime = now.getHours() * 60 + now.getMinutes();
            let statusMessage;

            // Check if there's a special message for today
            const dataDate = new Date(data[2][0]);
            if (dataDate.getTime() === currentDate.getTime() && data[2][1] !== "") {
                statusMessage = `<span style="color: #FFA500;">${data[2][1]}</span>`;
            } else {
                // Determine if open or closed
                if (currentTime >= openTimeInMinutes && currentTime < closeTimeInMinutes) {
                    const timeLeft = closeTimeInMinutes - currentTime;
                    const blinkClass = timeLeft <= 30 ? 'blink' : '';
                    statusMessage = `<span style="color: #00FF00; font-weight: bold;">Open</span> <span class="${blinkClass}">until ${formatTime(closeTime)}</span>`;
                } else {
                    let timeUntilOpen = openTimeInMinutes - currentTime;
                    if (timeUntilOpen < 0) timeUntilOpen += 1440; // Add 24hrs in minutes
                    const blinkClass = timeUntilOpen <= 30 ? 'blink' : '';
                    statusMessage = `<span style="color: #FFA500;">Closed</span> ⋅ <span class="${blinkClass}">Opens ${formatTime(openTime)}</span>`;
                }
            }

            // Update the display
            const timeElem = document.querySelector('.open-close');
            if (timeElem) {
                timeElem.innerHTML = statusMessage;
            }
        }

        // Initial update
        updateStatus();

        // Update every 30 seconds
        setInterval(updateStatus, 15000);

        // Inside the Misc data fetch .then block, after processing other data:
        const a9Value = data[8] && data[8][0]; // A9 cell (row 8, column 0)
        if (a9Value === "Image") {
            checkImageSize().then(valid => {
                if (valid) {
                    document.getElementById('imageOverlay').style.display = 'flex';
                    document.getElementById('driveImage').src = imageUrl;
                    setTimeout(() => {
                        document.getElementById('imageOverlay').style.display = 'none';
                    }, 5000);
                }
            });
        } else if (a9Value === "Message") {
            const b9Value = data[8] && data[8][1]; // B9 cell
            if (b9Value && b9Value.trim() !== "") {
                const messageOverlay = document.getElementById('messageOverlay');
                const messageText = document.getElementById('messageText');
                
                // Set message content
                messageText.textContent = b9Value;
                
                // Show the overlay
                messageOverlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Close button handler
                document.getElementById('closeMessage').onclick = () => {
                    messageOverlay.style.display = 'none';
                    document.body.style.overflow = '';
                };
                
                // Click outside to close
                messageOverlay.addEventListener('click', (e) => {
                    if (e.target === messageOverlay) {
                        messageOverlay.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                });
                
                // Auto-close after 5 seconds
                setTimeout(() => {
                    if (messageOverlay.style.display === 'flex') {
                        messageOverlay.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                }, 5000);
            }
        }
    }
})
.catch(error => {
    console.error("Error fetching Misc data:", error);
});

// Function to check image size
function checkImageSize() {
    return fetch(imageUrl)
    .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.blob();
    })
    .then(blob => (blob.size / 1024) < 250)
    .catch(() => false);
}

// Function to parse custom time format (hh.mmap)
function parseCustomTime(timeStr) {
    const match = timeStr.match(/(\d{1,2})\.(\d{2})(am|pm)/i);
    if (!match) {
        console.error('Invalid time format:', timeStr);
        return new Date(); // Handle error appropriately
    }
    
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const period = match[3].toLowerCase();
    
    // Convert to 24-hour format
    if (period === 'pm' && hour !== 12) {
        hour += 12;
    } else if (period === 'am' && hour === 12) {
        hour = 0;
    }
    
    return new Date(0, 0, 0, hour, minute);
}

// Function to format time in hh:mm am/pm format
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;  // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
}