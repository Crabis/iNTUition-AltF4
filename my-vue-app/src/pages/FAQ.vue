<template>
  <div class="text-center">
    <h1 class="display-4">Change Management FAQ</h1>

    <!-- Search Bar and Button -->
    <div class="mt-3">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Type to search..."
        class="form-control d-inline-block"
        style="width: 250px;"
      />
      <button class="btn btn-primary ml-2" @click="performSearch">
        {{ message }}
      </button>
    </div>

    <!-- FAQ List -->
    <div class="mt-4" v-if="filteredFaqs.length">
      <ul class="list-unstyled">
        <li
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          class="text-left mb-4 border-bottom pb-2"
        >
          <h5>{{ faq.question }}</h5>
          <p>{{ faq.answer }}</p>
        </li>
      </ul>
    </div>

    <!-- No Results Found -->
    <div class="mt-4" v-else>
      <p>No matching FAQs found.</p>
      <!-- Button to send the question to an AI chatbot -->
      <button class="btn btn-secondary" @click="askAiChatbot">
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
            "We maintain an internal archive that includes detailed case studies of past campaigns, lessons learned, and recommended strategies. You can access it via the 'Archive' section on our intranet or by contacting the Change Management Office."
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
            "Key metrics include employee adoption rates, feedback scores, project milestone completions, and overall ROI. We compare these against objectives set at the start of each campaign."
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
    // Dynamically filter FAQs based on search text in question or answer
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
      // Briefly change the button text for a user-friendly effect
      this.message = "Please wait";
      setTimeout(() => {
        this.message = "Search";
      }, 1000);

      // If you need extra logic (e.g., calling an external search API),
      // you can implement that here. The FAQ filtering is handled automatically
      // by the computed property 'filteredFaqs'.
    },

    askAiChatbot() {
      // This is where you'd handle sending the user's search query or
      // opening a chat window, etc. You could do something like:
      //
      // - this.$router.push('/ai-chat?query=' + this.searchQuery)
      // - open a modal with an AI chat component
      // - call an API endpoint that triggers a chatbot session
      //
      // For now, we'll just show a simple alert:
      alert(
        `Sending your question "${this.searchQuery}" to the AI chatbot...`
      );
    }
  }
};
</script>

<style scoped>
/* Add any custom styling here, for example: */
.list-unstyled li h5 {
  font-weight: bold;
}

.list-unstyled li p {
  margin-bottom: 0;
}
</style>
