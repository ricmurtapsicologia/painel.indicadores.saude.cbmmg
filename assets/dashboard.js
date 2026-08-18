"use strict";

const YEARS = ["2020","2021","2022","2023","2024","2025","2026*"];
const DATA = {
  eff: {
    mean:[5714.2,5920.2,5786.6,5774.7,6017.5,6041.0,6035.2],
    min:[5589,5820,5669,5702,5965,5899,6006],
    max:[6083,6029,5826,6071,6062,6182,6070]
  },
  q1:{
    reg:[96,10,881,576,4020,1586,2138],
    done:[96,10,881,497,3519,1152,1463],
    rate:[100,100,100,86.3,87.5,72.6,68.4],
    median:[null,null,null,2,22,15,18],
    p90:[null,null,null,52.6,113,88.9,54]
  },
  q2:{
    att:[3416,2917,3776,5033,10737,7377,4348],
    uniq:[1303,1062,1869,2026,5033,2914,2260],
    ratio:[2.62,2.75,2.02,2.48,2.13,2.53,1.92],
    att1000:[597.8,492.7,652.5,871.6,1784.3,1221.2,720.4],
    uniq1000:[228.0,179.4,323.0,350.8,836.4,482.4,374.5],
    urgentAux1000:[5.25,6.76,4.67,10.04,10.64,8.61,3.81]
  },
  q3:{ref:[null,null,null,162,465,406,155]},
  q5:{
    events:[355,444,337,512,580,438,188],
    uniq:[187,235,194,259,273,241,123],
    days:[3082,4087,2566,4334,4465,3194,1284],
    leave1000:[32.7,39.7,33.5,44.9,45.4,39.9,20.4],
    events1000:[62.1,75.0,58.2,88.7,96.4,72.5,31.2],
    days1000:[539.4,690.4,443.4,750.5,742.0,528.7,212.8]
  }
};

