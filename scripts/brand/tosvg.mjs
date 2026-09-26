import * as mupdf from "mupdf";
import fs from "node:fs";
const doc = mupdf.Document.openDocument(fs.readFileSync("kit/skal-international-logos-cmyk.pdf"), "application/pdf");
for (let i=0;i<doc.countPages();i++){
  const page=doc.loadPage(i);
  const buf=new mupdf.Buffer();
  const w=new mupdf.DocumentWriter(buf,"svg","text=path");
  const dev=w.beginPage(page.getBounds()); page.run(dev, mupdf.Matrix.identity); w.endPage(); w.close();
  const svg=buf.asString();
  fs.writeFileSync(`kit/logo-p${i+1}.svg`,svg);
  const fills=[...new Set([...svg.matchAll(/fill="(#[0-9a-fA-F]{6}|rgb\([^)]*\))"/g)].map(m=>m[1]))];
  console.log(`page ${i+1}: svg ${svg.length} bytes, <path> ${(svg.match(/<path/g)||[]).length}, fills:`, fills, "has <image>:", /<image/.test(svg));
}
