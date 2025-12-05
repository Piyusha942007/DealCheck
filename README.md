🚀 DealCheck — Price Comparison Web App
A simple and powerful price comparison tool that helps users find the best deals across multiple e‑commerce platforms.
Users search for any product → DealCheck scrapes prices from different websites → displays a clean comparison → and provides direct “Buy Now” links.

📌 Features
✔ Search any product (e.g., “iPhone 13”, “Laptop”, “Earbuds”)
✔ Compares prices from multiple websites like:

Amazon

Flipkart

Croma

Reliance Digital

✔ Displays product name, price, source website
✔ Direct links to purchase
✔ Fast, lightweight backend
✔ Modular scraper architecture
✔ Beginner‑friendly code structure

🏗 Tech Stack
Backend
Python

Flask

Requests

BeautifulSoup4

Scraping
HTML parsing with BeautifulSoup

Dynamic user‑agents

Modular website scrapers

Frontend (optional / created by your partner)
HTML, CSS, JS or React

📁 Project Structure
DealCheck/
 ├── scrapers/
 │    ├── amazon.py
 │    ├── flipkart.py
 │    ├── croma.py
 │    └── reliance.py
 ├── app.py
 ├── requirements.txt
 ├── README.md
 └── .gitignore
⚙️ How It Works
User enters a product name

Backend sends request to each scraper

Each scraper fetches:

Product Title

Price

Link

Backend returns combined results as JSON

Frontend displays a clean table/card UI

🚀 Installation & Setup
1. Clone Repo
git clone https://github.com/<your-username>/DealCheck.git
cd DealCheck
2. Create Virtual Environment
python -m venv venv
Activate:

Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

3. Install Dependencies
pip install -r requirements.txt
▶️ Run the Backend Server
python app.py
API will be available at:

http://localhost:5000/search?q=iphone
🧪 API Example Response
[
  {
    "website": "Amazon",
    "title": "Apple iPhone 13 (128GB)",
    "price": "58999",
    "url": "https://amazon.in/..."
  },
  {
    "website": "Flipkart",
    "title": "APPLE iPhone 13",
    "price": "57999",
    "url": "https://flipkart.com/..."
  }
]
🧱 Scrapers Overview
Each website has its own scraper file inside /scrapers.

Example template:

def scrape_amazon(product):
    # fetch HTML
    # parse product title
    # parse price
    # return JSON-ready dictionary
🌍 Deployment
Backend can be deployed on:

Render

Railway

Vercel (serverless)

Frontend can be deployed on:

Netlify

Vercel

GitHub Pages

🔮 Future Enhancements
Price history tracking

Graphs for price trends

More websites

Automatic price alerts (email/SMS)

Better error handling

Chrome extension

🤝 Contributors
Name	Role
Piyusha Amrutkar	Backend + Web Scraping
Khushi Agrawal    	Frontend + UI/UX