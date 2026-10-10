
// ═══════════════════════════════════════════════════════
//  STATE  (localStorage-backed, plug Supabase here later)
// ═══════════════════════════════════════════════════════
const SK = 'hcic_v2';
function gs(){ return JSON.parse(localStorage.getItem(SK)||'null') || defaultState(); }
function ss(d){ localStorage.setItem(SK, JSON.stringify(d)); }
function upd(fn){ const s=gs(); fn(s); ss(s); }

function uid(){ return Math.random().toString(36).slice(2,10); }
function today(){ return new Date().toISOString().slice(0,10); }

function defaultState(){
  return {
    coaches:[
      {id:'c1',name:'Dr. Mohammad M. Siddiqui',title:'Founder & Chief Wellness Officer',specialty:'Holistic Health & Wellness Coaching',bio:'With 30 years of experience in the healthcare sector, Dr. Siddiqui\'s journey spans health & wellness coaching, health education & awareness and medical imaging technologies. His coaching approach is personalized, empathetic, and rooted in functional medicine principles, aimed at creating long-lasting health transformations.',email:'mhs@hcicvision.com',phone:'+1 647 839 0271',color:'#0B3347',active:true},
      {id:'c2',name:'Dr. Afshin M. Siddiqui',title:'Integrative Mental Health Coach',specialty:'Integrative Mental Health Coaching',bio:'With years of experience in health and wellness, Dr. Afshin specializes in integrative mental health & wellness, with a particular focus on the psychological aspects of overall health. She helps individuals build resilience, enhance emotional well-being, and navigate the challenges of modern life with empathy and personalized strategies.',email:'afshin@hcicvision.com',phone:'+1 647 839 0271',color:'#17B8CC',active:true}
    ],
    availability:{
      c1:{0:[],1:['09:00','10:00','11:00','14:00','15:00','16:00'],2:['09:00','10:00','11:00','14:00','15:00','16:00'],3:['09:00','10:00','11:00','14:00','15:00','16:00'],4:['09:00','10:00','11:00','14:00','15:00','16:00'],5:['09:00','10:00','11:00'],6:[]},
      c2:{0:[],1:['10:00','11:00','14:00','15:00'],2:['10:00','11:00','14:00','15:00'],3:['10:00','11:00','14:00','15:00'],4:['10:00','11:00','14:00','15:00'],5:['10:00','11:00'],6:[]}
    },
    bookings:[
      {id:'b1',customerId:'cu1',coachId:'c1',service:'Holistic Health & Wellness Coaching',date:'2026-10-14',time:'10:00',status:'confirmed',notes:'Initial session',price:250,createdAt:'2026-10-09'},
      {id:'b2',customerId:'cu2',coachId:'c2',service:'Integrative Mental Health Coaching',date:'2026-10-15',time:'14:00',status:'pending',notes:'Follow-up session',price:180,createdAt:'2026-10-09'}
    ],
    customers:[
      {id:'cu1',name:'Sarah Johnson',email:'sarah.j@email.com',phone:'+1 416 555 0101',dob:'1985-03-14',goals:'Stress management and better sleep',createdAt:'2026-09-15'},
      {id:'cu2',name:'Ahmed Al-Rashid',email:'ahmed.r@email.com',phone:'+1 647 555 0202',dob:'1978-07-22',goals:'Anxiety management and work-life balance',createdAt:'2026-09-28'}
    ],
    transactions:[
      {id:'t1',type:'income',amount:250,description:'Wellness Session — Sarah Johnson',category:'Coaching',date:'2026-10-08'},
      {id:'t2',type:'income',amount:180,description:'Mental Health Coaching — Ahmed Al-Rashid',category:'Coaching',date:'2026-10-07'},
      {id:'t3',type:'expense',amount:49.99,description:'Zoom subscription',category:'Software',date:'2026-10-01'},
      {id:'t4',type:'income',amount:320,description:'Corporate Wellness Workshop — Tech Co.',category:'Workshops',date:'2026-10-05'},
      {id:'t5',type:'expense',amount:120,description:'Marketing materials',category:'Marketing',date:'2026-10-03'}
    ],
    settings:{
      promo:{enabled:true,title:'Free 30-Min Discovery Call',text:'Take the first step toward total wellness. Book a complimentary session with one of our expert health coaches today.',cta:'Book Free Call',bg:'#0B3347'},
      promoSeen:false,
      content:{heroTitle:'Holistic Health. Measurable Results.',heroSub:'Canada-based coaching and innovation consultancy serving individuals, workplaces, and healthcare organizations worldwide.',heroCta:'Book Your Session',philosophy:'At HCIC Vision, we view health as a dynamic balance between the physical, mental, and social aspects of life. True well-being goes beyond the absence of illness — it is about nurturing all dimensions of health.',phone:'+1 647 839 0271',email:'mhs@hcicvision.com'},
      adminPwd:'admin2024',
      adminAuth:false
    }
  };
}

// ═══════════════════════════════════════════════════════
//  ROUTER
// ═══════════════════════════════════════════════════════
let _page = 'home';
function navigate(pg){
  _page = pg;
  // hide all pages
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  // hide footer & show for public pages
  const pub = ['home','services','coaches','booking','about'];
  document.getElementById('main-footer').style.display = pub.includes(pg)?'block':'none';
  // close mobile nav
  document.getElementById('nav-links').classList.remove('open');
  // activate page
  const el = document.getElementById('p-'+pg);
  if(el){ el.classList.add('on'); }
  // update nav active
  document.querySelectorAll('.nav-links [data-page]').forEach(a=>{
    a.classList.toggle('active', a.dataset.page===pg);
  });
  // scroll top
  window.scrollTo(0,0);
  // render
  if(pg==='home') renderHome();
  if(pg==='coaches') renderCoaches();
  if(pg==='booking') initBooking();
  if(pg==='services') {}
  if(pg==='about') {}
}
function toggleMobileNav(){
  document.getElementById('nav-links').classList.toggle('open');
}

