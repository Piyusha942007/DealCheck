import requests
from bs4 import BeautifulSoup

def scrape_amazon(product):
    query = product.replace(" ", "+")
    url = f"https://www.amazon.in/s?k={query}"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.text, "html.parser")

    title = soup.select_one(".a-size-medium.a-color-base.a-text-normal")
    price = soup.select_one(".a-price-whole")
    link = soup.select_one(".a-link-normal.s-no-outline")

    if not title or not price or not link:
        return None

    return {
        "website": "Amazon",
        "title": title.text.strip(),
        "price": price.text.strip(),
        "url": "https://www.amazon.in" + link["href"]
    }
