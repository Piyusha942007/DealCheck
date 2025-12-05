from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_croma(product):
    chrome_options = Options()
    
    # --- CRASH FIXES ---
    # We MUST run headless to stop your GPU from crashing
    chrome_options.add_argument("--headless") 
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    # Set a fake screen size so elements are not hidden
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    # -------------------

    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)

        query = product.replace(" ", "+")
        url = f"https://www.croma.com/searchB?q={query}"
        
        driver.get(url)
        
        # Wait up to 10 seconds
        wait = WebDriverWait(driver, 10)
        title_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "product-title")))
        title = title_element.text.strip()
        
        price_element = driver.find_element(By.CSS_SELECTOR, ".amount")
        price = price_element.text.strip()

        link_element = title_element.find_element(By.TAG_NAME, "a")
        link = link_element.get_attribute("href")

        return {
            "website": "Croma",
            "title": title,
            "price": price,
            "url": link
        }

    except Exception as e:
        print(f"Croma Error: {e}")
        return None
    finally:
        if driver:
            driver.quit()