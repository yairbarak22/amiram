/* ==========================================================================
   לומדת אמיר"ם / אמירנט — Application logic
   Vanilla JS · localStorage persistence · event delegation
   ========================================================================== */
(function () {
'use strict';

/* =======================================================================
   1) DATA — content banks
   ======================================================================= */

// ---- Vocabulary ----
const VOCAB = [
  // connectors
  { id:'although', cat:'connectors', en:'although', he:'למרות ש־', ex:'Although it was raining, we went out.' },
  { id:'however', cat:'connectors', en:'however', he:'אולם / עם זאת', ex:'The plan was risky; however, it succeeded.' },
  { id:'nevertheless', cat:'connectors', en:'nevertheless', he:'אף על פי כן', ex:'It was late; nevertheless, they kept working.' },
  { id:'despite', cat:'connectors', en:'despite', he:'למרות (+ שם עצם)', ex:'Despite the rain, the game continued.' },
  { id:'whereas', cat:'connectors', en:'whereas', he:'בעוד ש־ / ואילו', ex:'He likes tea, whereas she prefers coffee.' },
  { id:'therefore', cat:'connectors', en:'therefore', he:'לכן', ex:'The data was clear; therefore, the conclusion was obvious.' },
  { id:'thus', cat:'connectors', en:'thus', he:'לפיכך / כך', ex:'He trained hard and thus won the race.' },
  { id:'consequently', cat:'connectors', en:'consequently', he:'כתוצאה מכך', ex:'Costs rose; consequently, prices increased.' },
  { id:'moreover', cat:'connectors', en:'moreover', he:'יתרה מזאת', ex:'The car is fast; moreover, it is fuel-efficient.' },
  { id:'furthermore', cat:'connectors', en:'furthermore', he:'יתר על כן', ex:'The theory is elegant; furthermore, it is well supported.' },
  { id:'in_addition', cat:'connectors', en:'in addition', he:'בנוסף', ex:'In addition to English, she speaks French.' },
  { id:'for_instance', cat:'connectors', en:'for instance', he:'לדוגמה', ex:'Some animals, for instance dolphins, are highly intelligent.' },
  { id:'unless', cat:'connectors', en:'unless', he:'אלא אם כן', ex:'You will fail unless you study.' },
  { id:'otherwise', cat:'connectors', en:'otherwise', he:'אחרת', ex:'Hurry, otherwise we will be late.' },
  { id:'indeed', cat:'connectors', en:'indeed', he:'אכן / למעשה', ex:'The test was hard; indeed, few passed.' },
  { id:'conversely', cat:'connectors', en:'conversely', he:'לעומת זאת / להיפך', ex:'Sales rose in summer; conversely, they fell in winter.' },
  // phrasal
  { id:'give_up', cat:'phrasal', en:'give up', he:'לוותר', ex:'Do not give up before you try.' },
  { id:'carry_out', cat:'phrasal', en:'carry out', he:'לבצע', ex:'The team carried out the experiment carefully.' },
  { id:'point_out', cat:'phrasal', en:'point out', he:'לציין / להצביע על', ex:'She pointed out a serious flaw in the plan.' },
  { id:'turn_down', cat:'phrasal', en:'turn down', he:'לדחות (הצעה)', ex:'He turned down the job offer.' },
  { id:'rule_out', cat:'phrasal', en:'rule out', he:'לשלול (אפשרות)', ex:'Doctors ruled out a serious illness.' },
  { id:'account_for', cat:'phrasal', en:'account for', he:'להסביר / להוות', ex:'This factor accounts for most of the change.' },
  { id:'bring_about', cat:'phrasal', en:'bring about', he:'לגרום ל־', ex:'The reform brought about major change.' },
  { id:'come_across', cat:'phrasal', en:'come across', he:'להיתקל ב־', ex:'I came across an interesting article.' },
  { id:'put_off', cat:'phrasal', en:'put off', he:'לדחות (בזמן)', ex:'They put off the meeting until Friday.' },
  { id:'figure_out', cat:'phrasal', en:'figure out', he:'להבין / לפענח', ex:'She figured out the solution quickly.' },
  { id:'set_up', cat:'phrasal', en:'set up', he:'להקים / להגדיר', ex:'They set up a new laboratory.' },
  { id:'look_into', cat:'phrasal', en:'look into', he:'לבדוק / לחקור', ex:'The police will look into the matter.' },
  // academic
  { id:'significant', cat:'academic', en:'significant', he:'משמעותי', ex:'There was a significant rise in temperature.' },
  { id:'approach', cat:'academic', en:'approach', he:'גישה / לגשת', ex:'The study used a new approach.' },
  { id:'consist', cat:'academic', en:'consist of', he:'מורכב מ־', ex:'Water consists of hydrogen and oxygen.' },
  { id:'occur', cat:'academic', en:'occur', he:'להתרחש', ex:'The reaction occurs at high temperature.' },
  { id:'factor', cat:'academic', en:'factor', he:'גורם', ex:'Cost is an important factor.' },
  { id:'establish', cat:'academic', en:'establish', he:'לבסס / להקים', ex:'The study established a clear link.' },
  { id:'indicate', cat:'academic', en:'indicate', he:'להצביע על / לרמז', ex:'The results indicate a strong trend.' },
  { id:'derive', cat:'academic', en:'derive', he:'להפיק / לגזור', ex:'The word is derived from Latin.' },
  { id:'sufficient', cat:'academic', en:'sufficient', he:'מספיק', ex:'There was not sufficient evidence.' },
  { id:'evident', cat:'academic', en:'evident', he:'ברור / גלוי', ex:'It was evident that he was tired.' },
  { id:'imply', cat:'academic', en:'imply', he:'לרמוז', ex:'Her silence implied disagreement.' },
  { id:'assume', cat:'academic', en:'assume', he:'להניח', ex:'We cannot assume the results are correct.' },
  { id:'contradict', cat:'academic', en:'contradict', he:'לסתור', ex:'The new data contradicts the old theory.' },
  { id:'conclusive', cat:'academic', en:'conclusive', he:'חד־משמעי', ex:'The evidence was conclusive.' },
  { id:'consistent', cat:'academic', en:'consistent', he:'עקבי / תואם', ex:'His story was consistent with the facts.' },
  { id:'undermine', cat:'academic', en:'undermine', he:'לערער / להחליש', ex:'The scandal undermined public trust.' },
  { id:'curb', cat:'academic', en:'curb', he:'לרסן / לבלום', ex:'New rules aim to curb pollution.' },
  { id:'intermittent', cat:'academic', en:'intermittent', he:'לסירוגין / לא רציף', ex:'Solar power is intermittent.' },
  { id:'consolidate', cat:'academic', en:'consolidate', he:'לגבש / לחזק', ex:'Sleep helps consolidate memories.' },
  { id:'flawed', cat:'academic', en:'flawed', he:'פגום', ex:'The experiment was flawed.' },
  { id:'reserved', cat:'academic', en:'reserved', he:'מופנם / שמור', ex:'She is quiet and reserved.' },
  { id:'tedious', cat:'academic', en:'tedious', he:'מייגע / משעמם', ex:'The lecture was long and tedious.' },
  { id:'setback', cat:'academic', en:'setback', he:'עיכוב / נסיגה', ex:'The project suffered a serious setback.' },
  { id:'alleviate', cat:'academic', en:'alleviate', he:'להקל', ex:'The drug helps alleviate pain.' },
  { id:'reluctant', cat:'academic', en:'reluctant', he:'מסויג / לא מוכן', ex:'He was reluctant to agree.' },
  { id:'abundant', cat:'academic', en:'abundant', he:'שופע / רב', ex:'Water is abundant in this region.' },
  { id:'deteriorate', cat:'academic', en:'deteriorate', he:'להידרדר', ex:'Her health began to deteriorate.' },
  { id:'inevitable', cat:'academic', en:'inevitable', he:'בלתי נמנע', ex:'Change was inevitable.' },
  { id:'plausible', cat:'academic', en:'plausible', he:'סביר / מתקבל על הדעת', ex:'That is a plausible explanation.' },
  { id:'scarce', cat:'academic', en:'scarce', he:'נדיר / מועט', ex:'Fresh water is scarce in the desert.' },
  // confusing
  { id:'postpone', cat:'confusing', en:'postpone', he:'לדחות בזמן (≠ לבטל)', ex:'They postponed the trip to next week.' },
  { id:'cancel', cat:'confusing', en:'cancel', he:'לבטל לגמרי', ex:'They cancelled the trip completely.' },
  { id:'argue', cat:'confusing', en:'argue', he:'לטעון (לא רק לריב)', ex:'The author argues that the theory is wrong.' },
  { id:'address', cat:'confusing', en:'address', he:'לטפל בנושא / לפנות', ex:'The report addresses the problem of poverty.' },
  { id:'novel', cat:'confusing', en:'novel', he:'חדשני / רומן', ex:'They proposed a novel solution.' },
  { id:'appreciate', cat:'confusing', en:'appreciate', he:'להעריך / להבין', ex:'I appreciate the difficulty of the task.' },
  { id:'barely', cat:'confusing', en:'barely', he:'בקושי', ex:'He could barely read the faded text.' },
  { id:'rather', cat:'confusing', en:'rather', he:'למדי / במקום', ex:'It was rather cold. She walked rather than drove.' },

  // ---- 100 high-value additions ----
  // connectors
  { id:'hence', cat:'connectors', en:'hence', he:'לפיכך / מכאן', ex:'The data was incomplete; hence, the study was repeated.' },
  { id:'accordingly', cat:'connectors', en:'accordingly', he:'בהתאם לכך', ex:'The rules changed, and the team acted accordingly.' },
  { id:'albeit', cat:'connectors', en:'albeit', he:'הגם ש / אם כי', ex:'It was a useful, albeit expensive, solution.' },
  { id:'instead', cat:'connectors', en:'instead', he:'במקום זאת', ex:'The meeting was cancelled; they met online instead.' },
  { id:'besides', cat:'connectors', en:'besides', he:'חוץ מזה / מלבד', ex:'Besides math, she studies physics.' },
  { id:'meanwhile', cat:'connectors', en:'meanwhile', he:'בינתיים', ex:'He cooked dinner; meanwhile, she set the table.' },
  { id:'thereby', cat:'connectors', en:'thereby', he:'ובכך', ex:'They cut costs, thereby increasing profit.' },
  { id:'regardless', cat:'connectors', en:'regardless', he:'ללא קשר / בכל מקרה', ex:'He continued regardless of the risks.' },
  { id:'namely', cat:'connectors', en:'namely', he:'כלומר / דהיינו', ex:'One factor, namely cost, was ignored.' },
  { id:'notably', cat:'connectors', en:'notably', he:'במיוחד / באופן בולט', ex:'Several cities, notably Tokyo, joined the plan.' },
  // phrasal
  { id:'bring_up', cat:'phrasal', en:'bring up', he:'להעלות (נושא) / לגדל', ex:'She brought up an important point.' },
  { id:'carry_on', cat:'phrasal', en:'carry on', he:'להמשיך', ex:'They carried on working despite the noise.' },
  { id:'put_forward', cat:'phrasal', en:'put forward', he:'להציע (רעיון/הצעה)', ex:'He put forward a new theory.' },
  { id:'take_on', cat:'phrasal', en:'take on', he:'לקחת על עצמו', ex:'The company took on more workers.' },
  { id:'break_down', cat:'phrasal', en:'break down', he:'להתפרק / לנתח לגורמים', ex:'Let us break down the problem into steps.' },
  { id:'come_up_with', cat:'phrasal', en:'come up with', he:'להעלות רעיון / להמציא', ex:'She came up with a clever solution.' },
  { id:'give_in', cat:'phrasal', en:'give in', he:'להיכנע', ex:'After a long debate, he gave in.' },
  { id:'turn_out', cat:'phrasal', en:'turn out', he:'להתברר', ex:'The rumor turned out to be false.' },
  { id:'rely_on', cat:'phrasal', en:'rely on', he:'להסתמך על', ex:'We rely on accurate data.' },
  { id:'deal_with', cat:'phrasal', en:'deal with', he:'להתמודד עם / לטפל ב', ex:'The report deals with climate change.' },
  { id:'result_in', cat:'phrasal', en:'result in', he:'לגרום ל / להוביל ל', ex:'The error resulted in a delay.' },
  { id:'lead_to', cat:'phrasal', en:'lead to', he:'להוביל ל', ex:'Poor planning can lead to failure.' },
  { id:'draw_on', cat:'phrasal', en:'draw on', he:'להסתמך על / לשאוב מ', ex:'The author draws on personal experience.' },
  { id:'stem_from', cat:'phrasal', en:'stem from', he:'לנבוע מ', ex:'The problem stems from a lack of funding.' },
  { id:'hold_back', cat:'phrasal', en:'hold back', he:'לעכב / לרסן', ex:'Fear held her back from trying.' },
  // academic
  { id:'acquire', cat:'academic', en:'acquire', he:'לרכוש / לקנות', ex:'Children acquire language quickly.' },
  { id:'assess', cat:'academic', en:'assess', he:'להעריך / לאמוד', ex:'The exam assesses reading skills.' },
  { id:'attribute', cat:'academic', en:'attribute', he:'לייחס', ex:'She attributed her success to hard work.' },
  { id:'comprise', cat:'academic', en:'comprise', he:'לכלול / מורכב מ', ex:'The book comprises ten chapters.' },
  { id:'constitute', cat:'academic', en:'constitute', he:'להוות', ex:'These changes constitute a major reform.' },
  { id:'crucial', cat:'academic', en:'crucial', he:'מכריע / חיוני', ex:'Timing is crucial in this experiment.' },
  { id:'demonstrate', cat:'academic', en:'demonstrate', he:'להדגים / להראות', ex:'The study demonstrates a clear trend.' },
  { id:'diminish', cat:'academic', en:'diminish', he:'להפחית / לקטון', ex:'Interest in the topic gradually diminished.' },
  { id:'distinct', cat:'academic', en:'distinct', he:'נבדל / ברור', ex:'There are three distinct groups.' },
  { id:'emerge', cat:'academic', en:'emerge', he:'להופיע / לצוץ', ex:'New evidence has emerged.' },
  { id:'emphasize', cat:'academic', en:'emphasize', he:'להדגיש', ex:'The report emphasizes the need for reform.' },
  { id:'enhance', cat:'academic', en:'enhance', he:'לשפר / לשדרג', ex:'Sleep can enhance memory.' },
  { id:'ensure', cat:'academic', en:'ensure', he:'להבטיח / לוודא', ex:'Please ensure the door is locked.' },
  { id:'exceed', cat:'academic', en:'exceed', he:'לעלות על / לחרוג', ex:'Demand exceeded supply.' },
  { id:'facilitate', cat:'academic', en:'facilitate', he:'להקל / לאפשר', ex:'Technology can facilitate learning.' },
  { id:'fundamental', cat:'academic', en:'fundamental', he:'יסודי / בסיסי', ex:'There is a fundamental difference between them.' },
  { id:'generate', cat:'academic', en:'generate', he:'לייצר / להפיק', ex:'Solar panels generate electricity.' },
  { id:'hypothesis', cat:'academic', en:'hypothesis', he:'השערה', ex:'The experiment tested a simple hypothesis.' },
  { id:'impose', cat:'academic', en:'impose', he:'לכפות / להטיל', ex:'The government imposed new taxes.' },
  { id:'incentive', cat:'academic', en:'incentive', he:'תמריץ', ex:'Bonuses provide an incentive to work harder.' },
  { id:'inherent', cat:'academic', en:'inherent', he:'טבוע / מובנה', ex:'There are inherent risks in any investment.' },
  { id:'initiate', cat:'academic', en:'initiate', he:'ליזום / להתחיל', ex:'They initiated a new program.' },
  { id:'integrate', cat:'academic', en:'integrate', he:'לשלב / לאחד', ex:'The system integrates several tools.' },
  { id:'interpret', cat:'academic', en:'interpret', he:'לפרש', ex:'It is hard to interpret these results.' },
  { id:'justify', cat:'academic', en:'justify', he:'להצדיק', ex:'The high costs are hard to justify.' },
  { id:'maintain', cat:'academic', en:'maintain', he:'לשמר / לטעון', ex:'She maintains that the theory is correct.' },
  { id:'modify', cat:'academic', en:'modify', he:'לשנות / להתאים', ex:'They modified the design slightly.' },
  { id:'notion', cat:'academic', en:'notion', he:'מושג / רעיון', ex:'He rejected the notion entirely.' },
  { id:'obtain', cat:'academic', en:'obtain', he:'להשיג', ex:'Researchers obtained similar results.' },
  { id:'persist', cat:'academic', en:'persist', he:'להתמיד / להימשך', ex:'The symptoms persisted for weeks.' },
  { id:'phenomenon', cat:'academic', en:'phenomenon', he:'תופעה', ex:'This is a common natural phenomenon.' },
  { id:'prominent', cat:'academic', en:'prominent', he:'בולט / מוביל', ex:'She is a prominent scientist.' },
  { id:'pursue', cat:'academic', en:'pursue', he:'לרדוף אחר / לחתור ל', ex:'He decided to pursue a career in law.' },
  { id:'reinforce', cat:'academic', en:'reinforce', he:'לחזק / לתגבר', ex:'The findings reinforce earlier studies.' },
  { id:'reveal', cat:'academic', en:'reveal', he:'לחשוף / לגלות', ex:'The study revealed a surprising result.' },
  { id:'subsequent', cat:'academic', en:'subsequent', he:'עוקב / מאוחר יותר', ex:'The error affected all subsequent steps.' },
  { id:'substantial', cat:'academic', en:'substantial', he:'ניכר / משמעותי', ex:'There was a substantial increase in sales.' },
  { id:'tendency', cat:'academic', en:'tendency', he:'נטייה', ex:'He has a tendency to exaggerate.' },
  { id:'utilize', cat:'academic', en:'utilize', he:'לנצל / לעשות שימוש', ex:'The plant utilizes solar energy.' },
  { id:'vary', cat:'academic', en:'vary', he:'להשתנות / לגוון', ex:'Prices vary from store to store.' },
  { id:'vital', cat:'academic', en:'vital', he:'חיוני', ex:'Water is vital for life.' },
  { id:'widespread', cat:'academic', en:'widespread', he:'נפוץ / רחב היקף', ex:'The belief is widespread.' },
  { id:'anticipate', cat:'academic', en:'anticipate', he:'לצפות / לחזות מראש', ex:'We did not anticipate such demand.' },
  { id:'compensate', cat:'academic', en:'compensate', he:'לפצות', ex:'Nothing can compensate for the loss.' },
  { id:'component', cat:'academic', en:'component', he:'רכיב', ex:'Each component was tested separately.' },
  { id:'comprehensive', cat:'academic', en:'comprehensive', he:'מקיף', ex:'The book gives a comprehensive overview.' },
  { id:'controversial', cat:'academic', en:'controversial', he:'שנוי במחלוקת', ex:'The decision was highly controversial.' },
  { id:'deliberate', cat:'academic', en:'deliberate', he:'מכוון / מחושב', ex:'It was a deliberate attempt to mislead.' },
  { id:'discern', cat:'academic', en:'discern', he:'להבחין', ex:'It was hard to discern the difference.' },
  { id:'eliminate', cat:'academic', en:'eliminate', he:'לחסל / להעלים', ex:'The new method eliminates errors.' },
  { id:'encompass', cat:'academic', en:'encompass', he:'להקיף / לכלול', ex:'The course encompasses many topics.' },
  { id:'exploit', cat:'academic', en:'exploit', he:'לנצל', ex:'They exploited a weakness in the system.' },
  { id:'feasible', cat:'academic', en:'feasible', he:'בר-ביצוע / ישים', ex:'The plan is technically feasible.' },
  { id:'coherent', cat:'academic', en:'coherent', he:'הגיוני ומלוכד', ex:'She gave a clear, coherent argument.' },
  { id:'ambiguous', cat:'academic', en:'ambiguous', he:'דו-משמעי / עמום', ex:'The instructions were ambiguous.' },
  { id:'explicit', cat:'academic', en:'explicit', he:'מפורש', ex:'He gave explicit instructions.' },
  { id:'implicit', cat:'academic', en:'implicit', he:'מרומז / משתמע', ex:'There was an implicit assumption in the plan.' },
  { id:'prevalent', cat:'academic', en:'prevalent', he:'נפוץ / שכיח', ex:'The disease is prevalent in warm regions.' },
  { id:'diverse', cat:'academic', en:'diverse', he:'מגוון', ex:'The city has a diverse population.' },
  { id:'resemble', cat:'academic', en:'resemble', he:'לדמות / דומה ל', ex:'The copy closely resembles the original.' },
  // confusing / tricky
  { id:'contrary', cat:'confusing', en:'contrary', he:'מנוגד / להיפך', ex:'Contrary to expectations, sales rose.' },
  { id:'former', cat:'confusing', en:'former', he:'הראשון (מבין שניים) / לשעבר', ex:'Of tea and coffee, I prefer the former.' },
  { id:'latter', cat:'confusing', en:'latter', he:'האחרון (מבין שניים)', ex:'She chose the latter option.' },
  { id:'hardly', cat:'confusing', en:'hardly', he:'בקושי / כמעט לא', ex:'He had hardly any money left.' },
  { id:'seldom', cat:'confusing', en:'seldom', he:'לעיתים רחוקות', ex:'She seldom makes mistakes.' },
  { id:'thorough', cat:'confusing', en:'thorough', he:'יסודי / מעמיק', ex:'They did a thorough investigation.' },
  { id:'subtle', cat:'confusing', en:'subtle', he:'עדין / דק / מעודן', ex:'There is a subtle difference between the two.' },
  { id:'apparent', cat:'confusing', en:'apparent', he:'נראה לכאורה / ברור', ex:'For no apparent reason, the system failed.' },
  { id:'eventually', cat:'confusing', en:'eventually', he:'בסופו של דבר (לא: אולי)', ex:'After many attempts, they eventually succeeded.' },
  { id:'sensible', cat:'confusing', en:'sensible', he:'הגיוני / נבון', ex:'That is a sensible decision.' },
  { id:'sensitive', cat:'confusing', en:'sensitive', he:'רגיש', ex:'This is a sensitive topic.' },
  { id:'literally', cat:'confusing', en:'literally', he:'מילולית / פשוטו כמשמעו', ex:'The word was translated literally.' },
  { id:'considerable', cat:'confusing', en:'considerable', he:'ניכר / רב', ex:'They spent a considerable amount of time on it.' },
  { id:'respectively', cat:'confusing', en:'respectively', he:'בהתאמה', ex:'Tom and Sam scored 90 and 85 respectively.' },
  { id:'yield', cat:'confusing', en:'yield', he:'להניב / להיכנע / תשואה', ex:'The experiment yielded useful data.' }
];

const VOCAB_CATS = [
  { key:'all', label:'הכל' },
  { key:'connectors', label:'מילות קישור' },
  { key:'phrasal', label:'Phrasal Verbs' },
  { key:'academic', label:'מילים אקדמיות' },
  { key:'confusing', label:'מבלבלות' }
];

// ---- Sentence Completion ----
const SC = [
  { id:'sc1', stem:"The scientist's theory was initially _____, but years later it became widely accepted.", opts:['dismissed','celebrated','proven','published'], ans:0, why:'מילת הקישור <b>but</b> מסמנת ניגוד. אם מאוחר יותר התקבלה — בהתחלה היא <b>נדחתה</b> (dismissed).' },
  { id:'sc2', stem:'Because the bridge was considered _____, the authorities closed it to all traffic.', opts:['modern','unsafe','popular','expensive'], ans:1, why:'<b>Because</b> נותן סיבה לסגירה. סוגרים גשר כי הוא <b>לא בטוח</b> (unsafe).' },
  { id:'sc3', stem:'The instructions were so _____ that even experienced users struggled to follow them.', opts:['clear','simple','confusing','short'], ans:2, why:'המבנה <b>so … that</b> = תוצאה. אם משתמשים מנוסים התקשו — ההוראות היו <b>מבלבלות</b> (confusing).' },
  { id:'sc4', stem:'Unlike her talkative brother, Maria tends to be quite _____.', opts:['loud','reserved','friendly','angry'], ans:1, why:'<b>Unlike</b> = ניגוד לאח הדברן. לכן מריה <b>מופנמת/שקטה</b> (reserved).' },
  { id:'sc5', stem:'The new policy was designed to _____ energy consumption, and within a year usage dropped by 20%.', opts:['increase','measure','reduce','ignore'], ans:2, why:'התוצאה: השימוש <b>ירד</b> ב־20%. לכן המדיניות נועדה <b>להפחית</b> (reduce).' },
  { id:'sc6', stem:'The evidence was _____; therefore, the jury reached a verdict quickly.', opts:['conclusive','missing','doubtful','hidden'], ans:0, why:'<b>therefore … quickly</b> — הכרעה מהירה נובעת מראיה <b>חד־משמעית</b> (conclusive).' },
  { id:'sc7', stem:'He is known for his _____ nature; he rarely changes his mind once he has decided.', opts:['flexible','stubborn','generous','nervous'], ans:1, why:'הנקודתיים מפרטות: "כמעט לא משנה דעתו" = <b>עקשן</b> (stubborn).' },
  { id:'sc8', stem:'The medication may cause _____ effects, such as drowsiness and mild nausea.', opts:['beneficial','permanent','side','main'], ans:2, why:'קולוקציה קבועה: drowsiness ובחילה הם <b>side effects</b> (תופעות לוואי).' },
  { id:'sc9', stem:'Despite the _____ weather, the outdoor event proceeded as planned.', opts:['pleasant','sunny','harsh','calm'], ans:2, why:'<b>Despite … proceeded as planned</b> = ניגוד. האירוע התקיים למרות מזג אוויר <b>קשה</b> (harsh).' },
  { id:'sc10', stem:'The professor lecture was so _____ that several students fell asleep.', opts:['exciting','tedious','brief','loud'], ans:1, why:'תוצאה: נרדמו → ההרצאה הייתה <b>מייגעת/משעממת</b> (tedious).' },
  { id:'sc11', stem:'In order to _____ the results, the research team repeated the experiment three times.', opts:['confirm','doubt','hide','forget'], ans:0, why:'חוזרים על ניסוי שלוש פעמים כדי <b>לאשש/לוודא</b> (confirm) תוצאות.' },
  { id:'sc12', stem:'Although marketing costs were high, the company profits _____ sharply this year.', opts:['declined','rose','remained','disappeared'], ans:1, why:'<b>Although</b> = ניגוד: למרות עלויות גבוהות, הרווחים דווקא <b>עלו</b> (rose).' },
  { id:'sc13', stem:'The two theories are not contradictory; rather, they _____ each other.', opts:['oppose','complement','replace','confuse'], ans:1, why:'"not contradictory; rather" מכוון לחיוב — הן <b>משלימות</b> (complement) זו את זו.' },
  { id:'sc14', stem:'Her argument was _____ by a lack of reliable data.', opts:['strengthened','supported','weakened','proven'], ans:2, why:'חוסר נתונים אמינים <b>מחליש</b> (weakened) טיעון.' },
  { id:'sc15', stem:'The ancient manuscript was so _____ that scholars could barely read it.', opts:['legible','faded','modern','valuable'], ans:1, why:'"barely read it" → הכתב <b>דהוי</b> (faded).' },
  { id:'sc16', stem:'The government introduced strict regulations to _____ pollution in major cities.', opts:['curb','encourage','celebrate','spread'], ans:0, why:'תקנות מחמירות נועדו <b>לרסן/לבלום</b> (curb) זיהום.' },
  { id:'sc17', stem:'Since the data was _____, the researchers had to collect it again.', opts:['accurate','sufficient','flawed','recent'], ans:2, why:'<b>Since</b> = סיבה. אספו שוב כי הנתונים היו <b>פגומים</b> (flawed).' },
  { id:'sc18', stem:'The witness account was _____ with the physical evidence, which convinced the jury.', opts:['consistent','inconsistent','unrelated','compared'], ans:0, why:'שכנע את חבר המושבעים → העדות הייתה <b>עקבית/תואמת</b> (consistent) לראיות.' },
  { id:'sc19', stem:'The results were _____; the same experiment produced different outcomes each time.', opts:['consistent','inconsistent','clear','final'], ans:1, why:'"תוצאות שונות בכל פעם" → התוצאות <b>לא עקביות</b> (inconsistent).' },
  { id:'sc20', stem:'Rather than _____ the problem, the new manager confronted it directly.', opts:['avoiding','solving','creating','facing'], ans:0, why:'"Rather than X … confronted directly" → X הוא ההפך מהתמודדות = <b>avoiding</b> (להימנע).' },
  { id:'sc21', stem:'The lecture gave a _____ overview, covering all the main points of the topic.', opts:['narrow','comprehensive','vague','brief'], ans:1, why:'"covering all the main points" → סקירה <b>מקיפה</b> (comprehensive).' },
  { id:'sc22', stem:'His explanation was perfectly _____, leaving no room for misunderstanding.', opts:['ambiguous','lucid','vague','complex'], ans:1, why:'"no room for misunderstanding" → הסבר <b>צלול/ברור</b> (lucid).' },
  { id:'sc23', stem:'The company had to _____ its workforce because of declining sales.', opts:['expand','reduce','train','promote'], ans:1, why:'"declining sales" → נאלצו <b>לצמצם</b> (reduce) את כוח האדם.' },
  { id:'sc24', stem:'Although he seemed confident, he was _____ unsure of the answer.', opts:['secretly','openly','clearly','truly'], ans:0, why:'<b>Although</b> "seemed confident" ↔ ניגוד → בפנים <b>בסתר</b> (secretly) לא בטוח.' },
  { id:'sc25', stem:'The findings were met with _____, since they challenged long-held beliefs.', opts:['acceptance','skepticism','indifference','praise'], ans:1, why:'"challenged long-held beliefs" → מתקבלות ב<b>ספקנות</b> (skepticism).' },
  { id:'sc26', stem:'The two nations signed a treaty in order to _____ the long-running conflict.', opts:['prolong','escalate','resolve','ignore'], ans:2, why:'חתמו הסכם כדי <b>ליישב</b> (resolve) את הסכסוך.' },
  { id:'sc27', stem:'The report was criticized as _____, since it left out several important details.', opts:['thorough','incomplete','lengthy','accurate'], ans:1, why:'"left out details" → הדוח <b>חלקי/לא שלם</b> (incomplete).' },
  { id:'sc28', stem:'She spoke with such _____ that the whole audience was persuaded.', opts:['hesitation','conviction','confusion','boredom'], ans:1, why:'הקהל שוכנע → דיברה מתוך <b>שכנוע פנימי</b> (conviction).' },
  { id:'sc29', stem:'The bridge collapsed because the materials used in it were _____.', opts:['durable','substandard','costly','modern'], ans:1, why:'"collapsed because" → החומרים היו <b>נחותים</b> (substandard).' },
  { id:'sc30', stem:'Unlike the original plan, which was rigid, the revised one is far more _____.', opts:['strict','flexible','detailed','costly'], ans:1, why:'<b>Unlike</b> "rigid" (נוקשה) → <b>גמיש</b> (flexible).' },
  { id:'sc31', stem:'The medication should be taken _____; skipping doses reduces its effect.', opts:['occasionally','regularly','rarely','once'], ans:1, why:'"skipping doses reduces its effect" → יש ליטול <b>בקביעות</b> (regularly).' },
  { id:'sc32', stem:'The new evidence matched every clue and served to _____ the original theory.', opts:['undermine','confirm','question','delay'], ans:1, why:'"matched every clue" → <b>לאשש</b> (confirm) את התיאוריה.' },
  { id:'sc33', stem:'Because fresh water is _____ in the region, people must use it carefully.', opts:['abundant','scarce','clean','deep'], ans:1, why:'"must use it carefully" → מים <b>נדירים/מועטים</b> (scarce).' },
  { id:'sc34', stem:'The argument was so _____ that no one in the room could refute it.', opts:['weak','compelling','confusing','brief'], ans:1, why:'"no one could refute" → טיעון <b>משכנע/חזק</b> (compelling).' },
  { id:'sc35', stem:'Thanks to the efficient new machines, the factory output _____ significantly.', opts:['fell','increased','halted','stalled'], ans:1, why:'"efficient new machines" (חיובי) → התפוקה <b>עלתה</b> (increased).' },
  { id:'sc36', stem:'His actions were _____ with the values he claimed to hold, so people stopped trusting him.', opts:['consistent','inconsistent','familiar','popular'], ans:1, why:'"people stopped trusting" → מעשיו היו <b>לא עקביים</b> (inconsistent) עם הערכים.' }
];

// ---- Restatement ----
const RS = [
  { id:'rs1', stem:'The project was completed on time despite numerous unexpected setbacks.',
    opts:[
      'The project faced no problems and finished early.',
      'Although there were many surprising obstacles, the project still finished on schedule.',
      'The project was delayed because of several setbacks.',
      'The project was completed early thanks to careful planning.'],
    ans:1, why:'שומרים על יחס הניגוד: "עיכובים רבים אך בזמן". (a) מוחק את העיכובים, (c) הופך ל"התעכב", (d) מוסיף מידע (תכנון). (b) שומר בדיוק.' },
  { id:'rs2', stem:'Scientists believe that the disease spreads primarily through contaminated water.',
    opts:[
      'The disease is definitely caused by dirty water.',
      'According to scientists, contaminated water is the main way the disease spreads.',
      'Scientists have proven that water is the only cause of the disease.',
      'The disease spreads through water and air equally.'],
    ans:1, why:'(a) ו-(c) מקצינים ("believe"→"definitely/proven", "only"). (d) מוסיף "אוויר". (b) שומר על "believe / primarily".' },
  { id:'rs3', stem:'Had the manager acted sooner, the crisis could have been avoided.',
    opts:[
      'The manager acted quickly and prevented the crisis.',
      'Because the manager acted late, the crisis was avoided.',
      'If the manager had responded earlier, the crisis might not have happened.',
      'The crisis was avoided despite the managers slow response.'],
    ans:2, why:'"Had the manager acted sooner" = תנאי הפוך = "If the manager had acted earlier". המשבר <b>לא</b> נמנע בפועל. (c) נכון.' },
  { id:'rs4', stem:'The new law benefits small businesses but places a heavy burden on large corporations.',
    opts:[
      'The new law helps both small and large businesses.',
      'While small businesses gain from the new law, large corporations are significantly burdened by it.',
      'The new law harms small businesses and helps large corporations.',
      'Large corporations support the new law because it reduces their burden.'],
    ans:1, why:'שומרים על הניגוד: קטנים מרוויחים / גדולים נעמסים. (c) הופך את הכיוון, (a) ו-(d) סותרים את המקור.' },
  { id:'rs5', stem:'Few of the participants were able to solve the puzzle within the time limit.',
    opts:[
      'Most participants solved the puzzle quickly.',
      'No participant managed to solve the puzzle in time.',
      'Only a small number of participants completed the puzzle before time ran out.',
      'All participants failed to finish the puzzle.'],
    ans:2, why:'<b>Few</b> = מעטים (לא "אף אחד" ולא "רוב"). (c) שומר על המשמעות המדויקת.' },
  { id:'rs6', stem:'The author latest novel, unlike her previous works, received mixed reviews.',
    opts:[
      'The authors new novel was praised more than her earlier books.',
      'Critics responded to the new novel with a mix of opinions, unlike her earlier books.',
      'All of the authors novels received mixed reviews.',
      'The authors previous works also received mixed reviews.'],
    ans:1, why:'"mixed reviews" = ביקורות מעורבות, ו"unlike previous works" = הקודמות היו שונות. (c) ו-(d) סותרים את ה-unlike.' },
  { id:'rs7', stem:'The factory reduced its emissions in order to comply with environmental regulations.',
    opts:[
      'The factory lowered its emissions so that it would meet environmental rules.',
      'The factory increased emissions despite environmental rules.',
      'Environmental regulations were changed to suit the factory.',
      'The factory was fined for violating environmental regulations.'],
    ans:0, why:'"in order to comply" = "so that it would meet". (b) הופך, (c) ו-(d) מוסיפים מידע חדש.' },
  { id:'rs8', stem:'Not only did the storm damage homes, but it also disrupted the power supply for days.',
    opts:[
      'The storm damaged homes but did not affect the power supply.',
      'The storm damaged homes and additionally cut off electricity for several days.',
      'The power supply was disrupted, but no homes were damaged.',
      'The storm mainly affected the power supply rather than homes.'],
    ans:1, why:'"Not only … but also" = <b>גם וגם</b>. (b) שומר על שני הנזקים. האחרים מבטלים אחד מהם.' },
  { id:'rs9', stem:'The results suggest a possible link between diet and memory, though further research is needed.',
    opts:[
      'Diet has been proven to improve memory.',
      'There is no connection between diet and memory.',
      'The findings point to a potential connection between diet and memory, but more study is required.',
      'Further research has already confirmed the link.'],
    ans:2, why:'"suggest a possible link … further research needed" — לא הוכחה. (c) שומר על הזהירות; (a)/(d) מקצינים.' },
  { id:'rs10', stem:'The company postponed the product launch until the software issues were resolved.',
    opts:[
      'The company launched the product before fixing the software.',
      'The company cancelled the product launch due to software issues.',
      'The company delayed the launch until the software problems were fixed.',
      'The software issues were caused by the delayed launch.'],
    ans:2, why:'<b>postpone = לדחות</b>, לא לבטל. (b) משנה משמעות, (d) הופך סיבתיות. (c) נכון.' },
  { id:'rs11', stem:'Whereas urban areas saw rapid population growth, rural regions experienced a steady decline.',
    opts:[
      'Both urban and rural areas grew rapidly.',
      'City populations grew quickly, while country areas gradually shrank.',
      'Rural regions grew while cities declined.',
      'Urban and rural populations remained stable.'],
    ans:1, why:'<b>Whereas</b> = ניגוד: ערים גדלו / כפר הצטמצם. (c) הופך, (a)/(d) סותרים.' },
  { id:'rs12', stem:'The invention would not have succeeded without the support of several key investors.',
    opts:[
      'The invention succeeded entirely on its own.',
      'Key investors prevented the invention from succeeding.',
      'The support of several important investors was essential to the inventions success.',
      'The investors invented the product themselves.'],
    ans:2, why:'"would not have succeeded without X" = X היה <b>הכרחי</b> להצלחה. (c) נכון; (d) מוסיף מידע.' },
  { id:'rs13', stem:'The success of the campaign depended largely on the dedication of the volunteers.',
    opts:[
      'The campaign succeeded because the volunteers were paid well.',
      'The commitment of the volunteers was a major factor in the success of the campaign.',
      'The campaign failed despite the efforts of the volunteers.',
      'The volunteers depended on the campaign for their own success.'],
    ans:1, why:'"depended largely on the dedication" → המחויבות הייתה <b>גורם מרכזי</b> להצלחה. (a) מוסיף "שולמו", (c) הופך לכישלון, (d) הופך את כיוון התלות.' },
  { id:'rs14', stem:'Contrary to popular belief, the ancient city was destroyed not by war but by a natural disaster.',
    opts:[
      'Most people correctly believe that war destroyed the city.',
      'Although many assume war destroyed the city, it was in fact a natural disaster.',
      'The city was destroyed by both war and a natural disaster.',
      'No one knows what destroyed the ancient city.'],
    ans:1, why:'"not by war but by a natural disaster" → רבים חושבים מלחמה, אך למעשה אסון טבע. (a) סותר, (c) מוסיף, (d) משנה.' },
  { id:'rs15', stem:'The medication is effective only when it is taken exactly as prescribed.',
    opts:[
      'The medication works no matter how it is taken.',
      'For the medication to work, it must be taken precisely as instructed.',
      'The medication is always effective.',
      'The medication has no effect even when taken correctly.'],
    ans:1, why:'"effective only when taken exactly as prescribed" → כדי שיעבוד חובה ליטול בדיוק לפי ההוראות. השאר הופכים/מקצינים.' },
  { id:'rs16', stem:'While the new software runs faster, it is also harder to use.',
    opts:[
      'The new software is both faster and easier to use.',
      'The greater speed of the new software comes together with greater difficulty of use.',
      'The new software is slower but easier to use.',
      'The new software offers no real advantages.'],
    ans:1, why:'<b>While</b> = ניגוד: מהיר יותר אך קשה יותר. (a) הופך "harder"→"easier", (c) הופך את שניהם.' },
  { id:'rs17', stem:'The author suggests that technology, if used wisely, can improve education.',
    opts:[
      'Technology always improves education.',
      'According to the author, using technology wisely has the potential to enhance education.',
      'The author believes that technology harms education.',
      'Education cannot be improved without technology.'],
    ans:1, why:'"suggests … if used wisely … can improve" → פוטנציאל בזהירות, לא ודאות. (a) מקצין ל"always", (c) הופך.' },
  { id:'rs18', stem:'Only after the deadline had passed did the committee realize its mistake.',
    opts:[
      'The committee noticed its mistake well before the deadline.',
      'The committee became aware of its error only once the deadline was over.',
      'The committee made no mistakes before the deadline.',
      'The deadline was extended because of the mistake of the committee.'],
    ans:1, why:'"Only after X did Y" = Y קרה רק לאחר ש-X עבר. (a) הופך את הזמן, (d) מוסיף מידע.' },
  { id:'rs19', stem:'Despite receiving very little funding, the research team made a major breakthrough.',
    opts:[
      'The research team failed because it lacked funding.',
      'Even though it was poorly funded, the team achieved a significant discovery.',
      'The breakthrough of the team was the result of generous funding.',
      'The team received a great deal of funding for its breakthrough.'],
    ans:1, why:'<b>Despite</b> מעט מימון → פריצת דרך. (a) הופך הצלחה→כישלון, (c)/(d) סותרים את "little funding".' },
  { id:'rs20', stem:'The policy is likely to benefit consumers, though some experts remain doubtful.',
    opts:[
      'All experts agree that the policy will help consumers.',
      'The policy will probably help consumers, but some experts are still skeptical.',
      'The policy will certainly harm consumers.',
      'Experts are confident that the policy will fail.'],
    ans:1, why:'"likely … though some doubtful" → כנראה יעזור, אך יש ספקנים. (a) מקצין ל"all agree", (c) הופך.' },
  { id:'rs21', stem:'He rarely arrives on time, which frustrates his colleagues.',
    opts:[
      'He is almost always punctual, which pleases his colleagues.',
      'His frequent lateness annoys the people he works with.',
      'His colleagues are never bothered by his lateness.',
      'He is sometimes late, but his colleagues do not mind.'],
    ans:1, why:'"rarely on time" = מאחר לעיתים קרובות; "frustrates" = מעצבן. (a) הופך, (c)/(d) מבטלים את התסכול.' },
  { id:'rs22', stem:'The theory gained acceptance only after decades of resistance from the scientific community.',
    opts:[
      'Scientists immediately embraced the theory.',
      'The theory was accepted quickly and without any opposition.',
      'It took many years of opposition before scientists accepted the theory.',
      'The scientific community never accepted the theory.'],
    ans:2, why:'"only after decades of resistance" → שנים של התנגדות ואז קבלה. (a)/(b) הופכים ל"מיד", (d) ל"מעולם לא".' },
  { id:'rs23', stem:'Reducing the speed limit is expected to lower the number of accidents.',
    opts:[
      'Lowering the speed limit should decrease the number of accidents.',
      'Raising the speed limit will reduce accidents.',
      'The speed limit has no effect on accidents.',
      'Accidents will increase if the speed limit is reduced.'],
    ans:0, why:'"reducing … expected to lower accidents" = הורדת המהירות אמורה להפחית תאונות. (b) הופך ל"raising", (d) הופך את הכיוון.' },
  { id:'rs24', stem:'The document becomes legally binding only after it has been signed by both parties.',
    opts:[
      'The document is legally binding even without any signatures.',
      'A signature from one party is enough to make the document valid.',
      'The agreement takes legal effect only once both sides have signed it.',
      'The document had already been signed by both parties.'],
    ans:2, why:'"binding only after both parties sign" → תוקף רק לאחר חתימת שני הצדדים. (b) "צד אחד מספיק" משנה, (a) סותר.' }
];

// ---- Reading Comprehension ----
const RC = [
  { id:'rcp1', title:'Sleep and Memory',
    passage:[
      "For decades, scientists assumed that sleep was simply a period of rest, a time when the brain shut down to recover from the day. Recent research, however, has revealed that the sleeping brain is remarkably active, performing essential tasks that support learning and memory. One of the most important of these tasks is memory consolidation — the process by which newly acquired information is stabilized and integrated into long-term storage.",
      "During the day, the brain gathers a vast amount of information, storing it temporarily in a region called the hippocampus. This temporary storage has limited capacity. If the information were left there, it would soon be overwritten by new experiences. During sleep, particularly during the deep stages, the brain replays the day's events and gradually transfers important memories from the hippocampus to the neocortex, where they can be stored more permanently.",
      "Interestingly, not all memories are treated equally. Studies suggest that the brain preferentially strengthens memories that are emotionally significant or that it expects to need in the future. In one experiment, participants who were told they would be tested later remembered more after sleeping than those who were not, even though both groups slept the same amount.",
      "These discoveries have practical implications. Students who sleep after studying tend to perform better than those who stay awake, suggesting that a good night's sleep may be as valuable as an extra hour of review."
    ],
    qs:[
      { id:'rcp1q1', stem:'The passage is mainly about:', opts:['why students should study longer','the active role sleep plays in forming memories','the anatomy of the human brain','how to treat sleep disorders'], ans:1, why:'רעיון מרכזי: הפסקה כולה עוסקת בתפקיד הפעיל של השינה בגיבוש זיכרון.' },
      { id:'rcp1q2', stem:'According to the passage, the hippocampus:', opts:['stores memories permanently','is only active during sleep','holds information temporarily and has limited capacity','is located inside the neocortex'], ans:2, why:'פרט מפורש: "storing it temporarily … has limited capacity".' },
      { id:'rcp1q3', stem:'The experiment with participants who expected a test showed that:', opts:['sleeping longer always improves memory','the brain strengthens memories it expects to be useful','emotional memories are quickly forgotten','testing has no effect on memory'], ans:1, why:'המצפים למבחן זכרו יותר — המוח מחזק זיכרונות שהוא צופה שיזדקק להם.' },
      { id:'rcp1q4', stem:'The word "consolidation" (paragraph 1) is closest in meaning to:', opts:['weakening','stabilizing and strengthening','deleting','copying'], ans:1, why:'מהקשר: "stabilized and integrated into long-term storage" = ייצוב/חיזוק.' },
      { id:'rcp1q5', stem:'It can be inferred that staying awake all night to study is:', opts:['the best way to prepare for an exam','likely less effective than studying and then sleeping','recommended by scientists','necessary for memory consolidation'], ans:1, why:'הסקה: אם ישֵנים אחרי לימוד מתפקדים טוב יותר — הישארות ערים כל הלילה כנראה פחות יעילה.' }
    ]},
  { id:'rcp2', title:'The Economics of Renewable Energy',
    passage:[
      "A generation ago, renewable energy sources such as solar and wind power were widely regarded as expensive alternatives, suitable only for those willing to pay a premium for environmental benefits. Today, that perception has changed dramatically. In many parts of the world, electricity from solar and wind is now cheaper to produce than electricity from coal or natural gas.",
      "Several factors explain this shift. The most significant is the steep decline in the cost of manufacturing solar panels and wind turbines. As production expanded and technology improved, prices fell. In addition, unlike fossil fuels, the \"fuel\" for solar and wind is free: once a plant is built, sunlight and wind cost nothing.",
      "Nevertheless, renewable energy faces a serious challenge: it is intermittent. The sun does not always shine, and the wind does not always blow. Because electricity is difficult and expensive to store on a large scale, power grids must balance supply and demand at every moment. Without adequate storage, a grid that relies heavily on renewables risks shortages when conditions are unfavorable.",
      "Engineers are addressing this problem in several ways, including the development of cheaper batteries and the construction of grids that connect distant regions, so that surplus power generated in one area can supply another. While these solutions are promising, they require substantial investment."
    ],
    qs:[
      { id:'rcp2q1', stem:'The passage mainly discusses:', opts:['why fossil fuels are better than renewables','the changing costs and challenges of renewable energy','how solar panels are manufactured','the dangers of climate change'], ans:1, why:'רעיון מרכזי: שינוי העלויות והאתגרים של אנרגיה מתחדשת.' },
      { id:'rcp2q2', stem:'The main reason renewable energy has become cheaper is:', opts:['government subsidies','the falling cost of manufacturing panels and turbines','the rising price of coal','increased demand for electricity'], ans:1, why:'מפורש: "The most significant is the steep decline in the cost of manufacturing".' },
      { id:'rcp2q3', stem:'The word "intermittent" (paragraph 3) most nearly means:', opts:['constant','not continuous / occurring irregularly','expensive','powerful'], ans:1, why:'מהקשר: "The sun does not always shine" — כלומר לא רציף.' },
      { id:'rcp2q4', stem:'A grid that relies heavily on renewables risks shortages because:', opts:['renewable energy is too expensive','electricity is hard to store and generation is not constant','engineers refuse to build batteries','demand is always higher than supply'], ans:1, why:'מפורש: קשה לאחסן חשמל + ייצור לא קבוע → מחסור.' },
      { id:'rcp2q5', stem:"The author's attitude toward renewable energy can best be described as:", opts:['completely pessimistic','cautiously optimistic','entirely uninterested','strongly opposed'], ans:1, why:'טון: מציין יתרונות ואתגרים, והפתרונות "promising" אך דורשים השקעה — אופטימיות זהירה.' }
    ]},
  { id:'rcp3', title:'The History of Coffee',
    passage:[
      "Coffee, one of the world's most popular beverages, has a history that stretches back many centuries. According to a widely told legend, its stimulating effect was first noticed by an Ethiopian goat herder who saw that his goats became unusually energetic after eating the berries of a certain plant. Whether or not the story is true, coffee cultivation and trade can be traced with certainty to the Arabian Peninsula by the fifteenth century.",
      "From there, coffee spread rapidly. By the sixteenth century, coffee houses had appeared in cities across the Middle East. These establishments were not merely places to drink coffee; they became centers of social and intellectual life, where people gathered to discuss news, play games, and listen to music. Because of this, they were sometimes viewed with suspicion by authorities who feared that such gatherings might encourage political dissent.",
      "When coffee reached Europe in the seventeenth century, it met with a similar mixture of enthusiasm and distrust. Some critics condemned the new drink, while others praised its ability to sharpen the mind. Over time, however, coffee houses became firmly established in European cities, playing a role in social and commercial life not unlike the one they had played in the Middle East.",
      "Today, coffee is grown in dozens of countries and consumed by billions of people. Yet its long history reminds us that even the most ordinary daily habits often have surprisingly rich and complicated origins."
    ],
    qs:[
      { id:'rcp3q1', stem:'The passage is mainly about:', opts:['how to grow coffee','the historical development and spread of coffee','why coffee houses were banned','the health effects of coffee'], ans:1, why:'רעיון מרכזי: התפתחות והתפשטות הקפה לאורך ההיסטוריה.' },
      { id:'rcp3q2', stem:'According to the legend, the effect of coffee was first noticed by:', opts:['Arabian traders','a European scientist','an Ethiopian goat herder','a Middle Eastern ruler'], ans:2, why:'פרט מפורש: רועה עיזים אתיופי שראה שהעיזים נעשו אנרגטיות.' },
      { id:'rcp3q3', stem:'Coffee houses in the Middle East were viewed with suspicion because authorities feared that:', opts:['coffee was too expensive','the gatherings might encourage political dissent','the coffee was unhealthy','they were too noisy'], ans:1, why:'מפורש: חשש שהמפגשים יעודדו מחאה פוליטית (dissent).' },
      { id:'rcp3q4', stem:'The word "condemned" (paragraph 3) is closest in meaning to:', opts:['praised','strongly criticized','ignored','sold'], ans:1, why:'מהניגוד "condemned … while others praised" → condemned = מתחו ביקורת חריפה.' },
      { id:'rcp3q5', stem:'The main point of the last paragraph is that:', opts:['coffee is unhealthy','everyday habits can have rich and surprising histories','coffee is grown only in a few countries','coffee houses no longer exist'], ans:1, why:'המסר: אפילו הרגלים יומיומיים רגילים בעלי מקורות עשירים ומפתיעים.' }
    ]},
  { id:'rcp4', title:'Bees and Pollination',
    passage:[
      "Bees are among the most important pollinators on Earth. As they move from flower to flower collecting nectar, they transfer pollen, enabling plants to reproduce. This service is essential not only for wild plants but also for a large proportion of the crops that humans depend on for food. It has been estimated that a significant share of global food production relies, directly or indirectly, on pollination by bees and other insects.",
      "In recent years, however, scientists have grown increasingly concerned about declining bee populations. Several factors appear to be responsible. The widespread use of certain pesticides can harm bees, weakening their ability to navigate and reproduce. The loss of natural habitats, as land is converted to farming or urban development, reduces the variety of flowers available to them. Disease and parasites pose additional threats.",
      "The consequences of a serious decline in bee populations could be far-reaching. Crops that depend on pollination might produce lower yields, driving up food prices and, in some regions, threatening food security. For this reason, researchers and policymakers have begun to explore ways to protect bees, from restricting harmful pesticides to preserving and restoring natural habitats.",
      "Some scientists caution, however, that no single measure will be enough. Protecting bees, they argue, will require a combination of approaches sustained over many years."
    ],
    qs:[
      { id:'rcp4q1', stem:'The passage is mainly concerned with:', opts:['how bees produce honey','the importance of bees and the threats they face','the history of agriculture','why pesticides are useful'], ans:1, why:'רעיון מרכזי: חשיבות הדבורים והאיומים על אוכלוסייתן.' },
      { id:'rcp4q2', stem:'According to the passage, bees help plants reproduce by:', opts:['eating harmful insects','producing nectar','transferring pollen between flowers','protecting flowers from disease'], ans:2, why:'מפורש: הן מעבירות אבקה מפרח לפרח (transfer pollen).' },
      { id:'rcp4q3', stem:'Which of the following is NOT mentioned as a threat to bees?', opts:['certain pesticides','loss of natural habitats','climate change','disease and parasites'], ans:2, why:'שאלת "לא הוזכר": חומרי הדברה, אובדן בתי גידול, מחלות וטפילים כן הוזכרו — שינוי אקלים לא.' },
      { id:'rcp4q4', stem:'It can be inferred from the passage that a decline in bees could:', opts:['have no real effect on humans','lead to higher food prices','increase crop yields','eliminate the need for pesticides'], ans:1, why:'הסקה: יבולים נמוכים → מחירי מזון עולים.' },
      { id:'rcp4q5', stem:'The scientists in the last paragraph believe that protecting bees:', opts:['is impossible','requires a single simple solution','requires several approaches sustained over many years','is not necessary'], ans:2, why:'מפורש: אין פתרון יחיד; נדרש שילוב גישות לאורך שנים.' }
    ]}
];

// ---- 4-day plan ----
const PLAN = [
  { day:'יום 1', theme:'אבחון, יסודות ואוצר מילים', tasks:[
    { id:'d1t1', core:true, time:'45 דק׳', text:'קראו את מודולי הפתיחה בלומדה: מבנה המבחן, ניקוד והמנגנון האדפטיבי' },
    { id:'d1t2', core:true, time:'45 דק׳', text:'בצעו סימולציית אבחון מלאה בתנאי אמת (טאב "סימולציה") — זו נקודת הפתיחה שלכם' },
    { id:'d1t3', core:true, time:'30 דק׳', text:'נתחו את האבחון: איזה סוג שאלה חלש ביותר? פתחו את יומן הטעויות' },
    { id:'d1t4', core:true, time:'45 דק׳', text:'אוצר מילים — מנה 1: כל מילות הקישור (טאב "אוצר מילים")' },
    { id:'d1t5', core:false, time:'45 דק׳', text:'מודול "השלמת משפטים": קראו טכניקה ופתרו 10–15 שאלות בתרגול' },
    { id:'d1t6', core:false, time:'30 דק׳', text:'אוצר מילים — מנה 2: קידומות וסיומות (טכניקת הפירוק)' },
    { id:'d1t7', core:false, time:'30 דק׳', text:'הרחבה: קראו טקסט אקדמי קצר באנגלית וסכמו את הרעיון המרכזי' }
  ]},
  { day:'יום 2', theme:'השלמת משפטים + ניסוח מחדש', tasks:[
    { id:'d2t1', core:true, time:'30 דק׳', text:'אוצר מילים — מנה 3 + חזרה על מילות אתמול' },
    { id:'d2t2', core:true, time:'60 דק׳', text:'מודול "ניסוח מחדש": 5 כללי הפסילה + פתרו 15–20 שאלות לאט ובשיטה' },
    { id:'d2t3', core:true, time:'45 דק׳', text:'השלמת משפטים (העמקה): עוד 15–20 שאלות, דגש על מילות קישור ופיסוק' },
    { id:'d2t4', core:false, time:'30 דק׳', text:'מודול "דקדוק": חזרה על הכללים שצצו בטעויות שלכם' },
    { id:'d2t5', core:true, time:'30 דק׳', text:'אוצר מילים — מנה 4: Phrasal Verbs ומילים אקדמיות' },
    { id:'d2t6', core:false, time:'30 דק׳', text:'תרגול משולב: ערבבו שאלות מסוגים שונים (Interleaving)' },
    { id:'d2t7', core:false, time:'30 דק׳', text:'הרחבה: קראו טקסט אקדמי וזהו את מילות הקישור בתוכו' }
  ]},
  { day:'יום 3', theme:'הבנת הנקרא + סימולציה שנייה', tasks:[
    { id:'d3t1', core:true, time:'30 דק׳', text:'אוצר מילים — מנה 5 + חזרה מרווחת על כל המילים עד כה' },
    { id:'d3t2', core:true, time:'60 דק׳', text:'מודול "הבנת הנקרא": skim/scan + תרגלו את 2 הקטעים בתנאי זמן' },
    { id:'d3t3', core:true, time:'60 דק׳', text:'סימולציה מלאה #2 בתנאי אמת + טיימר' },
    { id:'d3t4', core:true, time:'45 דק׳', text:'ניתוח מעמיק של הסימולציה + עדכון יומן הטעויות' },
    { id:'d3t5', core:false, time:'30 דק׳', text:'חזרה על יומן הטעויות מימים 1–2: האם טעויות חוזרות?' },
    { id:'d3t6', core:false, time:'30 דק׳', text:'הרחבה: תרגול נוסף בסוג השאלה החלש ביותר שלכם' }
  ]},
  { day:'יום 4', theme:'ליטוש, סימולציה אחרונה והכנה מנטלית', tasks:[
    { id:'d4t1', core:true, time:'30 דק׳', text:'חזרה כללית מהירה על כל אוצר המילים' },
    { id:'d4t2', core:true, time:'60 דק׳', text:'סימולציה מלאה #3 (אחרונה) — בשעה קרובה לשעת המבחן האמיתית שלכם' },
    { id:'d4t3', core:true, time:'30 דק׳', text:'ניתוח קליל — רק לוודא שהטכניקות עובדות (בלי להיכנס ללחץ)' },
    { id:'d4t4', core:true, time:'30 דק׳', text:'קראו את "יום המבחן" ועברו על יומן הטעויות פעם אחרונה' },
    { id:'d4t5', core:true, time:'—', text:'הפסקה מנטלית: הפסיקו ללמוד ~4–6 שעות לפני המבחן. שינה טובה חשובה מכל תרגול' }
  ]}
];

// ---- Theory modules (HTML) ----
const MODULES = [
  { id:'mod0', icon:'🧭', title:'מבנה המבחן והמנגנון האדפטיבי', html:`
    <p>אמיר"ם ואמירנט הם מבחן מיון לרמות באנגלית של המרכז הארצי לבחינות (מאל"ו). <b>התוכן, המבנה והניקוד שלהם זהים</b> — ההבדל הוא רק המיקום (אמירנט = מהבית עם השגחה).</p>
    <h4>מבנה המבחן (קו בסיס)</h4>
    <div class="tbl-wrap"><table class="tbl">
      <tr><th>סוג שאלה</th><th>בלוקים</th><th>שאלות בבלוק</th><th>סה"כ</th><th>זמן לבלוק</th></tr>
      <tr><td>השלמת משפטים</td><td>3</td><td>4</td><td>12</td><td>4 דק׳</td></tr>
      <tr><td>ניסוח מחדש</td><td>2</td><td>3</td><td>6</td><td>6 דק׳</td></tr>
      <tr><td>הבנת הנקרא</td><td>1</td><td>5 (על קטע)</td><td>5</td><td>15 דק׳</td></tr>
      <tr><td><b>סה"כ</b></td><td></td><td></td><td><b>~23</b></td><td><b>~39 דק׳</b></td></tr>
    </table></div>
    <div class="callout warn"><b>שימו לב:</b> המבחן אדפטיבי — מספר השאלות והזמן עשויים להשתנות מעט מנבחן לנבחן. הזמן מוקצב לכל בלוק בנפרד ואי אפשר לצבור אותו.</div>
    <h4>המנגנון האדפטיבי — ולמה זה משנה הכל</h4>
    <p>המבחן מתאים את עצמו אליכם: מתחילים ברמה בינונית; תשובה נכונה → שאלה קשה יותר (ששווה יותר נקודות); תשובה שגויה → שאלה קלה יותר.</p>
    <ul>
      <li>🔑 <b>ההתחלה קריטית</b> — תשובות נכונות בהתחלה "מרימות" אתכם לרמת קושי גבוהה. אל תתחממו על חשבון השאלות הראשונות.</li>
      <li>🔑 <b>דיוק לפני מהירות</b> בתחילת המבחן.</li>
      <li>🔑 אל תנסו לנתח אם שאלה "קלה מדי" — זה רק מסיח דעת.</li>
    </ul>
    <h4>ניקוד ורמות</h4>
    <div class="tbl-wrap"><table class="tbl">
      <tr><th>ציון</th><th>רמה</th></tr>
      <tr><td><b>134–150</b></td><td><b>פטור 🎓</b></td></tr>
      <tr><td>120–133</td><td>מתקדמים ב׳</td></tr>
      <tr><td>100–119</td><td>מתקדמים א׳</td></tr>
      <tr><td>85–99</td><td>בסיסי</td></tr>
      <tr><td>עד 84</td><td>טרום־בסיסי / מכינה</td></tr>
    </table></div>
    <div class="callout key"><b>הכלל הטקטי הכי חשוב:</b> <b>אין קנס על תשובה שגויה!</b> לעולם אל תשאירו שאלה ריקה — אם לא יודעים, מנחשים (אחרי פסילת מסיחים).</div>
  `},
  { id:'mod1', icon:'🗂️', title:'מודול 1 — אוצר מילים', html:`
    <p>אוצר מילים הוא <b>מנוע הציון</b> — הוא משפיע על כל סוגי השאלות. היקף רלוונטי: 1,500–3,000 מילים. ב-4 ימים <b>ממקדים</b> בתשואה הגבוהה.</p>
    <h4>סדר עדיפויות</h4>
    <ul>
      <li><b>1. מילות קישור</b> — ה"שלט" של המשפט (ניגוד/סיבה/תוצאה/הוספה). לְמדו את כולן.</li>
      <li><b>2. Phrasal Verbs וביטויים</b> — שכיחים הרבה יותר ממילים נדירות.</li>
      <li><b>3. מילים אקדמיות שכיחות</b> — significant, indicate, establish, sufficient…</li>
      <li><b>4. מילים עם ריבוי משמעויות</b> — argue (לטעון), address (לטפל)…</li>
    </ul>
    <h4>טכניקת־על: פירוק מילים</h4>
    <div class="tbl-wrap"><table class="tbl">
      <tr><th>קידומת</th><th>משמעות</th><th>דוגמה</th></tr>
      <tr><td>un / in / im / ir / il</td><td>שלילה</td><td>unlikely, impossible, irregular</td></tr>
      <tr><td>re</td><td>שוב</td><td>reconsider, rebuild</td></tr>
      <tr><td>pre</td><td>לפני</td><td>predict, prevent</td></tr>
      <tr><td>mis</td><td>שגוי</td><td>misunderstand, mislead</td></tr>
      <tr><td>over / under</td><td>יתר / חסר</td><td>overestimate, underrate</td></tr>
    </table></div>
    <p>סיומות מסגירות חלק דיבר: <code>-tion/-ment</code> (שם עצם), <code>-able/-ible</code> (תואר "ניתן ל־"), <code>-ly</code> (תואר הפועל), <code>-ify/-ize</code> (פועל).</p>
    <div class="callout tip"><b>שיטה:</b> 30 דק׳ ביום, מפוצל; ~10–15 מילים חדשות; פלאשקארד <b>בהקשר</b> (משפט, לא מילה בודדת); חזרה מרווחת. השתמשו בטאב "אוצר מילים".</div>
  `},
  { id:'mod2', icon:'📐', title:'מודול 2 — דקדוק חיוני', html:`
    <p>הדקדוק נבדק <b>בהקשר</b>, לא כשאלות "מצא שגיאה". צריך את היסודות שעוזרים לפענח מבנה משפט.</p>
    <ul>
      <li><b>זמנים</b> — Present Simple מול Present Perfect (has/have + V3) מול Past; שימו לב ל-since / for / already / yet.</li>
      <li><b>תנאי</b> — If + present, will… / If + past, would… (מזהים ב-restatement).</li>
      <li><b>פסיב</b> — was built, is written, has been done (שכיח בטקסטים אקדמיים).</li>
      <li><b>פסוקיות זיקה</b> — who / which / that / whose (עוזר לפרק משפטים ארוכים).</li>
      <li><b>השוואות</b> — more than, the most, as…as, less…than.</li>
      <li><b>מילות יחס בביטויים קבועים</b> — depend on, consist of, responsible for.</li>
      <li><b>סדר מילים</b> — נושא־פועל־מושא (מי עושה מה — קריטי לניסוח מחדש).</li>
    </ul>
    <div class="callout tip"><b>טיפ:</b> אל תלמדו דקדוק "מהספר". בכל טעות שאלו: "איזה כלל היה כאן?" וחזרו רק עליו — דקדוק לפי צורך.</div>
  `},
  { id:'mod3', icon:'✏️', title:'מודול 3 — השלמת משפטים', html:`
    <p>משפט עם מילה חסרה ו-4 מסיחים. בודק אוצר מילים + הבנת הקשר.</p>
    <h4>שיטת פתרון</h4>
    <ol>
      <li>קראו את <b>כל</b> המשפט לפני שמסתכלים על התשובות.</li>
      <li><b>חזו בעצמכם</b> איזו מילה (או סוג: חיובי/שלילי) צריכה להיכנס.</li>
      <li>חפשו רמזים: <b>מילות קישור</b> (although/because…), <b>פיסוק</b> (פסיק/נקודתיים = הסבר), <b>טון רגשי</b>.</li>
      <li>הציבו כל מסיח ובדקו הגיון ודקדוק.</li>
    </ol>
    <div class="worked">
      <div class="q">Although the medication was designed to _____ the symptoms, it unexpectedly made them worse.</div>
      <div class="opt">(a) relieve &nbsp; (b) intensify &nbsp; (c) ignore &nbsp; (d) describe</div>
      <p><b>פתרון:</b> <mark>Although</mark> = ניגוד. אם בסוף המצב החמיר — הכוונה הייתה <b>להקל</b>. תשובה: <b>(a) relieve</b>. מילת הקישור לבדה הכתיבה את התשובה.</p>
    </div>
    <div class="callout warn"><b>מלכודות:</b> מסיח מוכר אך לא מתאים להקשר; מסיח נכון במשמעות אך שגוי דקדוקית; שני מסיחים דומים — ההבדל בניואנס (חזרו למילת הקישור).</div>
  `},
  { id:'mod4', icon:'🔄', title:'מודול 4 — ניסוח מחדש', html:`
    <p>משפט מקורי ו-4 ניסוחים. בוחרים את זה ששומר על <b>אותה משמעות בדיוק</b> במילים אחרות. סוג השאלה הכי טכני — ולכן הכי משתלם לתרגל.</p>
    <h4>שיטת פתרון</h4>
    <ol>
      <li>פענחו את <b>שלד המשפט</b>: מי הנושא? מה הפעולה? מה <b>הקשר הלוגי</b> (סיבה/ניגוד/תנאי/זמן)?</li>
      <li>זהו את <b>מילת הקישור</b> — הניסוח הנכון ישמר את אותו יחס (because → due to/since).</li>
      <li>סרקו ופסלו לפי כללי הברזל.</li>
    </ol>
    <h4>5 כללי הפסילה 🚩</h4>
    <div class="tbl-wrap"><table class="tbl">
      <tr><th>אם המסיח…</th><th>דוגמה</th></tr>
      <tr><td>מוסיף מידע חדש</td><td>פרט שלא היה במקור → פסול</td></tr>
      <tr><td>הופך את הסיבתיות</td><td>X גרם ל-Y ↔ Y גרם ל-X</td></tr>
      <tr><td>משנה משמעות מילה</td><td>postponed (נדחה) ≠ cancelled (בוטל)</td></tr>
      <tr><td>מגזים / מקצין</td><td>some→all, may→must</td></tr>
      <tr><td>הופך חיוב/שלילה</td><td>הוספת/השמטת not</td></tr>
    </table></div>
    <div class="worked">
      <div class="q">The manager postponed the meeting because several key employees were absent.</div>
      <p>שלד: <b>דחה</b> פגישה <b>כי</b> עובדי מפתח נעדרו. התשובה הנכונה: "The meeting was delayed due to the absence of several important staff members" — delayed=postponed, due to=because, בלי מידע חדש.</p>
    </div>
    <div class="callout key"><b>מפתח ההצלחה:</b> לא לחפש "מילים דומות" — לחפש את <b>הרעיון והיחס הלוגי הזהה</b>. מסיח שגוי מרבה להשתמש באותן מילים של המקור כפיתוי.</div>
  `},
  { id:'mod5', icon:'📖', title:'מודול 5 — הבנת הנקרא', html:`
    <p>קטע אקדמי אחד (~300–500 מילים) + 5 שאלות. 15 דקות — המקטע הכי "כבד" בזמן.</p>
    <h4>שיטת עבודה</h4>
    <ol>
      <li><b>Skim (2–3 דק׳):</b> המשפט הראשון של כל פסקה + פתיחה וסיום → לתפוס רעיון מרכזי ומבנה.</li>
      <li>עברו לשאלות, זהו את <b>סוג</b> השאלה ומילת המפתח.</li>
      <li><b>Scan:</b> חזרו לטקסט למקום המדויק (השאלות לפי סדר הופעת המידע — נצלו!).</li>
      <li>ענו <b>לפי הכתוב בלבד</b>, לא לפי ידע כללי.</li>
    </ol>
    <div class="tbl-wrap"><table class="tbl">
      <tr><th>סוג שאלה</th><th>טקטיקה</th></tr>
      <tr><td>רעיון מרכזי</td><td>מהסקירה; היזהרו מ"צר מדי" או "רחב מדי"</td></tr>
      <tr><td>פרט ספציפי</td><td>סריקה ממוקדת למקום המדויק</td></tr>
      <tr><td>הסקה (Inference)</td><td>לא כתוב מפורש אבל נובע — לא ניחוש פרוע</td></tr>
      <tr><td>מילה בהקשר</td><td>הסתכלו על המשפט סביב המילה, לא על התרגום המילוני</td></tr>
      <tr><td>מטרת/טון הכותב</td><td>חפשו מילים טעונות: ניטרלי/ביקורתי/תומך?</td></tr>
    </table></div>
    <div class="callout warn"><b>מלכודות:</b> תשובה קיצונית (always/never/only); "נכון אבל לא רלוונטי"; "לא הוזכר בטקסט"; אל תסמכו על הזיכרון — חזרו לטקסט ואמתו.</div>
  `}
];

// ---- Readiness checklist ----
const CHECKLIST = [
  { id:'c1', text:'אני מכיר את מבנה המבחן ואת 3 סוגי השאלות' },
  { id:'c2', text:'אני שולט בכל מילות הקישור (ניגוד/סיבה/תוצאה/הוספה)' },
  { id:'c3', text:'אני יודע את 5 כללי הפסילה בניסוח מחדש' },
  { id:'c4', text:'אני עושה skim→scan בהבנת הנקרא אוטומטית' },
  { id:'c5', text:'עשיתי לפחות 3 סימולציות מלאות בתנאי זמן' },
  { id:'c6', text:'הציון שלי בסימולציה האחרונה קרוב/מעל היעד' },
  { id:'c7', text:'עברתי על יומן הטעויות ואיני חוזר על אותן טעויות' },
  { id:'c8', text:'אני זוכר: אין קנס על טעות → לא משאיר שום שאלה ריקה' },
  { id:'c9', text:'בדקתי לוגיסטיקה (מיקום/טכניקה לאמירנט, זהות, שעה)' }
];

// ---- Per-type "how to approach" guides (shown atop each practice tab) ----
const STRATEGY = {
  sc: { label:'השלמת משפטים', html:`
    <h4>איך ניגשים</h4>
    <ol>
      <li>קראו את <b>כל</b> המשפט עד הסוף — <b>לפני</b> שמסתכלים על התשובות.</li>
      <li><b>נחשו בעצמכם</b> איזו מילה מתאימה (או לפחות אם היא חיובית או שלילית).</li>
      <li>חפשו רמזים: <b>מילות קישור</b> (although / because / however) ו<b>פיסוק</b> — הם מסגירים אם צריך מילה <b>תואמת</b> או <b>מנוגדת</b>.</li>
      <li>הציבו כל מסיח במשפט ובדקו הגיון ודקדוק.</li>
    </ol>
    <h4>🔑 אם לא יודעים את המילה</h4>
    <ul>
      <li><b>פרקו אותה:</b> קידומת (<code>un-/in-/im-</code>=שלילה, <code>re-</code>=שוב) וסיומת מסגירות משמעות וחלק דיבר.</li>
      <li><b>חפשו דמיון:</b> לעברית (popular ↔ פופולרי) או למילה אנגלית מוכרת (findings ↔ find).</li>
      <li><b>חיובי או שלילי?</b> קבעו לפי טון המשפט איזו מילה דרושה — ופסלו את מי שלא מתאים.</li>
      <li><b>פסלו ונחשו:</b> אין קנס על טעות — כל מסיח שנפסל מכפיל את הסיכוי.</li>
    </ul>` },
  rs: { label:'ניסוח מחדש', html:`
    <h4>איך ניגשים</h4>
    <ol>
      <li>פענחו את <b>שלד המשפט</b>: מי הנושא, מה הפעולה, ומה <b>היחס הלוגי</b> (סיבה / ניגוד / תנאי / זמן).</li>
      <li>זהו את <b>מילת הקישור</b> במקור — הניסוח הנכון ישמר את אותו יחס במילים אחרות.</li>
      <li>בחרו את המסיח שאומר <b>אותו דבר בדיוק</b> — לא פחות ולא יותר.</li>
    </ol>
    <h4>🚩 פסלו מיד מסיח ש...</h4>
    <ul>
      <li><b>מוסיף מידע</b> שלא היה במקור · <b>הופך סיבתיות</b> · <b>משנה משמעות</b> (postponed ≠ cancelled) · <b>מקצין</b> (some→all) · <b>הופך חיוב/שלילה</b>.</li>
    </ul>
    <h4>🔑 אם לא יודעים מילה</h4>
    <ul>
      <li>התמקדו ב<b>יחס הלוגי</b> ובמילות הקישור, לא במילה הבודדת — לרוב זה מספיק לזהות את התשובה.</li>
      <li>היזהרו ממסיח שמשתמש <b>באותן מילים</b> של המקור — זה פיתוי. חפשו רעיון זהה, לא מילים דומות.</li>
    </ul>` },
  rc: { label:'הבנת הנקרא', html:`
    <h4>איך ניגשים</h4>
    <ol>
      <li><b>Skim</b> תחילה: קראו את המשפט הראשון של כל פסקה + פתיחה וסיום — לתפוס רעיון מרכזי ומבנה.</li>
      <li>עברו לשאלות, זהו את <b>סוג</b> השאלה ומילת המפתח, ואז <b>Scan</b> למקום המדויק (השאלות לפי סדר הופעת המידע).</li>
      <li>ענו <b>לפי הכתוב בלבד</b> — לא לפי ידע כללי או דעה.</li>
    </ol>
    <h4>⚠️ דגשים ומלכודות</h4>
    <ul>
      <li>תשובה קיצונית (<code>always / never / only</code>) לרוב שגויה · "נכון אבל לא רלוונטי" · "לא הוזכר בטקסט" · אל תסמכו על הזיכרון — חזרו לטקסט ואמתו.</li>
    </ul>
    <h4>🔑 אם לא יודעים מילה</h4>
    <ul>
      <li><b>הבינו מההקשר:</b> המשפטים סביב המילה חושפים את משמעותה — לרוב אין צורך במילה עצמה כדי לענות.</li>
      <li>בשאלת <b>"מילה בהקשר"</b>: החליפו את המילה בכל מסיח ובדקו איזה שומר על משמעות המשפט.</li>
    </ul>` }
};

/* =======================================================================
   2) STATE — persistence
   ======================================================================= */
const STORAGE_KEY = 'amiram_lomda_v1';

function defaultState() {
  return {
    version: 1,
    examDate: null,
    theme: 'light',
    tasks: {},        // taskId -> true
    modules: {},      // moduleId -> true (read)
    vocab: {},        // wordId -> {box, known, seen}
    practice: { sc:{}, rs:{}, rc:{} }, // qid -> {chosen, correct}
    sims: [],         // {date, total, correct, sc, rs, rc, est}
    errors: [],       // {type, q, reason, fix, date}
    checklist: {}     // cId -> true
  };
}

let state = load();
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  } catch (e) { return defaultState(); }
}
let saveTimer = null;
function save() {
  try {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }, 120);
  } catch (e) {}
}

