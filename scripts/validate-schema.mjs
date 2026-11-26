import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const out=path.resolve(process.argv[2] ?? '../billero.app/docs/strategy/evidence/WEB-008/schema');
const compact=process.argv.includes('--compact');
const targets=process.argv.slice(3).filter(arg=>arg!=='--compact');
if(!targets.length)targets.push(...['sl','en','de','es','nl','th'].map(lang=>`${lang}/index.html`));
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({locale:'en-US'});
  await page.goto('https://validator.schema.org/?hl=en',{waitUntil:'networkidle'});
  for(const [index,filename] of targets.entries()) {
    const lang=filename.replace(/\.html$/,'').replaceAll('/','-');
    if(index>0)await page.locator('#new-test').click();
    await page.getByText('Code snippet',{exact:true}).click();
    const html=await readFile(filename,'utf8');
    const snippet=html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/)[0];
    const area=page.locator('#new-test-textarea').locator('..');
    await area.locator('.CodeMirror').click();
    await page.keyboard.press('Control+A');
    await page.keyboard.insertText(snippet);
    const responsePromise=page.waitForResponse(r=>r.url().includes('/validate') && r.request().method()==='POST');
    await page.locator('#new-test-submit-button').click();
    const response=await responsePromise;
    const raw=await response.text();
    await writeFile(path.join(out,`${lang}-response.txt`),raw);
    const result=JSON.parse(raw.replace(/^\)\]\}'\s*/,''));
    assert.equal(result.totalNumErrors,0,`${lang}: schema errors`);
    assert.equal(result.totalNumWarnings,0,`${lang}: schema warnings`);
    function check(value) {
      if(!value || typeof value!=='object')return;
      for(const [key,child] of Object.entries(value)) {
        if(key==='errors' && Array.isArray(child))assert.equal(child.length,0,`${lang}: schema validation error`);
        check(child);
      }
    }
    check(result);
    await page.waitForLoadState('networkidle');
    const text=await page.locator('body').innerText();
    await writeFile(path.join(out,`${lang}-result.txt`),text);
    if(!compact)await page.screenshot({path:path.join(out,`${lang}-validator.png`),fullPage:true});
    console.log(lang,JSON.stringify(text.slice(-2200)));
  }
} finally {await browser.close();}
