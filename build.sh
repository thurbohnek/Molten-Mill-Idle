#!/bin/sh
# Concatenates the source files into the single-file game (index.html).
set -e
cd "$(dirname "$0")"
# game.html = the bare page (as published as a claude.ai artifact, which adds its own document skeleton)
cat src/0_head.html src/1_core.js src/1i_i18n.js src/2_gfx.js src/3_sim.js src/4_game.js src/5_draw.js src/5b_info.js src/6_main.js > game.html
# index.html = standalone page for GitHub Pages / any web host: doctype, charset and a mobile viewport
{
  printf '%s\n' '<!doctype html>' '<html lang="en">' '<head>' '<meta charset="utf-8">' \
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">' \
    '<meta name="theme-color" content="#0b0d12">' '<meta name="mobile-web-app-capable" content="yes">' \
    '<meta name="apple-mobile-web-app-capable" content="yes">' '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
  cat game.html
} > index.html
rm game.html
sed -n '/^<script>$/,/^<\/script>$/p' index.html | sed '1d;$d' > /tmp/molten_check.js
node --check /tmp/molten_check.js && echo "SYNTAX_OK"
wc -c index.html
