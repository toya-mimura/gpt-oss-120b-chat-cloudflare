export interface Env {
  AI: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Serve HTML for root path
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(getHTML(), {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
        },
      });
    }

    // Chat API endpoint
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const body = await request.json() as {
          systemPrompt: string;
          messages: Array<{ role: string; content: string }>;
        };

        // Prepare messages with system prompt
        const messages = [];

        if (body.systemPrompt && body.systemPrompt.trim()) {
          messages.push({
            role: 'system',
            content: body.systemPrompt,
          });
        }

        // Add conversation history
        messages.push(...body.messages);

        // Call Workers AI with gpt-oss-120b model
        const response = await env.AI.run('@cf/openai/gpt-oss-120b', {
          input: messages,
          reasoning: {
            effort: 'medium',
          },
        });

        // Extract the response content
        let responseContent = '';
        if (response.response) {
          responseContent = response.response;
        } else if (response.choices && response.choices[0]?.message?.content) {
          responseContent = response.choices[0].message.content;
        } else if (typeof response === 'string') {
          responseContent = response;
        } else {
          responseContent = JSON.stringify(response);
        }

        return new Response(JSON.stringify({ response: responseContent }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to process chat request', details: String(error) }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};

function getHTML(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GPT-OSS 120B Chat</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background-color: #1a1a1a;
      color: #e0e0e0;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background-color: #2d2d2d;
      padding: 1rem 2rem;
      border-bottom: 1px solid #404040;
    }

    .header h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
    }

    .container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .sidebar {
      width: 300px;
      background-color: #252525;
      padding: 1.5rem;
      border-right: 1px solid #404040;
      overflow-y: auto;
    }

    .sidebar h2 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
      color: #ffffff;
    }

    .system-prompt {
      width: 100%;
      min-height: 150px;
      background-color: #1a1a1a;
      border: 1px solid #404040;
      border-radius: 8px;
      padding: 0.75rem;
      color: #e0e0e0;
      font-size: 0.875rem;
      font-family: inherit;
      resize: vertical;
    }

    .system-prompt:focus {
      outline: none;
      border-color: #0080ff;
    }

    .main-chat {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      display: flex;
      gap: 1rem;
      max-width: 800px;
    }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .message.user .message-avatar {
      background-color: #0080ff;
    }

    .message.assistant .message-avatar {
      background-color: #10a37f;
    }

    .message-content {
      background-color: #2d2d2d;
      padding: 1rem;
      border-radius: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .message.user .message-content {
      background-color: #0080ff;
      color: #ffffff;
    }

    .input-area {
      padding: 1.5rem 2rem;
      background-color: #2d2d2d;
      border-top: 1px solid #404040;
    }

    .input-container {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      gap: 0.75rem;
    }

    .input-field {
      flex: 1;
      background-color: #1a1a1a;
      border: 1px solid #404040;
      border-radius: 12px;
      padding: 0.875rem 1rem;
      color: #e0e0e0;
      font-size: 1rem;
      font-family: inherit;
      resize: none;
      min-height: 50px;
      max-height: 200px;
    }

    .input-field:focus {
      outline: none;
      border-color: #0080ff;
    }

    .send-button {
      background-color: #0080ff;
      color: #ffffff;
      border: none;
      border-radius: 12px;
      padding: 0 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .send-button:hover:not(:disabled) {
      background-color: #0066cc;
    }

    .send-button:disabled {
      background-color: #404040;
      cursor: not-allowed;
    }

    .loading {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
    }

    .loading-dot {
      width: 8px;
      height: 8px;
      background-color: #666;
      border-radius: 50%;
      animation: loading 1.4s infinite ease-in-out both;
    }

    .loading-dot:nth-child(1) { animation-delay: -0.32s; }
    .loading-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes loading {
      0%, 80%, 100% { opacity: 0.3; }
      40% { opacity: 1; }
    }

    @media (max-width: 768px) {
      .container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        max-height: 200px;
        border-right: none;
        border-bottom: 1px solid #404040;
      }

      .system-prompt {
        min-height: 80px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>GPT-OSS 120B Chat</h1>
  </div>

  <div class="container">
    <div class="sidebar">
      <h2>System Prompt</h2>
      <textarea
        id="systemPrompt"
        class="system-prompt"
        placeholder="Enter system prompt here... (optional)"
      >You are a helpful AI assistant.</textarea>
    </div>

    <div class="main-chat">
      <div id="messages" class="messages"></div>

      <div class="input-area">
        <div class="input-container">
          <textarea
            id="userInput"
            class="input-field"
            placeholder="Type your message..."
            rows="1"
          ></textarea>
          <button id="sendButton" class="send-button">Send</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const systemPrompt = document.getElementById('systemPrompt');

    let conversationHistory = [];
    let isProcessing = false;

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });

    // Send on Enter (Shift+Enter for new line)
    userInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    sendButton.addEventListener('click', sendMessage);

    function addMessage(role, content) {
      const messageDiv = document.createElement('div');
      messageDiv.className = \`message \${role}\`;

      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.textContent = role === 'user' ? '👤' : '🤖';

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.textContent = content;

      messageDiv.appendChild(avatar);
      messageDiv.appendChild(contentDiv);
      messagesContainer.appendChild(messageDiv);

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showLoading() {
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'loading';
      loadingDiv.className = 'message assistant';

      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.textContent = '🤖';

      const loadingContent = document.createElement('div');
      loadingContent.className = 'loading';
      loadingContent.innerHTML = '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';

      loadingDiv.appendChild(avatar);
      loadingDiv.appendChild(loadingContent);
      messagesContainer.appendChild(loadingDiv);

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeLoading() {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.remove();
      }
    }

    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message || isProcessing) return;

      isProcessing = true;
      sendButton.disabled = true;

      // Add user message to UI
      addMessage('user', message);

      // Add to conversation history
      conversationHistory.push({ role: 'user', content: message });

      // Clear input
      userInput.value = '';
      userInput.style.height = 'auto';

      // Show loading
      showLoading();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemPrompt: systemPrompt.value,
            messages: conversationHistory,
          }),
        });

        const data = await response.json();

        removeLoading();

        if (response.ok) {
          const assistantMessage = data.response;
          addMessage('assistant', assistantMessage);
          conversationHistory.push({ role: 'assistant', content: assistantMessage });
        } else {
          addMessage('assistant', \`Error: \${data.error || 'Failed to get response'}\`);
        }
      } catch (error) {
        removeLoading();
        addMessage('assistant', \`Error: \${error.message}\`);
      } finally {
        isProcessing = false;
        sendButton.disabled = false;
        userInput.focus();
      }
    }
  </script>
</body>
</html>`;
}
