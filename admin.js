const USERS={johnny:{pass:'4321',name:'Johnny Andrade',av:'JA',role:'Master Barber · Fundador',biz:'Dom da Navalha'}};

const AGEND=[
  {id:1,cli:'Carlos Silva',tel:'(11) 95382-6351',email:'carlos@email.com',svc:'Corte + selagem',val:100,dia:19,hora:'09:00',status:'Confirmado',mensal:false},
  {id:2,cli:'Roberto Alves',tel:'(11) 91234-5678',email:'roberto@email.com',svc:'Corte masculino',val:45,dia:19,hora:'09:00',status:'Confirmado',mensal:true},
  {id:3,cli:'Rafael Souza',tel:'(11) 98888-7777',email:'rafa@email.com',svc:'Corte & barba',val:65,dia:19,hora:'14:00',status:'Aguardando presença',mensal:false},
  {id:4,cli:'Lucas Mendes',tel:'(11) 97777-6666',email:'lucas@email.com',svc:'Corte masculino',val:45,dia:19,hora:'19:00',status:'Aguardando presença',mensal:false},
  {id:5,cli:'Paulo Andrade',tel:'(11) 96666-5555',email:'paulo@email.com',svc:'Combo completo',val:160,dia:18,hora:'14:30',status:'Cancelado sem aviso',mensal:false},
  {id:6,cli:'Marcos Ferreira',tel:'(11) 99876-5432',email:'marcos@email.com',svc:'Corte masculino',val:45,dia:17,hora:'10:00',status:'Concluído',mensal:true},
  {id:7,cli:'Diego Lima',tel:'(11) 95555-4444',email:'diego@email.com',svc:'Corte barba & sel.',val:120,dia:20,hora:'10:00',status:'Confirmado',mensal:false},
  {id:8,cli:'Carlos Silva',tel:'(11) 95382-6351',email:'carlos@email.com',svc:'Corte masculino',val:45,dia:15,hora:'09:00',status:'Concluído',mensal:false},
  {id:9,cli:'André Costa',tel:'(11) 97654-3210',email:'andre@email.com',svc:'Corte masculino',val:45,dia:13,hora:'09:30',status:'Concluído',mensal:true},
  {id:10,cli:'Rafael Souza',tel:'(11) 98888-7777',email:'rafa@email.com',svc:'Corte & barba',val:65,dia:12,hora:'14:00',status:'Concluído',mensal:false},
  {id:11,cli:'Lucas Mendes',tel:'(11) 97777-6666',email:'lucas@email.com',svc:'Limpeza de pele',val:60,dia:10,hora:'11:00',status:'Concluído',mensal:false},
  {id:12,cli:'Fernando Costa',tel:'(11) 94444-3333',email:'fer@email.com',svc:'Corte + selagem',val:100,dia:8,hora:'14:00',status:'Cancelado sem aviso',mensal:false},
  {id:13,cli:'Carlos Silva',tel:'(11) 95382-6351',email:'carlos@email.com',svc:'Combo completo',val:160,dia:3,hora:'09:00',status:'Concluído',mensal:false},
];

let SVCS=[
  {n:'Corte masculino',dur:'45 min',val:45,on:true},
  {n:'Corte & barba',dur:'1h',val:65,on:true},
  {n:'Corte + selagem',dur:'1h 30min',val:100,on:true},
  {n:'Corte, barba & selagem',dur:'2h',val:120,on:true},
  {n:'Corte premium + limpeza',dur:'1h 15min',val:100,on:true},
  {n:'Limpeza de pele',dur:'45 min',val:60,on:true},
  {n:'Combo completo',dur:'2h 30min',val:160,on:true},
];

const CANCEL_DATA=[
  {cli:'Paulo Andrade',data:'18/06',svc:'Combo completo',val:160,sinal:48,status:'Cancelado sem aviso'},
  {cli:'Fernando Costa',data:'08/06',svc:'Corte + selagem',val:100,sinal:30,status:'Cancelado sem aviso'},
  {cli:'Marcos Reis',data:'03/06',svc:'Corte masculino',val:45,sinal:14,status:'Cancelado sem aviso'},
  {cli:'Bruno Teixeira',data:'01/06',svc:'Corte & barba',val:65,sinal:20,status:'Reagendado'},
  {cli:'Diego Lima',data:'28/05',svc:'Corte masculino',val:45,sinal:14,status:'Cancelado reembolsado'},
];

