<template>
  <div class="faq-container container py-5">
    <!-- Page Title with Icon -->
    <div class="row mb-5 text-center">
      <div class="col-12">
        <div class="title-icon mb-3">
          <i class="bi bi-question-circle-fill text-primary display-4"></i>
        </div>
        <h1 class="page-title display-4 fw-bold text-primary">Change Management FAQ</h1>
        <p class="lead text-muted">Find answers to commonly asked questions about our change management process</p>
      </div>
    </div>

    <!-- Search Section with Enhanced UI -->
    <div class="row justify-content-center mb-5">
      <div class="col-md-8">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <div class="input-group">
              <span class="input-group-text bg-light border-0">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Type your question..."
                class="form-control border-0 bg-light py-3"
                aria-label="Search questions"
              />
              <button class="btn btn-primary px-4" @click="performSearch">
                {{ message }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="row mb-4">
      <div class="col-12">
        <ul class="nav nav-pills nav-fill">
          <li class="nav-item">
            <button class="nav-link active" @click="filterCategory('all')">All Questions</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="filterCategory('process')">Process</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="filterCategory('resources')">Resources</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="filterCategory('support')">Support</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- FAQ List with Bootstrap Accordion -->
    <div class="row" v-if="filteredFaqs.length">
      <div class="col-12">
        <div class="accordion accordion-flush" id="faqAccordion">
          <transition-group name="faq-list">
            <div 
              v-for="(faq, index) in filteredFaqs" 
              :key="faq.question" 
              class="accordion-item border-0 mb-3 shadow-sm rounded"
            >
              <h2 class="accordion-header" :id="'heading' + index">
                <button 
                  class="accordion-button rounded" 
                  :class="{ 'collapsed': activeFaqIndex !== index }"
                  type="button" 
                  @click="toggleFaq(index)"
                  :aria-expanded="activeFaqIndex === index"
                  :aria-controls="'collapse' + index"
                >
                  <div class="d-flex align-items-center">
                    <i class="bi bi-patch-question-fill text-primary me-3 fs-4"></i>
                    <span class="fw-medium">{{ faq.question }}</span>
                  </div>
                </button>
              </h2>
              <div 
                :id="'collapse' + index" 
                class="accordion-collapse collapse" 
                :class="{ 'show': activeFaqIndex === index }"
                :aria-labelledby="'heading' + index"
              >
                <div class="accordion-body bg-light">
                  <div class="d-flex">
                    <i class="bi bi-info-circle-fill text-success mt-1 me-3 fs-5"></i>
                    <p class="mb-0">{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <!-- No Results Found with Illustration -->
    <div class="row justify-content-center text-center py-5" v-else>
      <div class="col-md-6">
        <img src="@/assets/no-results.png" alt="No results" class="img-fluid mb-4" style="max-height: 200px;">
        <h3 class="text-muted">No matching FAQs found</h3>
        <p class="lead">Try adjusting your search terms or browse all questions</p>
        <button class="btn btn-outline-primary mt-3" @click="searchQuery = ''">
          View All Questions
        </button>
      </div>
    </div>

    <!-- "Unanswered?" Section with Card Design -->
    <div class="row justify-content-center mt-5">
      <div class="col-md-8">
        <div class="card bg-primary text-white shadow border-0">
          <div class="card-body p-5 text-center">
            <div class="row align-items-center">
              <div class="col-md-3 d-none d-md-block">
                <img src="@/assets/question.png" alt="Ask Jim" class="img-fluid" style="max-height: 120px;">
              </div>
              <div class="col-md-9">
                <h3 class="mb-3">Still have questions?</h3>
                <p class="mb-4">Our change management expert Jim is ready to help you with personalized answers</p>
                <button class="btn btn-light btn-lg px-4" @click="askAiChatbot">
                  <i class="bi bi-chat-dots-fill me-2"></i> Ask Jim!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chatbot Modal with Bootstrap Modal -->
    <div class="modal fade" id="chatModal" tabindex="-1" :class="{ 'show': showChatModal }" v-if="showChatModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-robot me-2"></i> Ask Jim - Change Management Expert
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeChatModal"></button>
          </div>
          <div class="modal-body p-0">
            <!-- Chat Messages -->
            <div class="chat-messages p-3" style="height: 400px; overflow-y: auto;">
              <div
                v-for="(msg, idx) in conversation"
                :key="idx"
                :class="['chat-message mb-3', msg.role === 'user' ? 'text-end' : '']"
              >
                <div 
                  :class="['d-inline-block p-3 rounded-3 shadow-sm', 
                    msg.role === 'user' ? 'bg-primary text-white' : 'bg-light']"
                  style="max-width: 80%;"
                >
                  <div class="message-content">
                    <div class="d-flex align-items-center mb-2">
                      <div v-if="msg.role !== 'user'" class="avatar me-2 bg-primary text-white rounded-circle">
                        <span class="fw-bold">J</span>
                      </div>
                      <strong>{{ msg.role === 'user' ? 'You' : 'Jim' }}</strong>
                    </div>
                    <div v-if="msg.role === 'assistant'" v-html="formatMessage(msg.content)"></div>
                    <div v-else>{{ msg.content }}</div>
                  </div>
                </div>
                <!-- Message Actions -->
                <div v-if="msg.role === 'assistant'" class="message-actions mt-2">
                  <button
                    class="btn btn-sm"
                    :class="msg.feedback === 'like' ? 'btn-success' : 'btn-outline-secondary'"
                    @click="likeMessage(idx)"
                  >
                    <i class="bi bi-hand-thumbs-up"></i>
                  </button>
                  <button
                    class="btn btn-sm ms-1"
                    :class="msg.feedback === 'dislike' ? 'btn-danger' : 'btn-outline-secondary'"
                    @click="dislikeMessage(idx)"
                  >
                    <i class="bi bi-hand-thumbs-down"></i>
                  </button>
                  <button
                    v-if="idx === lastAssistantIndex"
                    class="btn btn-sm btn-outline-primary ms-1"
                    @click="regenerateResponse"
                  >
                    <i class="bi bi-arrow-repeat"></i> Regenerate
                  </button>
                </div>
              </div>
            </div>
            <!-- Chat Input -->
            <div class="chat-input-section p-3 border-top">
              <div class="input-group">
                <input
                  type="text"
                  v-model="userMessage"
                  @keyup.enter="sendMessage"
                  placeholder="Type your question for Jim..."
                  class="form-control"
                />
                <button class="btn btn-primary px-4" @click="sendMessage">
                  <i class="bi bi-send-fill"></i>
                </button>
              </div>
            </div>
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
      chatLoading: false,
      // Search / FAQ state
      message: "Search",
      searchQuery: "",
      activeFaqIndex: null,
      activeCategory: 'all',
      faqs: [
        {
          question: "What is change management?",
          answer: "Change management is a structured process and set of tools for leading the people side of change to achieve a desired outcome.",
          category: "process"
        },
        {
          question: "Why is change management important?",
          answer: "Effective change management increases the likelihood of achieving project goals on time and on budget, while minimizing resistance and disruption.",
          category: "process"
        },
        {
          question: "Where can I find the archive of past change management campaigns?",
          answer: "We maintain an internal archive with detailed case studies of past campaigns, lessons learned, and recommended strategies. Access it via the 'Archive' section on our intranet or contact the Change Management Office.",
          category: "resources"
        },
        {
          question: "How do we apply lessons learned to future campaigns?",
          answer: "Each completed campaign's debrief includes best practices and pitfalls. These insights are compiled in the archive and regularly reviewed during planning sessions for new initiatives.",
          category: "process"
        },
        {
          question: "Who is responsible for overseeing change management efforts?",
          answer: "The Change Management Office (CMO) leads and coordinates major transformations, working closely with stakeholders to ensure consistent communication and support.",
          category: "support"
        },
        {
          question: "How do we measure the success of a change initiative?",
          answer: "Key metrics include employee adoption rates, feedback scores, project milestone completions, and ROI. We compare these against objectives set at the start of each campaign.",
          category: "process"
        },
        {
          question: "Where can I get personalized support during a change?",
          answer: "Reach out to your department's Change Champion or the CMO for guidance on training, communication, and stakeholder engagement resources.",
          category: "support"
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
      let filtered = this.faqs;
      
      // Filter by category first
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(faq => faq.category === this.activeCategory);
      }
      
      // Then filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        );
      }
      
      return filtered;
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

      // Set chatLoading to true and push a temporary loading message from Jim
      this.chatLoading = true;
      this.conversation.push({ role: "assistant", content: "..." });

      // Create a sanitized version of the conversation by filtering out any user messages
      // that try to inject a new role or override system instructions.
      const sanitizedConversation = this.conversation.filter(msg => {
        // For example, if a user message contains "you are" (case-insensitive), filter it out.
        if (msg.role === "user" && /you are/i.test(msg.content)) {
          return false;
        }
        return true;
      });

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
                content: 'You are Jim, a helpful change management expert. You always respond in a professional tone regardless of the prompt. Provide clear, concise, and professional answers formatted in markdown.'
              },
              ...sanitizedConversation.filter(msg => msg.role !== "assistant" || msg.content !== "...")
            ]
          })
        });
        const data = await response.json();
        // Remove the temporary loading message
        this.conversation.pop();
        const aiReply = data?.choices?.[0]?.message?.content || "No response received.";
        this.conversation.push({ role: "assistant", content: aiReply });
      } catch (error) {
        console.error("Error calling OpenRouter.ai:", error);
        // Remove the temporary message if present
        this.conversation.pop();
        this.conversation.push({
          role: "assistant",
          content: "Sorry, I couldn't process your request."
        });
      } finally {
        this.chatLoading = false;
      }
    },
    async regenerateResponse() {
      // Remove the last assistant message if it exists
      const lastIdx = this.lastAssistantIndex;
      if (lastIdx !== -1) {
        this.conversation.splice(lastIdx, 1);
      }
      // Set loading state and add temporary "..." message
      this.chatLoading = true;
      this.conversation.push({ role: "assistant", content: "..." });
      
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
              // Filter out any temporary "..." messages if present
              ...this.conversation.filter(msg => msg.role !== "assistant" || msg.content !== "...")
            ]
          })
        });
        const data = await response.json();
        // Remove the temporary "..." message
        this.conversation.pop();
        const aiReply = data?.choices?.[0]?.message?.content || "No response received.";
        this.conversation.push({ role: "assistant", content: aiReply });
      } catch (error) {
        console.error("Error regenerating response:", error);
        // Remove the temporary message if present
        this.conversation.pop();
        this.conversation.push({
          role: "assistant",
          content: "Sorry, I couldn't process your request."
        });
      } finally {
        this.chatLoading = false;
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

<style>
/* Import Bootstrap CSS and Icons */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

/* Custom Styling */
.faq-container {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* Avatar styling */
.avatar {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Accordion customization */
.accordion-button:not(.collapsed) {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: rgba(13, 110, 253, 0.25);
}

/* Animations */
.faq-list-enter-active,
.faq-list-leave-active {
  transition: all 0.3s ease;
}
.faq-list-enter-from,
.faq-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Modal backdrop */
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

/* Title icon animation */
.title-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