/* transient UI state (not persisted) */
const ui = {
  section: 'dashboard',
  planDay: 0,
  vocabFilter: 'all',
  vocabIndex: 0,
  vocabFlipped: false,
  vocabReviewOnly: false,
  practiceType: 'sc',
  stratOpen: true,
  pIndex: { sc:0, rs:0, rc:0 },
  sim: null // {questions, answers, idx, remaining, timerId, finished}
};

/* =======================================================================
   3) HELPERS
   ======================================================================= */
const $ = (sel, root) => (root||document).querySelector(sel);
const view = $('#view');
const LETTERS = ['A','B','C','D','E'];
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function scoreBand(score) {
  if (score >= 134) return { label:'פטור', cls:'good' };
  if (score >= 120) return { label:'מתקדמים ב׳', cls:'warn' };
  if (score >= 100) return { label:'מתקדמים א׳', cls:'warn' };
  if (score >= 85)  return { label:'בסיסי', cls:'bad' };
  return { label:'טרום־בסיסי', cls:'bad' };
}

function totalPracticeQuestions() {
  let rcCount = 0; RC.forEach(p => rcCount += p.qs.length);
  return SC.length + RS.length + rcCount;
}
function practiceAnsweredCount() {
  return Object.keys(state.practice.sc).length + Object.keys(state.practice.rs).length + Object.keys(state.practice.rc).length;
}
function practiceCorrectCount() {
  let c = 0;
  ['sc','rs','rc'].forEach(t => Object.values(state.practice[t]).forEach(r => { if (r.correct) c++; }));
  return c;
}
function vocabKnownCount() { return Object.values(state.vocab).filter(v => v.known).length; }
function tasksDoneCount() { return Object.values(state.tasks).filter(Boolean).length; }
function totalTasks() { let n=0; PLAN.forEach(d => n += d.tasks.length); return n; }
function modulesReadCount() { return Object.values(state.modules).filter(Boolean).length; }