let PORTFOLIO_PHOTOS=[
  {src:'corte1.jpg',visible:true,type:'image'},
  {src:'corte2.jpg',visible:true,type:'image'},
  {src:'corte3.jpg',visible:true,type:'image'},
  {src:'corte4.jpg',visible:true,type:'image'},
];

const MOS=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const SC={'Confirmado':'p-g','Concluído':'p-g','Cancelado sem aviso':'p-r','Cancelado reembolsado':'p-b','Reagendado':'p-a','Aguardando presença':'p-a'};
const FAT_DIA={1:205,2:45,3:160,4:0,5:45,6:0,7:0,8:100,9:0,10:60,11:0,12:65,13:45,14:0,15:45,16:0,17:45,18:0,19:255,20:120};

let CU=null,calY=2026,calM=5,selDay=19;
let blockedSlots={},mensalFixos={19:new Set(['09:00']),17:new Set(['10:00']),13:new Set(['09:30'])};
let cliSort='recente',editSvcIdx=null,realocId=null,presState={};
let dashPer='hoje',chartType='fat',pendingPlan=null;
let customDate=null;

function fill(u,p){document.getElementById('l-u').value=u;document.getElementById('l-p').value=p;}

function doLogin(){
  const u=document.getElementById('l-u').value.trim().toLowerCase();
  const p=document.getElementById('l-p').value;
  const f=USERS[u];
  if(!f||f.pass!==p){document.getElementById('l-err').textContent='Usuário ou senha incorretos.';return;}
  CU={...f,username:u};
  document.getElementById('login-wrap').style.display='none';
  document.getElementById('painel').style.display='block';
  document.getElementById('sb-biz').textContent=CU.biz;
  document.getElementById('sb-role').textContent=CU.role;
  document.getElementById('tb-av').textContent=CU.av;
  document.getElementById('tb-name').textContent=CU.name.split(' ')[0];
  renderAll();
  renderPortfolio();
  if(window.innerWidth>900)openDrawer();
}

function doLogout(){
  CU=null;
  document.getElementById('painel').style.display='none';
  document.getElementById('login-wrap').style.display='flex';
  closeDrawer();
}

function toggleDrawer(){
  const sb=document.getElementById('sidebar');
  if(sb.classList.contains('open'))closeDrawer();else openDrawer();
}
function openDrawer(){
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('on');
}
function closeDrawer(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('on');
}

function goPage(id,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.getElementById('pg-'+id).classList.add('on');
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('active'));
  const si=document.getElementById('ni-'+id);if(si)si.classList.add('active');
  const T={dash:'Dashboard',agenda:'Agenda',clientes:'Clientes',cancel:'Cancelamentos',servicos:'Serviços',perfil:'Meu perfil',assin:'Assinatura'};
  document.getElementById('tb-title').textContent=T[id]||id;
  if(id==='agenda'){renderCal();renderDayAppts();}
  if(id==='clientes')renderClientes();
  if(id==='cancel')renderCancel();
  if(id==='servicos')renderServicos();
  if(id==='perfil')renderPortfolio();
  window.scrollTo(0,0);
  closeDrawer();
}

function renderAll(){renderDash();renderChart();renderCal();renderDayAppts();renderServicos();renderCancel();}

// ═══ DASHBOARD ═══
function setP(per,el){
  dashPer=per;customDate=null;
  document.getElementById('dash-date').value='2026-06-19';
  document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('active'));
  if(el)el.classList.add('active');
  renderDash();renderChart();
}

function setPCustom(val){
  if(!val)return;
  dashPer='custom';
  customDate=val;
  document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('active'));
  renderDash();renderChart();
}

function getDashRows(){
  const ok=a=>!['Cancelado sem aviso','Cancelado reembolsado'].includes(a.status);
  if(dashPer==='hoje')return AGEND.filter(a=>a.dia===19&&ok(a));
  if(dashPer==='semana')return AGEND.filter(a=>a.dia>=13&&a.dia<=19&&ok(a));
  if(dashPer==='custom'&&customDate){
    const d=new Date(customDate);
    const day=d.getUTCDate();
    return AGEND.filter(a=>a.dia===day&&ok(a));
  }
  return AGEND.filter(a=>ok(a));
}

