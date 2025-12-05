// ---- SELECT ELEMENTS USING CORRECT IDs ----
const input = document.getElementById("productInput");
const button = document.getElementById("searchButton");
const resultsBox = document.getElementById("resultsDisplay");

// ---- WHEN USER CLICKS SEARCH ----
button.addEventListener("click", searchProduct);

// ---- ALSO TRIGGER ON ENTER KEY ----
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchProduct();
});

// ---- MAIN FUNCTION ----
document.getElementById("searchButton").addEventListener("click", searchProduct);

function searchProduct() {
    const query = document.getElementById("productInput").value.trim();
    const resultsDiv = document.getElementById("resultsDisplay");

    if (!query) {
        resultsDiv.innerHTML = "<p>Please enter a product name.</p>";
        return;
    }

    resultsDiv.innerHTML = "<p>Searching...</p>";

    // STATIC DATA (you can modify)
    const staticData = [
        {
            title: "Nike Black Cap",
            price: "₹999",
            link: "https://example.com/nike-black-cap"
        },
        {
            title: "NY White Baseball Cap",
            price: "₹1299",
            link: "https://example.com/ny-white-cap"
        }
    ];

    // Show results
    resultsDiv.innerHTML = staticData
        .map(item => `
            <div class="result-item">
                <h3>${item.title}</h3>
                <p>Price: ${item.price}</p>
                <a href="${item.link}" target="_blank">View Deal</a>
            </div>
        `)
        .join("");
}

