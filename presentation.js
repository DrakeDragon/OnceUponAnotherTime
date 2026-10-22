/* Pass 21 · Original atmosphere art, opt-in audio, character presentation. */
'use strict';
(function(g){
 const imageFor={
   'A0-01':'bell-tower','A0-02':'bell-tower','A0-03':'silver-path',
   'A1-W01':'silver-path','A1-W03':'silver-path','A1-W04':'silver-path',
   'A1-C01':'cloud-lantern','A1-C04':'cloud-lantern','A1-P01':'midnight-clock','A1-P04':'midnight-clock',
   'A3-01':'sugar-lights','A3-03':'sugar-lights','A4-01':'archive-glow','A4-04':'archive-glow',
   'A5-01':'court-rays','A5-06':'court-rays','A6-01':'margin-stars','A6-09':'margin-stars',
   'A7-01':'bell-tower','A7-07':'bell-tower','A8-01':'last-chime','A8-03':'last-chime',
   'HUB-00':'bell-tower','HUB-08':'bell-tower'
 };
 const portraits=[['wolf','wolf'],['red','red'],['jack','jack'],['cinderella','cinderella'],['gretel','march'],['hansel','bakery'],['tern','archive'],['quill','shop'],['pip','shop'],['bram','giant'],['ink','ink'],['rumpel','sugar']];
 function artFor(m,stage){return imageFor[m.id]||m.art}
 function portrait(speaker,img){const k=String(speaker||'').toLowerCase();const match=portraits.find(([s])=>k.includes(s));if(!match)return'';const name=match[1];return `<div class="character-moment"><img src="${img(name)}" alt="${String(speaker).replace(/[&<>"]/g,'')}" loading="lazy"/><span>Talking with ${String(speaker).replace(/[&<>"]/g,'')}</span></div>`}
 function zone(m){const id=m?.id||'';const z=(m?.zone||'').toLowerCase();if(/^A[6-8]-/.test(id)||z.includes('margin'))return'margin';if(id.startsWith('A1-W')||z.includes('woods'))return'forest';if(/^A[3-5]-/.test(id)||z.includes('court')||z.includes('archive'))return'mystery';if(id.startsWith('A1-C')||id.startsWith('A1-P')||z.includes('cloud')||z.includes('palace'))return'kingdom';return'bookshop'}
 const labels={bookshop:'The Bookshop',forest:'Neverafter Woods',kingdom:'The Kingdoms',mystery:'A Mystery Unfolds',margin:'Beyond the Last Page'};
 let soundtrack=null,volume=.24,enabled=false,current='';
 const inline=g.__OUAT_INLINE_AUDIO||{};
 function path(key){return inline[key]||'audio/'+key+'.mp3'}
 function stop(){if(soundtrack){soundtrack.pause();soundtrack.currentTime=0;soundtrack=null}}
 function transitionTo(key){
   if(current===key&&soundtrack)return;
   current=key;stop();if(!enabled||document.hidden)return;
   try{soundtrack=new Audio(path(key));soundtrack.loop=true;soundtrack.volume=volume;soundtrack.preload='none';
     const playing=soundtrack.play();if(playing?.catch)playing.catch(()=>{});
   }catch(e){console.warn('Optional sound unavailable',e)}
 }
 function setEnabled(yes){enabled=!!yes;if(!enabled)stop();else transitionTo(current||'bookshop')}
 function setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));if(soundtrack)soundtrack.volume=volume}
 function effect(name){if(!enabled||document.hidden)return;try{const audio=new Audio(path(name));audio.volume=Math.min(.48,volume*1.7);const playing=audio.play();if(playing?.catch)playing.catch(()=>{})}catch(e){}}
 function scene(m,stage){transitionTo(zone(m));return labels[zone(m)]}
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(soundtrack)soundtrack.pause()}else if(enabled)transitionTo(current||'bookshop')});
 g.OUATPolish={artFor,portrait,zone,scene,labels};g.OUATSound={setEnabled,setVolume,effect,scene,transitionTo,stop,get enabled(){return enabled}};
})(window);
