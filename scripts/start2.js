const https = require('https')
const fs = require('fs')
const path = require('path')

const url = 'https://raw.githubusercontent.com/Tibowl/api_start2/master/start2.json'
const outDir = 'dist'
const outPath = path.join(outDir, 'start2.json')

fs.mkdirSync(outDir, { recursive: true })

https.get(url, (res) => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    console.debug(new Date(), 'Response length', data.length)
    const obj = { api_data: JSON.parse(data) }
    const content = JSON.stringify(obj)
    console.debug(new Date(), 'Content length', content.length)
    fs.writeFileSync(outPath, content)
    console.debug(new Date(), 'Write to', outPath)
  })
})