function renderDash(){
  const rows=getDashRows();
  const fat=rows.reduce((s,a)=>s+a.val,0);
  const qtd=rows.length;
  const sinal=Math.ceil(fat*.3);
  const ticket=qtd?Math.round(fat/qtd):0;
  const aReceber=fat-sinal;

  let card3Label='A receber balcão',card3Val='R$ '+aReceber,card3Sub='ticket médio R$ '+ticket;
  if(dashPer==='mes'||dashPer==='semana'){
    // na semana e no mês, mostra o que já foi recebido no balcão (itens concluídos)
    const concluidos=rows.filter(a=>a.status==='Concluído');
    const recebidoBalcao=concluidos.reduce((s,a)=>s+(a.val-Math.ceil(a.val*.3)),0);
    card3Label='Já recebido no balcão';
    card3Val='R$ '+recebidoBalcao;
    card3Sub=concluidos.length+' atendimento'+(concluidos.length!==1?'s':'')+' finalizado'+(concluidos.length!==1?'s':'');
  }

  document.getElementById('d-mets').innerHTML=`
    <div class="met c-w"><div class="met-lbl">Faturamento</div><div class="met-val">R$&nbsp;${fat}</div><div class="met-sub">${qtd} serviço${qtd!==1?'s':''}</div><span class="met-tag tag-up">+12% vs ant.</span></div>
    <div class="met c-g"><div class="met-lbl">Sinais recebidos</div><div class="met-val">R$&nbsp;${sinal}</div><div class="met-sub">30% antecipado</div></div>
    <div class="met c-gold"><div class="met-lbl">${card3Label}</div><div class="met-val">${card3Val}</div><div class="met-sub">${card3Sub}</div></div>
    <div class="met c-r"><div class="met-lbl">Retidos cancel.</div><div class="met-val">R$&nbsp;144</div><div class="met-sub">protegido pelo sinal</div></div>`;

  const bestDay=Object.entries(FAT_DIA).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('best-day-val').textContent='Dia '+bestDay[0]+' — R$ '+bestDay[1];
  document.getElementById('best-day-sub').textContent='Maior faturamento do mês';
  document.getElementById('compare-val').textContent='+12%';
  document.getElementById('compare-sub').textContent='vs período anterior';

  const hj=AGEND.filter(a=>a.dia===19&&!['Cancelado sem aviso','Cancelado reembolsado'].includes(a.status));
  document.getElementById('hoje-count').textContent=hj.length+' agendamento'+(hj.length!==1?'s':'');
  document.getElementById('hoje-list').innerHTML=hj.map(a=>`
    <div class="tl-item${a.mensal?' mensal':''}" style="margin-bottom:6px">
      ${a.mensal?'<div class="tl-mensal-tag">MENSAL</div>':''}
      <div class="tl-time">${a.hora}</div>
      <div class="tl-body"><div class="tl-name">${a.cli}</div><div class="tl-meta">${a.svc} · R$&nbsp;${a.val} <span class="pill ${SC[a.status]||'p-a'}">${a.status}</span></div></div>
    </div>`).join('')||'<div style="font-size:11px;color:var(--w4)">Nenhum agendamento hoje.</div>';

  document.getElementById('d-alerts').innerHTML=`
    <div class="alert-row"><div class="alert-ico" style="background:var(--pur-d)">🔒</div><div class="alert-body"><div class="alert-t">3 clientes com plano mensal</div><div class="alert-s">Roberto · Marcos · André — horários fixos protegidos</div></div><button class="btn btn-pur" style="font-size:9px;padding:3px 7px" onclick="goPage('agenda',document.getElementById('ni-agenda'))">Ver</button></div>
    <div class="alert-row"><div class="alert-ico" style="background:var(--amb-d)">⏰</div><div class="alert-body"><div class="alert-t">2 presenças sem confirmar</div><div class="alert-s">Lucas Mendes · Rafael Souza — hoje</div></div><button class="btn btn-gh" style="font-size:9px;padding:3px 7px" onclick="goPage('agenda',document.getElementById('ni-agenda'))">Ver</button></div>
    <div class="alert-row" style="border:none"><div class="alert-ico" style="background:var(--red-d)">💸</div><div class="alert-body"><div class="alert-t">3 clientes inativos 30+ dias</div><div class="alert-s">Paulo · Fernando · Marcos</div></div><button class="btn btn-gh" style="font-size:9px;padding:3px 7px">Disparar</button></div>`;

  const svcC={};rows.forEach(a=>{if(!svcC[a.svc])svcC[a.svc]={q:0,f:0};svcC[a.svc].q++;svcC[a.svc].f+=a.val;});
  const svcArr=Object.entries(svcC).sort((a,b)=>b[1].f-a[1].f).slice(0,4);
  const maxF=svcArr.length?svcArr[0][1].f:1;
  document.getElementById('d-top').innerHTML=svcArr.map(([n,d])=>`
    <div class="svc-bar">
      <div class="svc-bar-n">${n}</div>
      <div class="svc-bar-w"><div class="svc-bar-f" style="width:${Math.round((d.f/maxF)*100)}%"></div></div>
      <div class="svc-bar-v">${d.q}x</div>
      <div style="font-size:10px;color:var(--w);width:50px;text-align:right;flex-shrink:0">R$&nbsp;${d.f}</div>
    </div>`).join('')||'<div style="font-size:11px;color:var(--w4)">Sem dados no período.</div>';

  document.getElementById('d-tbody').innerHTML=AGEND.slice().reverse().slice(0,8).map(a=>`
    <tr onclick="openCliM('${a.cli}')">
      <td class="tdn">${a.cli}${a.mensal?' <span class="pill p-p" style="font-size:7px">M</span>':''}</td>
      <td>${a.svc}</td>
      <td style="color:var(--w)">R$&nbsp;${a.val}</td>
      <td><span class="pill ${SC[a.status]||'p-a'}">${a.status}</span></td>
      <td style="color:var(--w4)">${a.dia}/06</td>
      <td style="color:var(--w4)">${a.hora}</td>
      <td><button class="btn btn-gh" style="font-size:9px;padding:2px 6px" onclick="event.stopPropagation();openCliM('${a.cli}')">Ver cliente</button></td>
    </tr>`).join('');
}

