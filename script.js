// Get references to the buttons and response area
const iceBtn = document.getElementById('iceBtn'); // Icebreaker button
const factBtn = document.getElementById('factBtn'); // Weird Fact button
const jokeBtn = document.getElementById('jokeBtn'); // Joke button
const weatherBtn = document.getElementById('weatherBtn'); // Weather button
const responseDiv = document.getElementById('response'); // Area to show the AI's response

// Get reference to the context dropdown
const contextSelect = document.getElementById('contextSelect'); // Dropdown for context (Team, Classroom, Game Night)

// Helper function to get the system prompt based on context
// This changes the AI's tone depending on the selected context
function getSystemPrompt(context) {
  if (context === 'team') {
    // For team meetings
    return 'You are a helpful assistant for fun, professional team meetings. Keep it friendly and suitable for work.';
  } else if (context === 'classroom') {
    // For classroom settings
    return 'You are a helpful assistant for classroom settings. Keep it educational, positive, and age-appropriate.';
  } else if (context === 'game') {
    // For game nights
    return 'You are a helpful assistant for game nights. Keep it playful, energetic, and fun.';
  } else {
    // Default prompt
    return 'You are a helpful assistant for fun conversations.';
  }
}

// Helper function to call OpenAI API and get a response
// Uses async/await and fetch to talk to the AI
async function getOpenAIResponse(userPrompt) {
  // Array of fun loading messages with emojis
  const loadingMessages = [
    'Thinking... Please wait. 🤔',
    'Cooking up a response... 🍳',
    'Chatting with the AI... 💬',
    'Getting something cool for you... ❄️'
  ];
  // Pick a random loading message
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  responseDiv.textContent = loadingMessages[randomIndex];

  // Get the selected context from the dropdown
  const context = contextSelect.value;
  // Get the system prompt for the selected context
  const systemPrompt = getSystemPrompt(context);

  // Set up the API endpoint and request data
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const data = {
    model: 'gpt-4.1', // Use the gpt-4.1 model
    messages: [
      { role: 'system', content: systemPrompt }, // System prompt for context
      { role: 'user', content: userPrompt }      // User's request
    ],
    max_tokens: 80, // Limit the response length
    temperature: 0.8 // Make responses a bit creative
  };

  try {
    // Make the API request using fetch and async/await
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}` // Use your API key from secrets.js
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
// When a button is clicked, ask the AI for the right kind of response
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
