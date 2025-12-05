import requests
from bs4 import BeautifulSoup

def scrape_amazon(product):
    try:
        query = product.replace(" ", "+")
        url = f"https://www.amazon.in/s?k={query}"

        headers = {
            "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                           "AppleWebKit/537.36 (KHTML, like Gecko) "
                           "Chrome/118.0.0.0 Safari/537.36"),
            "Accept-Language": "en-US,en;q=0.9",
        }

        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            print("Amazon blocked request:", response.status_code)
            return None

        soup = BeautifulSoup(response.text, "html.parser")

        product_box = soup.select_one("div[data-component-type='s-search-result']")
        if not product_box:
            print("Amazon: No result-container found")
            return None

        title = product_box.select_one("h2 a span")
        price = product_box.select_one(".a-price-whole")
        link = product_box.select_one("h2 a")

        if not (title and price and link):
            print("Amazon: Missing title/price/link")
            return None

        return {
            "website": "Amazon",
            "title": title.get_text(strip=True),
            "price": price.get_text(strip=True),
            "url": "https://www.amazon.in" + link.get("href")
        }

    except Exception as e:
        print("Amazon scraper error:", e)
        return None