function overallProgress() {
  const parts = [
    tasksDoneCount() / totalTasks(),
    modulesReadCount() / MODULES.length,
    vocabKnownCount() / VOCAB.length,
    practiceAnsweredCount() / totalPracticeQuestions()
  ];
  const pct = parts.reduce((a,b)=>a+b,0) / parts.length;
  return Math.round(pct * 100);
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(t._tm); t._tm = setTimeout(() => t.hidden = true, 2200);
}

function updateSideProgress() {
  const p = overallProgress();
  const bar = $('#sideProgBar'), pct = $('#sideProgPct');
  if (bar) bar.style.width = p + '%';
  if (pct) pct.textContent = p + '%';
}

/* =======================================================================
   4) RENDERERS
   ======================================================================= */
function render() {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.section === ui.section));
  const r = RENDER[ui.section];
  view.innerHTML = r ? r() : '<p>—</p>';
  view.scrollTop = 0; window.scrollTo(0,0);
  if (ui.section === 'sim' && ui.sim && !ui.sim.finished) startSimClock();
  updateSideProgress();
}

const RENDER = {};

/* ---- Dashboard ---- */
RENDER.dashboard = function () {
  const p = overallProgress();
  const known = vocabKnownCount();
  const ans = practiceAnsweredCount();
  const corr = practiceCorrectCount();
  const acc = ans ? Math.round(corr/ans*100) : 0;
  const bestSim = state.sims.length ? Math.max.apply(null, state.sims.map(s=>s.est)) : null;
  const openErrors = state.errors.length;

  let countdownHtml;
  if (state.examDate) {
    const d = new Date(state.examDate + 'T00:00:00');
    const days = Math.ceil((d - new Date(new Date().toDateString())) / 86400000);
    countdownHtml = `<div class="countdown"><b>${days >= 0 ? days : 0}</b><span>ימים למבחן</span></div>`;
  } else {
    countdownHtml = `<p style="margin:.2em 0 .6em">בחרו תאריך מבחן כדי להתחיל ספירה לאחור 👇</p>`;
  }

  const R = 76, C = 2*Math.PI*R, off = C*(1 - p/100);
  const ring = `
    <div class="ring">
      <svg width="168" height="168" viewBox="0 0 168 168">
        <circle cx="84" cy="84" r="${R}" fill="none" stroke="var(--surface-3)" stroke-width="14"/>
        <circle cx="84" cy="84" r="${R}" fill="none" stroke="url(#g)" stroke-width="14" stroke-linecap="round"
          stroke-dasharray="${C}" stroke-dashoffset="${off}"/>
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="var(--primary)"/><stop offset="1" stop-color="var(--accent)"/>
        </linearGradient></defs>
      </svg>
      <div class="ring-label"><b>${p}%</b><span>הושלם</span></div>
    </div>`;

  return `
  <div class="page-head"><span class="eyebrow">לוח בקרה</span></div>
  <div class="dash-hero">
    <div>
      <h1>שלום, בואו נצא לפטור 🎓</h1>
      ${countdownHtml}
      <div class="date-row">
        <label>תאריך מבחן:</label>
        <input type="date" data-action="set-exam-date" value="${state.examDate||''}" />
        <button class="btn sm" data-action="nav" data-section="plan">התחל בתוכנית →</button>
      </div>
    </div>
    <div class="ring-wrap">${ring}</div>
  </div>

  <div class="grid cols-4" style="margin-top:16px">
    ${statCard('🗂️','אוצר מילים', known+' / '+VOCAB.length, 'מילים שסימנת "ידעתי"')}
    ${statCard('✍️','שאלות שתורגלו', String(ans), ans?('דיוק '+acc+'%'):'עדיין לא התחלת')}
    ${statCard('⏱️','סימולציות', String(state.sims.length), bestSim?('ציון שיא ~'+bestSim):'—')}
    ${statCard('📓','טעויות ביומן', String(openErrors), 'לחזרה ממוקדת')}
  </div>

  <div class="grid cols-2" style="margin-top:16px">
    <div class="card">
      <h3>המשך מאיפה שהפסקת</h3>
      <p style="color:var(--muted)">בנוי לפי תוכנית 4 הימים. הצעד הבא שלך:</p>
      ${nextTaskHtml()}
    </div>
    <div class="card">
      <h3>3 הדברים שמזיזים את המחט</h3>
      <ul style="padding-inline-start:18px;margin:.4em 0">
        <li><b>אוצר מילים</b> — משפיע על כל סוגי השאלות</li>
        <li><b>טכניקות פתרון</b> — במיוחד 5 כללי הפסילה בניסוח מחדש</li>
        <li><b>לא להשאיר שאלות ריקות</b> — אין קנס על טעות</li>
      </ul>
      <button class="btn ghost sm" data-action="nav" data-section="theory">למודולי הלומדה →</button>
    </div>
  </div>`;
};
function statCard(ico, k, v, sub) {
  return `<div class="stat"><div class="k">${ico} ${k}</div><div class="v">${v}</div><div class="sub">${sub}</div></div>`;
}
function nextTaskHtml() {
  for (let di=0; di<PLAN.length; di++) {
    for (const t of PLAN[di].tasks) {
      if (!state.tasks[t.id]) {
        return `<div class="task"><input type="checkbox" data-action="toggle-task" data-id="${t.id}">
          <div class="body"><div class="txt">${esc(t.text)}</div>
          <div class="meta"><span class="pill ${t.core?'core':'extra'}">${PLAN[di].day}</span><span class="time">⏱ ${t.time}</span></div></div></div>`;
      }
    }
  }
  return `<div class="callout tip">🎉 סיימת את כל משימות התוכנית! עבור לסימולציה אחרונה וליום המבחן.</div>`;
}

