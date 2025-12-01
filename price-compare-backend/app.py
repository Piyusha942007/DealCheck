from flask import Flask, request, jsonify
from scrappers.amazon import scrape_amazon

app = Flask(__name__)

@app.route("/search")
def search():
    product = request.args.get("q")

    data = []
    data.append(scrape_amazon(product))  # <---- Using your scraper

    data = [d for d in data if d]   # remove empty results

    return jsonify(data)

app.run(debug=True)
