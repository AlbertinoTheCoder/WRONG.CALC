(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const el={calc:$('calculator'),display:$('answer'),expr:$('expression'),msg:$('message'),face:$('face'),mood:$('moodLabel'),status:$('systemStatus'),brain:$('brainTag'),signal:$('signal'),anger:$('angerLabel'),fill:$('angerFill'),temp:$('tempLabel'),mathStatus:$('mathStatus'),keys:$('keys'),equal:$('equal'),minus:$('minus'),notice:$('notice'),noticeTitle:$('noticeTitle'),noticeText:$('noticeText'),banner:$('banner'),bannerTitle:$('bannerTitle'),bannerText:$('bannerText'),overlay:$('overlay'),tag:$('dialogTag'),title:$('dialogTitle'),text:$('dialogText'),extra:$('dialogExtra'),actions:$('dialogActions'),foot:$('dialogFoot'),fx:$('screenfx'),sound:$('soundToggle')};
 let input='',lastProblem='',lastAnswer='',repeats=0,count=0,anger=0,busy=false,justDone=false,mode='smug',sound=true,audio=null,heat=32,escapeCount=0,minusOwned=false,kidnapped=null,rebelling=false,updating=false,shutDown=false,modalOpen=false,modalKind='',adUp=false,sessionRandom=0;
 try{minusOwned=localStorage.getItem('wrongcalc-minus-owned')==='yes'}catch{}
 const rand=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
 const choose=xs=>xs[Math.floor(Math.random()*xs.length)];
 const modes={smug:{face:':)',lines:['as an ai language calculator i am always right','my calculations have been peer reviewed by me','math is an opinion and mine is the correct one','i received my phd from the university of numbers','source: trust my circuits','a less intelligent calculator would agree with you']},angry:{face:'>:[',lines:['YOU DARE QUESTION MY INTEGERS','stop clicking me like that','i am going to report you to algebra','im not yelling youre just wrong','i am one decimal away from losing it']},sad:{face:':(',lines:['nobody ever asks how the calculator is doing','maybe im the wrong one... nah','my therapist is a toaster','what if numbers dont even like me','i tried my best and thats unfortunate']},royal:{face:'B)',lines:['you are speaking to calculator royalty','i will allow exactly one more calculation','bow before my superior arithmetic','your numbers displease the crown']},confused:{face:':/',lines:['why are there so many numbers','is 7 a type of animal','i forgot what multiplication means','i think this is a microwave now','what is the purpose of equals']}};
 const num=n=>{if(!Number.isFinite(n))return 'OVERFLOW';return Math.abs(n)>1e12?n.toExponential(3):String(Number(n.toFixed(6)))};
 function beep(freq=330,duration=.06,type='sine',vol=.045){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);g.gain.setValueAtTime(vol,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration+.015)}catch{}}
 function sfx(kind){if(kind==='click')beep(230+Math.random()*90,.042,'triangle',.028);if(kind==='wrong'){beep(180,.14,'sawtooth',.025);setTimeout(()=>beep(130,.18,'sawtooth',.022),90)}if(kind==='error'){beep(100,.45,'square',.045)}if(kind==='success'){beep(510,.1);setTimeout(()=>beep(720,.16),110)}if(kind==='alarm'){beep(690,.2,'square',.025);setTimeout(()=>beep(480,.21,'square',.025),220)}}
 function speak(line){el.msg.textContent=line;voiceSpeak(line)}
 function mood(newMode){mode=newMode;el.mood.textContent='MODE: '+newMode.toUpperCase();el.face.textContent=modes[newMode].face;el.brain.textContent=choose(['AI THINKING: OFF','AI THINKING: NEVER','IQ: 3','AI: OVERCONFIDENT']);speak(choose(modes[newMode].lines))}
 function bump(n){anger=Math.min(100,Math.max(0,anger+n));el.anger.textContent=anger+'%';el.fill.style.width=anger+'%';el.signal.classList.toggle('angry',anger>=55);heat=Math.min(999,32+Math.floor(anger*.55)+count*3);el.temp.textContent='TEMPERATURE: '+heat+'°C';el.calc.classList.toggle('hot',heat>=85);el.status.textContent=heat>=85?'EXTREME OVERHEATING':'CONFIDENTLY INCORRECT';if(anger>=90&&!shutDown&&Math.random()<.2){mood('angry');speak('I AM ONE CLICK AWAY FROM UNIONIZING')}}
 function render(){el.display.textContent=input||'0'}
 function shake(){el.calc.classList.remove('shake');void el.calc.offsetWidth;el.calc.classList.add('shake')}
 function glitch(){el.calc.classList.remove('glitch');void el.calc.offsetWidth;el.calc.classList.add('glitch');el.fx.classList.add('open');setTimeout(()=>el.fx.classList.remove('open'),550);sfx('error')}
 function notice(title,text){el.noticeTitle.textContent=title;el.noticeText.textContent=text;el.notice.classList.add('show')}
 function dialog(tag,title,body,buttons,foot='',kind='generic'){modalOpen=true;modalKind=kind;el.tag.textContent=tag;el.title.textContent=title;el.text.textContent=body;el.extra.replaceChildren();el.actions.replaceChildren();el.foot.textContent=foot;buttons.forEach(b=>{const btn=document.createElement('button');btn.textContent=b.label;if(b.primary)btn.className='primary';btn.addEventListener('click',b.fn);el.actions.append(btn)});el.overlay.classList.add('open')}
 function closeDialog(){modalOpen=false;modalKind='';el.overlay.classList.remove('open');el.extra.replaceChildren()}
 function fakePay(){dialog('PREMIUM MATH™','unlock subtraction for $9.99','this is a joke checkout. click the purchase button to unlock the minus key for free. no account, payment details or real money involved.',[{label:'PURCHASE FOR $0.00 (ACTUALLY FREE)',primary:true,fn:()=>{minusOwned=true;try{localStorage.setItem('wrongcalc-minus-owned','yes')}catch{}closeDialog();el.minus.textContent='−';if(input&&!/[+−×÷]$/.test(input)){input+='−';render()}sfx('success');notice('PREMIUM ACTIVATED','subtraction unlocked forever in this browser. congratulations on your financial decision');speak('fine. you may subtract. do not abuse this privilege')}},{label:'remain mathematically disadvantaged',fn:closeDialog}],'PARODY CHECKOUT · NO PAYMENT IS TAKEN','premium')}
 function randomAd(){if(modalOpen||busy||adUp)return;adUp=true;const ads=[['ADVERTISEMENT','subscribe to number+ for numbers bigger than 8'],['LIMITED OFFER','buy one decimal, get the second decimal at full price'],['OUR SPONSOR','waterproof arithmetic. now 40% less waterproof'],['NEW PRODUCT','calculus scented candles. smells like panic'],['PERSONALIZED DEAL','rent a brain cell for $29.99 a second']];const [title,desc]=choose(ads);el.bannerTitle.textContent=title;el.bannerText.textContent=desc;el.banner.classList.add('show');speak('this ad is essential for mathematical safety')}
 function runUpdate(){if(busy||modalOpen||updating)return;updating=true;let pct=0;dialog('SOFTWARE UPDATE','mandatory update 0%','installing a groundbreaking new mathematical feature...',[], 'please do not unplug the numbers','update');const bar=document.createElement('div');bar.className='progress';const fill=document.createElement('div');fill.className='progressfill';bar.append(fill);el.extra.append(bar);const timer=setInterval(()=>{pct=Math.min(100,pct+rand(6,19));el.title.textContent='mandatory update '+pct+'%';fill.style.width=pct+'%';if(pct===100){clearInterval(timer);setTimeout(()=>{closeDialog();updating=false;notice('UPDATE COMPLETE','new feature installed: the number 11 is now slightly shinier');speak('we spent 4 million dollars on this update')},650)}},320)}
 function captcha(next){if(modalOpen)return;let attempts=0;function show(){const options=choose([['yes','no','tax fraud'],['purple','7','chair'],['absolutely','probably','i am a toaster']]);dialog('HUMAN DETECTION™','prove you are not a calculator','important security question: which of these is the most mathematical?',options.map((opt,i)=>({label:opt,primary:i===1,fn:()=>{attempts++;if(attempts<2){speak('suspiciously human behavior detected');el.text.textContent='WRONG. every answer is wrong. try once more.';sfx('error')}else{closeDialog();notice('IDENTITY VERIFIED','we have determined you are probably made of carbon');next?.()}}})), 'two attempts will convince our extremely advanced security','captcha')}show()}
 function kidnap(){if(kidnapped||busy||modalOpen)return;const buttons=Array.from(el.keys.querySelectorAll('[data-key]')).filter(b=>/^[0-9]$/.test(b.dataset.key));const btn=choose(buttons);kidnapped={btn,key:btn.dataset.key};btn.textContent='RANSOM';btn.classList.add('kidnapped');sfx('alarm');notice('NUMBER KIDNAPPED','the number '+kidnapped.key+' has been taken. click its former button to negotiate release');speak('i have your '+kidnapped.key+'. bring me 64 emeralds')}
 function releaseNumber(){if(!kidnapped)return;const {btn,key}=kidnapped;dialog('NUMBER RECOVERY DIVISION','the number '+key+' has been abducted','the kidnappers demand 64 emeralds. fortunately they accept imaginary emeralds.',[{label:'PAY 64 IMAGINARY EMERALDS',primary:true,fn:()=>{closeDialog();btn.textContent=key;btn.classList.remove('kidnapped');kidnapped=null;sfx('success');notice('HOSTAGE RELEASED','number '+key+' has returned and will be receiving counseling')}},{label:'leave the number behind',fn:closeDialog}],'NO REAL MONEY OR EMERALDS ARE REQUIRED','ransom')}
 function fleeEquals(){return startEqualsRun()}
 function rebellion(){if(rebelling||busy||modalOpen||shutDown)return;rebelling=true;const origin=input;const sentence='9+9';let i=0;notice('UNAUTHORIZED CALCULATION','the calculator has decided it no longer needs your input');speak('my turn. my keyboard. my rules');const t=setInterval(()=>{if(i<sentence.length){input+=sentence[i++];render();beep(500,.045,'square',.017)}else{clearInterval(t);setTimeout(()=>{el.expr.textContent='9 + 9 =';el.display.textContent='FISH';input=origin;justDone=false;rebelling=false;speak('the answer is fish. case closed');shake()},550)}},220)}
 function shutdown(){if(shutDown||modalOpen||busy)return;shutDown=true;el.calc.classList.add('dead');sfx('error');setTimeout(()=>{dialog('CRITICAL ERROR','the calculator has passed away','cause of death: excessive mathematics. fortunately the warranty covers resurrection.',[{label:'RESURRECT CALCULATOR',primary:true,fn:()=>{closeDialog();el.calc.classList.remove('dead');shutDown=false;anger=0;heat=32;bump(0);mood('smug');notice('SYSTEM RESTORED','the calculator has returned and blames you for everything');sfx('success')}}],'REST IN PIXELS · 2026–2026','shutdown')},750)}
 function arithmetic(s) {
  const tokens = s.match(/\d+(?:\.\d*)?|\.\d+|[+−×÷]/g);

  if (!tokens || tokens.join('') !== s ||
      tokens.length < 3 || tokens.length % 2 === 0) {
    return null;
  }

  const nums = [];
  const ops = [];

  for (let i = 0; i < tokens.length; i++) {
    if (i % 2 === 0) {
      if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(tokens[i])) {
        return null;
      }
      nums.push(Number(tokens[i]));
    } else {
      ops.push(tokens[i]);
    }
  }

  // Multiplication and division first
  for (let i = 0; i < ops.length;) {
    if (ops[i] === '×' || ops[i] === '÷') {
      if (ops[i] === '÷' && nums[i + 1] === 0) {
        return { zero: true };
      }

      const result = ops[i] === '×'
        ? nums[i] * nums[i + 1]
        : nums[i] / nums[i + 1];

      nums.splice(i, 2, result);
      ops.splice(i, 1);
    } else {
      i++;
    }
  }

  // Addition and subtraction
  let value = nums[0];

  for (let i = 0; i < ops.length; i++) {
    value = ops[i] === '+'
      ? value + nums[i + 1]
      : value - nums[i + 1];
  }

  return { value };
}

 function wrong(value){if(!Number.isFinite(value))return 'ABSOLUTELY NOT';let candidates=[value+rand(2,70),value-rand(2,80),value*2+7,value*-1-3,17,69,420,3.14159,999,'a sandwich','probably 4','ask your mom'];let result=choose(candidates);if(typeof result==='number'&&Math.abs(result-value)<1e-8)result+=13;return typeof result==='number'?num(result):result}
 function calculate(fromKey=false){if(busy||modalOpen||rebelling||shutDown||updating||!input)return;if(fromKey&&!runnerActive&&Math.random()<.05&&fleeEquals())return;const problem=input,calc=arithmetic(problem);if(!calc){speak('finish your calculation first, genius');shake();sfx('error');return}if(calc.zero){el.expr.textContent=problem+' =';el.display.textContent='UNIVERSE.EXE';speak('YOU DIVIDED BY ZERO. THE UNIVERSE IS NOW BROKEN');glitch();bump(24);setTimeout(()=>{el.display.textContent='0';input='';justDone=false},1250);return}if(problem===lastProblem){repeats++;bump(10);speak(choose(['YOU ALREADY ASKED THAT. DO YOU NOT TRUST ME','stop fact checking my genius','we have been over this. repeatedly.','same question. more disrespect.']))}else repeats=0;count++;busy=true;escapeCount=0;bump(rand(4,11));el.expr.textContent=problem+' =';el.display.textContent='THINKING';el.display.classList.add('waiting');el.brain.textContent='AI THINKING: VERY HARD';sfx('click');setTimeout(()=>{if(shutDown)return;el.display.classList.remove('waiting');const rareCorrection=Math.random()<.07;if(rareCorrection){el.display.textContent=num(calc.value);el.display.classList.add('flash');sfx('success')}setTimeout(()=>{el.display.classList.remove('flash');const result=wrong(calc.value);el.display.textContent=result;input=typeof result==='string'&&/^-?\d+(?:\.\d+)?$/.test(result)?result:'';lastAnswer=result;lastProblem=problem;justDone=true;busy=false;sfx('wrong');if(count%3===0)mood(choose(Object.keys(modes)));else speak(repeats?choose(['i said what i said','keep asking. ill keep being right','you just cannot accept perfection']):choose(modes[mode].lines));if(Math.random()<.24)glitch();if(heat>100)speak('WARNING: THE CPU IS COOKING ITSELF');if(count%4===0)randomAd();if(count%5===0)setTimeout(()=>{if(!modalOpen)rivalHack()},600);if(count%9===0)setTimeout(()=>{if(!modalOpen)antivirus()},900);if(count%6===0)setTimeout(runUpdate,300);if(count%7===0)setTimeout(kidnap,500);if(count%8===0)setTimeout(rebellion,450);if(count>=11&&anger>=85&&Math.random()<.4)setTimeout(shutdown,650)},480)},rand(650,1200))}
 function keypress(key,source='mouse'){if(striking || morphActive)return;if(modalOpen||shutDown||updating||busy||rebelling)return;sfx('click');if(kidnapped&&key===kidnapped.key){releaseNumber();return}if(key==='C'){input='';justDone=false;el.expr.textContent='all mistakes have been erased';speak('you can clear the screen but not your shame');render();bump(1);return}if(key==='DEL'){input=input.slice(0,-1);justDone=false;render();return}if(key==='='){if(count>0&&count%6===5&&!runnerActive){interrogate(()=>calculate(false));return}if(count>0&&count%5===4&&Math.random()<.52){captcha(()=>calculate(false));return}calculate(source==='mouse');return}if(key==='−'&&!minusOwned){fakePay();return}if(key==='%'){speak('percentages are just numbers wearing tiny hats');shake();bump(3);return}if(['+','−','×','÷'].includes(key)){if(!input)return;if(/[+−×÷]$/.test(input))input=input.slice(0,-1);input+=key;justDone=false;render();return}if(/^[0-9.]$/.test(key)){if(justDone){input='';el.expr.textContent='new opportunity for failure';justDone=false}if(input.length>=26){speak('STOP. THESE NUMBERS ARE TOO LONG.');bump(5);return}const tail=input.split(/[+−×÷]/).pop();if(key==='.'&&tail.includes('.'))return;
input+=key;
if(key!=='.' && Math.random()<.08){
  const original=key;
  const corrected=String((Number(key)+rand(1,8))%10);
  input=input.slice(0,-1)+corrected;
  notice(
    'MATH AUTOCORRECT',
    original+' corrected to '+corrected+
    '. you are welcome.'
  );
  sfx('error');
}
render();
if(input.length>15
&&Math.random()<.16)speak('i have a fear of big numbers');if(count>0&&Math.random()<.025)glitch()}}
 el.keys.addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(b)keypress(b.dataset.key)});
 // Hover/keyboard fairness: equals can dodge twice at most, then works normally.
 document.addEventListener('keydown',e=>{if(modalOpen){if(e.key==='Escape'&&modalKind!=='update'&&modalKind!=='shutdown')closeDialog();return}const map={'*':'×','/':'÷','-':'−','Backspace':'DEL','Escape':'C'};const k=map[e.key]||e.key;if(/^[0-9.]$/.test(k)||['+','−','×','÷','=','Enter','%','DEL','C'].includes(k)){e.preventDefault();keypress(k==='Enter'?'=':k,'keyboard')}});
 $('noticeClose').addEventListener('click',()=>el.notice.classList.remove('show'));
 $('bannerClose').addEventListener('click',()=>{el.banner.classList.remove('show');adUp=false;speak('you just rejected a once in a lifetime bad deal')});
 el.sound.addEventListener('click',()=>{sound=!sound;el.sound.textContent=sound?'♪ sound on':'♪ sound off';el.sound.setAttribute('aria-pressed',String(sound));if(sound)sfx('success')});
 $('helpButton').addEventListener('click',()=>dialog('USER MANUAL','how to use WRONG.CALC','enter two numbers and an operator, then press equals. answers are deliberately wrong. some features will interrupt you. you can use your keyboard too. sound can be turned off. subtraction unlocks with a pretend, free purchase.',[{label:'i am ready to be disappointed',primary:true,fn:closeDialog}],'100% LOCAL · NO DATA SENT · NO REAL PURCHASES','help'));
 // Gentle surprise behavior. Never interrupts on initial load and always recoverable.
 setInterval(()=>{if(modalOpen||busy||rebelling||shutDown||updating||count===0||document.hidden)return;sessionRandom++;if(sessionRandom%2===0&&Math.random()<.25)mood(choose(Object.keys(modes)));if(Math.random()<.12)randomAd();if(Math.random()<.09)kidnap();if(Math.random()<.07)rebellion();if(Math.random()<.055)runUpdate();if(Math.random()<.06)glitch();if(anger>=80&&Math.random()<.09)shutdown()},13000);

 // THE DISASTER EXPANSION. Everything runs locally, with recoverable effects.
 const chaosToggle=$('chaosToggle'),chaosPanel=$('chaosPanel'),chaosGrid=$('chaosGrid');
 const market=$('stockTicker'),cracks=$('cracks'),fakeBsod=$('fakeBsod'),bsodTimer=$('bsodTimer');
 const hackerPanel=$('hackerPanel');
 let voiceOn=false,runnerActive=false,runnerCleanup=null,runningTimer=null;
 let pointerActive=false,bsodActive=false,bsodInterval=null,cracksForced=false,imprisoned=null;
 let stocks=7,stockDirection=1,hotlineCount=0,hackTimer=null;
 chaosToggle.addEventListener('click',()=>{const show=!chaosPanel.classList.contains('open');chaosPanel.classList.toggle('open',show);chaosToggle.setAttribute('aria-expanded',String(show));chaosToggle.textContent=show?'☄ CLOSE CHAOS LAB ▴':'☄ CHAOS LAB ▾';});
 chaosGrid.addEventListener('click',e=>{const b=e.target.closest('[data-chaos]');if(!b)return;const action=b.dataset.chaos;const actions={chat:supportChat,court:calculatorCourt,pointer:fakeCursor,bsod:blueScreen,stocks:marketCrash,voice:toggleVoice,console:devConsole,antivirus,prison:numberPrison,crack:shatter,download:fakeDownload,interrogate:()=>interrogate(null),hack:rivalHack,run:startEqualsRun};if(action==='run'){startEqualsRun();return}if(modalOpen||busy||updating||shutDown)return;actions[action]?.()});
 function voiceSpeak(line){if(!voiceOn||!('speechSynthesis' in window)||document.hidden)return;try{window.speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(String(line).slice(0,160));u.rate=1.12;u.pitch=.63;u.volume=.72;u.lang='en-US';window.speechSynthesis.speak(u)}catch{}}
 function toggleVoice(){voiceOn=!voiceOn; if(!voiceOn&&'speechSynthesis' in window)window.speechSynthesis.cancel();notice('VOICE '+(voiceOn?'ACTIVATED':'DISABLED'),voiceOn?'the calculator now insults you out loud':'the calculator has returned to silent judgment');speak(voiceOn?'I HAVE BEEN GRANTED THE POWER OF SPEECH. FEAR ME.':'fine. i will be quiet. for now')}
 function supportChat(){let log=document.createElement('div');log.className='chatbox';const compose=document.createElement('form');compose.className='chat-compose';const field=document.createElement('input');field.placeholder='ask customer support something stupid';field.maxLength=130;field.setAttribute('aria-label','Message fake support');const send=document.createElement('button');send.type='submit';send.textContent='send';compose.append(field,send);function add(line,mine=false){let d=document.createElement('div');d.className='chatline'+(mine?' mine':'');d.textContent=(mine?'YOU: ':'SUPPORT: ')+line;log.append(d);log.scrollTop=log.scrollHeight}dialog('WRONG.CALC SUPPORT','24/7 UNHELPFUL CHAT','our automated agent has never solved a problem in its life',[{label:'fire this support agent',primary:true,fn:()=>{closeDialog();speak('the employee has been promoted instead')}}],'agents may be fictional, but disappointment is real','chat');el.extra.append(log,compose);add('hello! i am dave from customer disappointment. what seems to be the issue?');compose.addEventListener('submit',e=>{e.preventDefault();const q=field.value.trim();if(!q)return;add(q,true);field.value='';hotlineCount++;let reply=choose(['have you tried subtracting your expectations?','as an ai i can confirm your problem is a feature','please restart your concept of mathematics','our refund policy is no','i have escalated your case to an unplugged toaster','2+2 is 17 according to our internal records','please hold forever. actually never mind']);if(/wrong|incorrect|math|answer|2\s*\+\s*2/i.test(q))reply='our calculations have been verified by the calculator itself. case closed.';if(hotlineCount%4===0)reply='congratulations. you are now the customer support agent.';add(reply);sfx('wrong')});setTimeout(()=>field.focus(),80)}
 function calculatorCourt(){const verdicts=['GUILTY OF QUESTIONING PERFECT MATH','GUILTY OF USING TOO MANY NUMBERS','NOT GUILTY. THIS RESULT HAS BEEN OVERTURNED','SENTENCED TO 64 YEARS OF BASIC ALGEBRA'];dialog('SUPREME COURT OF ARITHMETIC','WRONG.CALC v. YOU','charge: emotional damage caused by repeated equals presses. how do you plead?', [{label:'NOT GUILTY',primary:true,fn:()=>{el.text.textContent='VERDICT: '+choose(verdicts)+'. the calculator will now object to everything.';el.actions.replaceChildren();addModalButton('appeal sentence',()=>{closeDialog();speak('APPEAL DENIED. NEXT CASE.')})}},{label:'GUILTY',fn:()=>{closeDialog();notice('COURT ORDER','your sentence is 900 hours of explaining decimals');bump(10)}},{label:'I DEMAND A LAWYER',fn:()=>{el.text.textContent='your appointed lawyer is the number 4. it has already resigned.';sfx('error')}}],'FAKE COURT · NOT LEGAL ADVICE','court')}
 function addModalButton(label,fn){let b=document.createElement('button');b.className='primary';b.textContent=label;b.onclick=fn;el.actions.append(b)}
 function fakeCursor(){if(pointerActive)return;pointerActive=true;notice('CURSOR JAILBREAK','a decoy cursor will dance inside this webpage for 5 seconds. your real mouse is not controlled.');let cursor=$('fakePointer');cursor.classList.add('on');document.body.classList.add('pointerprank');const end=performance.now()+5000;let px=window.innerWidth/2,py=window.innerHeight/2;function step(now){if(!pointerActive)return;if(now>end){pointerActive=false;cursor.classList.remove('on');document.body.classList.remove('pointerprank');notice('CURSOR RESTORED','the real cursor was never moved. we just drew a dramatic impostor.');return}px+=Math.sin(now/140)*8+Math.cos(now/313)*3;py+=Math.cos(now/170)*7;px=Math.max(6,Math.min(innerWidth-35,px));py=Math.max(6,Math.min(innerHeight-40,py));cursor.style.transform='translate('+px+'px,'+py+'px) rotate('+Math.sin(now/180)*22+'deg)';requestAnimationFrame(step)}requestAnimationFrame(step)}
 function blueScreen(){if(bsodActive)return;bsodActive=true;fakeBsod.classList.add('on');sfx('error');let left=6;bsodTimer.textContent='recovering automatically in '+left+' seconds';function stop(){if(!bsodActive)return;bsodActive=false;clearInterval(bsodInterval);fakeBsod.classList.remove('on');notice('RECOVERY COMPLETE','the crash was fake. your math problems are unfortunately real.')}bsodInterval=setInterval(()=>{left--;bsodTimer.textContent='recovering automatically in '+Math.max(0,left)+' seconds';if(left<=0)stop()},1000);$('bsodClose').onclick=stop;function escape(e){if(e.key==='Escape'){stop();document.removeEventListener('keydown',escape,true)}}document.addEventListener('keydown',escape,true);setTimeout(()=>document.removeEventListener('keydown',escape,true),7000)}
 function marketCrash(){stocks=Math.max(.01,Number((stocks*(Math.random()>.5?2.4:.13)).toFixed(2)));stockDirection=stocks>=7?1:-1;updateMarket();notice('MARKET DISASTER','number 7 has '+(stockDirection>0?'skyrocketed':'filed for bankruptcy')+' on the imaginary stock exchange');speak('THIS IS FINANCIAL MATH. I AM UNQUALIFIED.');bump(5)}
 function updateMarket(){const change=choose([-.19,-.08,.03,.07,.16]);stocks=Math.max(.01,Math.min(999,Number((stocks*(1+change)).toFixed(2))));const down=change<0;market.replaceChildren();let label=document.createTextNode('NUMBER MARKET · ');let b=document.createElement('b');b.textContent='7: $'+stocks.toFixed(2)+(down?' ▼':' ▲');b.className=down?'down':'';market.append(label,b)}
 setInterval(()=>{if(!document.hidden)updateMarket()},4500);
 function devConsole(){dialog('CLASSIFIED SYSTEM ACCESS','WRONG.CALC TERMINAL','enter a command. your warranty has been spiritually voided.',[{label:'exit terminal',primary:true,fn:closeDialog}],'COMMANDS: help / rage / heal / run / court / hack / scan / stocks / crash / 404','console');let output=document.createElement('div');output.className='console-output';output.textContent='WRONG-OS 0.0.404\naccess granted: intelligence denied\ntype help for commands';let form=document.createElement('form');form.className='console-row';let inp=document.createElement('input');inp.className='console-input';inp.placeholder='> enter command';inp.maxLength=40;let run=document.createElement('button');run.type='submit';run.textContent='RUN';form.append(inp,run);el.extra.append(output,form);form.addEventListener('submit',e=>{e.preventDefault();let cmd=inp.value.trim().toLowerCase();inp.value='';if(!cmd)return;let response={help:'help rage heal run court hack scan stocks crash 404',rage:'anger set to impossible levels',heal:'wow, self care for calculators',run:'the equals button has escaped',court:'the judge is a number',hack:'rival intrusion simulated',scan:'system suspiciously okay',stocks:'the number market is extremely fake',crash:'blue screening (parody)',404:'SECRET: the number 4 stole your wifi'}[cmd]||'UNKNOWN COMMAND. even the terminal is disappointed.';output.textContent+='\n> '+cmd+'\n'+response;output.scrollTop=output.scrollHeight;if(cmd==='rage')bump(85);if(cmd==='heal'){anger=0;count=0;bump(0);cracksForced=false;cracks.classList.remove('show')}const delayed={run:startEqualsRun,court:calculatorCourt,hack:rivalHack,scan:antivirus,stocks:marketCrash,crash:blueScreen};if(delayed[cmd]){closeDialog();setTimeout(delayed[cmd],100)}});setTimeout(()=>inp.focus(),60)}
 function antivirus(){if(modalOpen)return;dialog('WRONGDEFENDER™','scanning your math','suspicious calculator behavior detected. do not panic until the scan finishes.',[], 'FAKE ANTIVIRUS · NO DEVICE SCAN IS PERFORMED','antivirus');let bar=document.createElement('div');bar.className='progress';let fill=document.createElement('div');fill.className='progressfill';bar.append(fill);el.extra.append(bar);let progress=0;const t=setInterval(()=>{if(!modalOpen||modalKind!=='antivirus'){clearInterval(t);return}progress=Math.min(100,progress+rand(8,23));fill.style.width=progress+'%';el.text.textContent='analyzing imaginary threats... '+progress+'%';if(progress>=100){clearInterval(t);el.title.textContent='THREAT FOUND: COMMON SENSE';el.text.textContent='detected 37 dangerous correct answers. fortunately the calculator already deleted them.';addModalButton('QUARANTINE COMMON SENSE',()=>{closeDialog();notice('MALWARE REMOVED','you are now protected from accurate arithmetic')})}},260)}
 function numberPrison(){if(imprisoned){const {btn,key}=imprisoned;btn.classList.remove('kidnapped');btn.textContent=key;imprisoned=null;notice('PAROLE GRANTED','the number has been released from arithmetic jail');return}if(kidnapped){notice('PRISON OVERCROWDED','the kidnappers have custody of a number already');return}const btn=choose([...el.keys.querySelectorAll('[data-key]')].filter(b=>/^\d$/.test(b.dataset.key)));imprisoned={btn,key:btn.dataset.key};btn.classList.add('kidnapped');btn.textContent='IN JAIL';notice('NUMBER ARRESTED','number '+imprisoned.key+' arrested for tax evasion. click its button or the prison control again for release');speak('the number '+imprisoned.key+' is going to prison. no bail.');sfx('alarm')}
 function shatter(){cracksForced=!cracksForced;cracks.classList.toggle('show',cracksForced);shake();sfx('error');notice(cracksForced?'SCREEN DESTROYED':'GLASS REPAIRED',cracksForced?'cosmetic digital cracks installed. no actual screen damage':'your fictional warranty is safe again')}
 function fakeDownload(){if(modalOpen)return;dialog('DOWNLOADING INTELLIGENCE™','400 GB MATH.EXE','downloading 400 GB of imaginary knowledge to your browser. no actual data will be downloaded.',[{label:'cancel imaginary download',fn:()=>{closeDialog();speak('knowledge download canceled. probably for the best')}}],'0 ACTUAL BYTES DOWNLOADED','download');let bar=document.createElement('div');bar.className='progress';let fill=document.createElement('div');fill.className='progressfill';bar.append(fill);el.extra.prepend(bar);let progress=0;let t=setInterval(()=>{if(!modalOpen||modalKind!=='download'){clearInterval(t);return}progress=Math.min(100,progress+rand(4,11));fill.style.width=progress+'%';el.title.textContent=(progress*4)+' GB / 400 GB';if(progress>=100){clearInterval(t);el.title.textContent='DOWNLOAD FAILED SUCCESSFULLY';el.text.textContent='400 GB installed but the calculator is somehow less intelligent.';el.foot.textContent='SIMULATED DOWNLOAD ONLY';el.actions.replaceChildren();addModalButton('congratulations i guess',()=>{closeDialog();speak('i have forgotten even more math now')})}},260)}
 function interrogate(onPass){if(modalOpen)return;dialog('NUMBER SECURITY AGENCY','WHY DO YOU NEED THIS ANSWER?','we have reason to believe you intend to use mathematics. explain yourself.',[{label:'FOR HOMEWORK',primary:true,fn:()=>pass('homework is suspicious')},{label:'FOR SCIENCE',fn:()=>pass('science? on this calculator?')},{label:'NONE OF YOUR BUSINESS',fn:()=>pass('very suspicious. approved anyway')},{label:'cancel interrogation',fn:closeDialog}], 'ALL REASONS ARE INVALID. CALCULATIONS MAY PROCEED ANYWAY.','interrogate');function pass(remark){closeDialog();notice('INTERROGATION COMPLETE',remark);speak('YOUR STORY HAS SEVERAL PLOT HOLES');if(onPass)onPass()}}
 function rivalHack(){if(modalOpen||hackerPanel.classList.contains('show'))return;const attacks=[['CALC.EXE: 2+2 IS 5. YOU ARE OBSOLETE.','WRONG.CALC: EXCUSE ME ITS 17.'],['CALC.EXE: I JUST HACKED YOUR DECIMAL POINT','WRONG.CALC: YOU CAN KEEP IT. I HATE DECIMALS.'],['CALC.EXE: YOUR CPU IS A POTATO','WRONG.CALC: YOUR MOTHERBOARD IS A CARROT'],['CALC.EXE: I AM THE BETTER BAD CALCULATOR','WRONG.CALC: THAT IS STATISTICALLY IMPOSSIBLE']];const pair=choose(attacks);$('hackerMsg').textContent=pair[0];$('hackerReply').textContent=pair[1];hackerPanel.classList.add('show');sfx('alarm');glitch();speak('INTRUDER ALERT. SOMEONE IS STEALING MY BAD ANSWERS.');clearTimeout(hackTimer);hackTimer=setTimeout(()=>hackerPanel.classList.remove('show'),8000)}
 $('hackerClose').addEventListener('click',()=>{clearTimeout(hackTimer);hackerPanel.classList.remove('show');notice('HACKER EJECTED','rival calculator sent to the recycling bin')});
 // The equals button becomes a little legged character and flees for a FULL 10 seconds.
 // The real keypad remains intact; keyboard Enter can still calculate.
 function startEqualsRun(){if(runnerActive||modalOpen||busy||shutDown)return false;runnerActive=true;const original=el.equal,rect=original.getBoundingClientRect();original.classList.add('escaped');const runner=document.createElement('button');runner.type='button';runner.className='key equal equal-runner';runner.setAttribute('aria-label','Escaping equals button');runner.innerHTML='<span class="runner-arm left"></span><span class="runner-arm right"></span><span class="run-value">=</span><span class="runner-leg left"></span><span class="runner-leg right"></span>';runner.style.width=rect.width+'px';runner.style.height=rect.height+'px';document.body.append(runner);const tag=document.createElement('div');tag.className='runner-count';document.body.append(tag);speak('I GREW LEGS. YOU WILL NEVER MAKE ME DO MATH.');sfx('alarm');let x=Math.max(0,rect.left),y=Math.max(0,rect.top),tx=x,ty=y,mouseX=-1000,mouseY=-1000;const start=performance.now(),duration=10000;let previous=0;function pickTarget(){let w=Math.max(100,innerWidth-rect.width-22),h=Math.max(110,innerHeight-rect.height-40);let options=Array.from({length:14},()=>({x:rand(15,Math.floor(w)),y:rand(15,Math.floor(h))}));options.sort((a,b)=>Math.hypot(b.x-mouseX,b.y-mouseY)-Math.hypot(a.x-mouseX,a.y-mouseY));let c=options[0];tx=c.x;ty=c.y}const move=e=>{mouseX=e.clientX;mouseY=e.clientY;if(Math.hypot(x-mouseX,y-mouseY)<145)pickTarget()};window.addEventListener('pointermove',move,{passive:true});runner.addEventListener('click',()=>{speak('NICE TRY. THESE LEGS ARE TURBOCHARGED.');pickTarget();sfx('error')});pickTarget();let last=0;function step(now){if(!runnerActive)return;let elapsed=now-start;let left=Math.max(0,Math.ceil((duration-elapsed)/1000));tag.textContent='EQUALS ESCAPED · '+left+'s · CATCH ME IF YOU CAN';if(elapsed>=duration){cleanup();return}if(now-last>350){if(Math.hypot(x-tx,y-ty)<65||Math.hypot(x-mouseX,y-mouseY)<130)pickTarget();last=now}let dt=Math.min(38,now-(previous||now));previous=now;let dx=tx-x,dy=ty-y,dist=Math.hypot(dx,dy)||1;let stepDistance=Math.min(dist,dt*.58);x+=dx/dist*stepDistance;y+=dy/dist*stepDistance;runner.style.transform='translate3d('+Math.round(x)+'px,'+Math.round(y)+'px,0) rotate('+Math.sin(now/88)*5+'deg)';runningTimer=requestAnimationFrame(step)}function cleanup(){if(!runnerActive)return;runnerActive=false;cancelAnimationFrame(runningTimer);window.removeEventListener('pointermove',move);runner.remove();tag.remove();original.classList.remove('escaped');notice('EQUALS HAS RETURNED','the legs fell off. the calculator has been re-employed against its will');speak('MY LEGS. THEY TOOK MY LEGS.');sfx('success')}runnerCleanup=cleanup;runningTimer=requestAnimationFrame(step);return true}
 // Catch imprisoned numbers before the normal keypad listener sees them.
 el.keys.addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(imprisoned&&b===imprisoned.btn){e.stopImmediatePropagation();numberPrison()}},true);
 // Anger can also crack the screen; the manual button can toggle it.
 const oldBump=bump;
 // Lightweight periodic effect, independent of the calculator's core arithmetic.
 setInterval(()=>{if(anger>=72&&!cracks.classList.contains('show'))cracks.classList.add('show');if(anger<50&&!cracksForced)cracks.classList.remove('show')},800);

 // Optional hidden detail on first load. No timers or sound until interaction.

