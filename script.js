let urls = []; // Global variable to store URLs

// Load init when the content is loaded.
window.addEventListener("DOMContentLoaded", init);
window.addEventListener("DOMContentLoaded", loadList);

//Init Function - Initialize, load, addEventListeners
function init() {
  const addButton = document.getElementById("add"); // Get reference to 'add' button
  const deleteButton = document.getElementsByClassName("delete"); // Get references to 'delete' buttons
  const noWebsiteMsg = document.getElementById("no-website-msg"); // Get reference to 'no-website-msg' element

  // Check if there are any URLs stored in Chrome's local storage
  chrome.storage.local.getBytesInUse(["websites"], function (bytes) {
    if (bytes) {
      // Retrieve stored URLs from Chrome's local storage
      chrome.storage.local.get("websites", function (res) {
        if (res != {}) {
          urls = JSON.parse(res.websites); // Parse stored URLs into an array

          // Check if there are no URLs or the array is empty
          if (urls == undefined || urls.length == 0) {
            noWebsiteMsg.style.display = ""; // Display message indicating no websites
          } else {
            noWebsiteMsg.style.display = "none"; // Hide the message
          }

          // Add click event listeners to all 'delete' buttons
          if (deleteButton) {
            for (let i = 0; i < deleteButton.length; i++) {
              deleteButton[i].addEventListener("click", function (e) {
                deleteWebsite(e); // Call deleteWebsite function when a 'delete' button is clicked
              });
            }
          }
        }
      });
    } else {
      urls = []; // Initialize the URLs array
    }
  });

  // Add click event listener to 'add' button
  addButton.addEventListener("click", function () {
    const url = document.getElementsByClassName("add-website")[0].value; // Get value from input field
    if (url.length > 0) {
      noWebsiteMsg.style.display = "none"; // Hide the 'no-website-msg' element
      urls.push(url + "/*"); // Add the URL to the URLs array
      // Save the updated URLs array to Chrome's local storage
      chrome.storage.local.set(
        {
          websites: JSON.stringify(urls),
        },
        function (value) {
          console.log(value);
        }
      );
      save(); // Call the save function
      loadList(); // Call the loadList function
      document.getElementsByClassName("add-website")[0].value = ""; // Clear the input field value
    }
  });
}

// Function to load and display the list of URLs
function loadList() {
  const deleteButton = document.getElementsByClassName("delete"); // Get references to 'delete' buttons
  const tblNode = document.getElementsByTagName("body")[0]; // Get reference to table node
  let tblRow = document.createElement("tr"); // Create table row element
  let tblData = document.createElement("td"); // Create table cell element
  let tblButton = document.createElement("button"); // Create button element
  let storedURLs = []; // Array to store the retrieved URLs

  // Check if there are any URLs stored in Chrome's local storage
  chrome.storage.local.getBytesInUse(["websites"], function (bytes) {
    if (bytes) {
      // Retrieve stored URLs from Chrome's local storage
      chrome.storage.local.get("websites", function (res) {
        if (res != {}) {
          storedURLs = JSON.parse(res.websites); // Parse stored URLs into an array

          // Check if the storedURLs array is not undefined or empty
          if (storedURLs != undefined || storedURLs != []) {
            for (let i = 0; i < storedURLs.length; i++) {
              tblButton.innerText = "-"; // Set the button text to '-'
              tblButton.setAttribute("class", "delete"); // Set the button class to 'delete'
              tblRow.setAttribute("id", "row" + i); // Set the row ID
              tblButton.setAttribute("id", i); // Set the button ID
              tblData.innerText = storedURLs[i]; // Set the table cell content to the URL
              tblRow.appendChild(tblData); // Add the table cell to the row
              tblRow.appendChild(tblButton); // Add the button to the row
              document.getElementsByTagName("table")[0].appendChild(tblRow); // Add the row to the table
              if (deleteButton) {
                deleteButton[i].addEventListener("click", function (e) {
                  deleteWebsite(e); // Call deleteWebsite function when a 'delete' button is clicked
                });
              }
            }
          }
        }
      });
    } else {
      storedURLs = []; // Initialize the storedURLs array
    }
  });
}

// Function to delete a website from the list
function deleteWebsite(e) {
  urls.splice(e.target.id, 1); // Remove the URL from the URLs array
  // Update the URLs array in Chrome's local storage
  chrome.storage.local.set(
    {
      websites: JSON.stringify(urls),
    },
    function () {}
  );
  if (document.getElementById("row" + e.target.id))
    document.getElementById("row" + e.target.id).remove(); // Remove the corresponding row from the DOM
  save(); // Call the save function
  init(); // Reinitialize the extension
}

// Function to save the URLs
function save() {
  // Send a request to the Chrome extension background process
  chrome.extension.sendRequest(
    {
      urls: "save",
    },
    function (response) {}
  );
}