/* ---- Plan ---- */
RENDER.plan = function () {
  const tabs = PLAN.map((d,i) => {
    const done = d.tasks.filter(t=>state.tasks[t.id]).length;
    const pct = Math.round(done/d.tasks.length*100);
    return `<button class="day-tab ${i===ui.planDay?'active':''}" data-action="plan-day" data-i="${i}">
      <div class="d">${d.day}</div><div class="t">${done}/${d.tasks.length} משימות</div>
      <div class="mini"><i style="width:${pct}%"></i></div></button>`;
  }).join('');

  const day = PLAN[ui.planDay];
  const tasks = day.tasks.map(t => `
    <label class="task ${state.tasks[t.id]?'done':''}">
      <input type="checkbox" data-action="toggle-task" data-id="${t.id}" ${state.tasks[t.id]?'checked':''}>
      <div class="body"><div class="txt">${esc(t.text)}</div>
      <div class="meta">${t.core?'<span class="pill core">ליבה ⭐</span>':'<span class="pill extra">הרחבה</span>'}<span class="time">⏱ ${t.time}</span></div></div>
    </label>`).join('');

  return `
  <div class="page-head"><span class="eyebrow">תוכנית לימוד</span>
    <h1>אסטרטגיית 4 הימים</h1>
    <p>~5–6 שעות ביום. סמנו משימות בזמן אמת — ההתקדמות נשמרת. משימות <b>ליבה ⭐</b> = חובה; אם יש פחות זמן, דלגו על ה"הרחבה".</p>
  </div>
  <div class="day-tabs">${tabs}</div>
  <div class="card">
    <h3 style="margin-bottom:2px">${day.day} — ${day.theme}</h3>
    <p style="color:var(--muted);margin-top:0">חוקי ברזל יומיים: 30 דק׳ אוצר מילים · עדכון יומן טעויות · שינה טובה.</p>
    ${tasks}
  </div>`;
};

