<template>
  <div class="faq-container">
    <!-- Page Title -->
    <h1 class="page-title">Change Management FAQ</h1>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-input-container">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Type your question..."
          class="search-input"
        />
      </div>
      <button class="btn search-btn" @click="performSearch">
        {{ message }}
      </button>
    </div>

    <!-- FAQ List -->
    <transition-group name="faq-list" tag="div" class="faq-list" v-if="filteredFaqs.length">
      <div v-for="(faq, index) in filteredFaqs" :key="faq.question" class="faq-card">
        <div class="faq-header" @click="toggleFaq(index)">
          <h5 class="faq-question">{{ faq.question }}</h5>
          <span class="toggle-icon">
            <span v-if="activeFaqIndex === index">&#9660;</span>
            <span v-else>&#9658;</span>
          </span>
        </div>
        <transition name="accordion">
          <div v-if="activeFaqIndex === index" class="faq-answer">
            <p>{{ faq.answer }}</p>
          </div>
        </transition>
      </div>
    </transition-group>

    <!-- No Results Found -->
    <div class="no-results" v-else>
      <p>No matching FAQs found.</p>
    </div>

    <!-- "Unanswered?" Section -->
    <div class="unanswered-container">
      <button class="btn unanswered-btn" @click="askAiChatbot">
        Still have questions? Ask Jim!
      </button>
    </div>

    <!-- Chatbot Modal -->
    <div v-if="showChatModal" class="chat-modal">
      <div class="modal-overlay" @click="closeChatModal"></div>
      <div class="modal-content">
        <button class="close-btn" @click="closeChatModal">&times;</button>
        <div class="ai-chatbot">
          <h2>Ask Jim</h2>
          <!-- Chat Messages -->
          <div class="chat-messages">
            <div
              v-for="(msg, idx) in conversation"
              :key="idx"
              :class="['chat-message', msg.role]"
            >
              <div class="message-content">
                <strong>{{ msg.role === 'user' ? 'You' : 'Jim' }}:</strong>
                <!-- For Jim's messages, format using v-html to preserve markdown formatting -->
                <span v-if="msg.role === 'assistant'" v-html="formatMessage(msg.content)"></span>
                <span v-else>{{ msg.content }}</span>
              </div>
              <!-- Show actions for Jim's messages -->
              <div v-if="msg.role === 'assistant'" class="message-actions">
                <button
                  class="btn action-btn"
                  :class="{ liked: msg.feedback === 'like' }"
                  @click="likeMessage(idx)"
                >
                  Like
                </button>
                <button
                  class="btn action-btn"
                  :class="{ disliked: msg.feedback === 'dislike' }"
                  @click="dislikeMessage(idx)"
                >
                  Dislike
                </button>
                <!-- Only show regenerate for the last assistant message -->
                <button
                  v-if="idx === lastAssistantIndex"
                  class="btn action-btn"
                  @click="regenerateResponse"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
          <!-- Chat Input -->
          <div class="chat-input-section">
            <input
              type="text"
              v-model="userMessage"
              @keyup.enter="sendMessage"
              placeholder="Type your question for Jim..."
              class="chat-input"
            />
            <button class="btn send-btn" @click="sendMessage">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  data() {
    return {
      // Search / FAQ state
      message: "Search",
      searchQuery: "",
      activeFaqIndex: null,
      faqs: [
        {
          question: "What is change management?",
          answer:
            "Change management is a structured process and set of tools for leading the people side of change to achieve a desired outcome."
        },
        {
          question: "Why is change management important?",
          answer:
            "Effective change management increases the likelihood of achieving project goals on time and on budget, while minimizing resistance and disruption."
        },
        {
          question: "Where can I find the archive of past change management campaigns?",
          answer:
            "We maintain an internal archive with detailed case studies of past campaigns, lessons learned, and recommended strategies. Access it via the 'Archive' section on our intranet or contact the Change Management Office."
        },
        {
          question: "How do we apply lessons learned to future campaigns?",
          answer:
            "Each completed campaign's debrief includes best practices and pitfalls. These insights are compiled in the archive and regularly reviewed during planning sessions for new initiatives."
        },
        {
          question: "Who is responsible for overseeing change management efforts?",
          answer:
            "The Change Management Office (CMO) leads and coordinates major transformations, working closely with stakeholders to ensure consistent communication and support."
        },
        {
          question: "How do we measure the success of a change initiative?",
          answer:
            "Key metrics include employee adoption rates, feedback scores, project milestone completions, and ROI. We compare these against objectives set at the start of each campaign."
        },
        {
          question: "Where can I get personalized support during a change?",
          answer:
            "Reach out to your department's Change Champion or the CMO for guidance on training, communication, and stakeholder engagement resources."
        }
      ],

      // Modal and Chat state
      showChatModal: false,
      conversation: [], // Array of chat messages (each can have a "feedback" property)
      userMessage: ""
    };
  },
  computed: {
    filteredFaqs() {
      if (!this.searchQuery) return this.faqs;
      const query = this.searchQuery.toLowerCase();
      return this.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    },
    // Computes the index of the last assistant message
    lastAssistantIndex() {
      for (let i = this.conversation.length - 1; i >= 0; i--) {
        if (this.conversation[i].role === "assistant") {
          return i;
        }
      }
      return -1;
    }
  },
  methods: {
    performSearch() {
      this.message = "Please wait";
      setTimeout(() => {
        this.message = "Search";
      }, 1000);
    },
    toggleFaq(index) {
      this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
    },
    askAiChatbot() {
      this.showChatModal = true;
      // If the conversation is empty, let Jim send the first message.
      if (this.conversation.length === 0) {
        this.conversation.push({
          role: 'assistant',
          content: "Hi, I'm Jim, your change management expert. How can I assist you today?"
        });
      }
    },
    closeChatModal() {
      this.showChatModal = false;
    },
    async sendMessage() {
      const userInput = this.userMessage.trim();
      if (!userInput) return;
      // Add user's message to conversation
      this.conversation.push({ role: "user", content: userInput });
      this.userMessage = "";
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY_FAQ}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-thinking-exp:free",
            messages: [
              {
                role: 'system',
                content: 'You are Jim, a helpful change management expert. Provide clear, concise, and professional answers formatted in markdown.'
              },
              ...this.conversation
            ]
          })
        });
        const data = await response.json();
        const aiReply = data?.choices?.[0]?.message?.content || "No response received.";
        this.conversation.push({ role: "assistant", content: aiReply });
      } catch (error) {
        console.error("Error calling OpenRouter.ai:", error);
        this.conversation.push({
          role: "assistant",
          content: "Sorry, I couldn't process your request."
        });
      }
    },
    async regenerateResponse() {
      const lastIdx = this.lastAssistantIndex;
      if (lastIdx !== -1) {
        this.conversation.splice(lastIdx, 1);
      }
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY_FAQ}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-thinking-exp:free",
            messages: [
              {
                role: 'system',
                content: 'You are Jim, a helpful change management expert. Provide clear, concise, and professional answers formatted in markdown.'
              },
              ...this.conversation
            ]
          })
        });
        const data = await response.json();
        const aiReply = data?.choices?.[0]?.message?.content || "No response received.";
        this.conversation.push({ role: "assistant", content: aiReply });
      } catch (error) {
        console.error("Error regenerating response:", error);
        this.conversation.push({
          role: "assistant",
          content: "Sorry, I couldn't process your request."
        });
      }
    },
    likeMessage(index) {
      // Toggle like state; if already liked, remove it.
      this.conversation[index].feedback =
        this.conversation[index].feedback === "like" ? null : "like";
    },
    dislikeMessage(index) {
      // Toggle dislike state; if already disliked, remove it.
      this.conversation[index].feedback =
        this.conversation[index].feedback === "dislike" ? null : "dislike";
    },
    formatMessage(message) {
      // Use marked to convert markdown to HTML
      return marked(message);
    }
  }
};
</script>

