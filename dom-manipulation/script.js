// Step 1: Create an array of quote objects
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" }
];

// Step 2: Function to display a random quote
function showRandomQuote() {
  const quoteContainer = document.getElementById("quoteDisplay");
  
  // Pick a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Display it dynamically
  quoteContainer.innerHTML = `
    <p class="quote-text">"${randomQuote.text}"</p>
    <p class="quote-category">— ${randomQuote.category}</p>
  `;
}

// Step 3: Function to create a dynamic "Add Quote" form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  // Create form elements
  const form = document.createElement("form");
  form.id = "addQuoteForm";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter quote text";
  quoteInput.required = true;

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  // Append elements to form
  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);
  formContainer.appendChild(form);

  // Step 4: Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newQuote = {
      text: quoteInput.value.trim(),
      category: categoryInput.value.trim(),
    };

    if (newQuote.text && newQuote.category) {
      quotes.push(newQuote);
      alert("New quote added successfully!");
      form.reset();
    } else {
      alert("Please fill in both fields.");
    }
  });
}

// Step 5: Initialize the page on load
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm(); // Build the Add Quote form dynamically
  showRandomQuote(); // Show an initial random quote

  // Optional: Button to refresh quotes
  const btn = document.getElementById("newQuote");
  if (btn) {
    btn.addEventListener("click", showRandomQuote);
  }
});
