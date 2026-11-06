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

Last updated: `2026-11-06T04:47:42.452Z` \
[mcgeer/WastedBankSpace](https://github.com/mcgeer/WastedBankSpace) commit: `1cb3b285c995fb7f4229a172033fcb6020d445cf` \
[Runelite/runelite](https://github.com/runelite/runelite) commit: `8f2aca162a5ddd3765dd0166aea5de86522bc785` \
[Makeshift/osrs-wasted-bank-space-tag-tab](https://github.com/Makeshift/osrs-wasted-bank-space-tag-tab) commit: `c2c488fe172d3298c65698ef3a2dc2f00f39ce6e` \
Total item count: 2320 \
Total item categories: 21