// ═══ CHART ═══
function setChart(type){
  chartType=type;
  document.getElementById('ct-fat').classList.toggle('active',type==='fat');
  document.getElementById('ct-qtd').classList.toggle('active',type==='qtd');
  renderChart();
}

function renderChart(){
  const dias=Object.keys(FAT_DIA).map(Number).sort((a,b)=>a-b);
  const vals=dias.map(d=>chartType==='fat'?FAT_DIA[d]:AGEND.filter(a=>a.dia===d&&!['Cancelado sem aviso','Cancelado reembolsado'].includes(a.status)).length);
  const max=Math.max(...vals,1);
  document.getElementById('bars-wrap').innerHTML=vals.map((v,i)=>`
    <div class="bar-col" title="Dia ${dias[i]}: ${chartType==='fat'?'R$ '+v:v+' atend.'}">
      <div class="bar-fill${selDay===dias[i]?' sel':''}" style="height:${Math.max(Math.round((v/max)*46),v>0?2:0)}px;opacity:${v>0?(selDay===dias[i]?1:.55):.12}" onclick="pickDay(${dias[i]});goPage('agenda',document.getElementById('ni-agenda'))"></div>
      <div class="bar-lbl">${dias[i]}</div>
    </div>`).join('');
}

// ═══ CALENDAR ═══
function renderCal(){
  document.getElementById('ag-m').textContent=MOS[calM]+' '+calY;
  const first=new Date(calY,calM,1).getDay(),tot=new Date(calY,calM+1,0).getDate();
  const t=new Date();t.setHours(0,0,0,0);
  const dA=new Set(AGEND.filter(a=>!['Cancelado sem aviso','Cancelado reembolsado'].includes(a.status)&&!a.mensal&&calM===5).map(a=>a.dia));
  const dM=new Set(AGEND.filter(a=>a.mensal&&calM===5).map(a=>a.dia));
  let h=['D','S','T','Q','Q','S','S'].map(d=>`<div class="cal-dow">${d}</div>`).join('');
  for(let i=0;i<first;i++)h+=`<div class="cday empty"></div>`;
  for(let d=1;d<=tot;d++){
    const dt=new Date(calY,calM,d),past=dt<t,isT=dt.toDateString()===t.toDateString(),isSel=d===selDay&&calM===5;
    const hasA=dA.has(d),hasM=dM.has(d);
    h+=`<div class="cday${past?' past':''}${isT?' today':''}${isSel?' sel':''}${hasM&&!isSel?' has-m':hasA&&!isSel?' has-a':''}" ${past?'':'onclick="pickDay('+d+')"'}>${d}</div>`;
  }
  document.getElementById('ag-cal').innerHTML=h;
}

