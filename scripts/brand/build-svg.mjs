import fs from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const GRAD = `<linearGradient id="skalShield" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#314691"/>
  <stop offset="0.62" stop-color="#3f7fc4"/>
  <stop offset="1" stop-color="#65A8DE"/>
</linearGradient>`;

function fixGradient(svg){
  return svg.replace(/<image x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" xlink:href="data:image\/png;base64,[^"]+"\/>/,
    (m,x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#skalShield)"/>`)
    .replace("<defs>", "<defs>\n"+GRAD);
}
function render(svg, width){ return new Resvg(svg,{fitTo:{mode:"width",value:width}}).render(); }
function tightBBox(svg, pad=0){
  const s=4; const img=render(svg, Math.round(756.858*s)); const w=img.width,h=img.height; const data=img.pixels;
  let minx=w,miny=h,maxx=0,maxy=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){ if(data[(y*w+x)*4+3]>8){ if(x<minx)minx=x; if(x>maxx)maxx=x; if(y<miny)miny=y; if(y>maxy)maxy=y; } }
  return {x:minx/s-pad,y:miny/s-pad,w:(maxx-minx)/s+2*pad,h:(maxy-miny)/s+2*pad};
}
function setViewBox(svg,b){
  return svg.replace(/width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/, `width="${b.w.toFixed(2)}" height="${b.h.toFixed(2)}" viewBox="${b.x.toFixed(2)} ${b.y.toFixed(2)} ${b.w.toFixed(2)} ${b.h.toFixed(2)}"`);
}
function clean(svg){
  return svg.replace(/ xmlns:inkscape="[^"]+"/,"")
    .replace(/<g inkscape:groupmode="layer" inkscape:label="[^"]*">\s*<\/g>\s*/g,"")
    .replace(/ inkscape:groupmode="layer" inkscape:label="([^"]*)"/g,(m,l)=>` id="${l.replace(/&#xE5;/g,"a").replace(/&amp;/g,"and").replace(/[^\w-]+/g,"-")}"`)
    .replace(/<clipPath id="clip_2">[\s\S]*?<\/clipPath>\s*/,"").replace(/ clip-path="url\(#clip_2\)"/g,"")
    .replace(/<g clip-path="url\(#clip_2\)">/g,"<g>");
}

fs.mkdirSync("out",{recursive:true});
for (const [i,name] of [[1,"skal-international-logo"],[2,"skal-international-logo-white-text"],[3,"skal-international-logo-white"]]){
  let svg=clean(fixGradient(fs.readFileSync(`kit/logo-p${i}.svg`,"utf8")));
  const b=tightBBox(svg, 2); svg=setViewBox(svg,b);
  fs.writeFileSync(`out/${name}.svg`,svg);
  const png=render(svg,1600).asPng(); fs.writeFileSync(`out/${name}.png`,png);
  console.log(name, JSON.stringify(b), svg.length+"B", "images left:", (svg.match(/<image/g)||[]).length);
}
// crest only (shield region of page 1)
{ let svg=fs.readFileSync("out/skal-international-logo.svg","utf8");
  // shield path bounds from clip_1: x 51.7..180.2, y 99.5..250.4 (page coords)
  const b={x:50.5,y:98.3,w:130.9,h:153.3}; svg=setViewBox(svg,b); fs.writeFileSync("out/skal-crest.svg",svg); fs.writeFileSync("out/skal-crest.png",render(svg,800).asPng()); }
