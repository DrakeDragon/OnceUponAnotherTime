/* PASS 12 · ACT VII: THE STORY THAT CHOSE YOU
 * Follows the Pass 2–4 locked canon and only uses Pass 3 mission exits.
 * A finale is planned, not won; affected-person permission is never synthesized
 * from trust, a menu click, or possession of a page.
 */
'use strict';
const chapter7='Act VII · The Story That Chose You';
const sourceRoad=s=>({woods:'Red’s forest and the protected lantern courier',cloud:'Jack’s bridge and Bram’s dated work log',palace:'Cinderella’s revised ceremony and the sealed servant account'})[s.flags.chosen_road]||'the first kingdom';
const echoCouncil=s=>!!s.flags.legacy_verified && Number(s.flags.legacy_tier||0)>=5 && !!s.flags.a6_survivor_method;
const hasTechnical=s=>s.flags.chosen_road==='cloud'||!!s.flags.a1_cloud_bridge_choice||!!s.flags.a2_cloud_verified;
const hasRoyal=s=>s.flags.chosen_road==='palace'||!!s.flags.palace_midnight_released||!!s.flags.a5_verdict_supported;
const hasWoods=s=>s.flags.chosen_road==='woods'||!!s.evidence['EV-C03']||!!s.flags.wolf_apology;
const enough=s=>!!s.flags.a7_bell_role_checked&&!!s.flags.a7_witness_protocol&&!!s.flags.a6_machine_mapped;
const finalePreview=s=>[
 'E01 Bellkeeper — striker evidence ready; public oversight must be earned',
 'E02 Storykeeper — '+(s.flags.a7_affected_permission==='limited_test'?'limited test consent recorded; restoration still unearned':'affected-person restoration permission not granted'),
 'E03 Heart of the Kingdom — coalition charter and opposed factions still to be proven',
 'E04 Many Roads — later-telling Echo route required',
 'E05 Unwritten Truth — court chain and confirmed directive must endure final challenge',
 'E06 The Wolf’s Witness — exoneration and new hearing standard still need implementation',
 'E07 The Giant’s Tomorrow — Bram’s secured calendar route must survive the finale',
 'E08 Midnight Freed — the independent palace council must remain legitimate',
 'E09 The Inkbird Promise — thief agency, restitution and free agreement still unresolved',
 'E10 The Lost Crown — decentralized proof must survive the King’s refusal',
 'E11 The Empty Throne — broader three-faction caretaker charter required',
 'E12 The Thirteenth Path — genuine later telling and survivor-consented special anchor required'
 ].join('\n');
const finalOptions=s=>{
 const x=['A guarded containment route · ALWAYS AVAILABLE after mechanical checks'];
 if(s.flags.a7_coalition_commitment)x.push('A coordinated three-region defense · allies have limited, revocable tasks');
 if(s.flags.a7_affected_permission==='limited_test')x.push('A single protected test to bring the ending back · Elowen may withdraw permission');
 if(s.flags.a7_survivor_charter)x.push('A survivor-led shared plan written by the survivors · only signatory roads take part');
 return x.join('\n');
};
mission({id:'A7-01',title:'The Bell’s Old Design',zone:chapter7,art:'clock',
 arrival:s=>`Mistress Quill places a brass striker beneath the bookshop lamp. It is the smallest part of the thirteenth bell, and it carries three tiny notches.\n\nPip spreads your Margin machine chart beside it. “People keep calling this the switch,” he says, “but the bell’s wire doesn’t reach the machine.”`,
 activity:`A brittle drawing says the striker sounds when a possible future is improperly closed. A second sheet, with a different paper grain, shows the King’s sorting machine using its own power. The original drawing is partly missing.\n\nChoose which source you need to examine to distinguish a warning from a weapon.`,
 observations:[['Compare the warning wire with the machine diagram','The bell is mechanically separate from sorter, binder and road-cutter. A chime can warn people; it cannot restore pages.',{flag:'a7_bell_role_checked',clue:'EV-C15',source:'Bookshop striker diagram; separate machine schematic',stat:['wit',1]}],['Inspect the apprentice’s date and signature','A missing corner prevents a full primary-source reading; a separately dated apprentice copy can be requested.',{flag:'a7_bell_copy_requested',stat:['wit',1]}]],
 issue:`“If the alarm won’t defeat the King,” asks Pip, “why does it matter?”\n\n“Because someone can hear it,” Quill replies. “But they still must decide what to do.” The incomplete drawing can be authenticated using the Striker Apprentice’s preserved sketch.`,
 choices:[['Use the authenticated striker diagram; the bell is a warning.',{flag:'a7_diagram_path',value:'original',stat:['wit',1]}],['Ask the apprentice to authenticate the missing corner.',{flag:'a7_diagram_path',value:'apprentice',stat:['heart',1]}]],
 consequence:s=>s.flags.a7_diagram_path==='apprentice'?`You write a careful request to the apprentice who repaired the old bell. This adds a real errand, not a magically finished diagram.`:`Pip writes WARNING SYSTEM on the bell card and CLOSURE SYSTEM on the machine card. A single thread joins them: a person deciding to act.`,
 exit:`No one can ring their way to a happy ending. The next question is whose future the group is authorized to protect.`,next:s=>s.flags.a7_diagram_path==='apprentice'||!s.evidence['EV-C15']?'REC-06':'A7-02'});

