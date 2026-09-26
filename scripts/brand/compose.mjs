import fs from "node:fs";
import opentype from "opentype.js";
import { Resvg } from "@resvg/resvg-js";

const DARK="#314691", LIGHT="#65A8DE", GREY="#58595b";
const GRAD=`<linearGradient id="skalShield" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${DARK}"/><stop offset="0.62" stop-color="#3f7fc4"/><stop offset="1" stop-color="${LIGHT}"/></linearGradient>`;
const CLIP=`<clipPath id="clip_1"><path transform="matrix(1,0,0,-1,0,440.851)" d="M180.162 220.179 115.934 190.438 51.706 220.179V341.375H180.162Z"/></clipPath>`;

const logo=fs.readFileSync("out/skal-international-logo.svg","utf8");
const body=logo.slice(logo.indexOf("</defs>")+7, logo.lastIndexOf("</svg>"));
const paths=[...body.matchAll(/<path transform="matrix\(([^)]*)\)" d="([^"]*)"([^>]*)\/>/g)].map(m=>m[0]);
const crestPaths=paths.slice(0,19);           // white shield + 18 white graphics
const textPaths=paths.slice(19);               // rule, INTERNATIONAL, tagline, SKÅL
const crestGroup=(fill)=>`<g id="crest">${crestPaths[0]}<g clip-path="url(#clip_1)"><rect x="51" y="99" width="130" height="152" fill="${fill}"/></g>${crestPaths.slice(1).join("")}</g>`;
// crest geometry in logo space: x 51.706..180.162, y 99.476..250.413 (from clip path, y = 440.851-341.375 .. 440.851-190.438)
const CREST={x:51.706,y:99.476,w:128.456,h:150.937};

const fonts={ light:opentype.parse(fs.readFileSync("fonts/Montserrat-Light.ttf").buffer.slice(fs.readFileSync("fonts/Montserrat-Light.ttf").byteOffset, fs.readFileSync("fonts/Montserrat-Light.ttf").byteOffset+fs.readFileSync("fonts/Montserrat-Light.ttf").byteLength)), regular:opentype.parse(fs.readFileSync("fonts/Montserrat-Regular.ttf").buffer.slice(fs.readFileSync("fonts/Montserrat-Regular.ttf").byteOffset, fs.readFileSync("fonts/Montserrat-Regular.ttf").byteOffset+fs.readFileSync("fonts/Montserrat-Regular.ttf").byteLength)), semibold:opentype.parse(fs.readFileSync("fonts/Montserrat-SemiBold.ttf").buffer.slice(fs.readFileSync("fonts/Montserrat-SemiBold.ttf").byteOffset, fs.readFileSync("fonts/Montserrat-SemiBold.ttf").byteOffset+fs.readFileSync("fonts/Montserrat-SemiBold.ttf").byteLength)), bold:opentype.parse(fs.readFileSync("fonts/Montserrat-Bold.ttf").buffer.slice(fs.readFileSync("fonts/Montserrat-Bold.ttf").byteOffset, fs.readFileSync("fonts/Montserrat-Bold.ttf").byteOffset+fs.readFileSync("fonts/Montserrat-Bold.ttf").byteLength)), extrabold:opentype.parse(fs.readFileSync("fonts/Montserrat-ExtraBold.ttf").buffer.slice(fs.readFileSync("fonts/Montserrat-ExtraBold.ttf").byteOffset, fs.readFileSync("fonts/Montserrat-ExtraBold.ttf").byteOffset+fs.readFileSync("fonts/Montserrat-ExtraBold.ttf").byteLength)) };
function text(str, font, size, x, y, fill, {tracking=0, anchor="start"}={}){
  // tracking in em
  const p=font.getPath(str, 0, 0, size, {letterSpacing:tracking});
  const bb=p.getBoundingBox(); const w=bb.x2-bb.x1;
  const dx= anchor==="middle" ? x - (bb.x1 + w/2) : anchor==="end" ? x - bb.x2 : x - bb.x1;
  const d=font.getPath(str, dx, y, size, {letterSpacing:tracking}).toPathData(3);
  return {svg:`<path d="${d}" fill="${fill}"/>`, width:w, bb};
}
function capH(font,size){ const p=font.getPath("H",0,0,size); const b=p.getBoundingBox(); return -b.y1; }
function svgDoc(vb, defs, inner, bg){ return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}" width="${vb[2]}" height="${vb[3]}">\n<defs>${defs}</defs>\n${bg?`<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${bg}"/>`:""}\n${inner}\n</svg>`; }
function png(svg,width,file){ fs.writeFileSync(file,new Resvg(svg,{fitTo:{mode:"width",value:width}}).render().asPng()); }
fs.mkdirSync("out",{recursive:true});