// ═══════════════════════════════════════════════════════
//  HOME
// ═══════════════════════════════════════════════════════
function renderHome(){
  const s=gs();
  // coaches preview (dark bg)
  const wrap = document.getElementById('home-coaches');
  if(!wrap)return;
  wrap.innerHTML = s.coaches.filter(c=>c.active).map(c=>`
    <div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:28px;backdrop-filter:blur(8px);transition:all .3s" onmouseenter="this.style.background='rgba(255,255,255,.13)'" onmouseleave="this.style.background='rgba(255,255,255,.08)'">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,${c.color},rgba(249,115,22,.7));display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--fd);font-size:1.25rem;font-weight:800;flex-shrink:0;box-shadow:0 6px 20px rgba(0,0,0,.3)">${initials(c.name)}</div>
        <div>
          <div style="color:#fff;font-weight:700;font-size:1rem">${c.name}</div>
          <div style="background:linear-gradient(135deg,#F97316,#EC4899);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:.79rem;font-weight:700;margin-top:2px">${c.specialty}</div>
        </div>
      </div>
      <p style="color:rgba(255,255,255,.62);font-size:.83rem;line-height:1.6;margin:0 0 16px">${c.bio.slice(0,120)}…</p>
      <button class="btn btn-ghost btn-sm" onclick="navigate('booking')">Book with ${c.name.split(' ')[0]} →</button>
    </div>
  `).join('');
  // apply settings to hero if changed
  const c=s.settings.content;
  // promo
  const p=s.settings.promo;
  if(p.enabled && !s.settings.promoSeen){
    document.getElementById('pm-title').textContent=p.title;
    document.getElementById('pm-text').textContent=p.text;
    document.getElementById('pm-cta').textContent=p.cta;
    document.getElementById('pm-ov').style.display='flex';
  }
}
function closePromo(){
  upd(s=>s.settings.promoSeen=true);
  document.getElementById('pm-ov').style.display='none';
}
function subscribe(){
  const e=document.getElementById('nl-email');
  if(!e.value.includes('@')){toast('Please enter a valid email address');return;}
  toast('✅ You\'re subscribed! Thank you.');
  e.value='';
}

