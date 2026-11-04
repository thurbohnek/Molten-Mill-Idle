#!/bin/sh
# Concatenates the source files into the single-file game (index.html).
set -e
cd "$(dirname "$0")"
cat src/0_head.html src/1_core.js src/1i_i18n.js src/2_gfx.js src/3_sim.js src/4_game.js src/5_draw.js src/5b_info.js src/6_main.js > index.html
sed -n '/^<script>$/,/^<\/script>$/p' index.html | sed '1d;$d' > /tmp/molten_check.js
node --check /tmp/molten_check.js && echo "SYNTAX_OK"
wc -c index.html
