#!/usr/bin/env node
/*
  scrape-worldhookahmarket.js

  Usage:
    - Install dependencies: npm install axios cheerio
    - Run: node scripts/scrape-worldhookahmarket.js

  What it does:
    - Attempts to fetch https://worldhookahmarket.com/sitemap.xml and extract product URLs.
    - Visits each product URL and extracts common metadata (title, price, sku, description, images).
    - Outputs src/data/products.scraped.json (array of product objects).

  Notes:
    - This script is best run locally from the repo root where node/npm are available.
    - Selectors are heuristics for common WooCommerce themes; you may need to adjust selectors if some data is missing.
*/

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const BASE = 'https://worldhookahmarket.com'
const SITEMAP = `${BASE}/sitemap.xml`
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'products.scraped.json')

async function fetchSitemapUrls() {
  console.log('Fetching sitemap...')
  try {
    const res = await axios.get(SITEMAP, { timeout: 15000 })
    const xml = res.data
    const locs = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1])
    // Heuristic: product pages often contain /product/ or /product-
    const productUrls = locs.filter(u => /product/i.test(u) || /product-/i.test(u) )
    console.log(`Found ${productUrls.length} product URLs in sitemap`)
    return productUrls
  } catch (err) {
    console.error('Failed to fetch sitemap.xml:', err.message)
    return []
  }
}

async function fetchProduct(url) {
  try {
    const res = await axios.get(url, { timeout: 15000 })
    const $ = cheerio.load(res.data)

    // Title
    const titleCandidates = [
      'h1.product_title',
      'h1.entry-title',
      'h1',
    ]
    let title = ''
    for (const sel of titleCandidates) {
      const t = $(sel).first().text().trim()
      if (t) { title = t; break }
    }

    // Price
    const priceCandidates = [
      '.woocommerce-Price-amount',
      '.price',
      '.product-price',
      '[itemprop=price]'
    ]
    let price = ''
    for (const sel of priceCandidates) {
      const p = $(sel).first().text().trim()
      if (p) { price = p; break }
    }
    price = price.replace(/[^0-9.,]/g,'').trim()

    // SKU
    const skuCandidates = [
      '.sku',
      '[itemprop=sku]',
      '.product_meta .sku',
    ]
    let sku = ''
    for (const sel of skuCandidates) {
      const s = $(sel).first().text().trim()
      if (s) { sku = s; break }
    }

    // Short description
    const shortDescCandidates = [
      '.woocommerce-product-details__short-description',
      '.short-description',
      '.summary .description',
      '.product .excerpt'
    ]
    let short_description = ''
    for (const sel of shortDescCandidates) {
      const d = $(sel).first().text().trim()
      if (d) { short_description = d; break }
    }

    // Long description
    const longDescCandidates = [
      '#tab-description',
      '.woocommerce-Tabs-panel--description',
      '.product .entry-content',
      '.description'
    ]
    let description = ''
    for (const sel of longDescCandidates) {
      const d = $(sel).first().text().trim()
      if (d) { description = d; break }
    }

    // Images
    const imageSelectors = [
      '.woocommerce-product-gallery__image img',
      '.product img',
      '.images img',
      'img.wp-post-image',
      'meta[property="og:image"]'
    ]
    const images = []
    for (const sel of imageSelectors) {
      if (sel.startsWith('meta')) {
        const og = $('meta[property="og:image"]').attr('content')
        if (og) images.push(og)
        continue
      }
      $(sel).each((i, el) => {
        const src = $(el).attr('data-src') || $(el).attr('src') || $(el).attr('data-large_image')
        if (src) {
          const full = src.startsWith('http') ? src : new URL(src, BASE).href
          if (!images.includes(full)) images.push(full)
        }
      })
      if (images.length) break
    }

    return {
      url,
      title,
      price,
      sku,
      short_description,
      description,
      images
    }
  } catch (err) {
    console.error('Failed to fetch product', url, err.message)
    return null
  }
}

async function main(){
  const urls = await fetchSitemapUrls()
  if (!urls.length) {
    console.error('No product URLs discovered; aborting.')
    process.exit(1)
  }

  const results = []
  // process sequentially to be polite
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i]
    console.log(`(${i+1}/${urls.length}) Fetching ${u}`)
    const p = await fetchProduct(u)
    if (p) results.push(p)
    // small delay to avoid hammering
    await new Promise(r => setTimeout(r, 500))
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2), 'utf8')
  console.log('Wrote', OUT_PATH, 'with', results.length, 'products')
}

main().catch(err => { console.error(err); process.exit(1) })
