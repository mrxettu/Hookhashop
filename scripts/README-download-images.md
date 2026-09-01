Download images helper

This script (scripts/download-images.js) downloads images referenced in your scraped products JSON and writes a new products JSON with local image paths.

How it works
- Looks for src/data/products.scraped.json first, otherwise falls back to src/data/products.json
- Downloads every image URL found in product.images or product.image
- Saves images to public/assets/images/
- Optionally converts images to WebP if "sharp" is installed
- Writes src/data/products.local.json where each product has:
  - image: first local image path (e.g. "/assets/images/123-product-0.webp")
  - localImages: array of all local image paths

Run locally
1) Install helper deps:
   npm install axios
   (optional) npm install sharp
2) Run the downloader from the repo root:
   node scripts/download-images.js
3) Review src/data/products.local.json. When satisfied, you can replace src/data/products.json:
   mv src/data/products.local.json src/data/products.json
   git add src/data/products.json public/assets/images/*
   git commit -m "chore: add product images and point products.json to local assets"
   git push origin frontend/react-tailwind

Recommendations
- Large numbers of images should be committed using Git LFS to avoid bloating your repo. Install Git LFS and track the images before committing:
  git lfs install
  git lfs track "public/assets/images/*"
  git add .gitattributes

- Alternatively, host images on a CDN or cloud storage (S3/Cloudflare) and use those URLs in products.json.
