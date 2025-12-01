import requests
from bs4 import BeautifulSoup

def scrape_meesho(product):
    query = product.replace(" ", "+")
    url = f"https://www.meesho.com/search?q={query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, "html.parser")

        # Meesho uses styled-components (randomized classes like 'sc-dkzDqf')
        # Look for stable attributes or use Selenium.
        title = soup.select_one("REPLACE_WITH_MEESHO_TITLE_CLASS")
        price = soup.select_one("REPLACE_WITH_MEESHO_PRICE_CLASS")
        link = soup.select_one("REPLACE_WITH_MEESHO_LINK_CLASS")

        if not title or not price or not link:
            return None

        return {
            "website": "Meesho",
            "title": title.text.strip(),
            "price": price.text.strip(),
            "url": "https://www.meesho.com" + link["href"]
        }
    except Exception as e:
        print(f"Meesho Error: {e}")
        return None