mission({id:'REC-06',title:'The Striker Apprentice Drawing',zone:'Act VII · Fair Evidence Recovery',art:'catalog',
 arrival:`In a clock repairer's attic, a wooden box contains a charcoal rubbing signed by the apprentice who replaced the bell striker long ago. The paper is dated before the present thefts.`,
 activity:`The apprentice's granddaughter brings a second record: a payment receipt listing three notches cut into the striker. The receipt was kept at a different workshop.`,
 puzzle:{question:'Which comparison makes the alternate diagram reliable?',answers:[['The sketch is old, so it must be correct.',false,'Age alone is not independent provenance.'],['Compare the signed rubbing and an independently kept repair receipt.',true,'Two separately kept records agree on the physical striker.'],['The bells are magical, so documentation is unnecessary.',false,'The bell’s limits matter most when the stakes are high.']],flag:'a7_apprentice_verified'},
 issue:`The granddaughter agrees to supply a copy, not the family’s only original. “It’s our history too,” she reminds you.`,
 choices:[['Accept the dated copy with an honest custody note.',{flag:'a7_diagram_path',value:'verified_copy',clue:'EV-C15',source:'Apprentice signed rubbing + separate workshop receipt',stat:['wit',1]}],['Ask her to seal the copy for Quill’s restoration table.',{flag:'a7_diagram_path',value:'sealed_copy',clue:'EV-C15',source:'Sealed apprentice record + independent repair receipt',stat:['heart',1]}]],
 consequence:`The diagram is now sufficiently authenticated. It confirms a warning bell, not a hidden weapon. You never needed to take a family keepsake.`,
 exit:`The verified copy returns to the bookshop before the witness council convenes.`,next:'A7-02'});

mission({id:'A7-02',title:'The Surviving Witness Check',zone:chapter7,art:'page',
 arrival:`Elowen’s stolen page rests under a glass cover. The ink still tells of one road home that was never permitted. Elowen enters with a guardian she chose herself.\n\n“I’ll talk about my road,” she says, “but I don’t want an audience staring at my name.”`,
 activity:`Pip draws three columns: SURVIVING PAGE, VIABLE ALTERNATIVE, and AFFECTED PERSON’S CHOICE. The first two can be examined; the third belongs to Elowen.\n\nElowen will consider a small, supervised test if she can stop it and keep her name sealed. She has not yet agreed to anything.`,
 observations:[['Inspect the original named-page anchor','The actual page and a separately recorded seam survive, supporting the possibility of a limited repair—not restoring anything yet.',{flag:'a7_own_anchor_checked',stat:['wit',1]}],['Ask Elowen to explain her boundaries','She asks for a private location, a stop signal, no public reading of her name, and an witness who saw it for themselves.',{flag:'a7_boundaries_heard',stat:['heart',1]}]],
 issue:`An eager official proposes announcing Elowen’s story now because it would make the coalition look heroic. Quill refuses. “The most important witness here gets to decide what happens to her future.”`,
 choices:[['Explain a narrow test, then ask Elowen for her own decision.',{flag:'a7_witness_protocol',value:'ask_limited',stat:['heart',1]}],['Invite a protected delegate record without a test to bring the ending back.',{flag:'a7_witness_protocol',value:'delegate',stat:['wit',1]}],['Preserve her page securely; prepare containment without repair.',{flag:'a7_witness_protocol',value:'contain',stat:['courage',1]}]],
 consequence:s=>s.flags.a7_witness_protocol==='ask_limited'?`After hearing the exact stopping rule, Elowen says, “Yes—to one supervised test, and only with my guardian present. I can change my mind.” Pip records her specific permission without publishing her name.`:s.flags.a7_witness_protocol==='delegate'?`Elowen says, “I do not consent to restoring this page today. My guardian may record that decision, privately.” The refusal is protected and the plan moves forward.`:`Elowen exhales. “Thank you for not turning my future into your victory speech.” The page stays protected; the group will pursue a non-restoration defense.`,
 exit:`Restoration, when possible, requires a surviving anchor, a valid alternative, and permission freely given. A protective plan can still succeed when permission is withheld.`,next:'A7-03'});