const INDICATORS = [
  {
    id:"k1", code:"KPI 01", module:"cronico", accent:"#1769b3", status:"Calculável", tag:"ok",
    name:"Taxa de conclusão do monitoramento psicológico do PSOBM", short:"Conclusão do monitoramento",
    value:"72,6%", note:"2025 · 1.152 / 1.586", trend:DATA.q1.rate,
    dimension:"Processo / monitoramento programado",
    purpose:"Acompanhar a capacidade de completar o ciclo de monitoramento e sinalizar gargalos de execução.",
    definition:"Proporção de registros elegíveis do PSOBM que possuem avaliação concluída no período.",
    formula:"Avaliações concluídas ÷ registros elegíveis × 100",
    source:"AAS · Q1 — Monitoramento PSOBM", unit:"Percentual", polarity:"Quanto maior, melhor",
    periodicity:"Mensal, com consolidação trimestral/anual",
    decision:"Revisar agenda, adesão, pendências, retorno e capacidade de conclusão.",
    limitation:"2020–2022 apresentam padrões temporais atípicos; a comparação histórica deve considerar a qualidade das datas.",
    quality:"Calculável. Taxa global reconstruída: 81,9% (7.618/9.307). Comparação prioritária: 2023–2025.",
    publication:"Exibir valor, período, denominador e nota de qualidade quando houver mudança de semântica ou cobertura."
  },
  {
    id:"k2", code:"KPI 02", module:"cronico", accent:"#168aa1", status:"Calculável c/ ressalva", tag:"warn",
    name:"Tempo do ciclo de monitoramento psicológico", short:"Tempo do ciclo",
    value:"14 dias", note:"mediana global · média 32,2 · P90 79", trend:[null,null,null,2,22,15,18],
    dimension:"Processo / tempestividade",
    purpose:"Medir espera e tempestividade entre convocação e avaliação do monitoramento.",
    definition:"Tempo decorrido entre a data de convocação e a data da avaliação, resumido prioritariamente pela mediana.",
    formula:"Mediana de (data da avaliação − data da convocação)",
    source:"AAS · Q1 — datas de convocação e avaliação", unit:"Dias", polarity:"Quanto menor, melhor",
    periodicity:"Mensal/trimestral",
    decision:"Identificar fila, atraso, gargalo de agenda e necessidade de revisão de capacidade.",
    limitation:"A semântica histórica das datas é heterogênea; média é sensível a extremos e a série antiga possui intervalos de zero dia atípicos.",
    quality:"Calculável com ressalva. Mediana global 14 dias; média 32,2; P90 79 dias.",
    publication:"Apresentar mediana e P90; usar média apenas como medida complementar. Manter nota de qualidade temporal."
  },
  {
    id:"k3", code:"KPI 03", module:"cronico", accent:"#267a5d", status:"Calculável", tag:"ok",
    name:"Razão média de atendimentos psicológicos por beneficiário", short:"Recorrência assistencial",
    value:"4,38", note:"37.604 atendimentos / 8.579 beneficiários únicos", trend:DATA.q2.ratio,
    dimension:"Acesso e utilização assistencial",
    purpose:"Dimensionar utilização, recorrência e concentração da capacidade assistencial.",
    definition:"Razão entre atendimentos psicológicos válidos e beneficiários únicos no horizonte analítico.",
    formula:"Atendimentos válidos ÷ beneficiários únicos",
    source:"AAS · Q2 — Atendimentos psicológicos", unit:"Razão", polarity:"Contextual",
    periodicity:"Mensal/anual",
    decision:"Confrontar volume assistencial com alcance, recorrência e capacidade instalada.",
    limitation:"Não mede gravidade clínica. A razão global não equivale à média simples das razões anuais.",
    quality:"Calculável após tratamento da base. Valor global: 4,38 atendimentos por beneficiário.",
    publication:"Interpretar junto com beneficiários únicos e volume de atendimentos; evitar leitura como intensidade clínica."
  },
  {
    id:"k4", code:"KPI 04", module:"cronico", accent:"#728293", status:"Não calculável", tag:"no",
    name:"Taxa de continuidade assistencial concluída", short:"Continuidade assistencial",
    value:"N/D", note:"Q3: 1.188 encaminhamentos · desfecho ausente", trend:null,
    dimension:"Acesso e continuidade do cuidado",
    purpose:"Verificar se o encaminhamento realizado resultou em continuidade assistencial concluída.",
    definition:"Proporção de encaminhamentos com desfecho concluído entre os encaminhamentos realizados.",
    formula:"Encaminhamentos concluídos ÷ encaminhamentos realizados × 100",
    source:"AAS · Q3 — Encaminhamentos", unit:"Percentual", polarity:"Quanto maior, melhor",
    periodicity:"Mensal/trimestral",
    decision:"Identificar perdas de seguimento, barreiras de acesso e pendências de continuidade.",
    limitation:"A base permite contar 1.188 encaminhamentos, mas não contém situação e data de conclusão suficientes para reconstruir o desfecho.",
    quality:"Não calculável. O volume de encaminhamentos não deve ser confundido com continuidade concluída.",
    publication:"Exibir N/D até que status e data de conclusão estejam estruturados. Nunca imputar zero."
  },
  {
    id:"k5", code:"KPI 05", module:"agudo", accent:"#728293", status:"Não calculável", tag:"no",
    name:"Taxa de demandas psicológicas urgentes por 1.000 militares ativos", short:"Demandas urgentes / 1.000",
    value:"N/D", note:"DRH disponível · numerador Q4 ausente", trend:null,
    dimension:"Demanda aguda / pressão assistencial",
    purpose:"Dimensionar proporcionalmente a pressão de demandas psicológicas agudas sobre a rede institucional.",
    definition:"Número de demandas agudas estruturadas no período em relação ao efetivo de referência.",
    formula:"Demandas urgentes ÷ efetivo médio do período × 1.000",
    source:"AAS · Q4 + DRH · efetivo ativo", unit:"Por 1.000 ativos", polarity:"Contextual",
    periodicity:"Mensal, com consolidação anual",
    decision:"Sinalizar pressão assistencial, procedência, prioridade e necessidade de capacidade de resposta.",
    limitation:"A Q4 específica não foi disponibilizada. A classificação “urgente” da Q2 não representa o mesmo fluxo e não pode ser usada como proxy.",
    quality:"Não calculável por ausência do numerador específico. O denominador DRH já está disponível.",
    publication:"Exibir N/D e explicitar a fonte ausente. Não substituir por métrica auxiliar."
  },
  {
    id:"k6", code:"KPI 06", module:"agudo", accent:"#728293", status:"Não calculável", tag:"no",
    name:"Tempo até o primeiro acolhimento institucional", short:"Tempo até acolhimento",
    value:"N/D", note:"Q4 sem entrada e 1º acolhimento estruturados", trend:null,
    dimension:"Demanda aguda / tempestividade",
    purpose:"Avaliar a rapidez da resposta institucional após o registro da demanda aguda.",
    definition:"Tempo entre data/hora de entrada da demanda e data/hora do primeiro acolhimento institucional.",
    formula:"Data/hora do 1º acolhimento − data/hora da demanda",
    source:"AAS · Q4 — Demanda aguda", unit:"Horas ou dias", polarity:"Quanto menor, melhor",
    periodicity:"Mensal",
    decision:"Revisar canal de acesso, prioridade, protocolo e capacidade de resposta.",
    limitation:"Não há base Q4 com marcos temporais estruturados que permitam reconstrução válida.",
    quality:"Não calculável nesta etapa.",
    publication:"Exibir N/D até existir registro estruturado de entrada e primeiro acolhimento."
  },
  {
    id:"k7", code:"KPI 07", module:"agudo", accent:"#a7343f", status:"Calculável", tag:"ok",
    name:"Militares afastados por motivo psicológico/psiquiátrico por 1.000 ativos", short:"Militares afastados / 1.000",
    value:"39,9", note:"2025 · 241 únicos · efetivo médio 6.041,0", trend:DATA.q5.leave1000,
    dimension:"Resultado institucional / repercussão funcional",
    purpose:"Dimensionar a repercussão funcional proporcional e acompanhar sua trajetória ao longo do tempo.",
    definition:"Militares únicos com ao menos um afastamento iniciado no ano em relação ao efetivo médio mensal do mesmo ano.",
    formula:"Militares únicos afastados no ano ÷ efetivo médio mensal do ano × 1.000",
    source:"AAS · Q5 — Afastamentos + DRH · Dados consolidados", unit:"Por 1.000 ativos", polarity:"Quanto menor, melhor",
    periodicity:"Anual; acompanhamento intermediário somente com regra temporal compatível",
    decision:"Acompanhar repercussão funcional, priorizar investigação contextual e planejar prevenção/retorno ao trabalho.",
    limitation:"Não mede prevalência de transtorno nem causalidade ocupacional. 2026 cobre somente janeiro–junho.",
    quality:"Calculável após integração DRH. Nos anos completos, varia de 32,7 a 45,4 por 1.000.",
    publication:"Usar militares únicos anuais e efetivo médio mensal. Marcar 2026 como parcial e não aplicar meta anual automaticamente."
  },
  {
    id:"k8", code:"KPI 08", module:"agudo", accent:"#7f2530", status:"Calculável", tag:"ok",
    name:"Dias perdidos por afastamento psicológico/psiquiátrico por 1.000 ativos", short:"Dias perdidos / 1.000",
    value:"528,7", note:"2025 · 3.194 dias únicos · efetivo médio 6.041,0", trend:DATA.q5.days1000,
    dimension:"Resultado institucional / carga funcional",
    purpose:"Dimensionar a carga funcional agregada associada aos afastamentos por saúde mental.",
    definition:"Total de dias únicos de afastamento alocados ao ano, descontadas sobreposições do mesmo militar, em relação ao efetivo médio mensal.",
    formula:"Dias únicos de afastamento no ano ÷ efetivo médio mensal do ano × 1.000",
    source:"AAS · Q5 — Afastamentos + DRH · Dados consolidados", unit:"Dias por 1.000 ativos", polarity:"Quanto menor, melhor",
    periodicity:"Anual; acompanhamento intermediário somente com regra temporal compatível",
    decision:"Medir carga funcional, monitorar tendência e orientar prevenção, capacidade e retorno ao trabalho.",
    limitation:"É indicador agregado de repercussão; não identifica causa clínica ou ocupacional. 2026 é parcial.",
    quality:"Calculável. Nos anos completos, varia de 443,4 a 750,5 dias por 1.000.",
    publication:"Usar dias únicos e efetivo médio mensal; explicitar regra de sobreposição e parcialidade de 2026."
  }
];

