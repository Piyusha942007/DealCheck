from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/search")
def search():
    product = request.args.get("q")

    # TEMPORARY STATIC DATA
    static_data = {
        "results": [
            {
                "website": "Amazon",
                "title": "NY Baseball Cap - White",
                "price": "₹499",
                "url": "https://amazon.in/example-product"
            },
            {
                "website": "Flipkart",
                "title": "Black Stylish Cap",
                "price": "₹349",
                "url": "https://flipkart.com/example-product"
            },
            {
                "website": "Myntra",
                "title": "Trendy Streetwear Cap",
                "price": "₹699",
                "url": "https://myntra.com/example-product"
            }
        ]
    }

    return jsonify(static_data)