/* ---- Theory ---- */
RENDER.theory = function () {
  const mods = MODULES.map(m => {
    const read = state.modules[m.id];
    return `<details class="accordion">
      <summary><span class="mod-icon">${m.icon}</span> ${m.title}
        ${read?'<span class="pill good" style="margin-inline-start:6px">✓ נלמד</span>':''}
        <span class="chev">▾</span></summary>
      <div class="content">${m.html}
        <div style="margin-top:16px">
          <button class="btn ${read?'ghost':''} sm" data-action="toggle-module" data-id="${m.id}">
            ${read?'בטל סימון "נלמד"':'סמן כנלמד ✓'}</button>
        </div>
      </div>
    </details>`;
  }).join('');
  return `
  <div class="page-head"><span class="eyebrow">לומדה</span>
    <h1>מודולי התיאוריה</h1>
    <p>כל מה שצריך לדעת: מבנה, אוצר מילים, דקדוק וטכניקות פתרון לכל סוג שאלה — עם דוגמאות פתורות. לחצו להרחבה.</p>
  </div>${mods}`;
};

/* ---- Vocabulary ---- */
function vocabDeck() {
  let deck = ui.vocabFilter==='all' ? VOCAB.slice() : VOCAB.filter(w => w.cat===ui.vocabFilter);
  if (ui.vocabReviewOnly) deck = deck.filter(w => !(state.vocab[w.id] && state.vocab[w.id].known));
  return deck;
}
RENDER.vocab = function () {
  const chips = VOCAB_CATS.map(c => {
    const n = c.key==='all' ? VOCAB.length : VOCAB.filter(w=>w.cat===c.key).length;
    return `<button class="chip ${ui.vocabFilter===c.key?'active':''}" data-action="vocab-filter" data-k="${c.key}">${c.label} <span class="n">${n}</span></button>`;
  }).join('');

  const deck = vocabDeck();
  const known = deck.filter(w => state.vocab[w.id] && state.vocab[w.id].known).length;

  if (!deck.length) {
    return vocabHeader(chips) + `<div class="card"><div class="empty-state"><div class="big">🎉</div>
      <p>סיימת את כל המילים בקטגוריה הזו! בטלו "רק לחזרה" או בחרו קטגוריה אחרת.</p></div></div>`;
  }
  if (ui.vocabIndex >= deck.length) ui.vocabIndex = 0;
  const w = deck[ui.vocabIndex];
  const st = state.vocab[w.id] || { box:1, known:false };
  const catLabel = (VOCAB_CATS.find(c=>c.key===w.cat)||{}).label || '';

  return vocabHeader(chips) + `
  <div class="card">
    <div class="flashcard-wrap">
      <div class="flashcard ${ui.vocabFlipped?'flipped':''}" data-action="flip-card">
        <div class="flashcard-inner">
          <div class="face front">
            <span class="cat-tag">${catLabel} · ${ui.vocabIndex+1}/${deck.length}</span>
            <div class="word">${esc(w.en)}</div>
            <div class="hint">לחצו כדי לחשוף תרגום ↺</div>
          </div>
          <div class="face back">
            <span class="cat-tag">${esc(w.en)}</span>
            <div class="he">${esc(w.he)}</div>
            <div class="ex" dir="ltr">"${esc(w.ex)}"</div>
          </div>
        </div>
      </div>
    </div>
    <div class="vocab-controls">
      <button class="btn ghost sm" data-action="vocab-prev">← הקודם</button>
      <button class="btn sm" style="background:var(--danger)" data-action="vocab-review-mark">עדיין לומד</button>
      <button class="btn sm" style="background:var(--success)" data-action="vocab-known">ידעתי ✓</button>
      <button class="btn ghost sm" data-action="vocab-next">הבא →</button>
    </div>
    <div class="vocab-status">
      נלמדו בקטגוריה: <b>${known}/${deck.length}</b> ·
      <span class="box-badge">שלב חזרה ${st.box||1}/5</span> ·
      <label style="cursor:pointer"><input type="checkbox" data-action="vocab-reviewonly" ${ui.vocabReviewOnly?'checked':''}> הצג רק מה שלא נלמד</label>
    </div>
  </div>
  <div class="card">
    <h3>💡 איך להפיק את המקסימום</h3>
    <ul style="padding-inline-start:18px;color:var(--muted)">
      <li>נסו להיזכר בתרגום <b>לפני</b> שהופכים — המאמץ מקבע את הזיכרון.</li>
      <li>"ידעתי" מקדם מילה בשלבי החזרה; "עדיין לומד" מחזיר אותה להתחלה.</li>
      <li>עשו 2–3 מנות קצרות ביום, לא ישיבה אחת ארוכה.</li>
    </ul>
  </div>`;
};
function vocabHeader(chips) {
  return `<div class="page-head"><span class="eyebrow">אוצר מילים</span>
    <h1>פלאשקארדס עם חזרה מרווחת</h1>
    <p>המנוע של הציון. התחילו במילות הקישור. סמנו "ידעתי" / "עדיין לומד" — המערכת עוקבת אחרי מה שלמדתם.</p>
    </div><div class="chips">${chips}</div>`;
}

