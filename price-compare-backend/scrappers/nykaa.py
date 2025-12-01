import requests
from bs4 import BeautifulSoup

def scrape_nykaa(product):
    query = product.replace(" ", "+")
    url = f"https://www.nykaa.com/search/result/?q={query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, "html.parser")

        # Nykaa classes are very dynamic (e.g., 'css-1gc4x7i'). 
        # You must inspect the live site to get the current hash.
        title = soup.select_one(".css-xrzmfa") # Example class from recent data
        price = soup.select_one(".css-111z9ua") # Example class from recent data
        link = soup.select_one("a.css-qlopj4")

        if not title or not price or not link:
            return None

        return {
            "website": "Nykaa",
            "title": title.text.strip(),
            "price": price.text.strip(),
            "url": "https://www.nykaa.com" + link["href"]
        }
    except Exception as e:
        print(f"Nykaa Error: {e}")
        return None