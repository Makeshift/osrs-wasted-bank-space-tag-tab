import { Glob } from 'bun'
import * as fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import Git from 'simple-git'

const outputDir = 'output'
await fs.mkdir(outputDir, { recursive: true })

const wbsGit = Git()
const rlGit = Git()

const wbsRelativeLocationsDir = join(...'src/main/java/com/wastedbankspace/model/locations/'.split('/'))
const rlRelativeItemsFile = join(...'runelite-api/src/main/java/net/runelite/api/ItemID.java'.split('/'))

let wbsDir: string
let rlDir: string

const cloneOpts = {
  '--depth': 1
}

if (process.env.NODE_ENV === 'development') {
  wbsDir = join(import.meta.dir, 'wasted-bank-space')
  rlDir = join(import.meta.dir, 'runelite')
} else {
  wbsDir = await fs.mkdtemp(join(tmpdir(), 'wasted-bank-space-'))
  rlDir = await fs.mkdtemp(join(tmpdir(), 'runelite-'))
}

const wbsLocationsDir = join(wbsDir, wbsRelativeLocationsDir)
const rlItemsFile = join(rlDir, rlRelativeItemsFile)

console.log('WBS clone dir:', wbsDir)
console.log('RL clone dir:', rlDir)

if (
  // Hopefully the name doesn't change, I guess. Too lazy to check for the dir because Bun doesn't have
  //  a native way to do it yet.
  !await fs.exists(wbsLocationsDir)
  || !await fs.exists(rlItemsFile)
) {
  console.log('Cloning repositories...')
  await Promise.all([
    wbsGit.clone('https://github.com/mcgeer/WastedBankSpace.git', wbsDir, cloneOpts),
    rlGit.clone('https://github.com/runelite/runelite.git', rlDir, cloneOpts)
  ])
}

// Parsing java source code with regular expressions :D This is so fragile

const categoriseWbsItems = async (dir: string) => {
  const glob = new Glob('**/*.java')
  const matches = await glob.scan(dir)
  const results: Record<string, string[]> = {}
  for await (const match of matches) {
    const category = basename(match).replace('.java', '')

    const content = await Bun.file(join(wbsLocationsDir, match)).text()
    const items = [...content.matchAll(/ItemID\.(\w+)/g)].map(match => match[1])
    results[category] = items
  }
  return results
}

const mapRlItems = async (file: string) => {
  const content = await Bun.file(file).text()
  const items = [...content.matchAll(/(\w+) = (\d+);/g)].map(match =>
    ([match[1], match[2]]))
  return Object.fromEntries(items)
}

const [ categorisedItems, itemMappings ] = await Promise.all([
  categoriseWbsItems(join(wbsDir, wbsRelativeLocationsDir)),
  mapRlItems(join(rlDir, rlRelativeItemsFile))
])

console.log(`Got ${Object.keys(categorisedItems).length} categories and ${Object.keys(itemMappings).length} total items`)

const categorisedItemIds = Object.fromEntries(
  Object.entries(categorisedItems)
    .map(([category, items]) => {
      const itemIds = items.map(item => itemMappings[item])
      return [category, itemIds]
    })
)
const allItemIds = Object.values(categorisedItemIds).flat()

const vanillaTags = 'banktag:wastedbankslots,1038,' + allItemIds.join(',')

await Bun.write(join(outputDir, 'vanilla.txt'), vanillaTags)

let withLayout = 'banktaglayoutsplugin:wastedbankslots,'

let currentSlot = 0
for (const [, itemIds] of Object.entries(categorisedItemIds)) {
  for (const itemId of itemIds) {
    withLayout += `${itemId}:${currentSlot},`
    currentSlot++
  }
  // Bank has 8 slots per row, skip the rest of the row
  currentSlot += currentSlot % 8
}

withLayout += 'banktag:' + vanillaTags

await Bun.write(join(outputDir, 'with-layout.txt'), withLayout)

let tagPerCategory = ''

for (const [category, itemIds] of Object.entries(categorisedItemIds)) {
  tagPerCategory += `// ${category}\n`
  tagPerCategory += `${category.toLowerCase()},${itemIds.join(',')}\n\n`
}

await Bun.write(join(outputDir, 'tag-per-category.txt'), tagPerCategory)


console.log('Done!')
