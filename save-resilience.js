/* Pass 15 — Save validation, migration, snapshots, import/export. No external service. */
'use strict';
(function(g){
 const CURRENT=2, MAX=7_500_000;
 const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const plain=x=>isObj(x)&&Object.getPrototypeOf(x)===Object.prototype;
 function limitNumber(v,min,max,fallback){const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback}
 function checkMap(x,maxKeys=1000){return plain(x)&&Object.keys(x).length<=maxKeys&&!Object.keys(x).some(k=>['__proto__','constructor','prototype'].includes(k)||k.length>130)}
 function sanitizeGame(raw,validScene){
   if(!plain(raw))throw Error('Save must contain a game object.');
   if(![1,2].includes(Number(raw.version)) && ![1,2].includes(Number(raw.schemaVersion)))throw Error('This save version is not supported.');
   if(!validScene(raw.scene))throw Error('This backup names a missing story scene.');
   if(!checkMap(raw.flags,3000)||!checkMap(raw.evidence,250)||!checkMap(raw.stats,40)||!checkMap(raw.rels||{},80))throw Error('Story state structure is invalid.');
   if(raw.seen!=null&&!checkMap(raw.seen,300))throw Error('Observation list is invalid.');if(raw.interactions!=null&&!checkMap(raw.interactions,300))throw Error('Interaction history is invalid.');if(raw.miniGames!=null&&!checkMap(raw.miniGames,300))throw Error('Puzzle history is invalid.');
   if(raw.attempts!=null&&!checkMap(raw.attempts,300))throw Error('Puzzle history is invalid.');
   if(raw.depthChoices!=null&&!checkMap(raw.depthChoices,300))throw Error('Conversation history is invalid.');
   if(raw.items!=null&&(!Array.isArray(raw.items)||raw.items.length>250||raw.items.some(v=>typeof v!=='string'||v.length>180)))throw Error('Inventory is invalid.');
   if(raw.notes!=null&&(!Array.isArray(raw.notes)||raw.notes.length>1200||raw.notes.some(v=>!plain(v)||typeof v.text!=='string'||v.text.length>3000)))throw Error('Journal entries are invalid.');
   const clean={...raw,version:1,schemaVersion:CURRENT,name:String(raw.name||'Traveler').trim().slice(0,24)||'Traveler',trait:['curious','brave','kind'].includes(raw.trait)?raw.trait:'curious'};
   clean.stats={courage:limitNumber(raw.stats.courage,0,10,2),wit:limitNumber(raw.stats.wit,0,10,2),heart:limitNumber(raw.stats.heart,0,10,2)};
   clean.progression=g.OUATLitRPG?g.OUATLitRPG.normalize(raw.progression,clean.trait):raw.progression||null;
   // One-time catch-up for Pass 5–17 saves that predate the progression system.
   // Does not invent clue evidence, relationship consent, or story achievements.
   if(!raw.progression&&g.OUATLitRPG){
     const milestones=['act2_complete','act3_complete','act4_complete','act5_complete','act6_complete','act7_complete','act8_complete'];
     const seenActs=milestones.filter(k=>raw.flags?.[k]).length;
     const sceneMatch=/^A([1-8])-/.exec(String(raw.scene||''));
     const actFromScene=sceneMatch?Number(sceneMatch[1]):0;
     const progress=Math.max(seenActs,actFromScene-1,(raw.flags?.chosen_road?1:0));
     clean.progression.level=Math.min(10,1+progress);
     clean.progression.points=Math.max(0,clean.progression.level-1);
     clean.progression.statPoints=Math.floor(clean.progression.level/2);
     clean.progression.catchup=true;
   }
   const rels={red:0,wolf:0,courier:0,jack:0,bram:0,cinderella:0,nell:0,pip:0,hansel:0,gretel:0,taffy:0,tern:0,assistant:0,quill:0};
   for(const k of Object.keys(rels))rels[k]=limitNumber(raw.rels?.[k],-4,5,0);
   clean.rels=rels;clean.flags={...raw.flags};clean.evidence={};
   for(const [key,value] of Object.entries(raw.evidence)){
     if(!/^EV-[A-Z]\d{2}$/.test(key)&&!/^EV-C\d{2}$/.test(key))continue;
     if(!plain(value))continue;
     clean.evidence[key]={acquiredAt:String(value.acquiredAt||'unknown').slice(0,50),source:String(value.source||'Unspecified').slice(0,250),title:String(value.title||key).slice(0,150)};
   }
   clean.seen={};for(const [key,value] of Object.entries(raw.seen||{}))if(Array.isArray(value)&&value.length<=60)clean.seen[key]=[...new Set(value.filter(n=>Number.isInteger(n)&&n>=0&&n<60))];
   clean.interactions={};for(const [key,v] of Object.entries(raw.interactions||{}))if(plain(v))clean.interactions[key]={active:!!v.active,done:!!v.done,feedback:String(v.feedback||'').slice(0,400)};
   clean.miniGames={};for(const [id,value] of Object.entries(raw.miniGames||{}))if(g.OUATPuzzles?.has(id)&&plain(value))clean.miniGames[id]=g.OUATPuzzles.clean(g.OUATPuzzles.get(id),value);
   clean.attempts={};for(const [key,v] of Object.entries(raw.attempts||{}))if(plain(v))clean.attempts[key]={count:limitNumber(v.count,0,100000,0),solved:!!v.solved,hint:String(v.hint||'').slice(0,400)};
   clean.depthChoices={};for(const [key,value] of Object.entries(raw.depthChoices||{}))if(validScene(key+'-S01')&&(value===0||value===1))clean.depthChoices[key]=value;
   clean.depthOpen=(plain(raw.depthOpen)&&validScene(String(raw.depthOpen.id||'')+'-S01')&&['ask','reply'].includes(raw.depthOpen.step))?{id:raw.depthOpen.id,step:raw.depthOpen.step,answer:raw.depthOpen.answer===1?1:0}:null;
   if(raw.branchHistory!=null&&!checkMap(raw.branchHistory,300))throw Error('Branch decision history is invalid.');
   clean.branchHistory={};
   for(const [id,h] of Object.entries(raw.branchHistory||{})){
     if(!validScene(id+'-S01')||(g.OUATBranches&&!g.OUATBranches.get(id))||!plain(h)||!Number.isInteger(h.route)||h.route<0||h.route>2)continue;
     clean.branchHistory[id]={route:h.route,label:String(h.label||'').slice(0,200),result:String(h.result||'').slice(0,60),text:String(h.text||'').slice(0,750)};
   }
   const bo=raw.branchOpen;
   clean.branchOpen=(plain(bo)&&raw.scene===String(bo.id||'')+'-S02'&&validScene(String(bo.id||'')+'-S01')&&(!g.OUATBranches||!!g.OUATBranches.get(bo.id))&&['fork','challenge','outcome'].includes(bo.step)&&Number.isInteger(bo.route??0)&&[0,1,2].includes(bo.route??0)&&Number.isInteger(bo.choice??0)&&[0,1].includes(bo.choice??0))?{id:bo.id,step:bo.step,route:bo.route??0,choice:bo.choice??0}:null;
   clean.items=raw.items?.slice()||['Journal'];clean.notes=(raw.notes||[]).map(x=>({at:String(x.at||'Note').slice(0,65),text:x.text.slice(0,3000)})).slice(-250);
   clean.legacyRun=g.OUATLegacy?g.OUATLegacy.normRun(raw.legacyRun,raw.scene):{history:{},open:null};
   clean.decisions=limitNumber(raw.decisions,0,1000000,0);clean.startedAt=limitNumber(raw.startedAt,1,Number.MAX_SAFE_INTEGER,Date.now());clean.complete=!!raw.complete;
   clean.lastSavedAt=typeof raw.lastSavedAt==='string'?raw.lastSavedAt:null;
   return clean;
 }
 function sanitizeMeta(raw){
   if(!plain(raw))return {demoRuns:0,completedLocal:[],atlas:[]};
   if(raw.atlas!=null&&!Array.isArray(raw.atlas))throw Error('Living Atlas must be an array.');
   const atlas=(raw.atlas||[]).filter(plain).slice(-100).map(e=>({
     key:String(e.key||'').slice(0,110),ending:/^E(0[1-9]|1[0-2])$/.test(e.ending||'')?e.ending:'E01',firstRoad:String(e.firstRoad||'woods').slice(0,30),name:String(e.name||'Traveler').slice(0,24),epilogue:String(e.epilogue||'community').slice(0,30),date:String(e.date||'').slice(0,45),thiefProven:!!e.thiefProven,missingChime:!!e.missingChime,proofCount:limitNumber(e.proofCount,0,200,0),notes:Array.isArray(e.notes)?e.notes.slice(-8).filter(x=>typeof x==='string').map(x=>x.slice(0,240)):[]
   })).filter(e=>e.key);
   const legacy=g.OUATLegacy?g.OUATLegacy.normProfile(raw):{legacyRecords:[],legacyLenses:[]};
   if(!atlas.length){legacy.legacyRecords=[];legacy.legacyLenses=[];}
   return {demoRuns:limitNumber(raw.demoRuns,0,100000,0),completedLocal:[...new Set((Array.isArray(raw.completedLocal)?raw.completedLocal:[]).filter(x=>['woods','cloud','palace','reflection'].includes(x)))],atlas,...legacy};
 }
 function fingerprint(v){const t=JSON.stringify(v);let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return ('00000000'+(h>>>0).toString(16)).slice(-8)}
 function buildExport(game,profile,prefs){const data={format:'ouat-backup',backupVersion:CURRENT,createdAt:new Date().toISOString(),game,profile,prefs};return {...data,checksum:fingerprint(data)};}
 function parseImport(raw,validScene){
   if(typeof raw!=='string'||raw.length>MAX)throw Error('File is too large to import (7.5 MB maximum).');
   let value;try{value=JSON.parse(raw)}catch{throw Error('This file is not valid JSON.')}if(!plain(value))throw Error('Backup content must be an object.');
   if(value.format==='ouat-backup'){const {checksum,...data}=value;if(typeof checksum!=='string'||fingerprint(data)!==checksum)throw Error('The backup integrity check failed. The file may be incomplete or modified.');}
   const game=sanitizeGame(value.game||value,validScene);
   const profile=sanitizeMeta(value.profile||value.meta||{});
   const prefs=plain(value.prefs)?{scale:limitNumber(value.prefs.scale,1,1.75,1),contrast:!!value.prefs.contrast,reduced:!!value.prefs.reduced,muted:!!value.prefs.muted}:null;
   return {game,profile,prefs,createdAt:String(value.createdAt||value.savedAt||'Older backup'),legacy:value.format!=='ouat-backup'};
 }
 function saveSnapshot(storage,key,game,profile,validScene){
   const previous=storage.getItem(key);if(previous){
     try{const prior=sanitizeGame(JSON.parse(previous),validScene);if(prior.scene!==game.scene&&prior.scene.endsWith('S05')&&game.scene.endsWith('S01'))storage.setItem(key+'.checkpoint',previous)}catch{}
   }
   const json=JSON.stringify(game);
   // Primary storage remains the historic key, so Pass 5–13 saves keep working.
   storage.setItem(key,json);
   storage.setItem(key+'.lastGood',json);
   storage.setItem(key+'.profileGood',JSON.stringify(profile));
 }
 function recoveryCandidates(storage,key,validScene){const out=[];for(const [label,k] of [['Current save',key],['Most recent healthy save',key+'.lastGood'],['Earlier mission checkpoint',key+'.checkpoint']]){try{const raw=storage.getItem(k);if(!raw)continue;const game=sanitizeGame(JSON.parse(raw),validScene);out.push({label,key:k,game})}catch{}}return out;}
 g.OUATSave={CURRENT,MAX,sanitizeGame,sanitizeMeta,fingerprint,buildExport,parseImport,saveSnapshot,recoveryCandidates};
})(window);
