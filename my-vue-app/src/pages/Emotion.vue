<template>
    <div class="chatbot-container">
        <b-card no-body class="chat-card">
            <b-card-header class="chat-header">
                <h4>Change Management Assistant</h4>
                <p class="subtitle">Helping manage emotions during organizational change</p>
            </b-card-header>

            <b-card-body class="chat-body" ref="chatBody">
                <div class="messages-container">
                    <div v-for="(message, index) in messages" :key="index"
                        :class="['message', message.role === 'user' ? 'user-message' : 'bot-message']">
                        <b-avatar v-if="message.role !== 'user'" variant="primary" icon="robot"></b-avatar>
                        <div class="message-content">{{ message.content }}</div>
                        <b-avatar v-if="message.role === 'user'" variant="info" icon="person"></b-avatar>
                    </div>
                </div>
            </b-card-body>

            <b-card-footer class="chat-footer">
                <b-form @submit.prevent="sendMessage">
                    <b-input-group>
                        <b-form-input v-model="userInput" placeholder="Type your concerns about change management..."
                            :disabled="isLoading"></b-form-input>
                        <b-button type="submit" variant="primary" :disabled="isLoading || !userInput.trim()">
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
            isLoading: false
        };
    },
    mounted() {
        // Scroll to bottom of chat
        this.scrollToBottom();
    },
    updated() {
        // Scroll to bottom when messages update
        this.scrollToBottom();
    },
    methods: {
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
                        "HTTP-Referer": window.location.origin, // Site URL for rankings on openrouter.ai
                        "X-Title": "Change Management Assistant", // Site title for rankings on openrouter.ai
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": "google/gemini-2.0-flash-thinking-exp:free", // Using Gemini model as specified
                        "messages": [
                            {
                                role: 'system',
                                content: 'You are a supportive change management assistant. Help users manage their emotions during organizational change. Provide empathetic, practical advice for coping with uncertainty, stress, and resistance to change. Be concise but helpful.'
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
            }
        },
        scrollToBottom() {
            if (this.$refs.chatBody) {
                this.$nextTick(() => {
                    this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight;
                });
            }
        }
    }
};
</script>

<style scoped>
.chatbot-container {
    max-width: 800px;
    margin: 0 auto;
    height: 100%;
}

.chat-card {
    height: 600px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
}

.chat-header {
    background-color: #4a6fa5;
    color: white;
    padding: 15px 20px;
}

.chat-header h4 {
    margin-bottom: 5px;
}

.subtitle {
    font-size: 14px;
    margin-bottom: 0;
    opacity: 0.8;
}

.chat-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #f8f9fa;
}

.messages-container {
    display: flex;
    flex-direction: column;
}

.message {
    display: flex;
    margin-bottom: 15px;
    align-items: flex-start;
    max-width: 80%;
}

.user-message {
    margin-left: auto;
    flex-direction: row-reverse;
}

.bot-message {
    margin-right: auto;
}

.message-content {
    padding: 12px 16px;
    border-radius: 18px;
    margin: 0 10px;
    line-height: 1.4;
}

.user-message .message-content {
    background-color: #007bff;
    color: white;
    border-bottom-right-radius: 4px;
}

.bot-message .message-content {
    background-color: #e9ecef;
    color: #212529;
    border-bottom-left-radius: 4px;
}

.chat-footer {
    padding: 15px;
    background-color: white;
    border-top: 1px solid #dee2e6;
}
</style>