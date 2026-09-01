#!/usr/bin/env node
// scripts/download-images.js
// Usage:
//   npm install axios
//   (optional) npm install sharp
//   node scripts/download-images.js
//
// This script downloads product images referenced in either
// src/data/products.scraped.json OR src/data/products.json
// and saves them under public/assets/images/. It writes a new
// file src/data/products.local.json with product.image set to the
// local public path (e.g. /assets/images/...).

const fs = require('fs')
const path = require('path')
const axios = require('axios')

const SRC_JSON_SCRAPED = path.join(__dirname, '..', 'src', 'data', 'products.scraped.json')
const SRC_JSON = path.join(__dirname, '..', 'src', 'data', 'products.json')
const OUT_JSON = path.join(__dirname, '..', 'src', 'data', 'products.local.json')
const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'images')

const MAX_CONCURRENCY = 4

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true })
}

async function downloadImage(url, destPath) {
  try {
    const res = await axios.get(url, { responseType: 'stream', timeout: 20000 })
    await new Promise((resolve, reject) => {
      const stream = res.data.pipe(fs.createWriteStream(destPath))
      stream.on('finish', resolve)
      stream.on('error', reject)
    })
    return true
  } catch (err) {
    console.error('  download failed:', url, err.message)
    return false
  }
}

async function maybeConvertToWebp(inputPath) {
  try {
    const sharp = require('sharp')
    const outPath = inputPath.replace(/\.[^.]+$/, '.webp')
    await sharp(inputPath).webp({ quality: 80 }).toFile(outPath)
    // optionally remove original (commented out)
    // await fs.promises.unlink(inputPath)
    return outPath
  } catch (err) {
    // sharp not installed or conversion failed
    return inputPath
  }
}

async function main() {
  console.log('Download images script starting...')
  let products = null
  if (fs.existsSync(SRC_JSON_SCRAPED)) {
    console.log('Using', SRC_JSON_SCRAPED)
    products = JSON.parse(fs.readFileSync(SRC_JSON_SCRAPED, 'utf8'))
  } else if (fs.existsSync(SRC_JSON)) {
    console.log('Using', SRC_JSON)
    products = JSON.parse(fs.readFileSync(SRC_JSON, 'utf8'))
  } else {
    console.error('No product JSON found. Please run the scraper or provide src/data/products.json')
    process.exit(1)
  }

  await ensureDir(OUT_DIR)

  const tasks = []
  for (let idx = 0; idx < products.length; idx++) {
    const p = products[idx]
    const images = []
    if (Array.isArray(p.images) && p.images.length) images.push(...p.images)
    if (p.image && typeof p.image === 'string') images.push(p.image)
    // dedupe
    const uniq = Array.from(new Set(images.filter(Boolean)))
    p._downloadImages = uniq
  }

  let active = 0
  let i = 0
  const results = []

  async function next() {
    if (i >= products.length) return Promise.resolve()
    const current = products[i++]
    active++
    await processProduct(current)
    active--
    return next()
  }

  async function processProduct(product) {
    const id = product.id || slugify(product.title || `product-${Math.random().toString(36).slice(2,8)}`)
    const slug = slugify(product.title || (`p-${id}`))
    const downloadedPaths = []
    for (let j = 0; j < (product._downloadImages || []).length; j++) {
      const imgUrl = product._downloadImages[j]
      try {
        const urlObj = new URL(imgUrl)
        const extMatch = path.extname(urlObj.pathname).split('?')[0] || '.jpg'
        const filename = `${id}-${slug}-${j}${extMatch}`
        const destPath = path.join(OUT_DIR, filename)
        process.stdout.write(`Downloading ${imgUrl} -> /assets/images/${filename} ... `)
        const ok = await downloadImage(imgUrl, destPath)
        if (ok) {
          // optional conversion
          const finalPath = await maybeConvertToWebp(destPath)
          const publicPath = '/assets/images/' + path.basename(finalPath)
          downloadedPaths.push(publicPath)
          console.log('done')
        } else {
          console.log('failed')
        }
      } catch (err) {
        console.log('skip invalid url', imgUrl)
      }
    }
    // update product object: set image to first downloaded path and images to list
    if (downloadedPaths.length) {
      product.localImages = downloadedPaths
      product.image = downloadedPaths[0]
    } else {
      product.localImages = []
    }
    results.push(product)
  }

  const runners = []
  for (let k = 0; k < MAX_CONCURRENCY; k++) runners.push(next())
  await Promise.all(runners)

  // write out the local products JSON
  fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2), 'utf8')
  console.log('\nWrote', OUT_JSON, 'with', results.length, 'products (image paths updated to /assets/images/)')
  console.log('\nNotes:')
  console.log('- The images were saved to public/assets/images/. These are served by Vite at /assets/images/...')
  console.log('- For large repos consider using Git LFS for image files: https://git-lfs.github.com/')
  console.log('- If you want originals removed after conversion, edit the script. Sharp is optional: npm install sharp')
}

main().catch(err => { console.error(err); process.exit(1) })