const DECISIONS = [
  ["Queda da conclusão do PSOBM","87,5% (2024) → 72,6% (2025)","O gargalo está em capacidade, adesão, retorno, pendência ou registro?","Estratificar pendências e motivos; confrontar agenda, capacidade e retorno antes de intervir."],
  ["Pico assistencial seguido de redução","1.784,3 → 1.221,2 atend./1.000","Mudou demanda, acesso, oferta, capacidade ou modo de registro?","Cruzar atendimentos, beneficiários únicos, recorrência, cobertura e capacidade instalada."],
  ["Repercussão funcional menor em 2025","45,4 → 39,9 afastados/1.000; 742,0 → 528,7 dias/1.000","Há tendência sustentável ou oscilação anual?","Manter série histórica, anotar contexto e evitar inferência causal ou clínica isolada."],
  ["Continuidade assistencial não mensurável","1.188 encaminhamentos, sem desfecho estruturado","Os encaminhamentos efetivamente resultam em cuidado concluído?","Estruturar status e data de conclusão na Q3; só então pactuar limiar ou meta."],
  ["Demanda aguda não mensurável","Q4 específica não disponível","Qual é a pressão aguda e quanto tempo a instituição leva para acolher?","Criar registro mínimo de demanda, prioridade e primeiro acolhimento; não usar Q2 como proxy."]
];

