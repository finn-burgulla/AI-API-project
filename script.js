// Get references to the buttons and response area
const iceBtn = document.getElementById('iceBtn');
const factBtn = document.getElementById('factBtn');
const jokeBtn = document.getElementById('jokeBtn');
const weatherBtn = document.getElementById('weatherBtn');
const responseDiv = document.getElementById('response');

// Get reference to the context dropdown
const contextSelect = document.getElementById('contextSelect');

// Helper function to get the system prompt based on context
function getSystemPrompt(context) {
  if (context === 'team') {
    return 'You are a helpful assistant for fun, professional team meetings. Keep it friendly and suitable for work.';
  } else if (context === 'classroom') {
    return 'You are a helpful assistant for classroom settings. Keep it educational, positive, and age-appropriate.';
  } else if (context === 'game') {
    return 'You are a helpful assistant for game nights. Keep it playful, energetic, and fun.';
  } else {
    return 'You are a helpful assistant for fun conversations.';
  }
}

// Helper function to call OpenAI API
async function getOpenAIResponse(userPrompt) {
  // Array of fun loading messages with emojis
  const loadingMessages = [
    'Thinking... Please wait. 🤔',
    'Cooking up a response... 🍳',
    'Getting something cool for you... ❄️'
  ];
  // Pick a random loading message
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  responseDiv.textContent = loadingMessages[randomIndex];

  // Get the selected context
  const context = contextSelect.value;
  // Get the system prompt for the selected context
  const systemPrompt = getSystemPrompt(context);

  // Set up the API endpoint and request data
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const data = {
    model: 'gpt-4.1',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_tokens: 80,
    temperature: 0.8
  };

  try {
    // Make the API request using fetch and async/await
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(data)
    });

    // Parse the response as JSON
    const result = await response.json();

    // Get the AI's reply and show it
    const aiReply = result.choices && result.choices[0].message.content;
    responseDiv.textContent = aiReply || 'Sorry, no response from AI.';
  } catch (error) {
    // Show a friendly error message if something goes wrong
    responseDiv.textContent = 'Oops! Something went wrong. Please try again.';
  }
}

// Add event listeners for each button
iceBtn.addEventListener('click', () => {
  // Ask for a fun icebreaker question
  getOpenAIResponse('Give me a fun, friendly icebreaker question to start a conversation.');
});

factBtn.addEventListener('click', () => {
  // Ask for a weird or surprising fact
  getOpenAIResponse('Tell me a weird or surprising fact that most people don\'t know.');
});

jokeBtn.addEventListener('click', () => {
  // Ask for a light, friendly joke
  getOpenAIResponse('Tell me a short, light, and friendly joke.');
});

weatherBtn.addEventListener('click', () => {
  // Ask for a weather-related conversation starter
  getOpenAIResponse('Give me a weather-related conversation starter that encourages people to share what the weather is like where they are.');
});
