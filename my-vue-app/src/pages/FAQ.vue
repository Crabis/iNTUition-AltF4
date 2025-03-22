<template>
  <div class="faq-container text-center">
    <h1 class="page-title">Change Management FAQ</h1>

    <!-- Search Section -->
    <div class="search-section">
      <!-- Search Input with Icon -->
      <div class="search-input-container">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Type to search..."
          class="search-input"
        />
      </div>

      <!-- Search Button -->
      <button class="btn search-btn" @click="performSearch">
        {{ message }}
      </button>
    </div>

    <!-- FAQ List -->
    <transition-group
      name="faq-list"
      tag="div"
      class="faq-list mt-4"
      v-if="filteredFaqs.length"
    >
      <div
        v-for="(faq, index) in filteredFaqs"
        :key="faq.question"
        class="faq-card"
      >
        <!-- Accordion Header -->
        <div class="faq-header" @click="toggleFaq(index)">
          <h5 class="faq-question">{{ faq.question }}</h5>
          <span class="toggle-icon">
            <!-- Simple arrow indicator -->
            <span v-if="activeFaqIndex === index">&#9660;</span>
            <span v-else>&#9658;</span>
          </span>
        </div>

        <!-- Accordion Content -->
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
      <button class="btn ask-ai-btn" @click="askAiChatbot">
        Ask the AI Chatbot
      </button>
    </div>

    <!-- Chatbot Modal -->
    <div v-if="showChatModal" class="chat-modal">
      <div class="modal-overlay" @click="closeChatModal"></div>
      <div class="modal-content">
        <button class="close-btn" @click="closeChatModal">&times;</button>
        
        <!-- AI Chatbot Interface -->
        <div class="ai-chatbot">
          <h2>AI Chatbot</h2>

          <!-- Chat Messages -->
          <div class="chat-messages">
            <div
              v-for="(msg, idx) in conversation"
              :key="idx"
              :class="['chat-message', msg.role]"
            >
              <strong>{{ msg.role === 'user' ? 'You' : 'AI' }}:</strong>
              <span>{{ msg.content }}</span>
            </div>
          </div>

          <!-- Chat Input & Send Button -->
          <div class="chat-input-section">
            <input
              type="text"
              v-model="userMessage"
              @keyup.enter="sendMessage"
              placeholder="Type your question..."
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
            "Each completed campaign’s debrief includes best practices and pitfalls. These insights are compiled in the archive and regularly reviewed during planning sessions for new initiatives."
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
            "Reach out to your department’s Change Champion or the CMO for guidance on training, communication, and stakeholder engagement resources."
        }
      ],

      // Modal and Chat state
      showChatModal: false,
      conversation: [], // Will hold user & AI messages
      userMessage: ""   // Current user input
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
    }
  },
  methods: {
    // Simulate searching
    performSearch() {
      this.message = "Please wait";
      setTimeout(() => {
        this.message = "Search";
      }, 1000);
    },

    // Accordion toggle
    toggleFaq(index) {
      this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
    },

    // Open the chatbot modal
    askAiChatbot() {
      this.showChatModal = true;
      // Optionally clear the conversation each time:
      // this.conversation = [];
    },

    // Close the chatbot modal
    closeChatModal() {
      this.showChatModal = false;
    },

    // Send user message to the AI, receive response
    async sendMessage() {
      const userInput = this.userMessage.trim();
      if (!userInput) return;

      // Add user's message to conversation
      this.conversation.push({ role: "user", content: userInput });
      this.userMessage = "";

      try {
        // Example call to OpenRouter.ai Chat endpoint
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            // Replace with your real key (not recommended on client side!)
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            // Must match your configured domain in OpenRouter.ai settings
            //"HTTP-Referer": "https://your-domain.com"
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo", // or other models
            messages: this.conversation,
            max_tokens: 200
          })
        });

        const data = await response.json();
        // AI's reply typically in data.choices[0].message.content
        const aiReply = data?.choices?.[0]?.message?.content || "No response received.";

        this.conversation.push({ role: "assistant", content: aiReply });
      } catch (error) {
        console.error("Error calling OpenRouter.ai:", error);
        this.conversation.push({
          role: "assistant",
          content: "Sorry, I couldn't process your request."
        });
      }
    }
  }
};
</script>

<style scoped>
/* Container */
.faq-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: "Helvetica Neue", sans-serif;
}

/* Title */
.page-title {
  font-weight: bold;
  margin-bottom: 1rem;
}

/* Search Section */
.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

/* Search Input Container */
.search-input-container {
  position: relative;
  display: inline-block;
}

/* Search Icon */
.search-icon {
  position: absolute;
  left: 8px;
  top: 9px;
  font-size: 16px;
  color: #555;
}

/* Search Input */
.search-input {
  padding: 8px 8px 8px 30px; /* space for icon */
  min-width: 250px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

/* Search Button */
.search-btn {
  margin-top: 10px;
  margin-left: 0 !important;
  font-weight: 500;
  border: none;
  color: #fff;
  background-color: #007bff;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.2s ease-in-out;
}
.search-btn:hover {
  background-color: #0056b3;
}

/* FAQ Cards */
.faq-list {
  margin-top: 2rem;
}

/* For each FAQ item */
.faq-card {
  background: #f8f9fa;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}
.faq-card:hover {
  background: #e2e6ea;
}

/* FAQ Header */
.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-question {
  font-size: 1.1rem;
  margin: 0;
  text-align: left;
}
.toggle-icon {
  font-size: 1.4rem;
  padding-right: 5px;
}

/* FAQ Answer */
.faq-answer {
  margin-top: 0.5rem;
  text-align: left;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* No Results Section */
.no-results {
  margin-top: 2rem;
}

/* Ask AI Button */
.ask-ai-btn {
  font-weight: 500;
  border: none;
  color: #fff;
  background-color: #6c757d;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.2s ease-in-out;
}
.ask-ai-btn:hover {
  background-color: #5a6268;
}

/* TRANSITIONS & ANIMATIONS */
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
  max-height: 500px;
  opacity: 1;
}
.accordion-leave {
  max-height: 500px;
  opacity: 1;
}
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Chatbot Modal Styles */
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
  background: rgba(0,0,0,0.5);
}
.modal-content {
  position: relative;
  background: #fff;
  margin: 5% auto;
  padding: 20px;
  max-width: 600px;
  border-radius: 8px;
  z-index: 1001;
}
.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* AI Chatbot */
.ai-chatbot {
  margin-top: 1rem;
}

/* Chat messages container */
.chat-messages {
  max-height: 300px; /* or any desired height */
  overflow-y: auto;
  background: #f9f9f9;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: left;
}

/* Individual messages */
.chat-message {
  margin-bottom: 0.5rem;
  line-height: 1.4;
}
.chat-message.user {
  text-align: right;
}
.chat-message.assistant {
  text-align: left;
}

/* Input & Send button container */
.chat-input-section {
  display: flex;
  gap: 8px;
}
.chat-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}
.send-btn {
  border: none;
  background-color: #007bff;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
}
.send-btn:hover {
  background-color: #0056b3;
}
</style>
