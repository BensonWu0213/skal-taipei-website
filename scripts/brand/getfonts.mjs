import fs from "node:fs";
fs.mkdirSync("fonts",{recursive:true});
for (const w of ["Light","Regular","SemiBold","Bold","ExtraBold"]) {
  const u=`https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-${w}.ttf`;
  const r=await fetch(u,{redirect:"follow"}); const b=Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(`fonts/Montserrat-${w}.ttf`,b); console.log(w,r.status,b.length);
}