// ---- 1. Crest alone (gradient) and mono
{
  const pad=2; const vb=[CREST.x-pad,CREST.y-pad,CREST.w+2*pad,CREST.h+2*pad].map(n=>+n.toFixed(3));
  const s=svgDoc(vb, GRAD+CLIP, crestGroup("url(#skalShield)"));
  fs.writeFileSync("out/skal-crest.svg",s); png(s,800,"out/skal-crest.png");
  const m=svgDoc(vb, CLIP, crestGroup(DARK));
  fs.writeFileSync("out/skal-crest-mono.svg",m); png(m,800,"out/skal-crest-mono.png");
}

// ---- 2. Skål International | TAIPEI lockup (matches the club's flyer lockup)
function lockup({textFill=GREY, taipeiFill=LIGHT, crestFill="url(#skalShield)", divider=GREY, name}){
  // logo occupies x 49.5..706.75, y 50.25..390 in logo space
  const L={x:49.5,y:50.25,w:657.25,h:339.75};
  const gap=34, lineX=L.x+L.w+gap;
  const size=150; const ch=capH(fonts.light,size);           // TAIPEI cap height
  const cy=L.y+L.h/2;                                      // optical centre (tagline is light, shift a bit down)
  const t=text("TAIPEI", fonts.light, size, lineX+gap, cy+ch/2, taipeiFill, {tracking:0.02});
  const right=t.bb.x2 + (lineX+gap - t.bb.x1) + 4;
  const pad=6;
  const vb=[L.x-pad, L.y-pad, right-L.x+2*pad, L.h+2*pad].map(n=>+n.toFixed(2));
  const logoText=textPaths.join("").replace(/fill="#58595b"/g,`fill="${textFill}"`);
  const inner=`<g id="skal-international">${crestGroup(crestFill)}${logoText}</g>
<line x1="${lineX}" y1="${L.y+40}" x2="${lineX}" y2="${L.y+L.h-40}" stroke="${divider}" stroke-width="1.6"/>
<g id="taipei">${t.svg}</g>`;
  const s=svgDoc(vb, GRAD+CLIP, inner);
  fs.writeFileSync(`out/${name}.svg`,s); png(s,2400,`out/${name}.png`);
  return vb;
}
console.log("lockup", lockup({name:"skal-international-taipei-logo"}));
lockup({name:"skal-international-taipei-logo-white", textFill:"#ffffff", divider:"#ffffff", taipeiFill:"#9fd0f5"});
lockup({name:"skal-international-taipei-logo-mono", textFill:DARK, divider:DARK, taipeiFill:DARK, crestFill:DARK});
lockup({name:"skal-international-taipei-logo-all-white", textFill:"#ffffff", divider:"#ffffff", taipeiFill:"#ffffff", crestFill:"none"});



