import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {handleRequest} from '../edge/language-router.mjs';

const markets=[
  {sl:'/sl/racun-vsebina',en:'/en/invoice-requirements/slovenia'},
  {en:'/en/invoice-requirements/united-states',es:'/es/factura-requisitos/estados-unidos'},
  {de:'/de/rechnung-pflichtangaben',en:'/en/invoice-requirements/germany'},
];
test('country guide alternatives stay within their market and default to its English page',()=>{
  for(const family of markets)for(const url of Object.values(family)) {
    const html=readFileSync(new URL('..'+url+'.html',import.meta.url),'utf8');
    const actual=Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="https:\/\/billero.app([^"]+)">/g)].map(m=>[m[1],m[2]]));
    assert.deepEqual(actual,{...family,'x-default':family.en},url);
  }
});
test('nested and translated guide HTML aliases keep their market, language and query',async()=>{
  for(const family of markets)for(const path of Object.values(family)) {
    const response=await handleRequest(new Request(`https://billero.app${path}.html?ref=guide`,{headers:{Cookie:'lang=th','Accept-Language':'ja'}}));
    assert.equal(response.status,301);
    assert.equal(response.headers.get('Location'),`https://billero.app${path}?ref=guide`);
  }
});
