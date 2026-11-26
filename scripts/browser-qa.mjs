import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const base='http://127.0.0.1:8788';
const evidence=path.resolve('../billero.app/docs/strategy/evidence/WEB-008/browser');
await mkdir(evidence,{recursive:true});
const browser=await chromium.launch({headless:true});
const results={http:[],layouts:[],interactions:[],errors:[]};
try {
  const context=await browser.newContext();
  const pages=JSON.parse(await readFile('scripts/site-pages.json','utf8'));
  for(const page of Object.values(pages)) {
    const response=await context.request.get(base+page.url,{headers:{'Accept-Language':'ja',Cookie:'lang=sl'},maxRedirects:0});
    assert.equal(response.status(),200,page.url);
    results.http.push({url:page.url,status:response.status()});
  }
  for(const [headers,location] of [[{'Accept-Language':'de-DE,de;q=0.9'},'/de/'],[{'Accept-Language':'es-MX'},'/es/'],[{'Accept-Language':'sl'},'/sl/'],[{'Accept-Language':''},'/en/'],[{'Accept-Language':'ja'},'/en/'],[{'Accept-Language':'de',Cookie:'lang=sl'},'/sl/']]) {
    const response=await context.request.get(base+'/',{headers,maxRedirects:0});
    assert.equal(response.status(),302);assert.equal(response.headers().location,base+location);
    results.http.push({url:'/',headers,status:302,location});
  }
  for(const lang of ['sl','en','de','es','nl','th']) {
    const page=await context.newPage();
    const pageErrors=[];page.on('pageerror',error=>pageErrors.push(error.message));
    for(const width of [360,390,768,1024,1440]) {
      await page.setViewportSize({width,height:900});
      await page.goto(base+`/${lang}/`,{waitUntil:'networkidle'});
      const layout=await page.evaluate(()=>({
        horizontalOverflow:document.documentElement.scrollWidth>innerWidth,
        clipped:[...document.querySelectorAll('h1,h2,h3,p,.button')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.textContent.slice(0,80)),
        brokenImages:[...document.images].filter(img=>img.loading!=='lazy' && (!img.complete || !img.naturalWidth)).map(img=>img.src)
      }));
      results.layouts.push({lang,width,...layout});
      if(layout.horizontalOverflow || layout.clipped.length || layout.brokenImages.length)results.errors.push({lang,width,...layout});
      if([390,1440].includes(width))await page.screenshot({path:path.join(evidence,`${lang}-${width}.png`),fullPage:true});
    }
    if(pageErrors.length)results.errors.push({lang,pageErrors});
    await page.close();
  }
  const page=await context.newPage();await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/en/');
  await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  await page.locator('.language-picker summary').click();
  await page.locator('.language-menu a[data-lang="sl"]').focus();await page.keyboard.press('Enter');await page.waitForURL(base+'/sl/');
  assert.equal((await context.cookies()).find(cookie=>cookie.name==='lang')?.value,'sl');
  await page.goto(base+'/');assert.equal(page.url(),base+'/sl/');
  await page.locator('#faq details').first().locator('summary').click();assert.notEqual(await page.locator('#faq details').first().getAttribute('open'),null);
  await page.goto(base+'/ja/privacy-policy');await page.locator('a[data-lang="ja"]').click();await page.waitForLoadState();
  assert.equal((await context.cookies()).find(cookie=>cookie.name==='lang')?.value,'ja');
  await page.goto(base+'/');assert.equal(page.url(),base+'/en/');
  results.interactions.push('mobile menu + Escape','keyboard language switch persists cookie','root honors saved language','FAQ disclosure','policy-only language safely falls back to English');
  const nojs=await browser.newContext({javaScriptEnabled:false,locale:'de-DE'});
  const n=await nojs.newPage();await n.goto(base+'/');assert.equal(n.url(),base+'/de/');
  await n.goto(base+'/sl/privacy-policy');assert.equal(n.url(),base+'/sl/privacy-policy');
  results.interactions.push('HTTP language selection with JavaScript disabled','explicit localized page preserved without JavaScript');
  await nojs.close();
  const fallback=await browser.newContext({locale:'es-MX'});
  const entry=await readFile('index.html','utf8');
  await fallback.route(base+'/',route=>route.fulfill({status:200,contentType:'text/html',body:entry}));
  const f=await fallback.newPage();await f.goto(base+'/');await f.waitForURL(base+'/es/');
  results.interactions.push('static entry fallback uses navigator.languages');
  await fallback.close();await context.close();
} catch(error) {results.errors.push({failure:error.stack});}
finally {await browser.close();}
await writeFile(path.join(evidence,'results.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({http:results.http.length,layouts:results.layouts.length,interactions:results.interactions,errors:results.errors},null,2));
if(results.errors.length)process.exitCode=1;
