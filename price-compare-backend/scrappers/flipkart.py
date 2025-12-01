import requests
from bs4 import BeautifulSoup

def scrape_flipkart(product):
    query = product.replace(" ", "%20")
    # Correct URL for Flipkart
    url = f"https://www.flipkart.com/search?q={query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }

    try:
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, "html.parser")

        # Common Flipkart Classes (These change often!)
        # Title often: ._4rR01T or .s1Q9rs
        # Price often: ._30jeq3
        title = soup.select_one("._4rR01T") 
        price = soup.select_one("._30jeq3")
        link = soup.select_one("a._1fQZEK")

        if not title or not price or not link:
            return None

        return {
            "website": "Flipkart",
            "title": title.text.strip(),
            "price": price.text.strip(),
            "url": "https://www.flipkart.com" + link["href"]
        }
    except Exception as e:
        print(f"Flipkart Error: {e}")
        return None