Scraping instructions for worldhookahmarket

This directory contains a Node.js script to scrape product metadata from https://worldhookahmarket.com and write a JSON file to src/data/products.scraped.json.

How to run (locally):
1. From the repo root install the helper deps:
   npm install axios cheerio
2. Run the script:
   node scripts/scrape-worldhookahmarket.js
3. The script will write src/data/products.scraped.json. Review the file, then move/merge data into src/data/products.json as needed.

Notes & limitations:
- The script uses selectors that match many WooCommerce themes, but some fields may be empty if the site uses custom markup. If data is missing, inspect a product page and update selectors in the script.
- The script fetches URLs found in the site's sitemap.xml. If sitemap.xml is not present or doesn't list product pages, adjust the script to crawl category pages instead.
- This script runs locally — running it in CI and committing large numbers of images is not recommended; instead keep images hotlinked or upload a curated images.zip.
