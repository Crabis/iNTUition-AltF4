<template>
    <div class="chatbot-container">
        <b-card no-body class="chat-card">
            <b-card-header class="chat-header">
                <div class="header-content">
                    <div class="logo-container">
                        <img src="@/assets/vue.svg" alt="Change Management Logo" class="logo">
                    </div>
                    <div class="header-text">
                        <h4>Change Management Assistant</h4>
                        <p class="subtitle">Helping navigate organizational transitions with confidence</p>
                    </div>
                </div>
                <div class="theme-toggle">
                    <b-button variant="link" @click="toggleTheme" class="theme-button">
                        <b-icon :icon="isDarkMode ? 'sun' : 'moon'" font-scale="1.2"></b-icon>
                    </b-button>
                </div>
            </b-card-header>

            <div class="status-bar">
                <div class="status-indicator">
                    <span class="status-dot active"></span>
                    <span class="status-text">AI Assistant Online</span>
                </div>
                <div class="emotion-indicator">
                    <b-icon icon="emoji-smile" font-scale="1.1"></b-icon>
                    <span>Emotional Support Mode</span>
                </div>
            </div>

            <b-card-body class="chat-body" ref="chatBody">
                <div class="welcome-banner" v-if="messages.length === 1">
                    <img src="@/assets/welcome-illustration.jpg" alt="Welcome" class="welcome-image">
                    <h5>Welcome to your Change Management Assistant</h5>
                    <p>I'm here to help you navigate organizational change with confidence and resilience.</p>
                    <div class="quick-prompts">
                        <b-button variant="outline-primary" size="sm"
                            @click="useQuickPrompt('I\'m feeling anxious about the upcoming reorganization')">
                            I'm feeling anxious about changes
                        </b-button>
                        <b-button variant="outline-primary" size="sm"
                            @click="useQuickPrompt('How can I help my team adapt to new processes?')">
                            Supporting my team
                        </b-button>
                        <b-button variant="outline-primary" size="sm"
                            @click="useQuickPrompt('What are some change management best practices?')">
                            Change management tips
                        </b-button>
                    </div>
                </div>

                <div class="messages-container">
                    <div v-for="(message, index) in messages" :key="index"
                        :class="['message', message.role === 'user' ? 'user-message' : 'bot-message']">
                        <div class="avatar-container" v-if="message.role !== 'user'">
                            <b-avatar variant="primary" src="@/assets/assistant-avatar.png"
                                class="assistant-avatar"></b-avatar>
                        </div>
                        <div class="message-content" v-if="message.role === 'user'">{{ message.content }}</div>
                        <div class="message-content formatted-content" v-else v-html="formatMessage(message.content)">
                        </div>
                        <div class="avatar-container" v-if="message.role === 'user'">
                            <b-avatar variant="info" :src="userAvatar || undefined"
                                :icon="!userAvatar ? 'person' : undefined" class="user-avatar"></b-avatar>
                        </div>
                    </div>
                    <div class="typing-indicator" v-if="isLoading">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </b-card-body>

            <div class="resources-bar" v-if="showResources">
                <div class="resources-header">
                    <h6>Helpful Resources</h6>
                    <b-button variant="link" class="close-button" @click="showResources = false">
                        <b-icon icon="x" font-scale="1"></b-icon>
                    </b-button>
                </div>
                <div class="resources-content">
                    <a href="#" class="resource-item">
                        <b-icon icon="file-earmark-text" font-scale="1"></b-icon>
                        <span>Change Management Toolkit</span>
                    </a>
                    <a href="#" class="resource-item">
                        <b-icon icon="journal-text" font-scale="1"></b-icon>
                        <span>Emotional Resilience Guide</span>
                    </a>
                    <a href="#" class="resource-item">
                        <b-icon icon="people" font-scale="1"></b-icon>
                        <span>Team Transition Planning</span>
                    </a>
                </div>
            </div>

            <b-card-footer class="chat-footer">
                <div class="toolbar">
                    <b-button variant="link" class="toolbar-button" @click="showResources = !showResources">
                        <b-icon icon="info-circle" font-scale="1.1"></b-icon>
                    </b-button>
                    <b-button variant="link" class="toolbar-button" @click="clearChat">
                        <b-icon icon="trash" font-scale="1.1"></b-icon>
                    </b-button>
                </div>
                <b-form @submit.prevent="sendMessage" class="message-form">
                    <b-input-group>
                        <b-form-textarea v-model="userInput" placeholder="Type your concerns about change management..."
                            :disabled="isLoading" rows="1" max-rows="4" class="message-input"
                            @keydown.enter.exact.prevent="sendMessage"></b-form-textarea>
                        <b-button type="submit" variant="primary" :disabled="isLoading || !userInput.trim()"
                            class="send-button">
                            <b-spinner small v-if="isLoading"></b-spinner>
                            <span v-else>Send</span>
                        </b-button>
                    </b-input-group>
                </b-form>
            </b-card-footer>
        </b-card>
    </div>
