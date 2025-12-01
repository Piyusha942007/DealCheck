import requests
from bs4 import BeautifulSoup

def scrape_croma(product):
    # Croma typically uses /search/?text= for queries
    query = product.replace(" ", "+")
    url = f"https://www.croma.com/search/?text={query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    }

    try:
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, "html.parser")

        # You must Inspect Element on Croma to find these specific classes
        # They change frequently. Example (may be outdated): 'h3.product-title', 'span.amount'
        title = soup.select_one("REPLACE_WITH_CROMA_TITLE_CLASS") 
        price = soup.select_one("REPLACE_WITH_CROMA_PRICE_CLASS") 
        link = soup.select_one("REPLACE_WITH_CROMA_LINK_CLASS")

        if not title or not price or not link:
            print("Croma: No products found (Check Selectors or Anti-Bot)")
            return None

        return {
            "website": "Croma",
            "title": title.text.strip(),
            "price": price.text.strip(),
            "url": "https://www.croma.com" + link["href"]
        }
    except Exception as e:
        print(f"Croma Error: {e}")
        return None