const $ = (q,r=document)=>r.querySelector(q);
const $$ = (q,r=document)=>[...r.querySelectorAll(q)];
const fmt = (n,d=1)=>n==null?"—":new Intl.NumberFormat("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);

function sparkline(values,color){
  if(!values || values.filter(v=>v!=null).length<2) return `<svg class="sparkline" viewBox="0 0 74 26" aria-hidden="true"><path d="M2 20 H72" stroke="#dce5eb" stroke-width="1"/></svg>`;
  const vals=values.filter(v=>v!=null), lo=Math.min(...vals), hi=Math.max(...vals), span=hi-lo||1;
  const pts=[]; values.forEach((v,i)=>{if(v!=null){const x=2+i*(70/(values.length-1));const y=22-((v-lo)/span)*18;pts.push([x,y]);}});
  const d=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
  return `<svg class="sparkline" viewBox="0 0 74 26" aria-hidden="true"><path d="M2 22 H72" stroke="#dce5eb" stroke-width="1"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function indicatorCard(k){
  return `<article class="indicator-card" tabindex="0" role="button" aria-label="Abrir ficha técnica ${k.code}: ${k.name}" data-open-kpi="${k.id}" style="--accent:${k.accent}">
    <div class="indicator-top"><span class="indicator-code">${k.code}</span><span class="indicator-status ${k.tag}">${k.status}</span></div>
    <div class="indicator-value">${k.value}${k.id==="k7"||k.id==="k8"?` <small style="font-size:9px;color:#65788a;font-weight:700">/ 1.000</small>`:""}</div>
    <div class="indicator-name">${k.short}</div>
    <div class="indicator-note">${k.note}</div>
    <div class="indicator-foot"><small>abrir ficha técnica →</small>${sparkline(k.trend,k.accent)}</div>
  </article>`;
}

function renderIndicators(){
  $("#indicatorGrid").innerHTML=INDICATORS.map(indicatorCard).join("");
  $("#chronicKpis").innerHTML=INDICATORS.filter(k=>k.module==="cronico").map(indicatorCard).join("");
  $("#acuteKpis").innerHTML=INDICATORS.filter(k=>k.module==="agudo").map(indicatorCard).join("");
}

function svgWrap(inner,W=760,H=280){return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${inner}</svg>`;}
function extent(series){const vals=series.flatMap(s=>s.data.filter(v=>v!=null));return [Math.min(...vals),Math.max(...vals)];}

function lineChart(el,{labels=YEARS,series,format=v=>fmt(v,1),min=null,max=null,partialIndex=6,zero=false}){
  const node=$(el); if(!node) return;
  const W=760,H=278,p={l:56,r:18,t:22,b:40},pw=W-p.l-p.r,ph=H-p.t-p.b;
  let [lo,hi]=extent(series); if(min!=null)lo=min;if(max!=null)hi=max;if(zero)lo=0;if(lo===hi){lo-=1;hi+=1}
  const pad=(hi-lo)*.10; if(!zero)lo-=pad; hi+=pad; if(zero)lo=0;
  const x=i=>p.l+(pw/(labels.length-1||1))*i, y=v=>p.t+ph-((v-lo)/(hi-lo))*ph;
  let s="";
  if(partialIndex!=null && partialIndex<labels.length){const xx=x(partialIndex);s+=`<rect x="${Math.max(p.l,xx-35)}" y="${p.t}" width="70" height="${ph}" fill="#fff4e1" opacity=".7"/><text x="${xx}" y="${p.t+11}" text-anchor="middle" font-size="8" fill="#8a651e" font-weight="800">PARCIAL</text>`;}
  for(let k=0;k<=4;k++){const yy=p.t+ph*k/4,val=hi-(hi-lo)*k/4;s+=`<line x1="${p.l}" y1="${yy}" x2="${W-p.r}" y2="${yy}" stroke="#e6edf2"/><text x="${p.l-8}" y="${yy+3}" text-anchor="end" font-size="8" fill="#748596">${format(val)}</text>`;}
  labels.forEach((lab,i)=>s+=`<text x="${x(i)}" y="${H-13}" text-anchor="middle" font-size="9" fill="#687b8c">${lab}</text>`);
  series.forEach(obj=>{
    let d="",open=false;
    obj.data.forEach((v,i)=>{if(v==null){open=false;return;}d+=(open?" L ":"M ")+x(i)+" "+y(v);open=true;});
    s+=`<path d="${d}" fill="none" stroke="${obj.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    obj.data.forEach((v,i)=>{if(v!=null)s+=`<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#fff" stroke="${obj.color}" stroke-width="2.5"><title>${labels[i]} · ${obj.name}: ${format(v)}</title></circle>`;});
  });
  const leg=series.map((o,i)=>`<g transform="translate(${p.l+i*175},8)"><line x1="0" y1="0" x2="18" y2="0" stroke="${o.color}" stroke-width="3"/><text x="24" y="3" font-size="8" fill="#526a7d">${o.name}</text></g>`).join("");
  node.innerHTML=svgWrap(leg+s,W,H);
}

function barChart(el,{labels=YEARS,data,color="#1769b3",format=v=>fmt(v,0),partialIndex=6}){
  const node=$(el); if(!node)return;
  const W=760,H=278,p={l:52,r:18,t:22,b:40},pw=W-p.l-p.r,ph=H-p.t-p.b,mx=Math.max(...data.filter(v=>v!=null))*1.12,gw=pw/labels.length,bw=Math.min(58,gw*.52);
  let s="";
  for(let k=0;k<=4;k++){const yy=p.t+ph*k/4,val=mx*(1-k/4);s+=`<line x1="${p.l}" y1="${yy}" x2="${W-p.r}" y2="${yy}" stroke="#e6edf2"/><text x="${p.l-8}" y="${yy+3}" text-anchor="end" font-size="8" fill="#748596">${format(val)}</text>`;}
  labels.forEach((lab,i)=>{const cx=p.l+gw*i+gw/2;if(i===partialIndex)s+=`<rect x="${p.l+gw*i}" y="${p.t}" width="${gw}" height="${ph}" fill="#fff4e1" opacity=".7"/>`;s+=`<text x="${cx}" y="${H-13}" text-anchor="middle" font-size="9" fill="#687b8c">${lab}</text>`;const v=data[i];if(v!=null){const h=(v/mx)*ph,yy=p.t+ph-h;s+=`<rect x="${cx-bw/2}" y="${yy}" width="${bw}" height="${h}" rx="5" fill="${color}" opacity=".9"><title>${lab}: ${format(v)}</title></rect><text x="${cx}" y="${Math.max(p.t+10,yy-5)}" text-anchor="middle" font-size="8" fill="${color}" font-weight="800">${format(v)}</text>`;}});
  node.innerHTML=svgWrap(s,W,H);
}

function rangeChart(el){
  const node=$(el); if(!node)return;
  const W=760,H=310,p={l:58,r:20,t:28,b:42},pw=W-p.l-p.r,ph=H-p.t-p.b,lo=5500,hi=6250,x=i=>p.l+(pw/(YEARS.length-1))*i,y=v=>p.t+ph-((v-lo)/(hi-lo))*ph;
  let s="";
  for(let k=0;k<=5;k++){const yy=p.t+ph*k/5,val=hi-(hi-lo)*k/5;s+=`<line x1="${p.l}" y1="${yy}" x2="${W-p.r}" y2="${yy}" stroke="#e6edf2"/><text x="${p.l-8}" y="${yy+3}" text-anchor="end" font-size="8" fill="#748596">${fmt(val,0)}</text>`;}
  const partial=x(6);s+=`<rect x="${partial-35}" y="${p.t}" width="70" height="${ph}" fill="#fff4e1" opacity=".7"/>`;
  YEARS.forEach((lab,i)=>{const xx=x(i),mn=DATA.eff.min[i],mx=DATA.eff.max[i],av=DATA.eff.mean[i];s+=`<line x1="${xx}" y1="${y(mx)}" x2="${xx}" y2="${y(mn)}" stroke="#9cb0bf" stroke-width="8" stroke-linecap="round"><title>${lab} · mínimo ${fmt(mn,0)} · máximo ${fmt(mx,0)}</title></line><circle cx="${xx}" cy="${y(av)}" r="5" fill="#1769b3" stroke="#fff" stroke-width="2"><title>${lab} · média ${fmt(av,1)}</title></circle><text x="${xx}" y="${H-14}" text-anchor="middle" font-size="9" fill="#687b8c">${lab}</text><text x="${xx}" y="${y(av)-10}" text-anchor="middle" font-size="8" font-weight="800" fill="#1769b3">${fmt(av,1)}</text>`;});
  s+=`<g transform="translate(${p.l},12)"><line x1="0" y1="0" x2="18" y2="0" stroke="#9cb0bf" stroke-width="7" stroke-linecap="round"/><text x="25" y="3" font-size="8" fill="#526a7d">mín.–máx. mensal</text><circle cx="142" cy="0" r="4" fill="#1769b3"/><text x="152" y="3" font-size="8" fill="#526a7d">média anual</text></g>`;
  node.innerHTML=svgWrap(s,W,H);
}

function renderCharts(){
  lineChart("#chartAssistanceExecutive",{series:[{name:"Atendimentos",data:DATA.q2.att1000,color:"#1769b3"},{name:"Beneficiários",data:DATA.q2.uniq1000,color:"#267a5d"}],format:v=>fmt(v,0),zero:true});
  lineChart("#chartImpactExecutive",{series:[{name:"Militares afastados",data:DATA.q5.leave1000,color:"#a7343f"},{name:"Eventos",data:DATA.q5.events1000,color:"#7f2530"}],format:v=>fmt(v,1),zero:true});
  lineChart("#chartCompletion",{series:[{name:"Conclusão (%)",data:DATA.q1.rate,color:"#1769b3"}],format:v=>fmt(v,0)+"%",min:60,max:104,zero:false});
  lineChart("#chartCycle",{labels:["2023","2024","2025","2026*"],series:[{name:"Mediana",data:DATA.q1.median.slice(3),color:"#168aa1"},{name:"P90",data:DATA.q1.p90.slice(3),color:"#a66b13"}],format:v=>fmt(v,0)+" d",zero:true,partialIndex:3});
  lineChart("#chartAssistance",{series:[{name:"Atendimentos/1.000",data:DATA.q2.att1000,color:"#1769b3"},{name:"Beneficiários/1.000",data:DATA.q2.uniq1000,color:"#267a5d"}],format:v=>fmt(v,0),zero:true});
  barChart("#chartReferrals",{labels:["2023","2024","2025","2026*"],data:DATA.q3.ref.slice(3),color:"#63798b",partialIndex:3,format:v=>fmt(v,0)});
  lineChart("#chartLeave",{series:[{name:"Afastados/1.000",data:DATA.q5.leave1000,color:"#a7343f"}],format:v=>fmt(v,1),zero:true});
  lineChart("#chartDays",{series:[{name:"Dias/1.000",data:DATA.q5.days1000,color:"#7f2530"}],format:v=>fmt(v,0),zero:true});
  lineChart("#chartEvents",{series:[{name:"Eventos/1.000",data:DATA.q5.events1000,color:"#a7343f"}],format:v=>fmt(v,1),zero:true});
  rangeChart("#chartDenominator");
}

function renderDecisionMatrix(){
  $("#decisionRows").innerHTML=DECISIONS.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("");
}

function renderCalculability(){
  const restriction={
    k1:"Comparar ciclos com controle de qualidade das datas.",
    k2:"Série histórica exige validação semântica das datas.",
    k3:"Contextual; não mede gravidade clínica.",
    k4:"Q3 sem situação e data de conclusão.",
    k5:"Denominador DRH disponível; numerador Q4 inexistente.",
    k6:"Q4 sem data/hora da demanda e primeiro acolhimento.",
    k7:"Usar militares únicos anuais ÷ efetivo médio mensal; 2026 parcial.",
    k8:"Usar dias únicos anuais ÷ efetivo médio mensal; 2026 parcial."
  };
  const result={k1:"81,9% global",k2:"Mediana 14 d · média 32,2 · P90 79",k3:"4,38 atend./beneficiário",k4:"N/D",k5:"N/D",k6:"N/D",k7:"32,7–45,4/1.000*",k8:"443,4–750,5/1.000*"};
  $("#calcRows").innerHTML=INDICATORS.map(k=>`<tr><td><b>${k.code}</b><br>${k.short}</td><td>${result[k.id]}</td><td><span class="calc-status ${k.tag}">${k.status}</span></td><td>${restriction[k.id]}</td></tr>`).join("")+`<tr><td colspan="4" style="color:#65788a;font-size:8px">* Faixa observada nos anos completos. 2026 corresponde a janeiro–junho e não integra a faixa anual comparável.</td></tr>`;
}

function openKpi(id){
  const k=INDICATORS.find(x=>x.id===id); if(!k)return;
  const fields=[
    ["Dimensão analítica",k.dimension],["Finalidade gerencial",k.purpose],["Definição conceitual",k.definition],["Fórmula",k.formula],
    ["Fonte",k.source],["Unidade",k.unit],["Polaridade",k.polarity],["Periodicidade",k.periodicity],
    ["Decisão apoiada",k.decision],["Limitação",k.limitation],["Qualidade / calculabilidade",k.quality],["Regra de publicação",k.publication]
  ];
  $("#dialogContent").innerHTML=`<div class="dialog-inner"><div class="dialog-kicker">${k.code} · ficha técnica</div><h3>${k.name}</h3><span class="dialog-status ${k.tag}">${k.status}</span><div class="dialog-value">${k.value}${k.id==="k7"||k.id==="k8"?" / 1.000":""}</div><div class="dialog-grid">${fields.map((f,i)=>`<div class="dialog-field ${i===1||i===2||i>=8?"full":""}"><small>${f[0]}</small><p>${f[1]}</p></div>`).join("")}</div></div>`;
  const dialog=$("#kpiDialog"); if(typeof dialog.showModal==="function")dialog.showModal();
}

function bindInteractions(){
  $$(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{
    $$(".nav-item").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
    $$(".view").forEach(v=>v.classList.remove("active"));const target=$("#"+btn.dataset.view);if(target)target.classList.add("active");
    window.scrollTo({top:0,behavior:"smooth"});
  }));
  document.addEventListener("click",e=>{const el=e.target.closest("[data-open-kpi]");if(el)openKpi(el.dataset.openKpi);});
  document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".indicator-card[data-open-kpi]")){e.preventDefault();openKpi(e.target.dataset.openKpi);}});
}

function init(){
  renderIndicators();
  renderDecisionMatrix();
  renderCalculability();
  renderCharts();
  bindInteractions();
}

document.addEventListener("DOMContentLoaded",init);
