import React, {useSyncExternalStore} from 'react';
import {createRoot} from 'react-dom/client';
import {Reader} from '@fixture/Reader';
import {createReaderStore} from '../src/client/store.js';
import type {ReaderProps} from '../src/client/types.js';
const store=createReaderStore(), prefs=store.create(), session=store.create('public-flow');
const nodes=new Map(), turns=new Map(), listeners=new Set<()=>void>();
let revision=0;
const turn={turn:1,status:'open',start:{seq:0,time:1},end:undefined as any,data:new Map(),steps:[] as any[]};
const add=(step:number,text:string,reasoning='')=>{
 const key=`a${step}`,data={turn:1,step,status:'settled',time:1,finalNode:{seq:step+1,messageId:key},blocks:[...(reasoning?[{kind:'reasoning',text:reasoning}]:[]),{kind:'text',text}]};
 const location={step,start:{seq:step+1},data:new Map([['assistant-step',data]])};
 turn.steps.push(location);nodes.set(key,{key,kind:'assistant-step',visibility:'visible',anchorSeq:step+1,location:{kind:'step',turn,step:location},data});
};
add(0,'PUBLIC_A\n\n📌 进度：PROGRESS_A\n\nPUBLIC_B','THOUGHT_A');
add(1,'📌 进度：PROGRESS_B','THOUGHT_B');
add(2,'PUBLIC_C\n\n```js\nconst n = 1\n```\n\n|x|y|\n|-|-|\n|1|2|','THOUGHT_C');
for(let i=3;i<13;i++) add(i,' \n\t');
add(13,'FINAL_ANSWER','THOUGHT_FINAL');
turns.set(1,turn);
const chat={order:[...nodes.keys()],nodes,timeline:{turns}};
let running=true, forks:number[]=[];
const notify=()=>{chat.nodes=new Map(nodes);chat.order=[...nodes.keys()];chat.timeline={turns:new Map([[1,{...turn}]])};revision++;listeners.forEach(fn=>fn());};
const subscribe=(fn:()=>void)=>{listeners.add(fn);return()=>listeners.delete(fn);};
const host={home:'/fixture'};
const props={sessionId:'public-flow',useChat:selector=>{useSyncExternalStore(subscribe,()=>revision);return selector(chat)},
 useSession:selector=>{useSyncExternalStore(subscribe,()=>revision);return selector({running,openState:'ready',pendingSubmissions:[],hasMore:false,loadingOlder:false})},
 useSessions:selector=>selector({byId:{'public-flow':{cwd:'/fixture'}}}),
 useSessionStatus:selector=>selector(new Map([['public-flow',{running,pendingInteraction:undefined}]])),
 useStore:selector=>selector(useSyncExternalStore(session.subscribe,session.getSnapshot)),actions:session.actions,openPrefs:prefs,
 t:key=>key,renderSlot:(_n,_o,options)=>options?.fallback??null,renderSlotChain:(_n,_o,options)=>options?.fallback??null,
 loadImage:async()=>({data:new Uint8Array(),mediaType:'image/png'}),officialImageLoader:Object.assign(async()=>null,{peek:()=>null}),
 officialFileMentions:()=>undefined,officialPreviewFile:()=>{},officialHost:{getSnapshot:()=>host,subscribe:()=>()=>{}},
 fillComposer:()=>true,openFile:()=>{},loadOlder:async()=>{},openView:()=>{},forkAt:(seq:number)=>forks.push(seq),
} as ReaderProps;
Object.assign(window,{publicFixture:{
 close:()=>{running=false;turn.status='closed';turn.end={time:1001,data:{reason:{kind:'completed'}}};turn.data.set('turn-tail',{closing:{step:13,finalNode:{seq:14}}});notify()},
 update:(text:string)=>{const n=nodes.get('a1');nodes.set('a1',{...n,data:{...n.data,blocks:[{kind:'reasoning',text:'THOUGHT_B'},{kind:'text',text}]}});notify()},
 empty:(count:number)=>{for(let i=20;i<20+count;i++)add(i,' \n');chat.order=[...nodes.keys()];notify()},
 preference:(value:boolean)=>prefs.actions.setAutoFold(value),forks:()=>forks,
}});
createRoot(document.getElementById('app')!).render(<div data-conversation-scroll style={{height:'100vh',overflow:'auto'}}><Reader {...props}/></div>);