mission({id:'A7-03',title:'The Coalition Table',zone:chapter7,art:'shop',
 arrival:s=>`The Midnight Bookshop has never hosted so many disagreeing guests. From ${sourceRoad(s)} arrive letters or delegates with different fears. Gretel brings a dated ledger; Tern brings court-certified records; Mara speaks only for residents who asked her to.`,
 activity:`Red demands safeguards against public scapegoating. Bram needs an actual schedule for moving supplies. Cinderella insists that sealed testimonies remain sealed. None offers an unlimited promise.\n\nPip pins four cards to a board: ENGINEERING, CIVIC COUNCIL, WITNESS PROTECTION, and LOCAL DELEGATES.`,
 observations:[['Read Bram’s bridge logistics and supply limits','Bram can move a small number of people or materials safely; earlier bridge repairs determine which route is available.',{flag:'a7_coalition_engineering_review',stat:['wit',1]}],['Hear the council and protected-witness conditions','A ruler cannot order a frightened servant or survivor to give up their privacy; participating communities set boundaries.',{flag:'a7_coalition_rights_review',stat:['heart',1]}]],
 issue:`One ambassador proposes promising everyone's help before anyone votes. The room goes quiet. Red says, “A promise given for other people is not a promise at all.”`,
 choices:[['Develop Bram’s practical rescue and calendar plan.',{flag:'a7_coalition_focus',value:'giant',stat:['wit',1]},hasTechnical],['Develop Cinderella’s council and protected testimony plan.',{flag:'a7_coalition_focus',value:'council',stat:['heart',1]},hasRoyal],['Develop the Wolf’s fair-witness protection plan.',{flag:'a7_coalition_focus',value:'wolf',stat:['heart',1]},hasWoods],['Ask local delegates to rebuild support without old alliances.',{flag:'a7_coalition_focus',value:'local',stat:['courage',1]}],['Build a modest coalition with strictly limited help.',{flag:'a7_coalition_focus',value:'general',stat:['wit',1]}]],
 consequence:s=>({'giant':'Bram offers a timetable, not a miracle. Jack volunteers to carry tools, provided he does not make another secret shortcut.','council':'Cinderella offers a meeting with sworn independent custodians. Nell will not be summoned without her own permission.','wolf':'The Wolf offers to track safe routes, but asks for a fair hearing before anyone labels another animal a villain.','local':'The communities request a new conversation rather than a royal order. The group agrees to make their own separate choices.','general':'The group offers bounded supply help and document preservation. No one signs away a community’s future.'})[s.flags.a7_coalition_focus]||'The coalition records its limits.',
 exit:`The coalition has a direction. Your next task turns that promise into something people can safely carry out.`,next:s=>({'giant':'A7-04','council':'A7-05','wolf':'A7-06','local':'REC-10','general':'A7-07'})[s.flags.a7_coalition_focus]||'A7-07'});

mission({id:'A7-04',title:'The Giant’s Tomorrow Plan',zone:chapter7,art:'bridge',
 arrival:s=>`Bram clears a table large enough for a bridge beam. Jack lays down three calendars. ${s.flags.a1_cloud_bridge_choice==='repair'?'Your earlier bridge repair has kept the upper crossing in service.':'The upper crossing has restrictions because the earlier Cloudreach rescue could not repair every support.'}`, 
 activity:`The machine might sever roads before someone can carry a protective anchor across them. Bram can supervise an engineering route through Cloudreach or use certified Archive deliveries. Both demand time, tools and a named custodian.`,
 puzzle:{question:'Which plan stays safe even if the cloud bridge cannot carry a full caravan?',answers:[['Send every person across at once and hope.',false,'A crowded bridge cannot support an unlimited evacuation.'],['Use weight-limited crossings or the Archive relay, with schedules recorded separately.',true,'Both are bounded methods that preserve a real contingency.'],['Reset the missing Fifthday so the repair happened earlier.',false,'Days cannot be rewound within the same telling.']],flag:'a7_bram_calendar_proven'},
 issue:`Jack offers to keep his involvement secret to avoid a second lecture about shortcuts. Bram says, “That would make your help impossible to verify.”`,
 choices:[['Use supervised repairs and Jack’s signed work log.',{flag:'a7_engineering_route',value:'repair',rel:['jack',1],stat:['wit',1]}],['Use an Archive relay with weights checked against a second record.',{flag:'a7_engineering_route',value:'archive',rel:['bram',1],stat:['courage',1]}]],
 consequence:`The timetable names exactly who will carry what, which route remains open, and what to do if the wind changes. Nothing in it relies on the missing day returning.`,
 exit:`A finite engineering commitment joins the coalition’s working plan.`,next:'A7-07'});

