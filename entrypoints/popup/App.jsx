import { useState } from "react";
import "./App.css";

function App() {
  // State to track if the automation is in progress
  const [isLoading, setIsLoading] = useState(false);

  const startAutomation = () => {
    setIsLoading(true); // Show the loader

    // Send a message directly to the content script running on the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "startAutomation" },
        (response) => {
          console.log(response?.status || "No response");

          // Hide the loader once the response is received
          setIsLoading(false);
        }
      );
    });
  };

  return (
    <div>
      <h2>LinkedIn Auto Connect</h2>
      {isLoading ? (
        // Loader component (can be a spinner or any indicator)
        <div>
          <span className="loader"></span>
          <h2>Connecting...</h2>
        </div>
      ) : (
        // Show button when not loading
        <button onClick={startAutomation}>Connect With All</button>
      )}
    </div>
  );
}

export default App;
