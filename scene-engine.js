/* Pass 15 — Scene descriptor and interaction presentation layer.
   Mission IDs, gates, authored effects and exit destinations remain unchanged.
   New missions may set scenePlan[stage] to override text, interaction type, heading,
   hints or layout without editing the generic renderer. */
'use strict';
(function(g){
 const special={
  'A0-03':{2:{layout:'inspect-grid',heading:'Inspect the silver footprints',tip:'Select a mark to see what it proves. More than one object can be inspected.'}},
  'A1-W04':{2:{layout:'evidence-grid',heading:'Compare two sources',tip:'A living paw and an artificial print are not the same kind of evidence.'}},
  'A1-C02':{2:{layout:'timeline',heading:'Track what happened first'}},
  'A1-P04':{2:{layout:'evidence-grid',heading:'Inspect the palace clues'}},
  'A3-06':{2:{layout:'timeline',heading:'Reconstruct the order of events'}},
  'A4-04':{2:{layout:'evidence-grid',heading:'Compare clues collected separately'}},
  'A5-06':{3:{layout:'dialogue',heading:'Ask a question, then listen to the answer'}},
  'A7-03':{3:{layout:'dialogue',heading:'The coalition must decide for itself'}}
 };
 const interludes={
  'A0-03':{prompt:'The marks look like silver dust, but the place where they were found matters too. Where should you record the clue?',options:[['Record the mark, its location, and who found it.',true,'You write down the place and source. No one has been accused.'],['Write down the first person who seems suspicious.',false,'That is a guess. Write down what you saw first.']]},
  'A1-W04':{prompt:'You look from the real paw to the artificial print. What can you conclude safely?',options:[['Their different pressure and texture prove the prints do not match.',true,'The mismatch belongs on the case board. It does not yet name a forger.'],['The Wolf is close by, so he must have made the tracks.',false,'Someone can be nearby and still be innocent. Look at the tracks again.']]},
  'A1-C02':{prompt:'The two records were written by different hands. Which step helps establish the missing date?',options:[['Compare their dates recorded by different people and order of entries.',true,'You keep both records separate before drawing a conclusion.'],['Use whichever record tells the most exciting story.',false,'A dramatic account can still be inaccurate. Look for dates recorded by different people.']]},
  'A1-P04':{prompt:'The palace offers a reflection, a place-setting count, and a copied guest list. Which can you verify without naming anyone?',options:[['Count the chairs and plates. Then check the first guest list.',true,'The room itself can support a finding without exposing an identity.'],['Ask the mirror to reveal a stranger’s secret name.',false,'A mirror cannot prove who someone is or tell their secrets for them.']]},
  'A3-06':{prompt:'Two documents show the same changed stamp. What would make their agreement meaningful?',options:[['Find the first paper and dates written by other people.',true,'Two copies of one mark are still just one clue.'],['Count both copies as separate witnesses.',false,'Both copies can descend from one inaccurate source.']]},
  'A4-04':{prompt:'A catalog copy matches a page copy. How should the Archive treat them?',options:[['Trace each copy to its first place it was kept before counting evidence.',true,'You preserve the path back to the original clue and the limits of each copy.'],['Say the two copies prove that two people agreed.',false,'Two copies can still come from the same original.']]}
 };
 function describe(m,stage,game){
  const perMission=m.scenePlan?.[stage]||special[m.id]?.[stage]||{};
  const kinds={1:'narrative',2:m.puzzle?'deduction':'investigation',3:'decision',4:'consequence',5:'exit'};
  const fields={1:m.arrival,2:m.activity,3:m.issue,4:m.consequence,5:m.exit};
  let text=perMission.text!==undefined?perMission.text:fields[stage];
  if(typeof text==='function')text=text(game);
  return {kind:perMission.kind||kinds[stage],layout:perMission.layout||(stage===3?'dialogue':'stack'),heading:perMission.heading||null,tip:perMission.tip||null,text,stage,count:5};
 }
 function renderButtonList(buttons,layout,escape){
  const cardLayout=['inspect-grid','evidence-grid','timeline','dialogue'].includes(layout)?layout:'stack';
  return `<div class="choices ${cardLayout}" data-interaction="${cardLayout}">${buttons.map((b,i)=>`<button type="button" class="btn ${b.primary?'primary':''} ${!b.primary?'choice-card':''}" data-choice="${i}" ${b.disabled?'disabled aria-disabled="true"':''}><span class="choice-text">${escape(b.label)}</span><span class="arrow" aria-hidden="true">${b.primary?'❯':'✧'}</span></button>`).join('')}</div>`;
 }
 g.OUATScenes={describe,renderButtonList,special,interludes};
})(window);
