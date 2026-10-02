/** Shipped Reader, native Markdown primitives; synthetic public data, no model calls. */
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {homedir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..'), require=createRequire(join(root,'package.json'));
const {build}=await import(pathToFileURL(createRequire(require.resolve('tsx')).resolve('esbuild')).href);
const {chromium}=require(process.env.DSH_PLAYWRIGHT || join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const launchPinnedChromium=()=>chromium.launch({headless:true});
const baseline=process.argv.includes('--baseline');
const out=join(root,'.evidence',baseline?'public-flow-before':'public-flow');await mkdir(out,{recursive:true});
await build({entryPoints:[join(root,'tests/browser-public-flow.tsx')],outfile:join(out,'fixture.js'),bundle:true,format:'esm',platform:'browser',jsx:'automatic',
 nodePaths:[join(root,'node_modules')],alias:{'@fixture/Reader':baseline?resolve(root,'../backup/dsh-better-display/src/client/Reader.tsx'):join(root,'src/client/Reader.tsx'),react:dirname(require.resolve('react/package.json')),'react-dom':dirname(require.resolve('react-dom/package.json'))},
 loader:{'.css':'local-css','.woff2':'dataurl','.woff':'dataurl','.ttf':'dataurl','.svg':'dataurl'}});
const server=createServer(async(req,res)=>{
 const file=req.url==='/fixture.js'?'fixture.js':req.url==='/fixture.css'?'fixture.css':null;
 res.setHeader('Content-Type',file?file.endsWith('.js')?'text/javascript':'text/css':'text/html');
 res.end(file?await readFile(join(out,file)):'<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/fixture.css"><style>body{margin:0;font:14px/1.6 system-ui;--dsw-alias-label-primary:#222;--dsw-alias-label-secondary:#aaa;--dsw-alias-bg-base:#fff;--dsw-alias-border-l2:#ccc}button{cursor:pointer}</style><div id="app"></div><script type="module" src="/fixture.js"></script>');
});await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;const results=[];
const measures=page=>page.locator('[data-reader-flow]').evaluateAll(es=>es.map(e=>({height:e.getBoundingClientRect().height,phase:e.dataset.readerTransition,cells:[...e.children].map(c=>({key:c.dataset.flowKey,hidden:c.hidden,height:c.getBoundingClientRect().height,text:c.innerText.trim(),padding:c.firstElementChild?getComputedStyle(c.firstElementChild).paddingBottom:null,animations:c.getAnimations({subtree:true}).filter(a=>a.playState==='running').length}))})));
try{
 browser=await launchPinnedChromium();
 for(const reducedMotion of ['no-preference','reduce']){
  const page=await browser.newPage({viewport:{width:1200,height:900},reducedMotion});page.setDefaultTimeout(5000);
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.getByText('FINAL_ANSWER',{exact:true}).waitFor();await page.waitForTimeout(1500);
  if(baseline){await page.evaluate(()=>window.publicFixture.preference(false));await page.waitForTimeout(1500);}
  const live=await measures(page), text=await page.locator('[data-reader-turn="1"]').innerText();
  if(baseline){results.push({reducedMotion,live,topNarrations:await page.locator('[data-reader-narrations]').count(),order:text.includes('PUBLIC_A')&&text.indexOf('PUBLIC_A')<text.indexOf('PROGRESS_A'),emptyOccupied:live.flatMap(x=>x.cells).filter(c=>!c.hidden&&!c.text&&c.height>1)});await page.close();continue;}
  const order=['PUBLIC_A','PROGRESS_A','PUBLIC_B','PROGRESS_B','PUBLIC_C','FINAL_ANSWER'];
  assert.deepEqual([...order].sort((a,b)=>text.indexOf(a)-text.indexOf(b)),order);
  for(const value of order)assert.equal(text.split(value).length-1,1,value+' once');
  assert.equal(await page.locator('[data-reader-narrations]').count(),0);
  assert.equal(live.flatMap(x=>x.cells).filter(c=>!c.hidden&&!c.text&&c.height>1).length,0);
  assert.equal(await page.getByText('PUBLIC_A',{exact:true}).evaluate(e=>getComputedStyle(e).fontWeight),'600');
  assert.equal(await page.getByText('PROGRESS_A',{exact:true}).evaluate(e=>getComputedStyle(e).fontWeight),'400');
  await page.evaluate(()=>window.publicFixture.update('📌 进度：STREAM_PUBLIC'));
  await page.getByText('STREAM_PUBLIC',{exact:true}).waitFor();
  const stable=await page.getByText('STREAM_PUBLIC',{exact:true}).evaluate(e=>{window.publicSeat=e;return e.getAttribute('data-reader-progress')});
  await page.evaluate(()=>window.publicFixture.update('📌 进度：STREAM_PUBLIC grows'));
  await page.getByText('STREAM_PUBLIC grows',{exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>window.publicSeat===document.querySelector(`[data-reader-progress="${window.publicSeat.dataset.readerProgress}"]`)),true);
  // Freeze/resume a running renderer and cancel any in-flight arrival animations.
  // Public text must recover within the same choreography watchdog bound.
  const cdp=await page.context().newCDPSession(page);
  await page.evaluate(()=>window.publicFixture.update('📌 进度：BACKGROUND_PUBLIC'));
  await cdp.send('Page.setWebLifecycleState',{state:'frozen'});
  await cdp.send('Page.setWebLifecycleState',{state:'active'});
  await page.evaluate(()=>document.getAnimations().forEach(a=>a.cancel()));
  await page.waitForTimeout(1300);
  await page.getByText('BACKGROUND_PUBLIC',{exact:true}).waitFor({state:'visible'});
  assert.equal((await measures(page)).flatMap(x=>x.cells).filter(c=>!c.hidden&&!c.text&&c.height>1).length,0);
  await cdp.detach();
  await page.evaluate(()=>window.publicFixture.close());await page.waitForTimeout(1600);
  const closed=await measures(page);
  const beforeHeight=closed[0].height;await page.evaluate(()=>window.publicFixture.empty(100));await page.waitForTimeout(1000);
  assert.equal((await measures(page))[0].height,beforeHeight,'100 empty steps add no height');
  for(let i=0;i<4;i++){
   await page.getByRole('button',{name:'展开思考与过程',exact:true}).click();
   await page.getByText('THOUGHT_A',{exact:true}).waitFor();
   await page.getByRole('button',{name:'收起思考与过程',exact:true}).click();
   await page.evaluate(()=>document.getAnimations().forEach(a=>a.cancel()));await page.waitForTimeout(1300);
   await page.getByText('THOUGHT_A',{exact:true}).waitFor({state:'hidden'});
  }
  const settled=await measures(page);assert.equal(settled.flatMap(x=>x.cells).filter(c=>!c.hidden&&!c.text&&c.height>1).length,0);
  await page.getByRole('button',{name:'以此处为基础创建分叉会话',exact:true}).click();assert.deepEqual(await page.evaluate(()=>window.publicFixture.forks()),[14]);
  await page.context().grantPermissions(['clipboard-read','clipboard-write']);
  await page.getByRole('button',{name:'复制回答',exact:true}).click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'FINAL_ANSWER');
  assert.deepEqual(errors,[]);await page.screenshot({path:join(out,reducedMotion+'.png'),animations:'disabled'});
  results.push({reducedMotion,passed:true,live,closed,settled,stable,emptySteps:100});await page.close();
 }
 await writeFile(join(out,'result.json'),JSON.stringify({baseline,passed:!baseline,results},null,2));
 console.log(JSON.stringify({baseline,results:results.map(x=>({reducedMotion:x.reducedMotion,passed:x.passed,emptyOccupied:x.emptyOccupied?.length,order:x.order}))}));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
