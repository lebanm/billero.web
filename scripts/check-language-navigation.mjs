import {chromium} from 'playwright';
import {readFile,writeFile} from 'node:fs/promises';
const pages=JSON.parse(await readFile('scripts/site-pages.json','utf8'));
const browser=await chromium.launch({headless:true});
const results=[];
try {
  const context=await browser.newContext({viewport:{width:360,height:800}});
  const page=await context.newPage();
  for(const item of Object.values(pages).filter(item=>item.family!=='index')) {
    await page.goto('http://127.0.0.1:8788'+item.url,{waitUntil:'networkidle'});
    for(const width of [360,1440]) {
      await page.setViewportSize({width,height:800});
      const result=await page.locator('.locale-nav').evaluate(nav=>({
        outside:[...nav.querySelectorAll('a')].filter(a=>a.getBoundingClientRect().left<0 || a.getBoundingClientRect().right>innerWidth+1).map(a=>a.textContent),
        shortTargets:[...nav.querySelectorAll('a')].filter(a=>a.getBoundingClientRect().height<48).map(a=>a.textContent)
      }));
      results.push({url:item.url,width,...result});
    }
  }
} finally {await browser.close();}
await writeFile('../billero.app/docs/strategy/evidence/WEB-008/browser/secondary-navigation.json',JSON.stringify(results,null,2)+'\n');
const errors=results.filter(r=>r.outside.length || r.shortTargets.length);
console.log(JSON.stringify({checks:results.length,errors},null,2));
if(errors.length)process.exitCode=1;
