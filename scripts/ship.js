const fs = require('fs')
const path = require('path')

const shipIds = []

const baseInpPath = './kcs2/resources/ship'
const baseOutPath = path.join(__dirname, 'dist/ship')
const copyDirs = ['album_status', 'banner', 'card', 'remodel']
const maxId = 1500

const getId = s => Number(/^\d+/g.exec(s)[0])

copyDirs.forEach(dir => {
  const srcDir = path.join(baseInpPath, dir)
  const destDir = path.join(baseOutPath, dir)
  console.debug(srcDir)
  console.debug(destDir)

  fs.mkdirSync(destDir, { recursive: true })

  const files = fs.readdirSync(srcDir)
    .filter(v => {
      const id = getId(v)
      const isValid = true
        && id <= maxId
        && !shipIds.length ? true : shipIds.includes(getId(v))
      return isValid
    })
  console.debug(dir, 'count:', files.length)

  files.forEach(file => {
    console.debug(dir, file)
    const inpPath = path.join(srcDir, file)
    const outPath = path.join(destDir, getId(file) + path.extname(file))
    fs.copyFileSync(inpPath, outPath)
  })
})
