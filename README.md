# osrs-wasted-bank-space-tag-tab

## What is

This is a terrible script that parses [mcgeer/WastedBankSpace](https://github.com/mcgeer/WastedBankSpace)'s source code to generate a bank tag string compatible with the RuneLite clients' tag tabs.
![example of tag tab](example.png)

## How to use in RuneLite

- Pick the version you'd like:
- - A single tab showing all space-wasting items you actually have: [Here](output/vanilla.txt)
- - A single tab with a layout separating each category of items with placeholders (Note: This may not render correctly in RuneLite due to its sheer size): [Here](output/with-layout.txt)
- - A tab per category with placeholders (Note: You will need to individually copy and import each category, as RuneLite will not accept multiple tags in one import): [Here](output/tag-per-category.txt)
- Copy the entire thing
- Open your bank in OSRS, right click the `+` button at the top left and select `Import tag tab`
![import tag tab button](import.png)

## Development / Manual Generation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