mission({id:'A7-05',title:'The Midnight Council Plan',zone:chapter7,art:'ballroom',
 arrival:`Cinderella receives you in a ballroom without dancers. The palace clock now keeps honest time, but the cabinet containing old witness statements remains locked.\n\n“I won’t make Nell perform her fear for a council,” Cinderella says.`,
 activity:`A council can authenticate public rules without revealing private testimony. Tern offers sealed copies; Gretel offers records dated by different people. Cinderella explains that one servant may choose to speak, but the court must be able to proceed without them.`,
 observations:[['Compare a public rule with its sealed supporting record','The council can verify the rule’s original source without reading a private person’s account aloud.',{flag:'a7_council_source_checked',stat:['wit',1]}],['Ask the palace about the original midnight promise','Cinderella’s earlier protective choices changed the format of testimony, not the records kept by different people required.',{flag:'a7_council_history_heard',stat:['heart',1]}]],
 issue:`An eager magistrate says that a strong royal order would be faster. “That is how we got into trouble in the first place,” Cinderella answers.`,
 choices:[['Convene a council with independent custodians and opt-out protection.',{flag:'a7_council_method',value:'protected',rel:['cinderella',1],stat:['heart',1]}],['Use local hearings with a sealed central evidence index.',{flag:'a7_council_method',value:'local',rel:['tern',1],stat:['wit',1]}]],
 consequence:`A legitimate council can question an order that broke the rules while protecting witnesses who never agreed to a stage. Cinderella offers to testify to her own actions.`,
 exit:`The coalition now has a civic defense with clear limits, ready to join the machine counterplan.`,next:'A7-07'});

mission({id:'A7-06',title:'The Wolf’s Witness Plan',zone:chapter7,art:'wolf',
 arrival:s=>`At the edge of Neverafter Woods, the Wolf meets you beside an unlit lantern. ${s.flags.wolf_approach==='accuse'?'He keeps a careful distance; an earlier accusation is not forgotten.':'He nods once, recognizing that you tried to listen before judging.'}`, 
 activity:`The Wolf can guide witnesses past false trails. But he will not turn himself into a symbol of every falsely accused person. Red offers to keep a physical-clue ledger. A messenger requests protected travel, not public fame.`,
 puzzle:{question:'What does the Wolf’s established pawprint comparison actually support?',answers:[['All wolves are innocent in every story.',false,'A single investigation cannot settle every other case.'],['This Wolf did not make the synthetic ink tracks examined in Neverafter.',true,'Physical comparison supports a specific, bounded finding.'],['The Ink Thief must be forgiven because the Wolf was cleared.',false,'One person’s exoneration never erases another’s responsibility.']],flag:'a7_wolf_hearing_checked'},
 issue:`The Wolf asks whether you will repeat the rumor at a public meeting. Red says, “Tell the truth and tell whose truth it is.”`,
 choices:[['Carry the physical exoneration with proper witness boundaries.',{flag:'a7_wolf_protection',value:'physical',rel:['wolf',1],stat:['wit',1]}],['Organize protected routes without requiring the Wolf’s speech.',{flag:'a7_wolf_protection',value:'routes',rel:['red',1],stat:['heart',1]}]],
 consequence:`A map of safe witness routes replaces the old accusation poster. The Wolf’s help has limits—and those limits make it real.`,
 exit:`The coalition gains a tested witness-protection approach.`,next:'A7-07'});

mission({id:'REC-10',title:'The Consent Circle',zone:'Act VII · Alliance Recovery',art:'village',
 arrival:`In a square overlooked by three little towers, delegates from isolated villages gather around a chalk circle. No throne stands in the middle.`,
 activity:`Several communities want safe roads while others prefer secrecy. Your job is not to persuade every person to join; it is to ask whether enough neighbors voluntarily support a limited rescue.`,
 observations:[['Listen to the residents requesting safe travel','The first community can help carry supplies but asks that its exact location remain private.',{flag:'a7_local_road_support',stat:['heart',1]}],['Hear the residents who decline involvement','The second community refuses public participation. Its refusal is recorded without marking anyone disloyal.',{flag:'a7_local_opt_out',stat:['wit',1]}]],
 issue:`The third group offers supervised lantern signaling only. Pip looks around. “Three different answers,” he says. “And a plan we can actually keep.”`,
 choices:[['Record three separate answers and use only granted support.',{flag:'a7_local_support',value:'limited',stat:['heart',1]}],['Assign independent custodians to preserve the protected consent ledger.',{flag:'a7_local_support',value:'custodians',stat:['wit',1]}]],
 consequence:`The small plan is more reliable than a forged universal promise. People who refused are not erased from the map or treated as enemies.`,
 exit:`The limited delegate agreement goes to the coalition table.`,next:'A7-07'});

