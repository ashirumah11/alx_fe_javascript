// ===== Step 1: Initialize quotes array =====
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" }
];

// ===== Step 2: Load saved quotes on startup =====
document.addEventListener("DOMContentLoaded", () => {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }

  // Load the last viewed quote from session storage (if any)
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    document.getElementById("quoteDisplay").innerHTML = lastQuote;
  } else {
    showRandomQuote(); // Show one initially
  }

  createAddQuoteForm(); // Build the Add Quote form dynamically

  // Optional: Button to refresh quotes
  const btn = document.getElementById("newQuote");
  if (btn) {
    btn.addEventListener("click", showRandomQuote);
  }
});

// ===== Step 3: Save quotes to local storage =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== Step 4: Display a random quote =====
function showRandomQuote() {
  const quoteContainer = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteContainer.innerHTML = "<p>No quotes available. Please add some!</p>";
    return;
  }

  // Pick a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteHTML = `
    <p class="quote-text">"${randomQuote.text}"</p>
    <p class="quote-category">— ${randomQuote.category}</p>
  `;
  quoteContainer.innerHTML = quoteHTML;

  // Save this quote in sessionStorage as last viewed
  sessionStorage.setItem("lastQuote", quoteHTML);
}

// ===== Step 5: Create "Add Quote" form dynamically =====
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
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
      alert("New quote added successfully!");
      form.reset();
    } else {
      alert("Please fill in both fields.");
    }
  });
}

// ===== Step 6: Export quotes to JSON file =====
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

// ===== Step 7: Import quotes from JSON file =====
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file. Please check your data.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
