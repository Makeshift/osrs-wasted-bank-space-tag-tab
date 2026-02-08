import { Glob } from 'bun'
import * as fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import Git from 'simple-git'

const outputDir = 'output'
await fs.mkdir(outputDir, { recursive: true })

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
  let { } = [wbsDir, rlDir] = await Promise.all([
    fs.mkdtemp(join(tmpdir(), 'wasted-bank-space-')),
    fs.mkdtemp(join(tmpdir(), 'runelite-'))
  ])
}

const wbsLocationsDir = join(wbsDir, wbsRelativeLocationsDir)
const rlItemsFile = join(rlDir, rlRelativeItemsFile)

console.log('WBS clone dir:', wbsDir)
console.log('RL clone dir:', rlDir)

await Promise.all([
  fs.mkdir(wbsDir, { recursive: true }),
  fs.mkdir(rlDir, { recursive: true })
])

let wbsGit = Git(wbsDir)
const rlGit = Git(rlDir)

console.log('Cloning repositories...')
if (
  !await fs.exists(wbsLocationsDir)
  || !await fs.exists(rlItemsFile)
) {
  await Promise.all([
    wbsGit.clone('https://github.com/mcgeer/WastedBankSpace.git', '.', cloneOpts),
    rlGit.clone('https://github.com/runelite/runelite.git', '.', cloneOpts)
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
const allItemIds = [...new Set(Object.values(categorisedItemIds).flat())]

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

// Meta
const gistId = process.env.GIST_UPDATE_ID
// I couldn't find a decent gist library so we're just shelling out to the gh cli
if (gistId) {
  console.log('Updating gist with id', gistId)
  const gistReadme = Bun.spawnSync(['gh', 'gist', 'view', gistId, '--raw', '-f', 'README.md']).stdout.toString()
  let content = gistReadme.split('### Meta')[0].trim()
  content += `\n\n### Meta\n\nLast updated: \`${new Date().toISOString()}\` \\\n`
  const wbsLog = await wbsGit.log()
  content += `[mcgeer/WastedBankSpace](https://github.com/mcgeer/WastedBankSpace) commit: \`${wbsLog.latest!.hash}\` \\\n`
  const rlLog = await rlGit.log()
  content += `[Runelite/runelite](https://github.com/runelite/runelite) commit: \`${rlLog.latest!.hash}\` \\\n`
  content += `[Makeshift/osrs-wasted-bank-space-tag-tab](https://github.com/Makeshift/osrs-wasted-bank-space-tag-tab) commit: \`${process.env.GITHUB_SHA}\` \\\n`
  content += `Total item count: ${allItemIds.length} \\\n`
  content += `Total item categories: ${Object.keys(categorisedItemIds).length}`
  await Bun.write(join(outputDir, 'README.md'), content)
  
  const updates = []
  for (const file of await fs.readdir(outputDir)) {
    updates.push(
      Bun.spawn([
      'gh', 'gist', 'edit', gistId, '-f', file, join(outputDir, file)
      ], {
        env: process.env
    }).exited
        .then(result => console.log(`Updated gist file ${file} with status ${result}`))
    )
  }
  await Promise.all(updates)
}

console.log('Done!')