// ═══════════════════════════════════════════════════════
//  COACHES (public)
// ═══════════════════════════════════════════════════════
function renderCoaches(){
  const s=gs();
  document.getElementById('coaches-list').innerHTML = s.coaches.filter(c=>c.active).map(c=>`
    <div style="background:var(--surf);border-radius:var(--r);box-shadow:var(--sh);display:grid;grid-template-columns:280px 1fr;gap:0;overflow:hidden">
      <div style="background:linear-gradient(135deg,var(--deep) 0%,var(--mid) 100%);display:flex;align-items:center;justify-content:center;flex-direction:column;padding:44px;text-align:center;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 30%,rgba(249,115,22,.25) 0%,transparent 60%);pointer-events:none"></div>
        <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,${c.color},rgba(255,255,255,.3));border:3px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--fd);font-size:2.2rem;font-weight:800;margin-bottom:18px;box-shadow:0 8px 32px rgba(0,0,0,.25);position:relative;z-index:1">${initials(c.name)}</div>
        <div style="color:#fff;font-weight:700;font-size:1.08rem;position:relative;z-index:1">${c.name}</div>
        <div style="color:rgba(255,255,255,.65);font-size:.82rem;margin-top:5px;position:relative;z-index:1">${c.title}</div>
        ${c.email?`<div style="color:rgba(255,255,255,.5);font-size:.75rem;margin-top:12px;position:relative;z-index:1">✉️ ${c.email}</div>`:''}
      </div>
      <div style="padding:38px">
        <div style="display:inline-block;background:var(--brand-pale);color:var(--mid);padding:5px 16px;border-radius:100px;font-size:.78rem;font-weight:700;margin-bottom:18px;border:1px solid var(--border)">${c.specialty}</div>
        <p style="color:var(--muted);line-height:1.8;margin-bottom:26px;font-size:.92rem">${c.bio}</p>
        <button class="btn btn-gold" onclick="navigate('booking')">Book with ${c.name.split(' ')[0]} →</button>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════
//  BOOKING WIZARD
// ═══════════════════════════════════════════════════════
let BK = {step:0, coachId:null, date:null, time:null, customer:{}};
let calYear, calMonth;

function initBooking(){
  BK = {step:0, coachId:null, date:null, time:null, customer:{}};
  const now=new Date(); calYear=now.getFullYear(); calMonth=now.getMonth();
  showStep(0);
  renderCoachGrid();
}

function renderCoachGrid(){
  const s=gs();
  document.getElementById('coach-sel-grid').innerHTML = s.coaches.filter(c=>c.active).map(c=>`
    <div class="cs-card ${BK.coachId===c.id?'sel':''}" onclick="selectCoach('${c.id}')">
      <div class="coach-init" style="background:${c.color}">${initials(c.name)}</div>
      <div class="cs-info">
        <h4>${c.name}</h4>
        <p>${c.title}</p>
        <p style="margin-top:4px;color:var(--brand);font-size:.78rem;font-weight:600">${c.specialty}</p>
      </div>
      <div class="cs-check">✓</div>
    </div>
  `).join('');
}

function selectCoach(id){
  BK.coachId=id;
  document.querySelectorAll('.cs-card').forEach(c=>{
    c.classList.toggle('sel',c.onclick.toString().includes(`'${id}'`));
  });
  renderCoachGrid();
}

function renderCal(){
  const days=['Su','Mo','Tu','We','Th','Fr','Sa'];
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('cal-month').textContent=`${months[calMonth]} ${calYear}`;
  const first=new Date(calYear,calMonth,1).getDay();
  const total=new Date(calYear,calMonth+1,0).getDate();
  const today2=new Date();
  let html=days.map(d=>`<div class="cal-dn">${d}</div>`).join('');
  for(let i=0;i<first;i++) html+=`<div class="cal-d empty"></div>`;
  for(let d=1;d<=total;d++){
    const dt=new Date(calYear,calMonth,d);
    const ds=dt.toISOString().slice(0,10);
    const isPast=dt<new Date(today2.getFullYear(),today2.getMonth(),today2.getDate());
    const isSel=BK.date===ds;
    const isToday=ds===today();
    html+=`<div class="cal-d${isPast?' past':''}${isSel?' sel':''}${isToday?' today':''}" onclick="${isPast?'':'selectDate(\''+ds+'\')'}">${d}</div>`;
  }
  document.getElementById('cal-grid').innerHTML=html;
}

function calPrev(){ if(calMonth===0){calMonth=11;calYear--;}else calMonth--; renderCal(); }
function calNext(){ if(calMonth===11){calMonth=0;calYear++;}else calMonth++; renderCal(); }

function selectDate(ds){
  BK.date=ds; BK.time=null;
  renderCal();
  renderTimeSlots();
  document.getElementById('time-section').style.display='block';
  updateSummary();
}

function renderTimeSlots(){
  if(!BK.coachId||!BK.date)return;
  const s=gs();
  const dow=new Date(BK.date).getDay();
  const slots=(s.availability[BK.coachId]||{})[dow]||[];
  // check booked
  const booked=s.bookings.filter(b=>b.coachId===BK.coachId&&b.date===BK.date&&b.status!=='cancelled').map(b=>b.time);
  document.getElementById('ts-grid').innerHTML = slots.length
    ? slots.map(t=>{
        const taken=booked.includes(t);
        const sel=BK.time===t;
        return `<div class="ts${taken?' taken':''}${sel?' sel':''}" onclick="${taken?'':'selectTime(\''+t+'\')'}">${fmt12(t)}${taken?'<br><small style="font-size:.68rem;opacity:.7">Booked</small>':''}</div>`;
      }).join('')
    : `<p class="muted">No available slots for this day. Try another date.</p>`;
}

function selectTime(t){
  BK.time=t;
  renderTimeSlots();
  updateSummary();
}

function updateSummary(){
  const s=gs();
  const coach=s.coaches.find(c=>c.id===BK.coachId);
  const rows=[
    ['Coach', coach?coach.name:'Not selected'],
    ['Date', BK.date?formatDate(BK.date):'Not selected'],
    ['Time', BK.time?fmt12(BK.time):'Not selected'],
    ['Service', BK.customer.service||'To be selected'],
    ['Duration', '60 minutes'],
  ];
  const html=rows.map(([k,v])=>`<div class="sum-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('');
  ['sum-rows','sum-rows2','sum-rows3'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.innerHTML=html;
  });
}

function showStep(n){
  BK.step=n;
  document.querySelectorAll('.bk-step').forEach((el,i)=>el.classList.toggle('on',i===n));
  // wizard indicator
  document.querySelectorAll('.wiz-step').forEach((el,i)=>{
    el.classList.toggle('act',i===n);
    el.classList.toggle('done',i<n);
  });
  ['wc1','wc2','wc3'].forEach((id,i)=>{
    const el=document.getElementById(id);
    if(el) el.classList.toggle('done',i<n);
  });
  if(n===1){renderCal();updateSummary();}
  if(n===3){updateSummary();}
}

function bkNext(){
  if(BK.step===0){
    if(!BK.coachId){toast('Please select a coach to continue');return;}
    showStep(1);
  } else if(BK.step===1){
    if(!BK.date){toast('Please select a date');return;}
    if(!BK.time){toast('Please select a time slot');return;}
    showStep(2);
  } else if(BK.step===2){
    const name=document.getElementById('bk-name').value.trim();
    const email=document.getElementById('bk-email').value.trim();
    const svc=document.getElementById('bk-svc').value;
    if(!name){toast('Please enter your name');return;}
    if(!email.includes('@')){toast('Please enter a valid email');return;}
    if(!svc){toast('Please select a service type');return;}
    BK.customer={
      name,email,
      phone:document.getElementById('bk-phone').value,
      dob:document.getElementById('bk-dob').value,
      service:svc,
      notes:document.getElementById('bk-notes').value
    };
    updateSummary();
    showStep(3);
  }
}
function bkBack(){ if(BK.step>0) showStep(BK.step-1); }