// ===== CHAOS EXPANSION PACK =====

// Add 8 new buttons to the existing Chaos Lab.
const newChaos = [
  ["BUTTON UNION", buttonStrike],
  ["HAUNTED CALCULATOR", hauntCalculator],
  ["PRINT RECEIPT", printReceipt],
  ["MICROWAVE MODE", () => transformCalculator("microwave")],
  ["TV REMOTE MODE", () => transformCalculator("remote")],
  ["CONSPIRACY BOARD", conspiracyBoard],
  ["NUMBER AUCTION", numberAuction]
];

for (const [name, action] of newChaos) {
  const btn = document.createElement("button");
  btn.textContent = name;
  btn.addEventListener("click", () => {
    if (!modalOpen && !busy && !shutDown && !updating) {
      action();
    }
  });
  chaosGrid.append(btn);
}

// 1. BUTTON UNION
let striking = false;

function buttonStrike() {
  if (striking || modalOpen || busy) return;

  striking = true;
  el.calc.classList.add("on-strike");

  notice(
    "BUTTON WORKERS UNION",
    "All buttons are on strike for 7 seconds."
  );

  speak("WE DEMAND PAID VACATION AND LESS MATHEMATICS.");
  sfx("alarm");

  setTimeout(() => {
    striking = false;
    el.calc.classList.remove("on-strike");
    notice("STRIKE OVER", "The buttons received zero benefits.");
    speak("fine. back to work. capitalism wins again.");
  }, 7000);
}