function pickDay(d){selDay=d;renderCal();document.getElementById('ag-lbl').textContent=d+' de '+MOS[calM];renderDayAppts();renderChart();}
function calNav(d){calM+=d;if(calM>11){calM=0;calY++;}if(calM<0){calM=11;calY--;}renderCal();}

function renderDayAppts(){
  document.getElementById('ag-lbl').textContent=selDay+' de '+MOS[calM];
  const appts=AGEND.filter(a=>a.dia===selDay&&calM===5&&calY===2026).sort((a,b)=>a.hora.localeCompare(b.hora));
  const fat=appts.filter(a=>!['Cancelado sem aviso','Cancelado reembolsado'].includes(a.status)).reduce((s,a)=>s+a.val,0);
  const sin=Math.ceil(fat*.3);
  const men=appts.filter(a=>a.mensal).length;
  document.getElementById('ag-strip').innerHTML=`
    <div class="ds"><div class="ds-v">R$&nbsp;${fat}</div><div class="ds-l">Faturamento</div></div>
    <div class="ds"><div class="ds-v" style="color:var(--grn)">R$&nbsp;${sin}</div><div class="ds-l">Sinais</div></div>
    <div class="ds"><div class="ds-v" style="color:var(--pur)">${men}</div><div class="ds-l">Mensais</div></div>
    <div class="ds"><div class="ds-v">${appts.length}</div><div class="ds-l">Total</div></div>`;
  if(!appts.length){document.getElementById('ag-appts').innerHTML=`<div style="font-size:12px;color:var(--w4);padding:6px 0">Nenhum agendamento para este dia.</div>`;return;}
  document.getElementById('ag-appts').innerHTML=appts.map(a=>{
    const ps=presState[a.id];
    return `<div class="tl-item${a.mensal?' mensal':''}">
      ${a.mensal?'<div class="tl-mensal-tag">MENSAL</div>':''}
      <div class="tl-time">${a.hora}</div>
      <div class="tl-body">
        <div class="tl-name">${a.cli}</div>
        <div class="tl-meta">${a.svc} · R$&nbsp;${a.val} <span class="pill ${SC[a.status]||'p-a'}">${a.status}</span></div>
      </div>
      <div class="tl-acts">
        <button class="tl-btn${ps==='ok'?' ok':''}" onclick="setPresence(${a.id},'ok')">✓ Veio</button>
        <button class="tl-btn${ps==='no'?' no':''}" onclick="setPresence(${a.id},'no')">✗ Não</button>
        <button class="tl-btn mv" onclick="openRealocM(${a.id})">↔ Realocar</button>
        <button class="tl-btn" onclick="openCliM('${a.cli}')">👤 Ver</button>
      </div>
    </div>`;
  }).join('');
}

function setPresence(id,state){
  presState[id]=state;
  const a=AGEND.find(x=>x.id===id);
  if(a)a.status=state==='ok'?'Concluído':'Cancelado sem aviso';
  renderDayAppts();renderDash();
}

// ═══ BLOCK MODAL ═══
function openBlockM(){
  const key=`${calY}-${calM}-${selDay}`;
  if(!blockedSlots[key])blockedSlots[key]=new Set();
  const mensalSet=mensalFixos[selDay]||new Set();
  document.getElementById('block-lbl').textContent=`${selDay} de ${MOS[calM]} de ${calY}`;
  const slots=['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','19:00','19:30','20:00','20:30'];
  const booked=new Set(AGEND.filter(a=>a.dia===selDay&&calM===5&&!a.mensal).map(a=>a.hora));
  document.getElementById('block-grid').innerHTML=slots.map(s=>{
    const isM=mensalSet.has(s);
    const isB=blockedSlots[key].has(s);
    const isBk=booked.has(s);
    let cls='slot free';
    if(isM)cls='slot blocked-mensal';
    else if(isB)cls='slot blocked-folga';
    else if(isBk)cls='slot booked';
    return `<div class="${cls}" onclick="${isBk||isM?'':'toggleBlock(\''+s+'\')"'}>${s}</div>`;
  }).join('');
  openM('m-block');
}