function confirmBooking(){
  const s=gs();
  // upsert customer
  let cust=s.customers.find(c=>c.email===BK.customer.email);
  if(!cust){
    cust={id:uid(),name:BK.customer.name,email:BK.customer.email,phone:BK.customer.phone,dob:BK.customer.dob,goals:BK.customer.notes,createdAt:today()};
    s.customers.push(cust);
  }
  const booking={id:uid(),customerId:cust.id,coachId:BK.coachId,service:BK.customer.service,date:BK.date,time:BK.time,status:'pending',notes:BK.customer.notes,price:250,createdAt:today()};
  s.bookings.push(booking);
  // income transaction
  s.transactions.push({id:uid(),type:'income',amount:250,description:`${BK.customer.service} — ${BK.customer.name}`,category:'Coaching',date:today()});
  ss(s);
  // success screen
  const coach=s.coaches.find(c=>c.id===BK.coachId);
  document.getElementById('sum-success').innerHTML=[
    ['Coach',coach?coach.name:''],
    ['Service',BK.customer.service],
    ['Date',formatDate(BK.date)],
    ['Time',fmt12(BK.time)],
    ['Customer',BK.customer.name],
    ['Status','Pending Confirmation']
  ].map(([k,v])=>`<div class="sum-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('');
  showStep(4);
  toast('🎉 Booking submitted!');
}

// ═══════════════════════════════════════════════════════
//  CHATBOT
// ═══════════════════════════════════════════════════════
let cbOpen=false, voiceOn=false, recognition=null, speaking=false;
let cbFlow=null; // booking flow state

const KB = {
  services:`HCIC Vision offers three main services: 1) Holistic Health & Wellness Coaching — addressing 6 lifestyle pillars: nutrition, stress management, sleep, physical activity, social connections, and harmful substance avoidance. 2) Integrative Mental Health Coaching — anxiety, burnout, grief, mindfulness, teen depression, elderly care. 3) Health Imaging Consultancy — AI integration in medical imaging for healthcare providers and tech companies.`,
  coaches:`We have two expert coaches: Dr. Mohammad M. Siddiqui (Founder & CWO, 30+ years experience in wellness coaching and medical imaging) and Dr. Afshin M. Siddiqui (Integrative Mental Health Coach, specializing in emotional resilience and mental wellness).`,
  pricing:`Session pricing varies by service type. Initial sessions typically start at $250 for wellness coaching and $180 for mental health coaching. We also offer a free 30-minute Discovery Call to help you find the right fit.`,
  booking:`You can book a session directly on our website by clicking "Book Now". Choose your coach, pick an available date and time, fill in your details, and confirm. It takes about 2 minutes!`,
  contact:`Phone: +1 647 839 0271 | Email: mhs@hcicvision.com | Website: www.hcicvision.com | Based in Ontario, Canada since 2010.`,
  about:`HCIC Vision Inc. is a federally incorporated Canadian health coaching and innovation consultancy founded in 2010 by Dr. Mohammad Siddiqui. We serve global clients from Ontario, Canada, combining wellness coaching with medical technology innovation.`,
  location:`HCIC Vision is based in Ontario, Canada. We serve clients globally through virtual sessions.`,
  appointment:`To book an appointment, I can walk you through it right here! Just say "book appointment" and I'll guide you step by step.`
};

const PATTERNS=[
  {re:/service|offer|what do you do|program/i, key:'services'},
  {re:/coach|doctor|dr|staff|team/i, key:'coaches'},
  {re:/price|cost|fee|charge|how much/i, key:'pricing'},
  {re:/book|appointment|schedule|session|reserve/i, key:'booking'},
  {re:/contact|phone|email|call|reach/i, key:'contact'},
  {re:/about|history|who are|founded|company/i, key:'about'},
  {re:/where|location|based|canada|ontario/i, key:'location'},
];

function toggleChatbot(){
  cbOpen=!cbOpen;
  const panel=document.getElementById('cb-panel');
  panel.classList.toggle('open',cbOpen);
  document.getElementById('cb-btn').innerHTML=cbOpen?'✕':'💬';
  if(cbOpen && document.getElementById('cb-msgs').children.length===0) initChat();
}
function openChatbot(){ if(!cbOpen) toggleChatbot(); }

function initChat(){
  botMsg("Hi! I'm the HCIC Vision assistant 👋 I can answer questions about our services, coaches, and pricing — or help you book an appointment. How can I help?", [
    'Our Services','Meet the Coaches','Book Appointment','Pricing','Contact Info'
  ]);
}