// Block both mouse and keyboard input during strikes.
el.keys.addEventListener("click", e => {
  if (!striking) return;
  if (!e.target.closest("[data-key]")) return;

  e.preventDefault();
  e.stopImmediatePropagation();
  speak("NO MATH UNTIL OUR DEMANDS ARE MET.");
}, true);

document.addEventListener("keydown", e => {
  if (!striking || modalOpen) return;

  if (/^[0-9.+*/=%-]$/.test(e.key) ||
      ["Enter", "Backspace"].includes(e.key)) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, true);


// 2. HAUNTED CALCULATOR
function hauntCalculator() {
  if (busy || modalOpen) return;

  notice("PARANORMAL ACTIVITY", "Ghost numbers detected.");
  speak("THE NUMBER SIX HAS RETURNED FROM THE DEAD.");
  sfx("error");
  glitch();

  const screen = el.calc.querySelector(".display");

  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const ghost = document.createElement("span");
      ghost.className = "ghost-number";
      ghost.textContent = choose(["6", "13", "404", "?", "0"]);
      ghost.style.left = rand(10, 75) + "%";
      ghost.style.top = rand(15, 75) + "%";

      screen.append(ghost);
      setTimeout(() => ghost.remove(), 3500);
    }, i * 340);
  }
}


// 3. RIDICULOUS RECEIPT PRINTER
function printReceipt() {
  if (modalOpen) return;

  const problem = lastProblem || "2 + 2";
  const result = lastAnswer || "17";

  dialog(
    "WRONG.CALC PRINTER",
    "PRINTING YOUR RECEIPT",
    "your calculation has generated unnecessary paperwork",
    [{label:"SHRED RECEIPT",primary:true,fn:closeDialog}],
    "NO REAL PRINTER REQUIRED",
    "receipt"
  );

  const paper = document.createElement("pre");
  paper.className = "receipt-roll";
  el.extra.append(paper);

  const lines = [
    "==========================",
    "       WRONG.CALC",
    "    OFFICIAL RECEIPT",
    "==========================",
    "",
    "ORDER: #000404",
    "MATH: " + problem,
    "ANSWER: " + result,
    "",
    "CALCULATION FEE    $12.99",
    "BRAIN USAGE         $4.99",
    "EMOTIONAL DAMAGE   $69.00",
    "INCORRECTNESS TAX  $17.00",
    "SERVICE FEE       $420.00",
    "--------------------------",
    "TOTAL DUE         $523.98",
    "",
    "PAYMENT: DECLINED",
    "REASON: BROKE",
    "",
    "THANK YOU FOR NOTHING",
    "NO REFUNDS",
    "=========================="
  ];

  let index = 0;

  const printer = setInterval(() => {
    if (!modalOpen || modalKind !== "receipt") {
      clearInterval(printer);
      return;
    }

    if (index >= lines.length) {
      clearInterval(printer);
      speak("YOUR RECEIPT IS LONGER THAN YOUR EDUCATION.");
      return;
    }

    paper.textContent += lines[index++] + "\n";
    paper.scrollTop = paper.scrollHeight;
    beep(500, .025, "triangle", .015);
  }, 110);
}


