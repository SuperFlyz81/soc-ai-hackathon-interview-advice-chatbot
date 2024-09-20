/*
Helper functions
*/
function disableButton(button, updatedButtonText = "") {
  button.disabled = true;
  button.classList.add("disabled");

  if (updatedButtonText) {
    button.innerText = updatedButtonText;
  }
}

function enableButton(button, updatedButtonText = "") {
  button.disabled = false;
  button.classList.remove("disabled");

  if (updatedButtonText) {
    button.innerText = updatedButtonText;
  }
}

function focusOnPromptInput(selectText = false) {
  const promptInputElement = document.getElementById("promptInput");
  promptInputElement.focus();

  if (selectText) {
    promptInputElement.select();
  }
}

function clearPromptInput() {
  const promptInputElement = document.getElementById("promptInput");
  promptInputElement.value = "";
}

function showElement(element) {
  element.classList.remove("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

/*
Main functions
*/
// Function to get interview advice
async function getInterviewAdvice() {
  const promptInputValue = document.getElementById("promptInput").value;
  const submitButton = document.getElementById("submitButton");
  const resetButton = document.getElementById("resetButton");

  if (!promptInputValue) {
    alert("Please paste the job spec or ask me a question...");
    return;
  }

  try {
    // Disable the submit and reset buttons while the request is being made
    disableButton(submitButton, "Fetching advice... Please wait");
    hideElement(resetButton);

    // Hide the result output element while the request is being made
    hideElement(document.getElementById("resultOutput"));

    // Make the POST request to the backend API
    const response = await fetch("http://localhost:3000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: promptInputValue }),
    });

    const data = await response.json();

    // Display the advice in the output div
    const resultOutputElement = document.getElementById("resultOutput");
    resultOutputElement.innerHTML = data.advice;

    // Show the result output element
    showElement(resultOutputElement);

    // Re-enable the submit and reset buttons
    enableButton(submitButton, "Get Interview Advice");
    showElement(resetButton);

    // Focus on the prompt input element and select the text after the advice is displayed
    focusOnPromptInput(true);
  } catch (error) {
    // Re-enable the submit and reset buttons if something goes wrong
    enableButton(submitButton, "Get Interview Advice");
    showElement(resetButton);

    // Hide the result output element if something goes wrong
    hideElement(document.getElementById("resultOutput"));

    // Display an error message if something goes wrong
    document.getElementById(
      "resultOutput"
    ).innerText = `An error occurred while fetching advice.

    Error details:
    ${error.message}`;
  }
}

// Function to reset the chatbot state (i.e., clear the chatbot's history and context, and begin a new conversation)
async function resetChatbotState() {
  const resetButton = document.getElementById("resetButton");

  try {
    // Make the POST request to the backend API
    const response = await fetch("http://localhost:3000/reset", {
      method: "POST",
    });

    const data = await response.json();

    // Display the response message in the output div
    const resultOutputElement = document.getElementById("resultOutput");
    resultOutputElement.innerText = data.message;

    // Show the result output element
    showElement(resultOutputElement);

    // clear the prompt input after the chatbot state is reset
    clearPromptInput();

    // Focus on the prompt input element after the chatbot state is reset
    focusOnPromptInput();
  } catch (error) {
    // Hide the result output element if something goes wrong
    hideElement(document.getElementById("resultOutput"));

    // Display an error message if something goes wrong
    document.getElementById(
      "resultOutput"
    ).innerText = `An error occurred while resetting the chatbot state.

    Error details:
    ${error.message}`;
  }
}

/*
Event listeners
*/
document
  .getElementById("promptInput")
  .addEventListener("keydown", function (event) {
    // Enter will "submit" the prompt, while Shift + Enter will add a new line in the prompt input element (similar to ChatGPT's web interface)
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      getInterviewAdvice();
    }
  });
