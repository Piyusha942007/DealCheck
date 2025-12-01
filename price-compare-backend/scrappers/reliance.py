import requests
from bs4 import BeautifulSoup

def scrape_reliance(product):
    query = product.replace(" ", "%20") # Reliance often prefers %20 over +
    url = f"https://www.reliancedigital.in/search?q={query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, "html.parser")

        # Reliance classes often involve 'sp__name', 'sp__price' (examples only)
        title = soup.select_one("REPLACE_WITH_RELIANCE_TITLE_CLASS")
        price = soup.select_one("REPLACE_WITH_RELIANCE_PRICE_CLASS")
        link = soup.select_one("REPLACE_WITH_RELIANCE_LINK_CLASS")

        if not title or not price or not link:
            return None

        return {
            "website": "Reliance Digital",
            "title": title.text.strip(),
            "price": price.text.strip(),
            "url": "https://www.reliancedigital.in" + link["href"]
        }
    except Exception as e:
        print(f"Reliance Error: {e}")
        return None