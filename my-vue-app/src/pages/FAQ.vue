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
          <div
            v-if="activeFaqIndex === index"
            class="faq-answer"
          >
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Search",
      searchQuery: "",
      activeFaqIndex: null, // For the accordion open/close
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
      ]
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
    performSearch() {
      // Change the button text briefly
      this.message = "Please wait";
      setTimeout(() => {
        this.message = "Search";
      }, 1000);
      // Filtering is handled by computed property "filteredFaqs"
    },
    // Accordion toggle
    toggleFaq(index) {
      // If clicking the same FAQ, close it; otherwise, open the new one
      this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
    },
    // Escalate to AI Chatbot
    askAiChatbot() {
      alert(
        `Sending your question "${this.searchQuery}" to the AI chatbot...`
      );
      // Here you could route to a chat page, open a modal, or call an API
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
  background-color: #6c757d; /* greyish */
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.2s ease-in-out;
}
.ask-ai-btn:hover {
  background-color: #5a6268;
}

/* TRANSITIONS & ANIMATIONS */

/* Fade in/out for FAQ list items */
.faq-list-enter-active,
.faq-list-leave-active {
  transition: all 0.3s ease;
}
.faq-list-enter,
.faq-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Accordion expand/collapse */
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}
.accordion-enter {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to {
  max-height: 500px; /* large enough to fit your text */
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
</style>
