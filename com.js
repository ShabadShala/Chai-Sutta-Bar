 
                    
                    
                    
                    
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
                            
                            // Get current date
                            const now = new Date();
                            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Get today's date without time
                            
                            // Convert the date in data[2][0] to a Date object (assuming it's already in dd/mm/yy format and can be parsed directly)
                            const dataDate = new Date(data[2][0]); // This assumes the date is in a format that JavaScript can parse directly (e.g., mm/dd/yyyy or yyyy/mm/dd)
                            
                            // Check if data[2][0] is today's date and data[2][1] is not empty
                            if (dataDate.getTime() === currentDate.getTime() && data[2][1] !== "") {
                                // If the date is today and data[2][1] is not empty, set statusMessage to data[2][1]
                                statusMessage = `<span style="color: #FFA500;">${data[2][1]}</span>`;
                                } else {
                                // Check if either openTimeStr or closeTimeStr is empty
                                if (!openTimeStr || !closeTimeStr) {
                                    // If one or both times are missing, don't display anything
                                    const timeElem = document.querySelector('.open-close');
                                    if (timeElem) {
                                        timeElem.innerHTML = "";
                                    }
                                    return; // Exit the function
                                }
                                
                                // Add validation for time format
                                if (!/^\d{1,2}\.\d{2}(am|pm)$/i.test(openTimeStr) || !/^\d{1,2}\.\d{2}(am|pm)$/i.test(closeTimeStr)) {
                                    console.error('Invalid time format detected');
                                    return;
                                }
                                
                                // Convert Open and Close times to Date objects
                                const openTime = parseCustomTime(openTimeStr);
                                const closeTime = parseCustomTime(closeTimeStr);
                                
                                // Get current time
                                const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes since midnight
                                
                                // Convert Open and Close times to minutes since midnight
                                const openTimeInMinutes = openTime.getHours() * 60 + openTime.getMinutes();
                                const closeTimeInMinutes = closeTime.getHours() * 60 + closeTime.getMinutes();
                                
                                // Compare times based on minutes from midnight
                                if (currentTime >= openTimeInMinutes && currentTime < closeTimeInMinutes) {
                                    const timeLeft = closeTimeInMinutes - currentTime;
                                    const blinkClass = timeLeft <= 30 ? 'blink' : '';
                                    statusMessage = `<span style="color: #00FF00; font-weight: bold;">Open</span> <span class="${blinkClass}">until ${formatTime(closeTime)}</span>`;
                                    } else {
                                    let timeUntilOpen = openTimeInMinutes - currentTime;
                                    
                                    // Check if the opening time is on the next day
                                    if (timeUntilOpen < 0) {
                                        // Calculate the time difference until the next day's opening
                                        const minutesInDay = 24 * 60;
                                        timeUntilOpen = minutesInDay + timeUntilOpen; // Add a full day's worth of minutes
                                    }
                                    
                                    
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
                    })
                    .catch(error => {
                        console.error("Error fetching Misc data:", error);
                    });
                    
                    // Function to parse custom time format (hh.mmap)
                    function parseCustomTime(timeStr) {
                        // Extract hour, minute, and period using regex
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
                    
                    
                    
                    
                    
                    
                    
                    
                    