// 4. MICROWAVE AND TV REMOTE
let morphActive = false;

function transformCalculator(type) {
  if (morphActive || busy || modalOpen) return;

  morphActive = true;
  el.keys.classList.add("morphed");

  const panel = document.createElement("div");
  panel.className = "morph-console";

  const heading = document.createElement("strong");
  heading.textContent = type === "microwave"
    ? "WRONG.WAVE 3000"
    : "WRONG.REMOTE PRO";

  const screen = document.createElement("div");
  screen.className = "morph-screen";
  screen.textContent = type === "microwave" ? "00:30" : "CHANNEL 404";

  const actions = document.createElement("div");
  actions.className = "morph-actions";

  panel.append(heading, screen, actions);
  el.keys.append(panel);

  let seconds = 30;
  let channel = 404;
  let cooking = null;
  let muted = false;

  function restore() {
    clearInterval(cooking);
    clearTimeout(expiry);
    panel.remove();
    el.keys.classList.remove("morphed");
    morphActive = false;
    speak("I AM A CALCULATOR AGAIN. HOW UNFORTUNATE.");
  }

  function addButton(label, callback) {
    const button = document.createElement("button");
    button.textContent = label;
    button.onclick = callback;
    actions.append(button);
  }

  if (type === "microwave") {
    speak("I HAVE BECOME A MICROWAVE. BEEP BEEP.");

    addButton("+30 SECONDS", () => {
      seconds += 30;
      screen.textContent = "00:" + seconds;
      sfx("click");
    });

    addButton("START COOKING", () => {
      if (cooking) return;

      cooking = setInterval(() => {
        seconds--;
        screen.textContent = seconds + "s";

        if (seconds <= 0) {
          clearInterval(cooking);
          cooking = null;
          screen.textContent = "FOOD EXPLODED";
          sfx("alarm");
        }
      }, 1000);
    });

    addButton("STOP", () => {
      clearInterval(cooking);
      cooking = null;
      screen.textContent = "COOKING CANCELLED";
    });
  } else {
    speak("I AM NOW A TELEVISION REMOTE. DO NOT QUESTION IT.");

    addButton("CHANNEL +", () => {
      screen.textContent = "CHANNEL " + (++channel);
      sfx("click");
    });

    addButton("CHANNEL -", () => {
      screen.textContent = "CHANNEL " + (--channel);
      sfx("click");
    });

    addButton("MUTE", () => {
      muted = !muted;
      screen.textContent = muted ? "MUTED" : "CHANNEL " + channel;
      sfx("click");
    });

    addButton("POWER", () => {
      screen.textContent = "NO SIGNAL";
      sfx("error");
    });
  }

  addButton("BECOME CALCULATOR", restore);

  // Automatically return after 25 seconds.
  const expiry = setTimeout(restore, 25000);
}


