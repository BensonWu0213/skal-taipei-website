# Brand asset generator

Rebuilds every SVG/PNG in `public/images/brand/` from the official Skål International vector file.

```
cd scripts/brand
npm install mupdf @resvg/resvg-js opentype.js --cache ./npm-cache
mkdir kit; copy skal-international-logos-cmyk.pdf kit\
node getfonts.mjs      # downloads Montserrat (OFL) into fonts/
node tosvg.mjs         # PDF pages -> kit/logo-p{1,2,3}.svg (mupdf, text=path)
node build-svg.mjs     # rebuild gradient, trim viewBox -> out/skal-international-logo*.svg/png
node compose.mjs       # crest, Taipei lockup, pennant, banners -> out/
```

Source of the PDF: public "Skål International Brand Kit" Google Drive folder linked from https://skal.org/press-kit
(folder id 1rqJ_TeBPHJuaFSXOfRjsKqP7K2y7x1xX → CMYK → "Skål International Logos_CMYK.pdf").
Official colours: dark blue #314691, light blue #65A8DE, grey #59595B.