</template>

<script>
import { marked } from 'marked';

export default {
    name: 'Chatbot',
    data() {
        return {
            userInput: '',
            messages: [
                {
                    role: 'assistant',
                    content: 'Hello! I\'m your Change Management Assistant. I can help you manage emotions and stress during organizational transitions. How are you feeling about the changes in your organization?'
                }
            ],
            isLoading: false,
            isDarkMode: false,
            showResources: false,
            userAvatar: null, // Can be set to user's profile picture if available
        };
    },
    mounted() {
        // Scroll to bottom of chat
        this.scrollToBottom();

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('chatTheme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
            document.body.classList.add('dark-mode');
        }
    },
    updated() {
        // Scroll to bottom when messages update
        this.scrollToBottom();
    },
    methods: {
        formatMessage(content) {
            // Convert markdown to HTML and enhance with custom formatting
            let formattedContent = marked(content);

            // Replace certain patterns with custom HTML that includes icons
            formattedContent = formattedContent.replace(
                /<h3>Tip:(.*?)<\/h3>/gi,
                '<div class="tip-box"><b-icon icon="lightbulb" font-scale="1.2"></b-icon><h3>Tip:$1</h3></div>'
            );

            return formattedContent;
        },
        async sendMessage() {
            if (!this.userInput.trim() || this.isLoading) return;

            // Add user message
            this.messages.push({
                role: 'user',
                content: this.userInput
            });

            const userMessage = this.userInput;
            this.userInput = '';
            this.isLoading = true;

            try {
                // Prepare conversation history for the AI
                const messageHistory = this.messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));

                // Call OpenRouter.ai API using fetch
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY_EMOTION}`,
                        "HTTP-Referer": window.location.origin,
                        "X-Title": "Change Management Assistant",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": "google/gemini-2.0-flash-thinking-exp:free",
                        "messages": [
                            {
                                role: 'system',
                                content: 'You are a supportive change management assistant. Help users manage their emotions during organizational change. Provide empathetic, practical advice for coping with uncertainty, stress, and resistance to change. Format your responses using markdown for better readability. Use ### Tip: to highlight important tips. Keep responses concise but helpful. Include specific actionable strategies when possible.'
                            },
                            ...messageHistory
                        ]
                    })
                });

                const completion = await response.json();

                // Add AI response to messages
                if (completion.choices && completion.choices[0]) {
                    this.messages.push({
                        role: 'assistant',
                        content: completion.choices[0].message.content
                    });
                }
            } catch (error) {
                console.error('Error calling OpenRouter.ai:', error);
                this.messages.push({
                    role: 'assistant',
                    content: 'I apologize, but I encountered an error. Please try again later.'
                });
            } finally {
                this.isLoading = false;
                this.userInput = '';
            }
        },
        scrollToBottom() {
            if (this.$refs.chatBody) {
                this.$nextTick(() => {
                    this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight;
                });
            }
        },
        toggleTheme() {
            this.isDarkMode = !this.isDarkMode;
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('chatTheme', this.isDarkMode ? 'dark' : 'light');
        },
        useQuickPrompt(prompt) {
            this.userInput = prompt;
            this.sendMessage();
        },
        clearChat() {
            // Keep only the first welcome message
            this.messages = this.messages.slice(0, 1);
        }
    }
};
</script>

<style>
:root {
    --primary-color: #4a6fa5;
    --primary-light: #6189c2;
    --primary-dark: #385480;
    --secondary-color: #5d8aa8;
    --accent-color: #f0ad4e;
    --text-color: #333;
    --text-light: #666;
    --bg-color: #f8f9fa;
    --card-bg: #fff;
    --border-color: #dee2e6;
    --user-message-bg: #007bff;
    --user-message-color: white;
    --bot-message-bg: #e9ecef;
    --bot-message-color: #212529;
    --hover-color: #f1f3f5;
}

body.dark-mode {
    --primary-color: #5d8aa8;
    --primary-light: #7aa5c2;
    --primary-dark: #456980;
    --secondary-color: #4a6fa5;
    --accent-color: #f0ad4e;
    --text-color: #e9ecef;
    --text-light: #adb5bd;
    --bg-color: #2c3e50;
    --card-bg: #1a2634;
    --border-color: #4d5d6c;
    --user-message-bg: #0069d9;
    --user-message-color: white;
    --bot-message-bg: #3a4d5f;
    --bot-message-color: #e9ecef;
    --hover-color: #2e3e4e;
}

.chatbot-container {
    max-width: 800px;
    margin: 0 auto;
    height: 100%;
}

.chat-card {
    height: 700px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-radius: 16px;
    overflow: hidden;
    border: none;
    background-color: var(--card-bg);
    transition: all 0.3s ease;
}

.chat-header {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: none;
}

.header-content {
    display: flex;
    align-items: center;
}

.logo-container {
    margin-right: 15px;
}

.logo {
    height: 40px;
    width: 40px;
}

.header-text h4 {
    margin-bottom: 5px;
    font-weight: 600;
}

.subtitle {
    font-size: 14px;
    margin-bottom: 0;
    opacity: 0.9;
}

.theme-button {
    color: white;
    padding: 5px;
}

.theme-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
}

.status-bar {
    background-color: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    padding: 8px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: var(--text-light);
}

.status-indicator,
.emotion-indicator {
    display: flex;
    align-items: center;
}

.status-dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: #ccc;
}

.status-dot.active {
    background-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
}

.emotion-indicator svg {
    margin-right: 8px;
    color: var(--accent-color);
}

.chat-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: var(--bg-color);
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-light) var(--bg-color);
}

.chat-body::-webkit-scrollbar {
    width: 6px;
}

.chat-body::-webkit-scrollbar-track {
    background: var(--bg-color);
}

.chat-body::-webkit-scrollbar-thumb {
    background-color: var(--primary-light);
    border-radius: 3px;
}

.welcome-banner {
    text-align: center;
    padding: 20px;
    margin-bottom: 20px;
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.welcome-image {
    max-width: 200px;
    margin-bottom: 20px;
}

.welcome-banner h5 {
    margin-bottom: 10px;
    color: var(--primary-color);
    font-weight: 600;
}

.welcome-banner p {
    color: var(--text-light);
    margin-bottom: 20px;
}

.quick-prompts {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
}

.messages-container {
    display: flex;
    flex-direction: column;
}

.message {
    display: flex;
    margin-bottom: 20px;
    align-items: flex-start;
    max-width: 85%;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.user-message {
    margin-left: auto;
    flex-direction: row-reverse;
}

.bot-message {
    margin-right: auto;
}

.avatar-container {
    min-width: 40px;
    display: flex;
    align-items: center;
}

.assistant-avatar,
.user-avatar {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message-content {
    padding: 14px 18px;
    border-radius: 18px;
    margin: 0 10px;
    line-height: 1.5;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
    background-color: var(--user-message-bg);
    color: var(--user-message-color);
    border-bottom-right-radius: 4px;
}

.bot-message .message-content {
    background-color: var(--bot-message-bg);
    color: var(--bot-message-color);
    border-bottom-left-radius: 4px;
}

/* Typing indicator animation */
.typing-indicator {
    display: flex;
    padding: 15px;
    width: 70px;
    border-radius: 20px;
    background-color: var(--bot-message-bg);
    margin-bottom: 20px;
    align-self: flex-start;
}

.typing-indicator span {
    height: 8px;
    width: 8px;
    background-color: var(--text-light);
    border-radius: 50%;
    display: inline-block;
    margin: 0 2px;
    animation: bounce 1.3s linear infinite;
}


.typing-indicator span:nth-child(2) {
    animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes bounce {

    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-4px);
    }
}

.formatted-content {
    white-space: normal;
}

.formatted-content ul,
.formatted-content ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
}

.formatted-content li {
    margin-bottom: 0.25em;
}

.formatted-content p {
    margin: 0.5em 0;
}

.formatted-content h1,
.formatted-content h2,
.formatted-content h3,
.formatted-content h4 {
    margin: 0.75em 0 0.5em 0;
    color: var(--primary-color);
}

.formatted-content code {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-family: monospace;
}

.formatted-content pre {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.5em;
    border-radius: 5px;
    overflow-x: auto;
}

.formatted-content blockquote {
    border-left: 3px solid var(--primary-light);
    margin: 0.5em 0;
    padding-left: 1em;
    color: var(--text-light);
    font-style: italic;
}

.tip-box {
    background-color: rgba(240, 173, 78, 0.1);
    border-left: 4px solid var(--accent-color);
    padding: 10px 15px;
    margin: 10px 0;
    border-radius: 4px;
}

.tip-box h3 {
    display: flex;
    align-items: center;
    color: var(--accent-color);
    margin-bottom: 5px;
}

.tip-box svg {
    margin-right: 10px;
}

.resources-bar {
    background-color: var(--card-bg);
    border-top: 1px solid var(--border-color);
    padding: 15px;
}

.resources-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.resources-header h6 {
    margin: 0;
    color: var(--primary-color);
    font-weight: 600;
}

.close-button {
    padding: 0;
    color: var(--text-light);
}

.resources-content {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.resource-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: var(--bg-color);
    border-radius: 20px;
    color: var(--text-color);
    text-decoration: none;
    transition: background-color 0.2s ease;
}

.resource-item:hover {
    background-color: var(--hover-color);
}

.resource-item svg {
    margin-right: 8px;
    color: var(--primary-color);
}

.chat-footer {
    padding: 15px;
    background-color: var(--card-bg);
    border-top: 1px solid var(--border-color);
}

.toolbar {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
}

.toolbar-button {
    color: var(--text-light);
    padding: 5px;
    margin-right: 10px;
}

.toolbar-button:hover {
    color: var(--primary-color);
}

.message-form {
    display: flex;
}

.message-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    resize: none;
}

.message-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(74, 111, 165, 0.25);
}

.send-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem 0.75rem;
}

.send-button:hover:not(:disabled) {
    background-color: var(--primary-dark);
    border-color: var(--primary-dark);
    transform: scale(1.05);
}

.send-button:disabled {
    opacity: 0.6;
}

@media (max-width: 768px) {
    .send-button {
        padding: 0.375rem 0.5rem;
    }

    .chatbot-container {
        height: 100vh;
        max-width: 100%;
    }

    .chat-card {
        height: 100%;
        border-radius: 0;
    }

    .message {
        max-width: 90%;
    }

    .resources-content {
        flex-direction: column;
    }

    .resource-item {
        width: 100%;
    }
}
</style>
