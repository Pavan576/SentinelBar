// aiIntegration.js

const apiKey = "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"; // OpenAI API key

// Function to fetch AI response from OpenAI API
async function fetchAIResponse(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // or "gpt-4" if available
            messages: [{ role: "user", content: prompt }]
        })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.choices[0].message.content; // Return the AI's response
}

// Function to fetch offensive and defensive payloads based on the input payload
async function fetchAIUpdatedPayloads(payload) {
    const offensivePrompt = `Suggest offensive approaches for the following payload: "${payload}"`;
    const defensivePrompt = `Suggest defensive measures for the following payload: "${payload}"`;

    const responses = await Promise.all([
        fetchAIResponse(offensivePrompt),
        fetchAIResponse(defensivePrompt)
    ]);

    return {
        offensive: responses[0],
        defensive: responses[1]
    };
}

// Function to handle the execution of the payload
async function handlePayloadSubmission() {
    const selectedText = getSelectedText(); // Use default HackBar function to get the crafted payload
    if (!selectedText) {
        console.error("No payload text found.");
        return;
    }

    try {
        const suggestions = await fetchAIUpdatedPayloads(selectedText); // Fetch AI suggestions
        displayAIResponses(suggestions); // Display the AI responses
        showAIPopup(); // Show the AI suggestions in the popup

        // Optionally set the first offensive suggestion back to the input field
        const offensiveSuggestion = suggestions.offensive.split('\n')[0]; // Take the first offensive suggestion
        setSelectedText(offensiveSuggestion); // Use default HackBar function to set this suggestion in the input field
    } catch (error) {
        console.error("Error fetching AI suggestions:", error);
    }
}

// Function to display AI responses in the UI
function displayAIResponses(suggestions) {
    const aiResponsesContainer = document.getElementById('aiResponses'); // Ensure this element exists in your XUL
    aiResponsesContainer.innerHTML = ''; // Clear previous results

    const offensiveDiv = document.createElement('div');
    offensiveDiv.innerHTML = `<strong>Offensive Suggestions:</strong><br>${suggestions.offensive}`;
    aiResponsesContainer.appendChild(offensiveDiv);

    const defensiveDiv = document.createElement('div');
    defensiveDiv.innerHTML = `<strong>Defensive Suggestions:</strong><br>${suggestions.defensive}`;
    aiResponsesContainer.appendChild(defensiveDiv);
}

// Function to show the AI popup
function showAIPopup() {
    const aiPopup = document.getElementById('aiPopup');
    aiPopup.style.display = 'block'; // Show the popup
}

// Function to close the AI popup
function closeAIPopup() {
    const aiPopup = document.getElementById('aiPopup');
    aiPopup.style.display = 'none'; // Hide the popup
}

// Set up the event listener for closing the popup
document.getElementById('closePopup').addEventListener('click', closeAIPopup);
