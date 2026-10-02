import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {assistantSegments,hasRenderableRecord,isProcessRecord} from '../src/client/projection.js';
import {publicTextSegments} from '../src/client/native/progress-protocol.js';
import {segmentLiveTurn,presentLiveTurn} from '../src/client/live-turn.js';
import {flowRows,containsPublicUpdate} from '../src/client/fold-choreography.js';
test('vendored parser matches its canonical source checksum and protocol versions',()=>{
 const meta=JSON.parse(readFileSync(new URL('../src/client/native/public-text-source.json',import.meta.url),'utf8'));
 const copy=readFileSync(new URL('../src/client/native/progress-protocol.ts',import.meta.url),'utf8').replaceAll('\r\n','\n').split('\n').slice(2).join('\n');
 assert.equal(createHash('sha256').update(copy).digest('hex'),meta.sha256);
 assert.equal(meta.version,'0.4.0');assert.equal(meta.publicTextVersion,1);
});
test('Host and view block shapes produce identical public offsets, without touching code, media or unknowns',()=>{
 const content=[{type:'text',text:'原文\n\n📌 进度：确认。接着检查。\n\n继续。'},{type:'image',attachment:{}},{type:'future',value:1}];
 const host=publicTextSegments(content), view=publicTextSegments(content.map(({type,...b})=>({kind:type,...b})));
 const comparable=(parts:typeof host)=>parts.map(({kind,start,offset,renderable,public:p,progressText}:any)=>({kind,start,offset,renderable,p,progressText}));
 assert.deepEqual(comparable(host),comparable(view));
 assert.deepEqual(host.map((p:any)=>p.kind),['body','progress','body','other','other']);
 assert.equal(assistantSegments([{kind:'text',text:' \n'},{kind:'reasoning',text:' '}]).length,0);
});
test('unknown/media and actual terminal states survive empty-record exclusion and process folding',()=>{
 for(const node of [{kind:'turn-error',data:{message:'error'}},{kind:'future-node',data:{}},{kind:'command',data:{outcome:{kind:'error'}}}] as any[]){assert.equal(hasRenderableRecord(node),true);assert.equal(isProcessRecord(node),false);}
 assert.equal(hasRenderableRecord({kind:'turn-process',data:{}} as any),false);
 assert.equal(assistantSegments([{kind:'image',attachment:{}} as any,{kind:'other',block:{type:'future'}}]).length,2);
});
test('public output stays open between fold spans, source keys survive classification, and growth bypasses choreography',()=>{
 const steps:any[]=[{kind:'reasoning',key:'r1'},{kind:'body',key:'p1',blocks:[{kind:'text',text:'正文'}]},{kind:'reasoning',key:'r2'},{kind:'progress',key:'p2',blocks:[{kind:'text',text:'📌 进度：确认'}]},{kind:'reasoning',key:'r3'}];
 const items=presentLiveTurn(steps,{status:'open',reason:null,latestStep:3,closingStep:null});
 assert.deepEqual(flowRows(items).filter(r=>r.kind==='step').map(r=>r.key),steps.map(s=>s.key));
 assert.deepEqual(items.filter(i=>i.kind==='fold').flatMap(i=>i.steps.map(s=>s.key)),['r1','r2']);
 assert.equal(containsPublicUpdate(items,presentLiveTurn([...steps,{kind:'body',key:'p3',blocks:[{kind:'text',text:'新内容'}]}] as any,{status:'open'} as any)),true);
 const project=(text:string)=>segmentLiveTurn([{kind:'node',nodeKey:'a',key:'a',order:1}],()=>({kind:'assistant-step',visibility:'visible',data:{step:1,blocks:[{kind:'text',text}]}} as any));
 assert.equal(project('📌 进度：确认')[0].key,project('📌 进度：确认。增长')[0].key);
});