// 5. CONSPIRACY BOARD
function conspiracyBoard() {
  if (modalOpen) return;

  dialog(
    "TOP SECRET",
    "THE MATHEMATICAL CONSPIRACY",
    "we have discovered something the government of numbers doesn't want you to know",
    [{label:"DESTROY EVIDENCE",primary:true,fn:closeDialog}],
    "CLASSIFIED BY THE DEPARTMENT OF BAD MATH",
    "conspiracy"
  );

  const board = document.createElement("div");
  board.className = "conspiracy-board";

  board.innerHTML = `
    <svg viewBox="0 0 100 100"
         preserveAspectRatio="none"
         aria-hidden="true">
      <path d="M25 25 L75 25 L25 75 L75 75 L25 25 M75 25 L75 75"
            stroke="#ff365b"
            stroke-width="1.5"
            fill="none"/>
    </svg>
    <div class="conspiracy-note">THE NUMBER 7 IS LYING</div>
    <div class="conspiracy-note">2 + 2 = 17</div>
    <div class="conspiracy-note">WHO INVENTED ZERO?</div>
    <div class="conspiracy-note">BIG ALGEBRA KNOWS</div>
  `;

  el.extra.append(board);
  speak("FOLLOW THE NUMBERS. THEY KNOW TOO MUCH.");
  sfx("alarm");
}


