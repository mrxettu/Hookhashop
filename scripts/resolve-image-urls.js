const fs = require('fs')
const path = require('path')
const axios = require('axios')

const INPUT = path.join(__dirname, '..', 'src', 'data', 'products.scraped.json')
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'products.resolved.json')

async function resolveUrl(url){
  if (!url) return url
  try {
    // Use a HEAD request to avoid downloading the whole image. Follow redirects.
    const res = await axios.head(url, { maxRedirects: 10, timeout: 15000 })
    // In Node + axios the final URL is available at res.request.res.responseUrl
    const final = (res && res.request && res.request.res && res.request.res.responseUrl) || url
    return final
  } catch (err) {
    // If HEAD fails (some hosts disallow HEAD), fall back to GET but don't save body
    try {
      const res2 = await axios.get(url, { maxRedirects: 10, timeout: 15000, responseType: 'stream' })
      const final = (res2 && res2.request && res2.request.res && res2.request.res.responseUrl) || url
      if (res2 && res2.data && res2.data.destroy) res2.data.destroy()
      return final
    } catch (e) {
      console.warn('Failed to resolve', url, e.message)
      return url
    }
  }
}

async function main(){
  if (!fs.existsSync(INPUT)){
    console.error('Input file not found:', INPUT)
    process.exit(1)
  }
  const raw = fs.readFileSync(INPUT, 'utf8')
  let products
  try{ products = JSON.parse(raw) } catch(e){ console.error('Invalid JSON in', INPUT); process.exit(1) }

  for (let i=0;i<products.length;i++){
    const p = products[i]
    if (p.image && typeof p.image === 'string'){
      p.imageResolved = await resolveUrl(p.image)
      process.stdout.write('.')
    }
    if (Array.isArray(p.images) && p.images.length){
      p.imagesResolved = []
      for (let img of p.images){
        const r = await resolveUrl(img)
        p.imagesResolved.push(r)
        process.stdout.write('.')
      }
    }
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(products, null, 2), 'utf8')
  console.log('\nWrote', OUTPUT)
}

main().catch(e=>{ console.error(e); process.exit(1) })
