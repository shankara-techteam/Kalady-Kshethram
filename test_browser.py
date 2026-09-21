from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Listen for console logs
        page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))
        
        # Listen for uncaught exceptions
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        print("Navigating to admin.html...")
        page.goto("http://localhost:8000/pages/admin.html")
        page.wait_for_timeout(3000)
        
        browser.close()

if __name__ == "__main__":
    run()
