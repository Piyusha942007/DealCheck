from flask import Flask, request, jsonify, render_template
from scrappers.croma import scrape_croma
from scrappers.reliance import scrape_reliance

app = Flask(__name__)

@app.route("/")
def home():
    return "DealCheck API is Running! Go to /search?q=iphone"

@app.route("/search")
def search():
    product = request.args.get("q")
    if not product:
        return jsonify({"error": "No product query provided"}), 400

    data = []
    
    # List of scrapers to run
    scrapers = [
        scrape_croma,
        scrape_reliance
    ]

    print(f"DEBUG: Starting Search for '{product}'...")
    
    # Run them one by one
    for scraper in scrapers:
        try:
            print(f"DEBUG: Running {scraper.__name__}...")
            result = scraper(product)
            
            if result:
                print(f"DEBUG: Success! Found data from {result['website']}")
                data.append(result)
            else:
                print(f"DEBUG: {scraper.__name__} returned nothing.")
                
        except Exception as e:
            print(f"DEBUG: Critical Error in {scraper.__name__}: {e}")

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)