mission({id:'A7-07',title:'The King’s Weak Point',zone:chapter7,art:'engine',
 arrival:`At the restoration table Pip spreads three gears cut from cardboard: SORTER, BINDER, ROAD-CUTTER. Quill places the court’s order checked against the original beside them.\n\n“The King depends on all three,” she says. “What happens if one remains dangerous?”`,
 activity:`The sorter chooses which stories are targeted. The binder declares one version official. The road-cutter severs access to alternatives. The bell is not attached to these gears.\n\nYour coalition’s plan must either isolate each dangerous function or protect people while disabling the machine.`,
 puzzle:{question:'Which counterplan responds to the machine’s actual three dependencies?',answers:[['Ring the thirteenth bell thirteen times to erase the King.',false,'The bell is an alarm and cannot defeat someone by force.'],['Protect the affected anchors, interrupt sorting and binding, and safeguard the connected roads.',true,'The approach addresses all three functions without using consent as a lever.'],['Replace the King with a kinder single ruler over every ending.',false,'Compulsory one-story rule caused the original White Silence.']],flag:'a7_counterplan_mapped'},
 issue:`Mara says that erased-road families should have their own vote before a road is opened. In a legitimately completed later telling, survivors can suggest a very different technical route—if their separate consent survives scrutiny.`,
 choices:[['Keep a bounded, coordinated defense and prepare its logistics.',{flag:'a7_counterplan_branch',value:'ordinary',stat:['wit',1]}],['Explore the independently authorized survivor shared plan written by the survivors.',{flag:'a7_counterplan_branch',value:'survivors',stat:['heart',1]},echoCouncil]],
 consequence:s=>s.flags.a7_counterplan_branch==='survivors'?`Mara contacts her own community, not every erased-road resident. A separate set of permissions must be obtained before this route can be proposed.`:`Pip writes three protections on the board. None depends on the bell rewriting history or on the party controlling every possible future.`,
 exit:`The group begins the final feasibility review. It is still a plan, not a victory.`,next:s=>s.flags.a7_counterplan_branch==='survivors'&&echoCouncil(s)?'A7-X01':'A7-08'});

mission({id:'A7-X01',title:'The Choice of Those Left Out',zone:'Act VII · Legacy Survivor Road',art:'margin',
 arrival:`A verified neighboring telling brings you to Mara’s council beneath an old bridge. Three unrecorded settlements have sent separate delegates. One chair stays empty by request.`,
 activity:`The settlements disagree about whether opening old roads is safe. The empty chair belongs to a village that declined; its choice must not be converted into a yes.`,
 observations:[['Hear the trade-route delegates','They authorize a strictly limited supply crossing, not an open map of their homes.',{flag:'a7_survivor_trade',stat:['wit',1]}],['Hear the families requesting privacy','They support a protective machine shutdown but decline any public renaming or relocation.',{flag:'a7_survivor_privacy',stat:['heart',1]}]],
 issue:`A speaker proposes treating silence as agreement. Mara refuses to put that motion to a vote.`,
 choices:[['Record the refused seat and separate the positive permissions.',{flag:'a7_survivor_choice',value:'separate',stat:['heart',1]}],['Set explicit limits on trade, access, and publication.',{flag:'a7_survivor_choice',value:'bounded',stat:['wit',1]}]],
 consequence:`The council has fewer signatures than the King demanded, but every signature means something.`,
 exit:`The authorized communities invite you to examine three independently maintained road anchors.`,next:'A7-X02'});