function toggleBlock(slot){
  const key=`${calY}-${calM}-${selDay}`;
  if(!blockedSlots[key])blockedSlots[key]=new Set();
  if(blockedSlots[key].has(slot))blockedSlots[key].delete(slot);
  else blockedSlots[key].add(slot);
  openBlockM();
}

// ═══ REALOC ═══
function openRealocM(id){
  realocId=id;
  const a=AGEND.find(x=>x.id===id);
  document.getElementById('realoc-info').textContent=`${a.cli} · ${a.svc} · ${a.dia}/06 às ${a.hora}`;
  openM('m-realoc');
}
function confirmRealoc(){
  const a=AGEND.find(x=>x.id===realocId);
  if(a){a.hora=document.getElementById('realoc-t').value;a.status='Reagendado';}
  closeM('m-realoc');renderDayAppts();renderDash();
}

// ═══ CLIENTES ═══
function getClientes(){
  const names=[...new Set(AGEND.map(a=>a.cli))];
  return names.map(nome=>{
    const all=AGEND.filter(a=>a.cli===nome);
    const valid=all.filter(a=>!['Cancelado sem aviso','Cancelado reembolsado'].includes(a.status));
    const total=valid.reduce((s,a)=>s+a.val,0);
    const dias=all.map(a=>a.dia);
    const desde=Math.min(...dias)+'/06';
    const ultimo=valid.length?Math.max(...valid.map(a=>a.dia))+'/06':'—';
    const cancelou=all.some(a=>a.status==='Cancelado sem aviso');
    const mensal=all.some(a=>a.mensal);
    const f=all[0];
    return{nome,tel:f?.tel||'—',email:f?.email||'—',visitas:valid.length,total,ticket:valid.length?Math.round(total/valid.length):0,desde,ultimo,status:cancelou?'Cancelou':'Ativo',mensal,visits:valid,allVisits:all};
  });
}

function renderClientes(){
  const q=(document.getElementById('cli-q')||{}).value||'';
  let rows=getClientes().filter(c=>!q||c.nome.toLowerCase().includes(q.toLowerCase())||c.tel.includes(q));
  if(cliSort==='visitas')rows.sort((a,b)=>b.visitas-a.visitas);
  else if(cliSort==='gasto')rows.sort((a,b)=>b.total-a.total);
  document.getElementById('cli-cnt').textContent=rows.length+' cliente'+(rows.length!==1?'s':'');
  document.getElementById('cli-tbody').innerHTML=rows.map(c=>`
    <tr onclick="openCliM('${c.nome}')">
      <td class="tdn">${c.nome}${c.mensal?' <span class="pill p-p" style="font-size:7px">M</span>':''}</td>
      <td>${c.tel}</td>
      <td>${c.visitas}</td>
      <td style="color:var(--w)">R$&nbsp;${c.total}</td>
      <td>R$&nbsp;${c.ticket}</td>
      <td style="color:var(--w4)">${c.desde}</td>
      <td style="color:var(--w4)">${c.ultimo}</td>
      <td><span class="pill ${c.status==='Ativo'?'p-g':'p-r'}">${c.status}</span></td>
      <td><button class="btn btn-gh" style="font-size:9px;padding:2px 6px" onclick="event.stopPropagation();openCliM('${c.nome}')">Ver</button></td>
    </tr>`).join('');
}

