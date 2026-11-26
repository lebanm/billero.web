// Local browser QA; compact evidence only. Start scripts/preview.mjs first.
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const origin=process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:8788';
const out=path.resolve(process.argv[2] || '../billero.app/docs/strategy/evidence/WEB-009/browser');
const {pages}=JSON.parse(await readFile('scripts/invoice-guides.json','utf8'));
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
try {
  for(const guide of pages) {
    const context=await browser.newContext({locale:'en-US'});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(String(error)));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    const url=origin+'/'+guide.file.replace(/\.html$/,'');
    for(const width of [360,390,768,1440]) {
      await page.setViewportSize({width,height:844});
      assert.equal((await page.goto(url,{waitUntil:'networkidle'})).status(),200);
      const layout=await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth>innerWidth+1,
        brokenImages:[...document.images].filter(img=>!img.complete || !img.naturalWidth).length,
        clipped:[...document.querySelectorAll('h1,h2,h3,p,li,td,th,summary')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.tagName+': '+e.textContent.slice(0,70))
      }));
      assert.equal(layout.overflow,false,guide.file+' '+width);
      assert.equal(layout.brokenImages,0);
      assert.deepEqual(layout.clipped,[]);
      const first=page.locator('.faq-list summary').first();
      await first.focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('.faq-list details').first().getAttribute('open'),'');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('.faq-list details').first().getAttribute('open'),null);
      results.push({file:guide.file,width,status:200,...layout,faqKeyboard:true});
      if(width===390 && ['sl','es','de'].includes(guide.lang)) {
        await page.evaluate(()=>scrollTo(0,0));
        await page.screenshot({path:path.join(out,guide.lang+'-mobile.jpg'),type:'jpeg',quality:65});
      }
      if(width===1440 && guide.lang==='sl') {
        await page.evaluate(()=>scrollTo(0,0));
        await page.screenshot({path:path.join(out,'sl-desktop.jpg'),type:'jpeg',quality:65});
      }
      if(width===390 && guide.lang==='de') {
        await page.locator('#e-rechnung table').scrollIntoViewIfNeeded();
        await page.screenshot({path:path.join(out,'de-transition.jpg'),type:'jpeg',quality:65});
      }
    }
    const alternate=page.locator('.locale-nav a:not([aria-current="page"])');
    const lang=await alternate.getAttribute('data-lang');
    const destination=await alternate.getAttribute('href');
    await alternate.click();
    await page.waitForURL(origin+destination);
    assert.ok((await context.cookies()).some(cookie=>cookie.name==='lang' && cookie.value===lang));
    assert.deepEqual(errors,[],guide.file);
    await context.close();
  }
  await writeFile(path.join(out,'results.json'),JSON.stringify({checkedAt:new Date().toISOString(),layouts:results,languagePairs:6,errors:[]},null,2)+'\n');
  console.log('24 layouts, 6 language switches, native FAQ keyboard checks: passed.');
} finally {await browser.close();}