mission({id:'A7-X02',title:'Three Anchors, No Monarch',zone:'Act VII · Legacy Survivor Road',art:'echo',
 arrival:`Three lanterns hang over a bridge that exists in three different local maps. Each community kept its own anchor after the road was omitted from the royal copy.`,
 activity:`One anchor is a bridge-plank date, another a birth announcement kept privately, and the third a public ferry schedule. Their custody chains differ.`,
 puzzle:{question:'Why must all three anchors be checked separately?',answers:[['A royal certificate makes every community’s copy true.',false,'A crown cannot replace clues collected separately or local permission.'],['They are independent historical records tied to communities granting different levels of access.',true,'Separate evidence and consent keep the new charter from repeating the old edict.'],['Three is a magic number that guarantees success.',false,'A count alone is not proof of authenticity.']],flag:'a7_three_anchors_verified'},
 issue:`The private family will let a custodian certify a date but not reveal the child’s name. You may still use the aggregate proof.`,
 choices:[['Use bounded custodial attestations and keep identities sealed.',{flag:'a7_three_anchor_policy',value:'sealed',stat:['heart',1]}],['Build a public route from only the openly released records.',{flag:'a7_three_anchor_policy',value:'public_only',stat:['wit',1]}]],
 consequence:`Three independent anchors show a viable bypass, but no one has yet authorized operating it on their behalf.`,
 exit:`The delegate council must now approve—or refuse—the written shared plan written by the survivors.`,next:'A7-X03'});

mission({id:'A7-X03',title:'An Unwritten Counter-Charter',zone:'Act VII · Legacy Survivor Road',art:'orders',
 arrival:`The council writes a charter on three detachable leaves. Every community may remove its own leaf without invalidating the others.`,
 activity:`The charter proposes a survivor-led bypass of the central tower, with named safeguards and no permission to restore anyone’s private page. Participants read the plan aloud in their own words.`,
 observations:[['Compare each offered signature to its delegate’s authorization','Signatures are limited by settlement, purpose, and duration. The absent community has no forged signature.',{flag:'a7_charter_authority_checked',stat:['wit',1]}],['Read the withdrawal and stopping conditions','Any consenting community can stop its own participation. The plan does not order the others to continue.',{flag:'a7_charter_stop_checked',stat:['heart',1]}]],
 issue:`The chair asks each present delegate individually, rather than saying the council agrees as a whole. The two participants agree to a protected bypass test. The third declines.`,
 choices:[['Accept a limited charter signed only by consenting communities.',{flag:'a7_survivor_charter',value:'limited',stat:['heart',1]}],['Require separate custodians for each authorization and seal.',{flag:'a7_survivor_charter',value:'custodial',stat:['wit',1]}]],
 consequence:`The survivor-led plan becomes eligible for consideration. It remains optional, revocable, and limited to its signatories.`,
 exit:`The shared plan written by the survivors joins the honest plan board beside the ordinary routes.`,next:'A7-08'});

mission({id:'A7-08',title:'The Honest Plan Board',zone:chapter7,art:'catalog',
 arrival:`Pip opens an enormous board titled POSSIBLE ENDINGS. Twelve empty spaces wait at its far edge. None is marked EARNED; the coming final act will determine which outcome is actually achieved.`,
 activity:s=>`Your clues show a realistic plan—not a guaranteed ending.\n\nCurrently available preparation routes:\n${finalOptions(s)}\n\nTwelve possible ending families (NONE EARNED YET):\n${finalePreview(s)}\n\nThis is a plan preview, not an unlock screen. The final act must verify each gate separately. Protected testimony stays private.`,
 observations:[['Inspect what still needs consent and verified sources','The board separates evidence checked against the original, what the witness agreed to share, available materials and unearned future outcomes.',{flag:'a7_plan_audit_seen',stat:['wit',1]}],['Read the list of plans that must never be offered','No mass rewrite, forced testimony, or magically costless reset can be selected as an acceptable ending.',{flag:'a7_plan_limits_seen',stat:['heart',1]}]],
 issue:`“Could we promise the very best ending now?” Pip asks. Quill shakes her head. “We can promise to try. We can’t promise other people’s choices.”`,
 choices:[['Prepare the ordinary containment and witness-safety plan.',{flag:'a7_strategy_requested',value:'containment',stat:['courage',1]}],['Prepare the coalition-coordinated machine shutdown.',{flag:'a7_strategy_requested',value:'coalition',stat:['wit',1]}],['Prepare Elowen’s specifically authorized small test to bring the ending back.',{flag:'a7_strategy_requested',value:'limited_restore',stat:['heart',1]},s=>s.flags.a7_affected_permission==='limited_test'],['Prepare the voluntary survivor-led bypass.',{flag:'a7_strategy_requested',value:'survivors',stat:['heart',1]},s=>!!s.flags.a7_survivor_charter],['Recover missing supplies and finish a fair fallback plan.',{flag:'a7_strategy_requested',value:'repair',stat:['wit',1]}]],
 consequence:s=>s.flags.a7_strategy_requested==='repair'?`Pip circles the unfilled feasibility squares. “Then we go find out what we actually need, rather than pretending the plan is ready.”`:`Your preferred strategy receives a pencil outline, not a victory seal. A basic protective method remains available if an optional ally later says no.`,
 exit:`The next steps are explicit: verify supplies, choose companions, confirm permissions and travel safely to the last confrontation.`,next:s=>s.flags.a7_strategy_requested==='repair'?'REC-12':'A7-09'});

