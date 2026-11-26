import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {handleRequest} from '../edge/language-router.mjs';
import {legacyPaths, pagePaths, pageLanguages, homeLanguages} from '../edge/routes.mjs';

const origin='https://billero.app';
const pages=JSON.parse(readFileSync(new URL('../scripts/site-pages.json',import.meta.url),'utf8'));
const files=new Map(Object.entries(pages).map(([file,page])=>[page.url,file]));
const fixture=readFileSync(new URL('./fixtures/gsc-404-2026-11-23.csv',import.meta.url),'utf8');

async function follow(path,headers={}) {
  const chain=[];
  for(let hops=0;hops<6;hops++) {
    const response=await handleRequest(new Request(origin+path,{headers}),request=>{
      const file=files.get(new URL(request.url).pathname);
      return new Response(null,{status:file && existsSync(new URL('../'+file,import.meta.url)) ? 200 : 404});
    });
    chain.push({path,status:response.status});
    if(![301,302].includes(response.status))return chain;
    path=new URL(response.headers.get('Location')).pathname;
  }
  assert.fail('Redirect loop: '+JSON.stringify(chain));
}

test('all 22 GSC paths resolve after the existing www redirect, except the malformed path',async()=>{
  const urls=fixture.trim().split(/\r?\n/).slice(1).map(row=>row.split(',')[0]);
  assert.equal(urls.length,22);
  for(const url of urls) {
    assert.equal(new URL(url).hostname,'www.billero.app');
    const path=new URL(url).pathname;
    const chain=await follow(path);
    assert.equal(chain.at(-1).status,path.startsWith('/mes.')?404:200,JSON.stringify(chain));
    if(!path.startsWith('/mes.'))assert.equal(chain[0].status,301,path);
  }
});

test('missing home routes enter language negotiation and preserve the query',async()=>{
  for(const lang of pageLanguages.filter(lang=>!homeLanguages.includes(lang))) {
    for(const suffix of ['', '/', '/index', '/index.html']) {
      const path=`/${lang}${suffix}`;
      const response=await handleRequest(new Request(`${origin}${path}?utm_source=gsc`));
      assert.equal(response.status,301,path);
      assert.equal(response.headers.get('Location'),`${origin}/?utm_source=gsc`);
      const chain=await follow(path,{Cookie:'lang=sl','Accept-Language':'de'});
      assert.deepEqual(chain.map(hop=>hop.status),[301,302,200]);
      assert.equal(chain.at(-1).path,'/sl/');
    }
  }
});

test('only absent contact and donate pages fall back, for every known language',async()=>{
  for(const lang of pageLanguages)for(const family of ['contact','donate']) {
    const path=`/${lang}/${family}`;
    if(pagePaths.includes(path))assert.equal(legacyPaths[path],undefined,path);
    else for(const suffix of ['','.html']) {
      const response=await handleRequest(new Request(`${origin}${path}${suffix}?from=app`,{method:'HEAD'}));
      assert.equal(response.status,301);
      assert.equal(response.headers.get('Location'),`${origin}/en/${family}?from=app`);
    }
  }
});

test('regeneration removes fallbacks as soon as translations are added',()=>{
  execFileSync('python',['-c',`
import importlib.util,json
from pathlib import Path
spec=importlib.util.spec_from_file_location('sync', 'scripts/sync-locales.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
pages=json.loads(Path('scripts/site-pages.json').read_text())
before=module.missing_page_redirects(pages)
assert before['/cs/index.html']=='/'
assert before['/de/contact.html']=='/en/contact'
assert before['/es/donate']=='/en/donate'
for file,url in [('cs/index.html','/cs/'),('de/contact.html','/de/contact'),('es/donate.html','/es/donate')]:
 pages[file]={'url':url}
after=module.missing_page_redirects(pages)
for path in ['/cs','/cs/','/cs/index','/cs/index.html','/de/contact','/de/contact.html','/es/donate','/es/donate.html']:
 assert path not in after,path
assert '/fr/' not in after and '/unknown/contact' not in after
`],{cwd:new URL('..',import.meta.url),stdio:'pipe'});
});
