// Function to block a web request and redirect to a warning page
function blockRequest(details) {
    return {
        redirectUrl: chrome.extension.getURL('warning.html')
    };
}

// Listener for Chrome extension requests
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.urls == 'save') {
            let getStoredURLs = [];

            // Check if there are any URLs stored in Chrome's local storage
            chrome.storage.local.getBytesInUse('websites', function (bytes) {
                if (bytes) {
                    // Retrieve stored URLs from Chrome's local storage
                    chrome.storage.local.get("websites", function (res) {
                        if (res != {}) {
                            getStoredURLs = JSON.parse(res.websites);

                            // Check if there are stored URLs
                            if (getStoredURLs.length > 0) {
                                const filter = {
                                    urls: getStoredURLs,
                                };

                                // Add listener to block web requests for stored URLs and redirect to warning page
                                chrome.webRequest.onBeforeRequest.addListener(
                                    blockRequest,
                                    filter, ["blocking"]
                                );
                            } else if (getStoredURLs.length == 0) {
                                // If no stored URLs, remove the listener if it exists
                                if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
                                    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
                                }
                            }
                        }
                    });
                } else {
                    getStoredURLs = false; // Initialize getStoredURLs as false
                }
            });
        }
    }
);
