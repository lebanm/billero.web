// Mobile SEO/accessibility audits. Store compact audit evidence, not large reports.
import {chromium} from 'playwright';
import lighthouse from 'lighthouse';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const origin=process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:8788';
const out=path.resolve(process.argv[2] || '../billero.app/docs/strategy/evidence/WEB-009/lighthouse');
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--remote-debugging-port=9223']});
try {
  for(const [country,url] of [['SI','/sl/racun-vsebina'],['US','/en/invoice-requirements/united-states'],['DE','/de/rechnung-pflichtangaben']]) {
    const {lhr}=await lighthouse(origin+url,{port:9223,onlyCategories:['seo','accessibility'],formFactor:'mobile',logLevel:'error'});
    const report={lighthouseVersion:lhr.lighthouseVersion,fetchTime:lhr.fetchTime,requestedUrl:lhr.requestedUrl,finalDisplayedUrl:lhr.finalDisplayedUrl,configSettings:lhr.configSettings,categories:lhr.categories,audits:lhr.audits,runWarnings:lhr.runWarnings,runtimeError:lhr.runtimeError};
    // Filmstrips and page screenshots are not needed to prove these audits.
    for(const key of ['screenshot-thumbnails','final-screenshot','full-page-screenshot'])delete report.audits[key];
    await writeFile(path.join(out,country+'.json'),JSON.stringify(report,null,2)+'\n');
    assert.ok(lhr.categories.seo.score>=.95,`${country}: SEO below 95`);
    assert.ok(!lhr.runtimeError,`${country}: runtime error`);
    console.log(country,JSON.stringify(Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)]))));
  }
} finally {await browser.close();}