mission({id:'REC-12',title:'Final Plan Rehabilitation',zone:'Act VII · Fair Strategy Recovery',art:'preservation',
 arrival:`Quill lays a modest survival plan beside the grander designs. It needs no royal privilege: a protected anchor store, evacuation signposts, and a way to interrupt dangerous gears without using the thirteenth bell as a weapon.`,
 activity:`Three crates hold tools, sealed evidence envelopes, and a route map. None contains a magic solution to another person’s consent. You must identify which materials actually address the threats.`,
 puzzle:{question:'What is the minimum defensible approach if optional alliances fail?',answers:[['Force every witness to join so the party has enough power.',false,'Forced permission is not permission.'],['Protect the surviving anchors, secure safe routes, and target the machine’s three harmful operations.',true,'The plan works without compulsory witnesses or a secret lucky item.'],['Ignore the road-cutter and hope the binder fixes itself.',false,'Every independently harmful component needs a response.']],flag:'a7_fallback_proven'},
 issue:`Pip offers to carry the supplies, but there are more crates than he can lift. A cart can make the journey with no rare artifact required.`,
 choices:[['Choose a supply cart and posted evacuation markers.',{flag:'a7_fallback_method',value:'cart',item:'Emergency Route Kit',stat:['wit',1]}],['Have Quill coordinate the protected anchor store.',{flag:'a7_fallback_method',value:'anchor_store',item:'Emergency Route Kit',stat:['heart',1]}]],
 consequence:`The plan is slower than a heroic charge but defensible. It gives every participant a way to refuse tasks outside their promise.`,
 exit:`The repaired ordinary strategy is ready for party and travel preparation.`,next:s=>s.flags.a8_final_started?'A8-05':'A7-09'});

mission({id:'A7-09',title:'The Repair Caravan',zone:chapter7,art:'village',
 arrival:`Lanterns gather in front of the Midnight Bookshop. People who disagreed at the table are now checking ropes, maps, blankets and evidence boxes.\n\nTwo companions can travel beside you; the others will have jobs at safe stations.`,
 activity:s=>`Pip can oversee records. Red can track safe forest paths. Jack and Bram can handle load limits. Cinderella and Gretel can keep independent testimony intact. Mara speaks only for consenting settlements.\n\nYour earlier route—${sourceRoad(s)}—changes which friend recognizes the hardest part of this work.`,
 observations:[['Check each companion’s actual assignment','Every assignment is finite: guide, carry, authenticate, protect, or signal. No companion is ordered to grant someone else’s consent.',{flag:'a7_assignments_checked',stat:['wit',1]}],['Review the route markers and supply pack','The party has an anchored return path and a protected plan B. A companion can decline without creating a softlock.',{flag:'a7_supplies_checked',item:'Caravan Markers',stat:['heart',1]}]],
 issue:`Red offers to go ahead. Jack volunteers to carry heavy equipment. Cinderella says she would rather guard testimony than swing a sword. Pip offers to be two companions at once, which Quill rules out on grounds of “basic mouse geometry.”`,
 choices:[['Travel with Red and Pip; put others on protected relay duty.',{flag:'a7_travel_party',value:'red_pip',stat:['heart',1]}],['Travel with Jack and Bram; keep safe witness custodians behind.',{flag:'a7_travel_party',value:'jack_bram',stat:['courage',1]}],['Travel with Cinderella and Gretel; prioritize documented consent.',{flag:'a7_travel_party',value:'cinder_gretel',stat:['wit',1]}],['Travel with Pip and a neutral route steward.',{flag:'a7_travel_party',value:'pip_steward',stat:['wit',1]}]],
 consequence:s=>`The traveling pair is ${({'red_pip':'Red and Pip','jack_bram':'Jack and Bram','cinder_gretel':'Cinderella and Gretel','pip_steward':'Pip and a local steward'})[s.flags.a7_travel_party]||'Pip and a steward'}. Others still have meaningful duties. The party confirms a stopping rule before anyone leaves.`,
 exit:`The caravan has a real route, bounded tasks, and enough supplies to return. The last decision is where to enter the final night.`,next:'A7-10'});