/* ---- Practice ---- */
RENDER.practice = function () {
  const tabs = [
    { k:'sc', label:'השלמת משפטים', n:SC.length },
    { k:'rs', label:'ניסוח מחדש', n:RS.length },
    { k:'rc', label:'הבנת הנקרא', n:RC.reduce((a,p)=>a+p.qs.length,0) }
  ].map(t => `<button class="subtab ${ui.practiceType===t.k?'active':''}" data-action="practice-tab" data-type="${t.k}">${t.label} (${t.n})</button>`).join('');

  let body;
  if (ui.practiceType === 'rc') body = renderRCPractice();
  else body = renderSCRSPractice(ui.practiceType);

  const strat = STRATEGY[ui.practiceType];
  const stratBox = `<details class="accordion strat" ${ui.stratOpen ? 'open' : ''}>
      <summary data-action="strat-toggle"><span class="mod-icon">💡</span> איך לגשת · ${strat.label}<span class="chev">▾</span></summary>
      <div class="content">${strat.html}</div>
    </details>`;

  return `
  <div class="page-head"><span class="eyebrow">תרגול</span>
    <h1>בנק שאלות עם משוב מיידי</h1>
    <p>כל טעות נכנסת אוטומטית ליומן הטעויות. קראו את ההסבר — שם נמצאת הלמידה האמיתית.</p>
  </div>
  <div class="subtabs">${tabs}</div>
  ${stratBox}
  ${body}`;
};

