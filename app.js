const API_KEY = "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"; // Replace with your actual API key
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatDisplay = document.getElementById("chat-display");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

async function fetchGroqData(messages) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`, // Ensuring the API key is used correctly
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768", // Ensure this model is supported
                messages: messages,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorBody}`);
        }

        const data = await response.json();

        // Check for correct response structure
        if (data.choices?.[0]?.message?.content) {
            return data.choices[0].message.content;
        } else {
            console.error("Unexpected API response:", data);
            throw new Error("Unexpected response format from API.");
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        return "Sorry, I encountered an error. Please try again later."; // User-friendly error message
    }
}

function appendMessage(content, isUser = false, isError = false) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add(isUser ? "user-message" : isError ? "error-message" : "bot-message");
    messageElement.textContent = content;
    chatDisplay.appendChild(messageElement);

    // Ensure scrolling to the bottom
    setTimeout(() => {
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }, 100);
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        appendMessage(userMessage, true);
        userInput.value = "";

        try {
            const messages = [
                { role: "system", content: "You are a helpful assistant." }, // Customize if needed
                { role: "user", content: userMessage },
            ];

            const botResponse = await fetchGroqData(messages);
            appendMessage(botResponse);
        } catch (error) {
            appendMessage(error.message, false, true);
        }
    }
}

sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleUserInput();
    }
});

// Clear existing messages on page load
chatDisplay.innerHTML = "";