function openCliM(nome){
  const cli=getClientes().find(c=>c.nome===nome);
  if(!cli)return;
  document.getElementById('m-cli-t').textContent=nome;
  document.getElementById('m-av').textContent=nome.split(' ').map(n=>n[0]).slice(0,2).join('');
  document.getElementById('m-cn').textContent=nome+(cli.mensal?' 🔒':'');
  document.getElementById('m-ct').textContent=cli.tel;
  document.getElementById('m-ce').textContent=cli.email;
  document.getElementById('m-since').textContent='Cliente desde '+cli.desde;
  document.getElementById('m-v').textContent=cli.visitas;
  document.getElementById('m-tot').textContent='R$ '+cli.total;
  document.getElementById('m-tk').textContent='R$ '+cli.ticket;
  document.getElementById('m-ult').textContent=cli.ultimo;
  const svcC={};cli.visits.forEach(v=>{svcC[v.svc]=(svcC[v.svc]||0)+1;});
  const mxQ=Math.max(...Object.values(svcC),1);
  document.getElementById('m-svcs').innerHTML=Object.entries(svcC).sort((a,b)=>b[1]-a[1]).map(([s,q])=>`
    <div class="svc-bar">
      <div class="svc-bar-n">${s}</div>
      <div class="svc-bar-w"><div class="svc-bar-f" style="width:${Math.round((q/mxQ)*100)}%"></div></div>
      <div class="svc-bar-v">${q}x</div>
    </div>`).join('')||'<div style="font-size:11px;color:var(--w4)">Sem serviços.</div>';
  document.getElementById('m-hist').innerHTML=cli.allVisits.slice().reverse().slice(0,6).map(v=>`
    <div class="hist-row">
      <div class="hist-dot"></div>
      <div style="flex:1;min-width:0"><div class="hist-svc">${v.svc}</div><div class="hist-meta">${v.dia}/06 · ${v.hora} · R$&nbsp;${v.val}</div></div>
      <span class="pill ${SC[v.status]||'p-a'}">${v.status}</span>
    </div>`).join('')||'<div style="font-size:11px;color:var(--w4)">Sem histórico.</div>';
  openM('m-cli');
}

// ═══ CANCELAMENTOS ═══
function renderCancel(){
  document.getElementById('can-tbody').innerHTML=CANCEL_DATA.map(c=>`
    <tr>
      <td class="tdn">${c.cli}</td>
      <td style="color:var(--w4)">${c.data}</td>
      <td>${c.svc}</td>
      <td>R$&nbsp;${c.val}</td>
      <td>R$&nbsp;${c.sinal}</td>
      <td><span class="pill ${SC[c.status]||'p-a'}">${c.status}</span></td>
      <td style="color:${c.status==='Cancelado sem aviso'?'var(--grn)':'var(--w4)'}">${c.status==='Cancelado sem aviso'?'R$&nbsp;'+c.sinal:'—'}</td>
      <td><button class="btn btn-gh" style="font-size:9px;padding:2px 6px" onclick="openCliM('${c.cli}')">Ver cliente</button></td>
    </tr>`).join('');
}

// ═══ SERVIÇOS ═══
function renderServicos(){
  document.getElementById('svc-tbody').innerHTML=SVCS.map((s,i)=>`
    <tr>
      <td class="tdn">${s.n}</td>
      <td>${s.dur}</td>
      <td style="color:var(--w)">R$&nbsp;${s.val}</td>
      <td style="color:var(--w3)">R$&nbsp;${Math.ceil(s.val*.3)}</td>
      <td><div class="tog${s.on?' on':''}" onclick="toggleSvc(${i})"></div></td>
      <td><span class="pill ${s.on?'p-g':'p-r'}">${s.on?'Visível':'Oculto'}</span></td>
      <td><button class="btn btn-gh" style="font-size:9px;padding:2px 6px" onclick="editSvc(${i})">✏ Editar</button></td>
    </tr>`).join('');
}

function toggleSvc(i){SVCS[i].on=!SVCS[i].on;renderServicos();}
function editSvc(i){
  editSvcIdx=i;const s=SVCS[i];
  document.getElementById('m-svc-t').textContent='Editar: '+s.n;
  document.getElementById('se-n').value=s.n;
  document.getElementById('se-v').value=s.val;
  document.getElementById('se-d').value=s.dur;
  document.getElementById('se-sin').textContent='R$ '+Math.ceil(s.val*.3);
  openM('m-svc');
}
function newSvc(){SVCS.push({n:'Novo serviço',dur:'45 min',val:60,on:true});editSvc(SVCS.length-1);}
function updSinal(){const v=parseInt(document.getElementById('se-v').value)||0;document.getElementById('se-sin').textContent='R$ '+Math.ceil(v*.3);}
function saveSvc(){
  if(editSvcIdx===null)return;
  SVCS[editSvcIdx].n=document.getElementById('se-n').value;
  SVCS[editSvcIdx].val=parseInt(document.getElementById('se-v').value)||SVCS[editSvcIdx].val;
  SVCS[editSvcIdx].dur=document.getElementById('se-d').value;
  renderServicos();closeM('m-svc');
}

