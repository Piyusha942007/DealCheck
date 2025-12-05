from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_reliance(product):
    chrome_options = Options()
    
    # --- CRASH FIXES ---
    chrome_options.add_argument("--headless") 
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    # -------------------

    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)

        query = product.replace(" ", "%20")
        url = f"https://www.reliancedigital.in/search?q={query}:relevance"
        
        driver.get(url)

        # Reliance is slow, wait 15s
        wait = WebDriverWait(driver, 15)
        title_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "product-card-title")))
        title = title_element.text.strip()

        price_element = driver.find_element(By.CLASS_NAME, "price")
        price = price_element.text.strip()

        link_element = driver.find_element(By.CLASS_NAME, "product-card-image")
        link = link_element.get_attribute("href")
        
        if not link.startswith("http"):
            link = "https://www.reliancedigital.in" + link

        return {
            "website": "Reliance Digital",
            "title": title,
            "price": price,
            "url": link
        }

    except Exception as e:
        print(f"Reliance Error: {e}")
        return None
    finally:
        if driver:
            driver.quit()