# osrs-wasted-bank-space-tag-tab

## What is

This is a terrible script that parses [mcgeer/WastedBankSpace](https://github.com/mcgeer/WastedBankSpace)'s source code to generate a bank tag string compatible with the RuneLite clients' tag tabs.
![example of tag tab](example.png)

## How to use in RuneLite

- Pick the version you'd like:
  - [Link](https://raw.githubusercontent.com/Makeshift/osrs-wasted-bank-space-tag-tab/master/output/vanilla.txt) - A single tab showing all space-wasting items you actually have
  - [Link](https://raw.githubusercontent.com/Makeshift/osrs-wasted-bank-space-tag-tab/master/output/with-layout.txt) - A single tab with a layout separating each category of items with placeholders (Note: This may not render correctly the bank interface due to its sheer size)
  - [Link](https://raw.githubusercontent.com/Makeshift/osrs-wasted-bank-space-tag-tab/master/output/tag-per-category.txt) - A tab per category (Note: You will need to individually copy and import each category, as RuneLite will not accept multiple tags in one import)
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