// ═══ PERFIL — fotos ═══
function previewProfilePhoto(input){
  if(input.files&&input.files[0]){
    const reader=new FileReader();
    reader.onload=e=>document.getElementById('profile-photo-prev').src=e.target.result;
    reader.readAsDataURL(input.files[0]);
  }
}
function saveProfilePhoto(){alert('Foto de perfil atualizada! A nova foto já aparece para os clientes na tela "Seu barbeiro".');}

function previewLogoPhoto(input){
  if(input.files&&input.files[0]){
    const reader=new FileReader();
    reader.onload=e=>document.getElementById('logo-photo-prev').src=e.target.result;
    reader.readAsDataURL(input.files[0]);
  }
}
function saveLogoPhoto(){alert('Logo atualizado! O novo logo já aparece na tela inicial do app.');}

function renderPortfolio(){
  const items=PORTFOLIO_PHOTOS.map((p,i)=>{
    const media=p.type==='video'
      ? `<video src="${p.src}" muted playsinline></video><div class="portfolio-vid-badge">▶ vídeo</div>`
      : `<img src="${p.src}" alt="Corte ${i+1}"/>`;
    return `<div class="portfolio-item${p.visible?'':' hidden-photo'}">
      ${media}
      <div class="portfolio-del" onclick="deletePortfolioMedia(${i})">×</div>
      <div class="portfolio-toggle" onclick="togglePortfolio(${i})">${p.visible?'✓':'✕'}</div>
    </div>`;
  }).join('');
  const addTile=`<div class="portfolio-add" onclick="document.getElementById('portfolio-upload').click()">
      <div class="portfolio-add-ico">+</div>
      <div class="portfolio-add-lbl">Foto ou<br>vídeo</div>
    </div>`;
  document.getElementById('portfolio-grid').innerHTML=items+addTile;
}
function togglePortfolio(i){PORTFOLIO_PHOTOS[i].visible=!PORTFOLIO_PHOTOS[i].visible;renderPortfolio();}
function deletePortfolioMedia(i){
  if(!confirm('Remover esta mídia do portfólio?'))return;
  PORTFOLIO_PHOTOS.splice(i,1);
  renderPortfolio();
}
function addPortfolioMedia(input){
  if(!input.files||!input.files[0])return;
  const file=input.files[0];
  const isVideo=file.type.startsWith('video/');
  const reader=new FileReader();
  reader.onload=e=>{
    PORTFOLIO_PHOTOS.push({src:e.target.result,visible:true,type:isVideo?'video':'image'});
    renderPortfolio();
    const strip=document.getElementById('portfolio-grid');
    strip.scrollLeft=strip.scrollWidth;
  };
  reader.readAsDataURL(file);
  input.value='';
}

// ═══ ASSINATURA — planos ═══
function openPlanConfirm(planName,price){
  pendingPlan=planName;
  document.getElementById('plan-confirm-t').textContent='Mudar para '+planName;
  document.getElementById('plan-confirm-body').textContent=`Você está prestes a mudar do plano Pro (R$ 147/mês) para o plano ${planName} (${price}). A alteração entra em vigor no próximo ciclo de cobrança, em 08/07/2026.`;
  openM('m-plan-confirm');
}
function confirmPlanChange(){
  alert('Solicitação registrada! Seu plano será alterado para '+pendingPlan+' no próximo ciclo de cobrança.');
  closeM('m-plan-confirm');
}

function confirmCancelSub(){
  closeM('m-cancel-sub');
  alert('Cancelamento registrado. Sua assinatura permanece ativa até 08/07/2026. Você pode reativar a qualquer momento antes dessa data.');
}

function openM(id){document.getElementById(id).classList.add('on');}
function closeM(id){document.getElementById(id).classList.remove('on');}

if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});});}