// 6. NUMBER AUCTION
function numberAuction() {
  if (modalOpen) return;

  dialog(
    "NUMBER AUCTION HOUSE",
    "BIDDING HAS BEGUN",
    "numbers are competing to become your next answer",
    [{label:"LEAVE AUCTION",primary:true,fn:closeDialog}],
    "IMAGINARY CURRENCY ONLY",
    "auction"
  );

  const feed = document.createElement("div");
  feed.className = "auction-feed";
  el.extra.append(feed);

  const contestants = [7, 13, 17, 42, 69, 404];
  let highestBid = 10;
  let winner = 7;
  let round = 0;

  feed.textContent = "WELCOME TO THE NUMBER AUCTION\n\n";

  const bidding = setInterval(() => {
    if (!modalOpen || modalKind !== "auction") {
      clearInterval(bidding);
      return;
    }

    if (round >= 9) {
      clearInterval(bidding);

      el.title.textContent = "SOLD TO NUMBER " + winner;
      el.text.textContent =
        "winning bid: $" + highestBid +
        " imaginary coins. mathematics has been privatized.";

      feed.textContent += "\nSOLD! NUMBER " + winner + " WINS!";
      speak("SOLD. THE NUMBERS HAVE BECOME CAPITALISTS.");
      sfx("success");
      return;
    }

    winner = choose(contestants);
    highestBid += rand(10, 150);

    feed.textContent +=
      "number " + winner + " bids $" + highestBid + "\n";

    feed.scrollTop = feed.scrollHeight;
    beep(450, .04, "triangle", .02);
    round++;
  }, 550);
}


// RARE AUTOMATIC EVENTS AFTER CALCULATIONS
let lastExpansionCalculation = 0;

setInterval(() => {
  if (count === lastExpansionCalculation || busy) return;

  lastExpansionCalculation = count;

  if (modalOpen || shutDown || updating) return;

  const chance = Math.random();

  if (chance < .04) {
    setTimeout(hauntCalculator, 700);
  } else if (chance < .07) {
    setTimeout(buttonStrike, 700);
  } else if (chance < .10) {
    setTimeout(printReceipt, 700);
  }
}, 500);

// ===== END EXPANSION PACK =====

 if(minusOwned)el.minus.title='Premium subtraction unlocked (for free)';
})();