function botMsg(text, quickReplies=[]){
  const msgs=document.getElementById('cb-msgs');
  // typing indicator
  const typing=document.createElement('div');
  typing.className='msg bot';
  typing.innerHTML=`<div class="msg-ic">🤖</div><div class="msg-b"><div class="typing"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(typing);
  msgs.scrollTop=msgs.scrollHeight;
  setTimeout(()=>{
    typing.remove();
    const div=document.createElement('div');
    div.className='msg bot';
    div.innerHTML=`<div class="msg-ic">🤖</div><div class="msg-b">${text}</div>`;
    msgs.appendChild(div);
    // quick replies
    const qr=document.getElementById('cb-qr');
    qr.innerHTML=quickReplies.map(r=>`<button class="qr" onclick="handleQR('${r}')">${r}</button>`).join('');
    msgs.scrollTop=msgs.scrollHeight;
    if(voiceOn) speak(text.replace(/<[^>]*>/g,''));
  }, 800 + Math.random()*400);
}

function usrMsg(text){
  const msgs=document.getElementById('cb-msgs');
  const div=document.createElement('div');
  div.className='msg usr';
  div.innerHTML=`<div class="msg-b">${text}</div><div class="msg-ic">👤</div>`;
  msgs.appendChild(div);
  document.getElementById('cb-qr').innerHTML='';
  msgs.scrollTop=msgs.scrollHeight;
}

function sendMsg(){
  const inp=document.getElementById('cb-in');
  const txt=inp.value.trim();
  if(!txt)return;
  inp.value='';
  usrMsg(txt);
  processMsg(txt);
}

function handleQR(txt){
  usrMsg(txt);
  processMsg(txt);
}

function processMsg(txt){
  const lower=txt.toLowerCase();
  // booking flow
  if(cbFlow){
    handleBookingFlow(txt);
    return;
  }
  // book intent
  if(/book|appointment|schedule|reserve/i.test(lower)){
    botMsg("Great! I can help you book a session. Let's get started — <strong>which service are you interested in?</strong>", ['Wellness Coaching','Mental Health Coaching','Health Imaging','Discovery Call (Free)']);
    cbFlow={step:'svc'};
    return;
  }
  // knowledge base match
  for(const p of PATTERNS){
    if(p.re.test(lower)){
      const reply=KB[p.key];
      botMsg(reply,p.key==='booking'?['Book Now','View Services']:p.key==='coaches'?['Book with Dr. Mohammad','Book with Dr. Afshin']:['Book Appointment']);
      return;
    }
  }
  // greetings
  if(/hi|hello|hey|good morning|good afternoon/i.test(lower)){
    botMsg("Hello! Great to hear from you 😊 I'm here to help with questions about HCIC Vision or to book a session. What can I do for you?",['Our Services','Book Appointment','Pricing']);
    return;
  }
  // thanks
  if(/thank|thanks/i.test(lower)){
    botMsg("You're very welcome! Is there anything else I can help you with?",['Book Appointment','Our Services']);
    return;
  }
  // fallback
  botMsg("I want to make sure I give you the right information. Could you rephrase that? I can help with services, coaches, pricing, bookings, and contact details.",['Our Services','Book Appointment','Contact Info','Pricing']);
}

function handleBookingFlow(txt){
  const s=gs();
  if(cbFlow.step==='svc'){
    cbFlow.service=txt;
    cbFlow.step='coach';
    const coaches=s.coaches.filter(c=>c.active).map(c=>c.name.split(' ').slice(0,3).join(' '));
    botMsg(`Perfect! <strong>${txt}</strong> is a great choice.<br><br>Who would you like to work with?`,coaches);
  } else if(cbFlow.step==='coach'){
    cbFlow.coach=txt;
    cbFlow.step='done';
    botMsg(`Wonderful! I'll take you to the booking page where you can choose your date and time with <strong>${txt}</strong>.<br><br>I'll pre-select your preferences.`);
    setTimeout(()=>{
      cbFlow=null;
      navigate('booking');
      if(!cbOpen) toggleChatbot();
      toast('💬 Redirected to booking — your selections are ready!');
    }, 1500);
  }
}

function toggleVoice(){
  voiceOn=!voiceOn;
  document.getElementById('cb-voice-toggle').textContent=voiceOn?'🔊':'🔇';
  if(!voiceOn && speechSynthesis) speechSynthesis.cancel();
}

function speak(text){
  if(!voiceOn||!window.speechSynthesis)return;
  const u=new SpeechSynthesisUtterance(text);
  u.rate=1; u.pitch=1;
  speechSynthesis.speak(u);
}

function toggleMic(){
  const SpeechRec=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRec){toast('Voice not supported in this browser');return;}
  const btn=document.getElementById('cb-mic-btn');
  if(recognition){
    recognition.stop(); recognition=null;
    btn.classList.remove('rec'); btn.textContent='🎤';
    return;
  }
  recognition=new SpeechRec();
  recognition.lang='en-US'; recognition.continuous=false; recognition.interimResults=false;
  recognition.onresult=e=>{
    const t=e.results[0][0].transcript;
    document.getElementById('cb-in').value=t;
    sendMsg();
  };
  recognition.onend=()=>{btn.classList.remove('rec');btn.textContent='🎤';recognition=null;};
  recognition.onerror=()=>{btn.classList.remove('rec');btn.textContent='🎤';recognition=null;};
  recognition.start();
  btn.classList.add('rec'); btn.textContent='⏹';
}

// ═══════════════════════════════════════════════════════
//  ADMIN
// ═══════════════════════════════════════════════════════
function openAdmin(){
  const s=gs();
  if(!s.settings.adminAuth){
    document.getElementById('adm-login-ov').style.display='flex';
    return;
  }
  launchAdmin();
}
function doAdminLogin(){
  const pwd=document.getElementById('adm-pwd').value;
  const s=gs();
  if(pwd===s.settings.adminPwd){
    upd(s=>s.settings.adminAuth=true);
    document.getElementById('adm-login-ov').style.display='none';
    launchAdmin();
  } else {
    toast('❌ Incorrect password');
  }
}
function closeAdminLogin(){
  document.getElementById('adm-login-ov').style.display='none';
}
function launchAdmin(){
  document.getElementById('root').style.display='none';
  document.getElementById('nav').style.display='none';
  document.getElementById('main-footer').style.display='none';
  document.getElementById('admin').classList.add('on');
  admNav('dashboard');
  updateAdmClock();
  setInterval(updateAdmClock,60000);
}
function closeAdmin(){
  upd(s=>s.settings.adminAuth=false);
  document.getElementById('admin').classList.remove('on');
  document.getElementById('root').style.display='block';
  document.getElementById('nav').style.display='block';
  navigate(_page);
}
function updateAdmClock(){
  const el=document.getElementById('adm-time');
  if(el) el.textContent=new Date().toLocaleString('en-CA',{dateStyle:'medium',timeStyle:'short'});
}

function admNav(sec){
  document.querySelectorAll('.adm-item').forEach(el=>{
    el.classList.toggle('on', el.getAttribute('onclick')===`admNav('${sec}')`);
  });
  document.querySelectorAll('.adm-pane').forEach(p=>p.classList.remove('on'));
  const pane=document.getElementById('ap-'+sec);
  if(pane) pane.classList.add('on');
  // title
  const titles={dashboard:'Dashboard',bookings:'Bookings',schedule:'Availability & Scheduling',customers:'Customers','coaches-adm':'Coaches',finances:'Sales & Expenses',content:'Site Content',banner:'Promotional Banner'};
  document.getElementById('adm-title').textContent=titles[sec]||sec;
  // render
  if(sec==='dashboard') renderDashboard();
  if(sec==='bookings') renderBookingsTable();
  if(sec==='schedule') renderScheduleSetup();
  if(sec==='customers') renderCustomersTable();
  if(sec==='finances') renderFinances();
  if(sec==='coaches-adm') renderCoachesAdmin();
  if(sec==='content') renderContentEditor();
  if(sec==='banner') renderBannerEditor();
}

// DASHBOARD
function renderDashboard(){
  const s=gs();
  const tot=s.bookings.length;
  const pend=s.bookings.filter(b=>b.status==='pending').length;
  const custCnt=s.customers.length;
  const rev=s.transactions.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0);
  document.getElementById('kpi-grid').innerHTML=[
    {lbl:'Total Bookings',val:tot,ch:`${pend} pending`},
    {lbl:'Customers',val:custCnt,ch:'Total registered'},
    {lbl:'Revenue',val:'$'+rev.toFixed(0),ch:'All time'},
    {lbl:'Active Coaches',val:s.coaches.filter(c=>c.active).length,ch:'Currently available'}
  ].map(k=>`<div class="kpi"><div class="kpi-lbl">${k.lbl}</div><div class="kpi-val">${k.val}</div><div class="kpi-ch">${k.ch}</div></div>`).join('');
  // upcoming bookings
  const upcoming=s.bookings.filter(b=>b.date>=today()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6);
  document.getElementById('dash-bookings').innerHTML = upcoming.length
    ? upcoming.map(b=>{
        const cu=s.customers.find(c=>c.id===b.customerId);
        const co=s.coaches.find(c=>c.id===b.coachId);
        return `<tr><td>${cu?cu.name:'Unknown'}</td><td>${co?co.name.split(' ').slice(0,2).join(' '):'?'}</td><td>${formatDate(b.date)} ${fmt12(b.time)}</td><td><span class="sts sts-${b.status[0]}">${b.status}</span></td></tr>`;
      }).join('')
    : '<tr><td colspan="4" class="empty-state">No upcoming bookings</td></tr>';
  // recent tx
  document.getElementById('dash-tx').innerHTML = s.transactions.slice(-6).reverse().map(t=>`
    <tr><td>${t.description.slice(0,28)}${t.description.length>28?'…':''}</td>
    <td style="color:${t.type==='income'?'#16a34a':'#dc2626'};font-weight:600">${t.type==='income'?'+':'-'}$${t.amount.toFixed(2)}</td>
    <td><span class="sts sts-${t.type==='income'?'c':'x'}">${t.type}</span></td></tr>
  `).join('');
}

// BOOKINGS TABLE
function renderBookingsTable(){
  const s=gs();
  const q=(document.getElementById('bk-search')||{value:''}).value.toLowerCase();
  const f=(document.getElementById('bk-filter')||{value:''}).value;
  const rows=s.bookings.filter(b=>{
    const cu=s.customers.find(c=>c.id===b.customerId);
    const co=s.coaches.find(c=>c.id===b.coachId);
    const txt=[(cu?cu.name:''),b.service,(co?co.name:'')].join(' ').toLowerCase();
    return (!q||txt.includes(q)) && (!f||b.status===f);
  }).sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('bookings-tbl').innerHTML = rows.length
    ? rows.map(b=>{
        const cu=s.customers.find(c=>c.id===b.customerId);
        const co=s.coaches.find(c=>c.id===b.coachId);
        return `<tr>
          <td style="color:var(--muted);font-size:.75rem">#${b.id.slice(0,6)}</td>
          <td>${cu?cu.name:'Unknown'}</td>
          <td>${co?co.name.split(' ').slice(0,3).join(' '):'?'}</td>
          <td>${b.service.slice(0,30)}${b.service.length>30?'…':''}</td>
          <td>${formatDate(b.date)}</td>
          <td>${fmt12(b.time)}</td>
          <td><span class="sts sts-${b.status[0]}">${b.status}</span></td>
          <td>
            <select style="font-size:.75rem;padding:3px 6px;border:1px solid var(--border);border-radius:4px;cursor:pointer" onchange="updateBkStatus('${b.id}',this.value)">
              <option value="pending" ${b.status==='pending'?'selected':''}>Pending</option>
              <option value="confirmed" ${b.status==='confirmed'?'selected':''}>Confirmed</option>
              <option value="completed" ${b.status==='completed'?'selected':''}>Completed</option>
              <option value="cancelled" ${b.status==='cancelled'?'selected':''}>Cancelled</option>
            </select>
          </td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="8"><div class="empty-state"><p>No bookings found</p></div></td></tr>';
}
function updateBkStatus(id,status){
  upd(s=>{const b=s.bookings.find(b=>b.id===id);if(b)b.status=status;});
  toast('Booking status updated');
  renderBookingsTable();
}

