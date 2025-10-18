// ===== Step 1: Initialize quotes array =====
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" }
];
// Simulated server URL using a mock API
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";


let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// ===== Step 2: Load saved quotes on startup =====
document.addEventListener("DOMContentLoaded", () => {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }

  // Build UI elements
  createAddQuoteForm();
  populateCategories();

  // Load the last viewed quote from session storage (if any)
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    document.getElementById("quoteDisplay").innerHTML = lastQuote;
  } else {
    filterQuotes(); // Show one initially (respects last selected category)
  }

  // Refresh quote button
  const btn = document.getElementById("newQuote");
  if (btn) {
    btn.addEventListener("click", filterQuotes);
  }
});

// ===== Step 3: Save quotes to local storage =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== Step 4: Populate categories dynamically =====
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  // Get unique categories (plus “all”)
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  // Clear existing options
  filter.innerHTML = "";

  // Populate dropdown
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (cat === lastSelectedCategory) option.selected = true;
    filter.appendChild(option);
  });
}

// ===== Step 5: Display a random quote =====
function showRandomQuote(filteredQuotes = quotes) {
  const quoteContainer = document.getElementById("quoteDisplay");

  if (!quoteContainer) return;

  if (filteredQuotes.length === 0) {
    quoteContainer.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  const quoteHTML = `
    <p class="quote-text">"${randomQuote.text}"</p>
    <p class="quote-category">— ${randomQuote.category}</p>
  `;
  quoteContainer.innerHTML = quoteHTML;

  // Save this quote in sessionStorage as last viewed
  sessionStorage.setItem("lastQuote", quoteHTML);
}

// ===== Step 6: Filter quotes by category =====
function filterQuotes() {
  const filter = document.getElementById("categoryFilter");
  const selectedCategory = filter ? filter.value : "all";

  // Save filter selection
  localStorage.setItem("selectedCategory", selectedCategory);
  lastSelectedCategory = selectedCategory;

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  showRandomQuote(filteredQuotes);
}

// ===== Step 7: Create "Add Quote" form dynamically =====
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  if (!formContainer) return;

  formContainer.innerHTML = ""; // prevent duplicates

  const form = document.createElement("form");
  form.id = "addQuoteForm";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter quote text";
  quoteInput.required = true;
  quoteInput.id = "quoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;
  categoryInput.id = "quoteCategory";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  // Append elements to form
  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);
  formContainer.appendChild(form);

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newQuote = {
      text: quoteInput.value.trim(),
      category: categoryInput.value.trim(),
    };

    if (newQuote.text && newQuote.category) {
      quotes.push(newQuote);
      saveQuotes(); // save to local storage
      populateCategories(); // update dropdown
      alert("New quote added successfully!");
      form.reset();
    } else {
      alert("Please fill in both fields.");
    }
  });
}

// ===== Step 8: Export quotes to JSON file =====
function exportToJsonFile() {
  const jsonStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ===== Step 9: Import quotes from JSON file =====
// ===== Fetch quotes from server =====
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // replace with your real URL or local file
    if (!response.ok) throw new Error("Failed to fetch quotes");

    const serverQuotes = await response.json();

    // Merge and handle conflicts
    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    showNotification("Failed to fetch quotes from server.", "error");
  }
}
// ===== Step 11: Show notification messages =====
function showNotification(message, type = "info") {
  let notif = document.getElementById("notification");

  // Create container if missing
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "notification";
    document.body.appendChild(notif);
  }

  // Style and display
  notif.textContent = message;
  notif.className = `notification ${type}`; // example: "notification success"
  notif.style.display = "block";

  // Auto-hide after 3 seconds
  setTimeout(() => {
    notif.style.display = "none";
  }, 3000);
}
let pendingConflict = null; // store current conflict for user choice

function resolveConflicts(serverQuotes) {
  const localMap = new Map(quotes.map((q) => [q.id, q]));
  const serverMap = new Map(serverQuotes.map((q) => [q.id, q]));
  const newQuotes = [];
  let hasConflict = false;

  serverQuotes.forEach((serverQuote) => {
    const localQuote = localMap.get(serverQuote.id);

    // Conflict if same ID but different text or category
    if (localQuote && (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category)) {
      hasConflict = true;
      pendingConflict = { localQuote, serverQuote };
      openConflictModal(pendingConflict);
    } else if (!localQuote) {
      newQuotes.push(serverQuote); // new server quote
    }
  });

  // Add any new quotes (non-conflicting)
  if (newQuotes.length > 0) {
    quotes.push(...newQuotes);
    saveQuotes();
    showNotification(`${newQuotes.length} new quotes synced from server.`, "success");
  }

  if (!hasConflict) {
    showNotification("No conflicts found. Sync complete.", "info");
  }
}

// ===== Modal Logic =====
function openConflictModal(conflict) {
  const modal = document.getElementById("conflictModal");
  const conflictText = document.getElementById("conflictText");

  conflictText.innerHTML = `
    <b>Conflict on Quote ID:</b> ${conflict.localQuote.id}<br><br>
    <b>Local:</b> "${conflict.localQuote.text}" (${conflict.localQuote.category})<br>
    <b>Server:</b> "${conflict.serverQuote.text}" (${conflict.serverQuote.category})
  `;

  modal.style.display = "block";

  // Button event handlers
  document.getElementById("keepLocalBtn").onclick = () => {
    closeConflictModal();
    showNotification("Kept local version.", "info");
  };

  document.getElementById("useServerBtn").onclick = () => {
    const index = quotes.findIndex((q) => q.id === conflict.localQuote.id);
    if (index !== -1) {
      quotes[index] = conflict.serverQuote;
    } else {
      quotes.push(conflict.serverQuote);
    }
    saveQuotes();
    closeConflictModal();
    showNotification("Replaced with server version.", "success");
  };
}

function closeConflictModal() {
  document.getElementById("conflictModal").style.display = "none";
  pendingConflict = null;
}
