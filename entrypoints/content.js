export default defineContentScript({
  matches: ['https://www.linkedin.com/mynetwork/grow*'],
  main() {
    console.log('Content script loaded.');

    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "startAutomation") {
        alert("Request received.");
        startAutomation(sendResponse);  // Pass sendResponse to startAutomation
        return true; // Keeps the message channel open for asynchronous response
      }
    });

    const startAutomation = (sendResponse) => {
      console.log("Starting LinkedIn automation...");

      // Immediately query for buttons 
      const connectButtons = document.querySelectorAll('button[aria-label^="Accept"]');
      console.log("Connect buttons found: ", connectButtons);

      // If there are no requests
      if (connectButtons.length === 0) {
        console.log("No connection requests found.");
        alert("No connection requests to accept.");
        sendResponse({ status: false, message: "No connection requests" });
        return;
      }

      let processedButtons = 0;  // Track number of processed buttons
      const totalButtons = connectButtons.length;

      // Process each button
      connectButtons.forEach((button, index) => {
        setTimeout(() => {
          if (button) {
            console.log(button);
            button.setAttribute("data-trigger-click", "true");
            button.dispatchEvent(new Event('click', { bubbles: true }));

            // Handle "Send now" modal if it appears
            const modalSendButton = document.querySelector('button[aria-label="Send now"]');
            if (modalSendButton) modalSendButton.click();

            processedButtons++;  // Increment after each processed button

            // Check if all buttons have been processed
            if (processedButtons === totalButtons) {
              console.log("All connection requests processed.");
              sendResponse({ status: true, message: "Automation completed" });
            }
          }
        }, 1000 * (index + 1)); // Add delay between each button click
      });
    };
  },
});