// ---- 3. Pennant (digital recreation of the club flag: SKÅL INTERNATIONAL / crest / T A I P E I / N°347)
function pennant({bg="#ffffff", ink=DARK, name, border=true}){
  const W=800,H=1200; const cx=W/2;
  const parts=[];
  if(border) parts.push(`<rect x="22" y="22" width="${W-44}" height="${H-44}" fill="none" stroke="${ink}" stroke-width="3"/>`);
  const t1=text("SKÅL INTERNATIONAL", fonts.bold, 58, cx, 150, ink, {tracking:0.06, anchor:"middle"});
  parts.push(t1.svg);
  // crest: scale so width = 440
  const s=440/CREST.w; const cy0=215;
  parts.push(`<g transform="translate(${cx-CREST.w*s/2 - CREST.x*s} ${cy0 - CREST.y*s}) scale(${s})">${crestGroup(ink)}</g>`);
  const crestBottom=cy0+CREST.h*s;
  const t2=text("TAIPEI", fonts.regular, 64, cx, crestBottom+150, ink, {tracking:0.55, anchor:"middle"});
  parts.push(t2.svg);
  const t3=text("N° 347", fonts.semibold, 54, cx, crestBottom+250, ink, {tracking:0.12, anchor:"middle"});
  parts.push(t3.svg);
  const svg=svgDoc([0,0,W,H], CLIP, parts.join("\n"), bg);
  fs.writeFileSync(`out/${name}.svg`,svg); png(svg,1600,`out/${name}.png`);
  return crestBottom;
}
console.log("pennant crest bottom", pennant({name:"skal-taipei-pennant"}));
pennant({name:"skal-taipei-pennant-transparent", bg:null, border:false});
pennant({name:"skal-taipei-pennant-white-on-blue", bg:DARK, ink:"#ffffff", border:true});

// ---- 4. Wide web banner (hero / social header) on the official blue gradient
function banner({name, W=1920, H=640}){
  const defs=`<linearGradient id="bannerBg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${DARK}"/><stop offset="1" stop-color="${LIGHT}"/></linearGradient>`+CLIP;
  const parts=[`<rect width="${W}" height="${H}" fill="url(#bannerBg)"/>`];
  // ghost crest on the right
  const gs=(H*1.35)/CREST.h;
  parts.push(`<g opacity="0.12" transform="translate(${W-CREST.w*gs*0.78 - CREST.x*gs} ${-H*0.18 - CREST.y*gs}) scale(${gs})">${crestGroup("none").replace(/<path transform="matrix\(1,0,0,-1,177\.1842,220\.13872\)"[^>]*\/>/,"")}</g>`);
  // crest left (white on blue = mono white version: shield outline white + graphics white, interior transparent -> use white fill with blue graphics? keep official white+shield look: shield gradient not visible on blue, so use white-filled shield with blue graphics)
  const s=(H*0.62)/CREST.h; const x0=120, y0=(H-CREST.h*s)/2;
  const crestWhite=crestGroup(DARK).replace(/fill="#ffffff"/g,'fill="#ffffff"'); // white shield background path stays white, graphics white, interior DARK
  parts.push(`<g transform="translate(${x0-CREST.x*s} ${y0-CREST.y*s}) scale(${s})">${crestWhite}</g>`);
  const tx=x0+CREST.w*s+90;
  const a=text("SKÅL INTERNATIONAL", fonts.extrabold, 96, tx, H/2-40, "#ffffff", {tracking:0.01});
  const b=text("TAIPEI", fonts.light, 96, tx, H/2+70, "#ffffff", {tracking:0.32});
  const c=text("CLUB N° 347  ·  EST. 1970  ·  CONNECTING TOURISM GLOBALLY", fonts.regular, 30, tx, H/2+150, "#dfefff", {tracking:0.12});
  parts.push(`<line x1="${tx}" y1="${H/2-5}" x2="${tx+a.width}" y2="${H/2-5}" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>`);
  parts.push(a.svg,b.svg,c.svg);
  const svg=svgDoc([0,0,W,H], defs, parts.join("\n"));
  fs.writeFileSync(`out/${name}.svg`,svg); png(svg,W,`out/${name}.png`);
}
banner({name:"skal-taipei-banner-wide"});
banner({name:"skal-taipei-banner-social", W:1600, H:900});