<style scoped>
/* Overall Container */
.faq-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
}

/* Page Title */
.page-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2c3e50;
  font-weight: 700;
}

/* Search Section */
.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}
.search-input-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #95a5a6;
}
.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s ease;
}
.search-input:focus {
  border-color: #007bff;
}
.search-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}
.search-btn:hover {
  background-color: #0056b3;
}

/* FAQ List */
.faq-list {
  margin-top: 1.5rem;
}
/* FAQ Card */
.faq-card {
  background: #f7f9fb;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}
.faq-card:hover {
  background: #eef2f6;
  transform: translateY(-2px);
}
.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-question {
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
}
.toggle-icon {
  font-size: 1.4rem;
  color: #007bff;
}
/* FAQ Answer */
.faq-answer {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
}
/* No Results */
.no-results {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #777;
}

/* Unanswered Button */
.unanswered-container {
  text-align: center;
  margin-top: 2rem;
}
.unanswered-btn {
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: #fff;
  background-color: #6c757d;
  cursor: pointer;
  transition: background 0.2s ease;
}
.unanswered-btn:hover {
  background-color: #5a6268;
}

/* Transitions */
.faq-list-enter-active,
.faq-list-leave-active {
  transition: all 0.3s ease;
}
.faq-list-enter,
.faq-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}
.accordion-enter {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to {
  max-height: 400px;
  opacity: 1;
}
.accordion-leave {
  max-height: 400px;
  opacity: 1;
}
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Chatbot Modal */
.chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}
.modal-content {
  position: relative;
  background: #fff;
  margin: 5% auto;
  padding: 2rem;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.75rem;
  color: #aaa;
  cursor: pointer;
  transition: color 0.2s ease;
}
.close-btn:hover {
  color: #333;
}

/* AI Chatbot Styles */
.ai-chatbot {
  margin-top: 1rem;
  text-align: center;
}
.ai-chatbot h2 {
  margin-bottom: 1rem;
  color: #007bff;
}
.chat-messages {
  max-height: 500px;
  min-height: 300px;
  overflow-y: auto;
  background: #f1f4f8;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: left;
}
.chat-message {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}
.message-content {
  display: inline-block;
}
.message-actions {
  margin-top: 0.5rem;
}
.message-actions .action-btn {
  margin-right: 0.5rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #e7e7e7;
  color: #333;
  transition: background 0.2s ease;
}
.message-actions .action-btn.liked {
  background-color: #28a745;
  color: #fff;
}
.message-actions .action-btn.disliked {
  background-color: #dc3545;
  color: #fff;
}
.message-actions .action-btn:hover {
  background-color: #d4d4d4;
}
.chat-input-section {
  display: flex;
  gap: 0.5rem;
}
.chat-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s ease;
}
.chat-input:focus {
  border-color: #007bff;
}
.send-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}
.send-btn:hover {
  background-color: #0056b3;
}
</style>