mission({id:'A7-10',title:'The Choice to Go',zone:chapter7,art:'landscape',
 arrival:`The Storyfold’s skyline glimmers beyond the bookshop window. Somewhere in the Margin, the sorter is still selecting endings, the binder is still narrowing futures, and the road-cutter is still separating neighbors.\n\nTonight the party travels. Tomorrow it must act.`,
 activity:s=>`Quill asks you to repeat your plan without pretending to know what the King will choose.\n\nChosen preparation: ${s.flags.a7_strategy_requested==='limited_restore'?'one protected, revocable test to bring the ending back':s.flags.a7_strategy_requested==='survivors'?'a limited survivor-led bypass':s.flags.a7_strategy_requested==='coalition'?'a coordinated machine shutdown':s.flags.a7_strategy_requested==='repair'?'a recovered, ordinary defense':'a guarded containment approach'}.\nCompanions: ${s.flags.a7_travel_party||'not yet named'}.`,
 puzzle:{question:'Which statement can you honestly make before the final confrontation?',answers:[['We already won because the court ruled for us.',false,'The court ruling did not stop the ending-stealing machine.'],['We have an authorized plan, protected fallback and limits. Its outcome still depends on what happens next.',true,'Prepared is not the same as victorious.'],['The thirteenth bell will rewrite every future without anyone choosing.',false,'The bell warns; it does not compel new endings.']],flag:'a7_final_readiness_checked'},
 issue:`The King sent an offer: hand him your maps, and he will promise a single safe ending for everyone. The friends beside you wait without speaking for you.`,
 choices:[['Refuse compulsory safety and go with the prepared plan.',{flag:'a7_final_approach',value:'principled',stat:['courage',1]}],['Invite the King to explain himself, but reject control over others.',{flag:'a7_final_approach',value:'parley',stat:['heart',1]}],['Secure the retreat route before stepping into the Margin.',{flag:'a7_final_approach',value:'cautious',stat:['wit',1]}]],
 consequence:`The lanterns brighten along the route. No one says you have chosen everyone’s ending. You have chosen to defend their right to make one.`,
 exit:`ACT VII COMPLETE · THE STORY THAT CHOSE YOU. The plan, companions, witness rights and fallback are saved. The final confrontation and twelve canonical ending families remain Act VIII work.`,next:'HUB-07'});

mission({id:'HUB-07',title:'Final Night at the Bookshop',zone:'Bookshop Interlude · Act VII Complete',art:'shop',
 arrival:s=>`The Midnight Bookshop’s bell gives one soft chime. On the reading table are your evidence boxes, authenticated striker drawing, limited companion promises, and the plan for the King’s three-part machine.\n\nPip writes tomorrow's first question beneath the heading FINAL NIGHT: “Who gets to choose what comes next?”`,
 activity:s=>`ACT VII CHECKPOINT. Chosen party: ${s.flags.a7_travel_party||'still being organized'}. Strategy: ${s.flags.a7_strategy_requested||'ordinary containment'}. Witness approach: ${s.flags.a7_witness_protocol||'protect first'}.\n\nThe public court record and individual privacy instructions are separate. This is a real save checkpoint, not a Book One ending or a New Game Plus unlock.`,
 observations:[['Review the final strategy and protected evidence ledger','Your plan is logged alongside its alternative and recovery route. Required sources retain custodians and provenance.',{flag:'a7_final_journal_audit',stat:['wit',1]}],['Leave a note for the allies staying behind','The people not traveling have genuine tasks: relay messages, protect households and keep the records independent.',{flag:'a7_allies_farewell',stat:['heart',1]}]],
 issue:`Quill closes the door for the night. “You have no guarantee,” she says. “You have a reason, a plan, and people who made their own promises. That will have to be enough.”`,
 choices:[['Ask Pip to mark all chapter choices in the journal.',{flag:'a7_last_note',value:'journal',stat:['wit',1]}],['Thank the allies who chose to help and those who chose to stay.',{flag:'a7_last_note',value:'thanks',stat:['heart',1]}]],
 consequence:`The bookshop’s front window glows. For one quiet moment, the place where your story began feels large enough to hold every road beyond it.`,
 exit:`The last night at the bookshop is over. Everything you have chosen is recorded. The tower awaits, and your companions travel beside you by choice.`,next:'A8-01'});

Object.assign(EVIDENCE_INFO,{
 'EV-C15':{title:'Verified Bell Striker Diagram',meaning:'Bell is a warning about removed possibilities, not the energy source or off-switch of the ending-stealing machine.',family:'Original striker diagram or independently attested apprentice drawing'}
});