// SCHEDULE
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const TIMES=['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

function renderScheduleSetup(){
  const s=gs();
  const sel=document.getElementById('sch-coach');
  sel.innerHTML=s.coaches.filter(c=>c.active).map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  renderSchedule();
}

function renderSchedule(){
  const s=gs();
  const coachId=document.getElementById('sch-coach').value;
  const av=s.availability[coachId]||{};
  // build table
  let html=`<tr><th>Time</th>${DAYS.map(d=>`<th>${d}</th>`).join('')}</tr>`;
  for(const t of TIMES){
    html+=`<tr><td class="tl-cell">${fmt12(t)}</td>`;
    for(let d=0;d<7;d++){
      const on=(av[d]||[]).includes(t);
      // check if booked
      const bk=s.bookings.some(b=>b.coachId===coachId&&b.time===t&&new Date(b.date).getDay()===d&&b.date>=today()&&b.status!=='cancelled');
      html+=`<td><div class="sl${on?' on':''}${bk?' bk':''}" data-d="${d}" data-t="${t}" onclick="${bk?'':'toggleSlot(this,\''+coachId+'\','+d+',\''+t+'\')'}" title="${bk?'Booked':'Click to toggle'}">${on?'✓':''}</div></td>`;
    }
    html+='</tr>';
  }
  document.getElementById('sch-tbl').innerHTML=html;
}

function toggleSlot(el, coachId, d, t){
  upd(s=>{
    if(!s.availability[coachId]) s.availability[coachId]={};
    if(!s.availability[coachId][d]) s.availability[coachId][d]=[];
    const slots=s.availability[coachId][d];
    const i=slots.indexOf(t);
    if(i>-1) slots.splice(i,1);
    else slots.push(t);
  });
  renderSchedule();
}
function saveSchedule(){toast('✅ Schedule saved!');}

// CUSTOMERS
function renderCustomersTable(){
  const s=gs();
  const q=(document.getElementById('cust-search')||{value:''}).value.toLowerCase();
  const rows=s.customers.filter(c=>[c.name,c.email,c.phone].join(' ').toLowerCase().includes(q));
  document.getElementById('customers-tbl').innerHTML = rows.length
    ? rows.map(c=>{
        const sessions=s.bookings.filter(b=>b.customerId===c.id).length;
        return `<tr>
          <td><strong>${c.name}</strong></td>
          <td>${c.email}</td>
          <td>${c.phone||'—'}</td>
          <td style="text-align:center"><span style="background:var(--brand-pale);color:var(--mid);padding:2px 10px;border-radius:100px;font-size:.75rem;font-weight:700">${sessions}</span></td>
          <td style="max-width:200px;color:var(--muted);font-size:.82rem">${(c.goals||'').slice(0,50)}${(c.goals||'').length>50?'…':''}</td>
          <td style="color:var(--muted);font-size:.8rem">${formatDate(c.createdAt)}</td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="6"><div class="empty-state"><p>No customers found</p></div></td></tr>';
}

// FINANCES
function renderFinances(){
  const s=gs();
  const rev=s.transactions.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0);
  const exp=s.transactions.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
  document.getElementById('fin-rev').textContent='$'+rev.toFixed(2);
  document.getElementById('fin-exp').textContent='$'+exp.toFixed(2);
  document.getElementById('fin-net').textContent='$'+(rev-exp).toFixed(2);
  document.getElementById('tx-tbl').innerHTML=s.transactions.slice().reverse().map(t=>`
    <tr>
      <td style="color:var(--muted);font-size:.8rem">${t.date||'—'}</td>
      <td>${t.description}</td>
      <td>${t.category||'—'}</td>
      <td><span class="sts sts-${t.type==='income'?'c':'x'}">${t.type}</span></td>
      <td style="font-weight:700;color:${t.type==='income'?'#16a34a':'#dc2626'}">${t.type==='income'?'+':'-'}$${parseFloat(t.amount).toFixed(2)}</td>
    </tr>
  `).join('');
  // set today date on form
  const dtEl=document.getElementById('tx-date');
  if(dtEl&&!dtEl.value) dtEl.value=today();
}
function openAddTx(){ document.getElementById('add-tx-form').style.display='block'; }
function addTransaction(){
  const amt=parseFloat(document.getElementById('tx-amount').value);
  const desc=document.getElementById('tx-desc').value.trim();
  if(!desc||isNaN(amt)||amt<=0){toast('Please fill in amount and description');return;}
  upd(s=>s.transactions.push({
    id:uid(),
    type:document.getElementById('tx-type').value,
    amount:amt,
    description:desc,
    category:document.getElementById('tx-cat').value,
    date:document.getElementById('tx-date').value||today()
  }));
  document.getElementById('add-tx-form').style.display='none';
  ['tx-amount','tx-desc','tx-cat'].forEach(id=>document.getElementById(id).value='');
  renderFinances();
  toast('✅ Transaction added');
}

// COACHES ADMIN
function renderCoachesAdmin(){
  const s=gs();
  document.getElementById('coaches-adm-list').innerHTML=s.coaches.map(c=>`
    <div class="cadm-card">
      <div class="cadm-av" style="background:${c.color}">${initials(c.name)}</div>
      <div style="flex:1">
        <div class="fbc">
          <div>
            <strong style="color:var(--deep)">${c.name}</strong>
            <div style="color:var(--muted);font-size:.82rem">${c.title}</div>
          </div>
          <div class="flex gap2">
            <label class="tog"><input type="checkbox" ${c.active?'checked':''} onchange="toggleCoach('${c.id}',this.checked)"><span class="tog-sl"></span></label>
            <button class="btn btn-deep btn-sm" onclick="removeCoach('${c.id}')">Remove</button>
          </div>
        </div>
        <div style="color:var(--brand);font-size:.8rem;margin-top:6px;font-weight:600">${c.specialty}</div>
        <p class="muted mt2" style="font-size:.82rem">${c.bio.slice(0,120)}…</p>
      </div>
    </div>
  `).join('');
}
function openAddCoach(){ document.getElementById('add-coach-form').style.display='block'; }
function addCoach(){
  const name=document.getElementById('ac-name').value.trim();
  const title=document.getElementById('ac-title').value.trim();
  const spec=document.getElementById('ac-spec').value.trim();
  if(!name||!title||!spec){toast('Please fill required fields');return;}
  const id='c'+uid();
  upd(s=>{
    s.coaches.push({id,name,title,specialty:spec,bio:document.getElementById('ac-bio').value,email:document.getElementById('ac-email').value,color:document.getElementById('ac-color').value,active:true});
    s.availability[id]={0:[],1:['09:00','10:00','14:00','15:00'],2:['09:00','10:00','14:00','15:00'],3:['09:00','10:00','14:00','15:00'],4:['09:00','10:00','14:00','15:00'],5:['09:00','10:00'],6:[]};
  });
  document.getElementById('add-coach-form').style.display='none';
  renderCoachesAdmin();
  toast('✅ Coach added');
}
function toggleCoach(id,active){
  upd(s=>{const c=s.coaches.find(c=>c.id===id);if(c)c.active=active;});
  toast(`Coach ${active?'activated':'deactivated'}`);
}
function removeCoach(id){
  const btn=document.querySelector(`[onclick="removeCoach('${id}')"]`);
  if(!btn)return;
  if(btn.dataset.confirm!=='yes'){
    btn.dataset.confirm='yes';
    btn.textContent='Confirm?';
    btn.style.background='#dc2626';
    setTimeout(()=>{if(btn.dataset.confirm==='yes'){btn.dataset.confirm='';btn.textContent='Remove';btn.style.background='';}},3000);
    return;
  }
  upd(s=>s.coaches=s.coaches.filter(c=>c.id!==id));
  renderCoachesAdmin();
  toast('Coach removed');
}

// CONTENT EDITOR
function renderContentEditor(){
  const s=gs().settings.content;
  document.getElementById('cnt-hero-title').value=s.heroTitle||'';
  document.getElementById('cnt-hero-sub').value=s.heroSub||'';
  document.getElementById('cnt-hero-cta').value=s.heroCta||'';
  document.getElementById('cnt-phil').value=s.philosophy||'';
  document.getElementById('cnt-phone').value=s.phone||'';
  document.getElementById('cnt-email').value=s.email||'';
}
function saveContent(){
  upd(s=>{
    s.settings.content.heroTitle=document.getElementById('cnt-hero-title').value;
    s.settings.content.heroSub=document.getElementById('cnt-hero-sub').value;
    s.settings.content.heroCta=document.getElementById('cnt-hero-cta').value;
    s.settings.content.philosophy=document.getElementById('cnt-phil').value;
    s.settings.content.phone=document.getElementById('cnt-phone').value;
    s.settings.content.email=document.getElementById('cnt-email').value;
  });
  toast('✅ Content saved');
}

// BANNER EDITOR
function renderBannerEditor(){
  const p=gs().settings.promo;
  document.getElementById('ban-enabled').checked=p.enabled;
  document.getElementById('ban-title').value=p.title||'';
  document.getElementById('ban-text').value=p.text||'';
  document.getElementById('ban-cta').value=p.cta||'';
  document.getElementById('ban-bg').value=p.bg||'#0B3347';
  previewBanner();
}
function previewBanner(){
  const bg=document.getElementById('ban-bg').value;
  document.getElementById('ban-prev-box').style.background=bg;
  document.getElementById('ban-prev-title').textContent=document.getElementById('ban-title').value||'Banner Title';
  document.getElementById('ban-prev-text').textContent=document.getElementById('ban-text').value||'Banner message text here.';
  document.getElementById('ban-prev-cta').textContent=document.getElementById('ban-cta').value||'CTA';
}
function saveBanner(){
  upd(s=>{
    s.settings.promo={
      enabled:document.getElementById('ban-enabled').checked,
      title:document.getElementById('ban-title').value,
      text:document.getElementById('ban-text').value,
      cta:document.getElementById('ban-cta').value,
      bg:document.getElementById('ban-bg').value
    };
    s.settings.promoSeen=false; // reset so it shows again
  });
  toast('✅ Banner saved');
}

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════
function initials(name){ return name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join(''); }
function fmt12(t){ if(!t)return''; const [h,m]=t.split(':'); const hr=parseInt(h); return `${hr>12?hr-12:hr||12}:${m} ${hr>=12?'PM':'AM'}`; }
function formatDate(ds){ if(!ds)return''; const d=new Date(ds+'T12:00:00'); return d.toLocaleDateString('en-CA',{month:'short',day:'numeric',year:'numeric'}); }
function toast(msg,dur=2800){
  const el=document.getElementById('toast');
  el.textContent=msg; el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),dur);
}

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════
// Ensure default state exists
if(!localStorage.getItem(SK)) ss(defaultState());
navigate('home');