function renderSCRSPractice(type) {
  const bank = type==='sc' ? SC : RS;
  const store = state.practice[type];
  const answered = Object.keys(store).length;
  const correct = Object.values(store).filter(r=>r.correct).length;
  let idx = ui.pIndex[type]; if (idx >= bank.length) idx = 0;
  const q = bank[idx];
  const saved = store[q.id];
  const dir = type==='rs' ? '' : 'ltr';

  const opts = q.opts.map((o,i) => {
    let cls = 'option';
    if (saved) {
      if (i === q.ans) cls += ' correct';
      else if (i === saved.chosen) cls += ' wrong';
    }
    return `<button class="${cls}" data-action="answer" data-type="${type}" data-qid="${q.id}" data-choice="${i}" ${saved?'disabled':''}>
      <span class="letter">${LETTERS[i]}</span><span>${esc(o)}</span></button>`;
  }).join('');

  const explain = saved ? `<div class="explain">
      <div class="verdict ${saved.correct?'ok':'no'}">${saved.correct?'✓ נכון!':'✗ לא נכון — התשובה: '+LETTERS[q.ans]}</div>
      <div>${q.why}</div></div>` : '';

  return `
  <div class="card">
    <div class="quiz-head">
      <span class="quiz-counter">שאלה ${idx+1} מתוך ${bank.length}</span>
      <span class="quiz-counter">נענו: ${answered}/${bank.length} · נכונות: ${correct}</span>
    </div>
    <div class="q-stem" dir="${dir}">${type==='rs'?'<div style="font-size:13px;color:var(--muted);margin-bottom:6px">בחרו את המשפט ששומר על אותה משמעות:</div>':''}<span dir="ltr">${esc(q.stem)}</span></div>
    <div class="options">${opts}</div>
    ${explain}
    <div class="quiz-foot">
      <button class="btn ghost sm" data-action="practice-prev" data-type="${type}">← הקודם</button>
      <button class="btn sm" data-action="practice-next" data-type="${type}">${saved?'הבא →':'דלג →'}</button>
    </div>
  </div>`;
}

function renderRCPractice() {
  let idx = ui.pIndex.rc; if (idx >= RC.length) idx = 0;
  const p = RC[idx];
  const store = state.practice.rc;

  const passage = `<div class="passage" dir="ltr">${p.passage.map(par=>`<p>${esc(par)}</p>`).join('')}</div>`;

  const qs = p.qs.map((q,qi) => {
    const saved = store[q.id];
    const opts = q.opts.map((o,i) => {
      let cls = 'option';
      if (saved) { if (i===q.ans) cls+=' correct'; else if (i===saved.chosen) cls+=' wrong'; }
      return `<button class="${cls}" data-action="answer" data-type="rc" data-qid="${q.id}" data-choice="${i}" ${saved?'disabled':''}>
        <span class="letter">${LETTERS[i]}</span><span>${esc(o)}</span></button>`;
    }).join('');
    const explain = saved ? `<div class="explain"><div class="verdict ${saved.correct?'ok':'no'}">${saved.correct?'✓ נכון!':'✗ התשובה: '+LETTERS[q.ans]}</div><div>${q.why}</div></div>` : '';
    return `<div style="margin-top:16px">
      <div class="q-stem" dir="ltr" style="font-size:15px">${qi+1}. ${esc(q.stem)}</div>
      <div class="options">${opts}</div>${explain}</div>`;
  }).join('');

  const nav = RC.map((pp,i)=>`<button class="subtab ${i===idx?'active':''}" data-action="rc-passage" data-i="${i}">קטע ${i+1}: ${esc(pp.title)}</button>`).join('');

  return `<div style="margin-bottom:12px;display:flex;gap:8px;flex-wrap:wrap">${nav}</div>
  <div class="card">
    <div class="quiz-head"><span class="quiz-counter">📖 ${esc(p.title)}</span>
    <span class="quiz-counter">קראו קודם בסקירה (skim), אחר כך חפשו את התשובה (scan)</span></div>
    ${passage}${qs}
  </div>`;
}

/* ---- Simulation ---- */
function buildSim() {
  const pick = (arr,n) => { const a = arr.slice(); const out=[]; while(out.length<n && a.length){ out.push(a.splice(Math.floor(pseudo()*a.length),1)[0]); } return out; };
  const scQ = pick(SC,8).map(q=>({type:'sc',q}));
  const rsQ = pick(RS,4).map(q=>({type:'rs',q}));
  const passage = pick(RC,1)[0];
  const rcQ = passage.qs.map(q=>({type:'rc',q,passage}));
  const questions = scQ.concat(rsQ).concat(rcQ);
  return { questions, answers:{}, remaining: 18*60, finished:false, passageTitle:passage.title };
}
// tiny deterministic-ish pseudo random seeded by time-of-call counter
let _seed = 1;
function pseudo(){ _seed = (_seed*9301 + 49297) % 233280; return _seed/233280; }

RENDER.sim = function () {
  if (!ui.sim) return simIntro();
  if (ui.sim.finished) return simResult();
  return simExam();
};

function simIntro() {
  const rows = state.sims.slice().reverse().map((s,i) => {
    const b = scoreBand(s.est);
    return `<tr><td>${state.sims.length - i}</td><td>${esc(s.date)}</td>
      <td>${s.correct}/${s.total}</td><td><b>~${s.est}</b></td>
      <td><span class="pill ${b.cls}">${b.label}</span></td></tr>`;
  }).join('');
  const history = state.sims.length ? `
    <div class="card"><h3>היסטוריית סימולציות</h3>
    <div class="tbl-wrap"><table class="tbl sim-history">
      <tr><th>#</th><th>תאריך</th><th>ציון גולמי</th><th>הערכת ציון</th><th>רמה</th></tr>${rows}
    </table></div>
    <p style="color:var(--muted);font-size:13px;margin-top:10px">הערכת הציון היא <b>קירוב</b> בלבד (המבחן האמיתי אדפטיבי). השתמשו בה למעקב מגמה.</p>
    </div>` : '';

  return `
  <div class="page-head"><span class="eyebrow">סימולציה</span>
    <h1>מבחן מדומה בתנאי אמת</h1>
    <p>17 שאלות (8 השלמה + 4 ניסוח + קטע קריאה עם 5 שאלות), טיימר של 18 דקות. עשו אותה בשקט, בלי הפרעות — כמו במבחן.</p>
  </div>
  <div class="card">
    <h3>⏱️ לפני שמתחילים</h3>
    <ul style="padding-inline-start:18px;color:var(--muted)">
      <li>סביבה שקטה, בלי טלפון.</li>
      <li>אין קנס על טעות — <b>ענו על הכל</b>, גם בניחוש.</li>
      <li>בסוף תקבלו פירוק לפי סוג שאלה + הערכת ציון + התשובות ייכנסו לניתוח.</li>
    </ul>
    <button class="btn" data-action="sim-start">התחל סימולציה ▶</button>
  </div>${history}`;
}

function simExam() {
  const s = ui.sim;
  const answeredN = Object.keys(s.answers).length;
  const pct = Math.round(answeredN / s.questions.length * 100);
  const typeLabel = { sc:'השלמת משפטים', rs:'ניסוח מחדש', rc:'הבנת הנקרא' };

  const blocks = s.questions.map((item,i) => {
    const q = item.q;
    const chosen = s.answers[q.id];
    let passageHtml = '';
    if (item.type==='rc' && (i===0 || s.questions[i-1].type!=='rc')) {
      passageHtml = `<div class="passage" dir="ltr">${item.passage.passage.map(par=>`<p>${esc(par)}</p>`).join('')}</div>`;
    }
    const opts = q.opts.map((o,oi)=>`<button class="option ${chosen===oi?'correct':''}" style="${chosen===oi?'':''}" data-action="sim-answer" data-qid="${q.id}" data-choice="${oi}">
      <span class="letter">${LETTERS[oi]}</span><span>${esc(o)}</span></button>`).join('');
    return `${passageHtml}<div class="sim-q" id="simq-${q.id}">
      <div class="tag">שאלה ${i+1} · ${typeLabel[item.type]}</div>
      <div class="q-stem" dir="ltr" style="font-size:15.5px">${esc(q.stem)}</div>
      <div class="options">${opts}</div></div>`;
  }).join('');

  const mm = String(Math.floor(s.remaining/60)).padStart(2,'0');
  const ss = String(s.remaining%60).padStart(2,'0');

  return `
  <div class="sim-timer">
    <span class="clock ${s.remaining<=60?'low':''}" id="simClock">${mm}:${ss}</span>
    <div class="progress" style="flex:1"><i style="width:${pct}%"></i></div>
    <span class="quiz-counter">${answeredN}/${s.questions.length}</span>
    <button class="btn sm" data-action="sim-submit">סיים והצג ציון</button>
  </div>
  ${blocks}
  <div class="quiz-foot"><span style="color:var(--muted);font-size:13px">💡 ענו על כל השאלות — אין קנס על טעות.</span>
  <button class="btn" data-action="sim-submit">סיים והצג ציון</button></div>`;
}

function simResult() {
  const s = ui.sim;
  const byType = { sc:{c:0,t:0}, rs:{c:0,t:0}, rc:{c:0,t:0} };
  let correct = 0;
  s.questions.forEach(item => {
    const q = item.q; byType[item.type].t++;
    const chosen = s.answers[q.id];
    const ok = chosen === q.ans;
    if (ok) { correct++; byType[item.type].c++; }
  });
  const total = s.questions.length;
  const est = Math.max(50, Math.min(150, Math.round(50 + correct/total*100)));
  const band = scoreBand(est);
  const typeLabel = { sc:'השלמת משפטים', rs:'ניסוח מחדש', rc:'הבנת הנקרא' };
  const breakdown = ['sc','rs','rc'].map(t=>{
    const b = byType[t]; const pct = b.t?Math.round(b.c/b.t*100):0;
    return `<div class="stat"><div class="k">${typeLabel[t]}</div><div class="v">${b.c}/${b.t}</div>
      <div class="progress" style="margin-top:8px"><i style="width:${pct}%"></i></div></div>`;
  }).join('');

  // review list
  const review = s.questions.map((item,i)=>{
    const q = item.q; const chosen = s.answers[q.id];
    const ok = chosen===q.ans;
    return `<div class="sim-q">
      <div class="tag">${i+1} · ${typeLabel[item.type]} ${ok?'<span class="pill good">נכון</span>':'<span class="pill bad">טעות</span>'}</div>
      <div class="q-stem" dir="ltr" style="font-size:14.5px">${esc(q.stem)}</div>
      <div style="font-size:14px;margin-top:6px" dir="ltr"><b>Your answer:</b> ${chosen!=null?LETTERS[chosen]+'. '+esc(q.opts[chosen]):'—'} ${ok?'✓':'✗'}</div>
      ${!ok?`<div style="font-size:14px" dir="ltr"><b>Correct:</b> ${LETTERS[q.ans]}. ${esc(q.opts[q.ans])}</div><div class="explain"><div>${q.why}</div></div>`:''}
    </div>`;
  }).join('');

  return `
  <div class="page-head"><span class="eyebrow">תוצאות סימולציה</span></div>
  <div class="card">
    <div class="sim-result-score">
      <div class="big" style="color:var(--primary-600)">~${est}</div>
      <div>ציון מוערך · <span class="pill ${band.cls}" style="font-size:14px">${band.label}</span></div>
      <p style="color:var(--muted);font-size:13px;margin-top:8px">${correct}/${total} תשובות נכונות. זהו קירוב למעקב מגמה — לא ציון רשמי.</p>
    </div>
    <div class="grid cols-3" style="margin-top:10px">${breakdown}</div>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn" data-action="sim-again">סימולציה נוספת ↻</button>
      <button class="btn ghost" data-action="nav" data-section="errors">ליומן הטעויות →</button>
    </div>
  </div>
  <div class="card"><h3>סקירת התשובות</h3>${review}</div>`;
}

let simClockId = null;
function startSimClock() {
  clearInterval(simClockId);
  simClockId = setInterval(() => {
    if (!ui.sim || ui.sim.finished) { clearInterval(simClockId); return; }
    ui.sim.remaining--;
    const el = $('#simClock');
    if (el) {
      const mm = String(Math.floor(ui.sim.remaining/60)).padStart(2,'0');
      const ss = String(ui.sim.remaining%60).padStart(2,'0');
      el.textContent = mm+':'+ss;
      el.classList.toggle('low', ui.sim.remaining<=60);
    }
    if (ui.sim.remaining <= 0) { clearInterval(simClockId); finishSim(true); }
  }, 1000);
}
function finishSim(auto) {
  clearInterval(simClockId);
  const s = ui.sim;
  let correct = 0;
  s.questions.forEach(item => { if (s.answers[item.q.id] === item.q.ans) correct++; });
  const total = s.questions.length;
  const est = Math.max(50, Math.min(150, Math.round(50 + correct/total*100)));
  const now = new Date();
  const date = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  state.sims.push({ date, total, correct, est });
  // add wrong answers to error log
  s.questions.forEach(item => {
    const q = item.q; const chosen = s.answers[q.id];
    if (chosen !== q.ans) {
      const typeLabel = { sc:'השלמת משפטים', rs:'ניסוח מחדש', rc:'הבנת הנקרא' }[item.type];
      addError(typeLabel, q.stem, chosen!=null?('בחרתי '+LETTERS[chosen]+', הנכון '+LETTERS[q.ans]):'לא ענתה (סימולציה)', '');
    }
  });
  s.finished = true;
  save();
  if (auto) toast('⏰ הזמן נגמר — הסימולציה הוגשה');
  render();
}

