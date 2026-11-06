# Molten Mill Idle: Steel Tycoon

A mobile carry/tycoon game about running a steel mill, from the blast furnace and converters
to electric arc furnaces, continuous casting and the rolling mill.

- Carry stacks of material yourself, buy upgrades by walking onto pads and hire helpers.
- Clear, visible bottleneck balancing: the map shows which plant limits the furnace.
- Follows the history of steelmaking: blast furnace + Bessemer/LD converter → open-hearth → EAF → UHP EAF → continuous scrap charging.
- English (default) and Norwegian; tap anything for an explanation bubble.

The whole game is one self-contained HTML file (`index.html`) with no dependencies. Play it at https://thurbohnek.github.io/Molten-Mill-Idle/ or open the file in a browser.

## Development

```
src/        source modules, concatenated in order by build.sh
build.sh    builds index.html
tests/      headless Node tests (simulation) and Playwright tests (rendering/input)
```

```
npm run build        # build index.html
npm test             # simulation tests (Node only)
npm run test:long    # 8-hour bot playthrough
npm run test:browser # Playwright tests (needs `npm i` and a Chromium)
```

## Copyright

Copyright © 2026 Studio.grane. All rights reserved.

The source code is public so the game can be played and reviewed, but it is **not open source**.
You may not copy, modify, redistribute or publish the game or its code without written permission.
See [`LICENSE`](LICENSE) and [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
Contact: studio.grane@gmail.com
