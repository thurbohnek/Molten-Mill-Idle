# Molten Mill Idle: Steel Tycoon

A mobile carry/tycoon game about running a steel mill, from the blast furnace and converters
to electric arc furnaces, continuous casting and the rolling mill.

- Carry stacks of material yourself, buy upgrades by walking onto pads and hire helpers.
- Clear, visible bottleneck balancing: the map shows which plant limits the furnace.
- Follows the history of steelmaking: blast furnace + Bessemer/LD converter → open-hearth → EAF → UHP EAF → continuous scrap charging.
- English (default) and Norwegian; tap anything for an explanation bubble.

The whole game is one self-contained HTML file (`index.html`) with no dependencies. Open it in a browser.

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

© Studio.grane
