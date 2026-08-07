# Wasted Space Bank Tabs for OSRS

This gist contains tag tabs designed for import into the ['Bank Tabs' plugin](https://github.com/runelite/runelite/wiki/Bank-Tags) in [Runelite](https://github.com/runelite/runelite), the client for Old School RuneScape. They are generated and updated in [Makeshift/osrs-wasted-bank-space-tag-tab](https://github.com/Makeshift/osrs-wasted-bank-space-tag-tab) by parsing the code from the fantastic plugin [mcgeer/WastedBankSpace](https://github.com/mcgeer/WastedBankSpace).

While I've attempted to make sure this gist automatically updates, the method used to get item IDs is inherently fragile and will likely break if the WastedBankSpace plugin changes in any significant way.

## Files in this gist

- `vanilla.txt`: A single tab showing all space-wasting items you actually have
- `with-layout.txt`: A single tab with a layout separating each category of items with placeholders (Note: This may not render correctly the bank interface due to its sheer size)
- `tag-per-category.txt`: A tab per category (Note: You will need to individually copy and import each category, as RuneLite will not accept multiple tags in one import)

## Import

- Copy the contents of one of the files below (or in the case of `tag-per-category.txt`, one of the lines)
- Open your bank in OSRS, right click the `+` button at the top left and select `Import tag tab`
- Paste and hit enter. Your new tab should now be visible on the left.

### Meta

Last updated: `2026-08-07T02:24:48.462Z` \
[mcgeer/WastedBankSpace](https://github.com/mcgeer/WastedBankSpace) commit: `1cb3b285c995fb7f4229a172033fcb6020d445cf` \
[Runelite/runelite](https://github.com/runelite/runelite) commit: `f01f0d474d81f5059c83b143970e2e57eb8c8a82` \
[Makeshift/osrs-wasted-bank-space-tag-tab](https://github.com/Makeshift/osrs-wasted-bank-space-tag-tab) commit: `8fc32f324271accb441c0a0a7536b99dac153713` \
Total item count: 2320 \
Total item categories: 21