/* ---- Errors ---- */
function addError(type, q, reason, fix) {
  state.errors.push({ type, q, reason:reason||'', fix:fix||'', date: todayStr() });
}
function todayStr(){ const n=new Date(); return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0'); }

RENDER.errors = function () {
  if (!state.errors.length) {
    return `<div class="page-head"><span class="eyebrow">יומן טעויות</span><h1>יומן הטעויות</h1>
      <p>כל טעות בתרגול/סימולציה נכנסת לכאן אוטומטית. חזרה על היומן שווה יותר מ-100 שאלות חדשות.</p></div>
      <div class="card"><div class="empty-state"><div class="big">📓</div>
      <p>עדיין אין טעויות מתועדות. התחילו לתרגל — או הוסיפו טעות ידנית.</p>
      <button class="btn sm" data-action="err-add">+ הוסף טעות ידנית</button></div></div>`;
  }
  const rows = state.errors.map((e,i) => `
    <div class="err-row">
      <div class="type-badge pill ${e.type&&e.type.indexOf('ניסוח')>-1?'warn':(e.type&&e.type.indexOf('הבנת')>-1?'core':'extra')}">${esc(e.type||'—')}<br><small>${esc(e.date||'')}</small></div>
      <div><div style="font-size:13px;color:var(--muted);margin-bottom:4px" dir="ltr">${esc((e.q||'').slice(0,120))}${(e.q||'').length>120?'…':''}</div>
        <textarea rows="2" data-action="err-edit" data-i="${i}" data-f="reason" placeholder="סיבת הטעות…">${esc(e.reason||'')}</textarea></div>
      <div><textarea rows="2" data-action="err-edit" data-i="${i}" data-f="fix" placeholder="התיקון / הכלל שלמדתי…">${esc(e.fix||'')}</textarea></div>
      <button class="del" data-action="err-del" data-i="${i}" title="מחק">🗑</button>
    </div>`).join('');
  return `
  <div class="page-head"><span class="eyebrow">יומן טעויות</span><h1>יומן הטעויות (${state.errors.length})</h1>
    <p>מלאו את <b>סיבת הטעות</b> ואת <b>התיקון</b> לכל שורה. אם אותה סיבה חוזרת — זה הנושא מספר 1 לחזור עליו.</p></div>
  <div style="margin-bottom:12px;display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn sm" data-action="err-add">+ הוסף טעות ידנית</button>
    <button class="btn ghost sm" data-action="err-clear">נקה יומן</button>
  </div>${rows}`;
};

/* ---- Exam day ---- */
RENDER.examday = function () {
  const chk = CHECKLIST.map(c => `<label class="task ${state.checklist[c.id]?'done':''}">
    <input type="checkbox" data-action="check-toggle" data-id="${c.id}" ${state.checklist[c.id]?'checked':''}>
    <div class="body"><div class="txt">${esc(c.text)}</div></div></label>`).join('');
  const done = CHECKLIST.filter(c=>state.checklist[c.id]).length;

  return `
  <div class="page-head"><span class="eyebrow">יום המבחן</span><h1>הפלייבוק ליום המבחן</h1>
    <p>קראו את זה ביום 4. המטרה: להיכנס רגועים ולתרגם את כל העבודה לציון.</p></div>

  <div class="grid cols-2">
    <div class="card"><h3>⏱️ ניהול זמן</h3><ul style="padding-inline-start:18px">
      <li>עקבו אחרי הטיימר של כל בלוק. נתקעתם? <b>סמנו, נחשו, המשיכו</b>.</li>
      <li>לא יותר מ~1 דקה על שאלת השלמה/ניסוח בודדת.</li>
      <li>הבנת הנקרא: 2–3 דק׳ סקירה, ~12 דק׳ שאלות.</li>
    </ul></div>
    <div class="card"><h3>🎲 ניחוש חכם</h3><ul style="padding-inline-start:18px">
      <li><b>אף שאלה לא נשארת ריקה</b> — אין קנס על טעות.</li>
      <li>פסלו מסיחים ודאיים — כל פסילה מכפילה סיכוי.</li>
      <li>ניסוח מחדש: פסלו מי שמוסיף מידע/מקצין.</li>
      <li>השלמה: לכו על מסיח שמתאים לטון (חיובי/שלילי).</li>
    </ul></div>
    <div class="card"><h3>🧠 אסטרטגיה אדפטיבית</h3><ul style="padding-inline-start:18px">
      <li>ריכוז מלא מהשאלה הראשונה — ההתחלה קובעת את רמת הקושי.</li>
      <li>אל תנתחו אם שאלה "קלה/קשה מדי" — פשוט פתרו.</li>
      <li>דיוק לפני מהירות בהתחלה.</li>
    </ul></div>
    <div class="card"><h3>💻 אמירנט מהבית (בדקו יום לפני)</h3><ul style="padding-inline-start:18px">
      <li>מצלמה, מיקרופון, אינטרנט יציב, דפדפן מעודכן.</li>
      <li>חדר שקט, תאורה טובה, שולחן פנוי.</li>
      <li>תעודת זהות מוכנה לאימות.</li>
    </ul></div>
  </div>

  <div class="card">
    <h3>✅ צ׳קליסט מוכנוּת (${done}/${CHECKLIST.length})</h3>
    <div class="progress" style="margin:8px 0 14px"><i style="width:${Math.round(done/CHECKLIST.length*100)}%"></i></div>
    ${chk}
  </div>
  <div class="callout key" style="margin-top:16px">בהצלחה! 🍀 עבדתם לפי התוכנית — אתם מגיעים מוכנים. שלושת הדברים: <b>אוצר מילים · טכניקות · לא להשאיר ריק</b>.</div>`;
};

/* =======================================================================
   5) EVENTS — delegation
   ======================================================================= */
document.addEventListener('click', function (e) {
  const t = e.target.closest('[data-action]');
  const a = t ? t.dataset.action : null;

  // Auto-dismiss the tools dropdown and the mobile nav menu on any outside click
  if (a !== 'tools-toggle' && !e.target.closest('#toolsMenu')) closeMenus();
  if (a !== 'menu-toggle' && !e.target.closest('#sidebar')) closeSidebar();

  if (!t) return;

  switch (a) {
    case 'nav': ui.section = t.dataset.section; closeSidebar(); render(); break;
    case 'menu-toggle': toggleSidebar(); break;
    case 'tools-toggle': toggleTools(); break;
    case 'theme-toggle': toggleTheme(); break;
    case 'export': exportData(); closeMenus(); break;
    case 'import': $('#importFile').click(); closeMenus(); break;
    case 'reset': resetData(); closeMenus(); break;

    case 'toggle-task': /* handled by change */ break;
    case 'plan-day': ui.planDay = +t.dataset.i; render(); break;

    case 'toggle-module':
      state.modules[t.dataset.id] = !state.modules[t.dataset.id]; save(); render();
      toast(state.modules[t.dataset.id]?'סומן כנלמד ✓':'הסימון בוטל'); break;

    case 'vocab-filter': ui.vocabFilter = t.dataset.k; ui.vocabIndex = 0; ui.vocabFlipped = false; render(); break;
    case 'flip-card': ui.vocabFlipped = !ui.vocabFlipped; render(); break;
    case 'vocab-next': vocabMove(1); break;
    case 'vocab-prev': vocabMove(-1); break;
    case 'vocab-known': vocabMark(true); break;
    case 'vocab-review-mark': vocabMark(false); break;

    case 'practice-tab': ui.practiceType = t.dataset.type; render(); break;
    case 'strat-toggle': e.preventDefault(); ui.stratOpen = !ui.stratOpen; render(); break;
    case 'answer': answerQuestion(t.dataset.type, t.dataset.qid, +t.dataset.choice); break;
    case 'practice-next': practiceMove(t.dataset.type, 1); break;
    case 'practice-prev': practiceMove(t.dataset.type, -1); break;
    case 'rc-passage': ui.pIndex.rc = +t.dataset.i; render(); break;

    case 'sim-start': _seed = (Date.now?Date.now():1) % 233280 || 7; ui.sim = buildSim(); render(); break;
    case 'sim-answer': ui.sim.answers[t.dataset.qid] = +t.dataset.choice; markSimAnswer(t.dataset.qid, +t.dataset.choice); break;
    case 'sim-submit': if (confirm('לסיים את הסימולציה ולהציג ציון?')) finishSim(false); break;
    case 'sim-again': ui.sim = null; render(); break;

    case 'err-add': addError('כללי','', '', ''); save(); render(); break;
    case 'err-del': state.errors.splice(+t.dataset.i,1); save(); render(); break;
    case 'err-clear': if(confirm('לנקות את כל יומן הטעויות?')){ state.errors=[]; save(); render(); } break;

    case 'set-exam-date': break;
    default: break;
  }
});

/* close the menu / sidebar with the Escape key */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { closeMenus(); closeSidebar(); }
});

/* change events (checkboxes, date, textareas) */
document.addEventListener('change', function (e) {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;
  if (a === 'toggle-task') {
    state.tasks[t.dataset.id] = t.checked; save();
    // light update without full re-render for the plan tab
    const label = t.closest('.task'); if (label) label.classList.toggle('done', t.checked);
    if (ui.section==='plan') updatePlanTabs();
    updateSideProgress();
  } else if (a === 'check-toggle') {
    state.checklist[t.dataset.id] = t.checked; save(); render();
  } else if (a === 'set-exam-date') {
    state.examDate = t.value || null; save(); render();
  } else if (a === 'vocab-reviewonly') {
    ui.vocabReviewOnly = t.checked; ui.vocabIndex = 0; render();
  } else if (a === 'import-file') {
    /* handled below */
  }
});

document.addEventListener('input', function (e) {
  const t = e.target.closest('[data-action="err-edit"]');
  if (!t) return;
  const i = +t.dataset.i, f = t.dataset.f;
  if (state.errors[i]) { state.errors[i][f] = t.value; save(); }
});

$('#importFile').addEventListener('change', function (e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const data = JSON.parse(reader.result);
      state = Object.assign(defaultState(), data);
      applyTheme(); save(); render(); toast('התקדמות יובאה בהצלחה ✓');
    } catch (err) { toast('שגיאה: קובץ לא תקין'); }
  };
  reader.readAsText(file);
  e.target.value = '';
});

/* helpers for events */
function updatePlanTabs() {
  document.querySelectorAll('.day-tab').forEach((tab,i) => {
    const d = PLAN[i]; const done = d.tasks.filter(x=>state.tasks[x.id]).length;
    const pct = Math.round(done/d.tasks.length*100);
    const bar = tab.querySelector('.mini i'); if (bar) bar.style.width = pct+'%';
    const t = tab.querySelector('.t'); if (t) t.textContent = done+'/'+d.tasks.length+' משימות';
  });
}
function vocabMove(dir) {
  const deck = vocabDeck(); if (!deck.length) return;
  ui.vocabIndex = (ui.vocabIndex + dir + deck.length) % deck.length;
  ui.vocabFlipped = false; render();
}
function vocabMark(known) {
  const deck = vocabDeck(); if (!deck.length) return;
  const w = deck[ui.vocabIndex];
  const st = state.vocab[w.id] || { box:1, known:false, seen:0 };
  st.seen = (st.seen||0)+1;
  if (known) { st.known = true; st.box = Math.min(5,(st.box||1)+1); }
  else { st.known = false; st.box = 1; }
  state.vocab[w.id] = st; save();
  // advance to next card
  const nd = vocabDeck();
  if (!nd.length) { ui.vocabFlipped=false; render(); return; }
  if (ui.vocabReviewOnly) { if (ui.vocabIndex>=nd.length) ui.vocabIndex=0; }
  else ui.vocabIndex = (ui.vocabIndex+1) % nd.length;
  ui.vocabFlipped = false; render();
}
function answerQuestion(type, qid, choice) {
  const bank = type==='sc'?SC : type==='rs'?RS : allRC();
  const q = bank.find(x=>x.id===qid); if (!q) return;
  if (state.practice[type][qid]) return; // already answered
  const correct = choice === q.ans;
  state.practice[type][qid] = { chosen:choice, correct };
  if (!correct) {
    const typeLabel = { sc:'השלמת משפטים', rs:'ניסוח מחדש', rc:'הבנת הנקרא' }[type];
    addError(typeLabel, q.stem, 'בחרתי '+LETTERS[choice]+', הנכון '+LETTERS[q.ans], '');
  }
  save(); render();
  updateSideProgress();
}
function allRC(){ const out=[]; RC.forEach(p=>p.qs.forEach(q=>out.push(q))); return out; }
function practiceMove(type, dir) {
  const len = type==='rc'?RC.length:(type==='sc'?SC.length:RS.length);
  ui.pIndex[type] = (ui.pIndex[type] + dir + len) % len;
  render();
}
function markSimAnswer(qid, choice) {
  // update just the buttons of this question (avoid full re-render → keep scroll & timer)
  const wrap = $('#simq-'+qid); if (!wrap) { render(); return; }
  wrap.querySelectorAll('.option').forEach((b,i)=>b.classList.toggle('correct', i===choice));
  // update counter + progress bar
  const s = ui.sim; const answeredN = Object.keys(s.answers).length;
  const pct = Math.round(answeredN/s.questions.length*100);
  const bar = document.querySelector('.sim-timer .progress i'); if (bar) bar.style.width = pct+'%';
  const cnt = document.querySelector('.sim-timer .quiz-counter'); if (cnt) cnt.textContent = answeredN+'/'+s.questions.length;
}

/* menus / sidebar / theme */
function toggleSidebar() {
  const sb = $('#sidebar'), sc = $('.scrim');
  const open = sb.classList.toggle('open'); sc.hidden = !open;
}
function closeSidebar() { $('#sidebar').classList.remove('open'); $('.scrim').hidden = true; }
function toggleTools() { const m = $('#toolsMenu'); m.hidden = !m.hidden; }
function closeMenus() { const m = $('#toolsMenu'); if (m && !m.hidden) m.hidden = true; }
function toggleTheme() {
  state.theme = state.theme==='dark' ? 'light' : 'dark'; applyTheme(); save();
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const btn = document.querySelector('[data-action="theme-toggle"]');
  if (btn) btn.textContent = state.theme==='dark' ? '☀️' : '🌙';
}

/* data tools */
function exportData() {
  const blob = new Blob([JSON.stringify(state,null,2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'amiram-progress-'+todayStr()+'.json'; a.click();
  URL.revokeObjectURL(url); toast('קובץ גיבוי נוצר ⬇︎');
}
function resetData() {
  if (!confirm('לאפס את כל ההתקדמות? פעולה זו אינה הפיכה. שקלו לייצא גיבוי קודם.')) return;
  state = defaultState(); applyTheme(); save(); ui.sim=null; render(); toast('ההתקדמות אופסה');
}

/* =======================================================================
   6) INIT
   ======================================================================= */
applyTheme();
render();

})();
