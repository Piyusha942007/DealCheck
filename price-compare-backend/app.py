from flask import Flask, request, jsonify
# Import all your scrapers here
# Ensure these files are all inside the 'scrappers' folder
from scrappers.amazon import scrape_amazon
from scrappers.flipkart import scrape_flipkart
from scrappers.croma import scrape_croma
from scrappers.meesho import scrape_meesho
from scrappers.myntra import scrape_myntra
from scrappers.reliance import scrape_reliance
from scrappers.nykaa import scrape_nykaa

# OPTIONAL: Import ThreadPoolExecutor for faster scraping
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "DealCheck API is running!"}

@app.route("/search")
def search():
    product = request.args.get("q")
    if not product:
        return jsonify({"error": "No product query provided"}), 400

    data = []

    # --- OPTION 1: Simple (Slow) ---
    # Python runs these one by one. If one takes 3 seconds, 7 sites = 21 seconds.
    # data.append(scrape_amazon(product))
    # data.append(scrape_flipkart(product))
    # data.append(scrape_croma(product))
    # data.append(scrape_meesho(product))
    # data.append(scrape_myntra(product))
    # data.append(scrape_reliance(product))
    # data.append(scrape_nykaa(product))

    # --- OPTION 2: Parallel (Fast) ---
    # This runs all scrapers at the exact same time. Total time = time of the slowest single site.
    scrapers = [
        scrape_amazon,
        scrape_flipkart,
        scrape_croma,
        scrape_meesho,
        scrape_myntra,
        scrape_reliance,
        scrape_nykaa
    ]

    with ThreadPoolExecutor() as executor:
        # map runs the function (first arg) with the argument (second arg)
        results = executor.map(lambda f: f(product), scrapers)
        
        # Collect results
        for result in results:
            if result:
                data.append(result)

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)