import requests
from bs4 import BeautifulSoup

def scrape_myntra(product):
    # Myntra search URL path usually uses dashes
    query = product.replace(" ", "-")
    url = f"https://www.myntra.com/{query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, "html.parser")

        # Myntra classes are often 'product-base', 'product-productMetaInfo', etc.
        # NOTE: If this returns None, it is because Myntra requires Selenium to render JavaScript.
        title = soup.select_one(".product-product") 
        price = soup.select_one(".product-price") 
        link = soup.select_one("a") # This is likely inside a loop in real code

        if not title or not price:
            return None

        return {
            "website": "Myntra",
            "title": title.text.strip(),
            "price": price.text.strip(),
            "url": "https://www.myntra.com" + link.get('href')
        }
    except Exception as e:
        print(f"Myntra Error: {e}")
        return None