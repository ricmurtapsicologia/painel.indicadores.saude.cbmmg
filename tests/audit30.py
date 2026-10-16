#!/usr/bin/env python3
"""Auditoria estática: 30 verificações independentes sobre o painel público."""
from pathlib import Path
from html.parser import HTMLParser
import re
ROOT=Path(__file__).resolve().parents[1]
H=(ROOT/"v070.html").read_text(encoding="utf-8")
INDEX=(ROOT/"index.html").read_text(encoding="utf-8")
ETL=(ROOT/"scripts/dashboard_etl.py").read_text(encoding="utf-8")
class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.tags=[]
    def handle_starttag(self,tag,attrs):
        self.tags.append((tag,dict(attrs)))
p=Parser(); p.feed(H)
def count(tag,attr):
    return sum(t==tag and attr in attrs for t,attrs in p.tags)
def has(s):
    return s in H
checks=[
("01 doctype",H.lstrip().lower().startswith("<!doctype html>")),
("02 idioma",has('lang="pt-BR"')),
("03 charset",has('charset="utf-8"')),
("04 viewport",has('name="viewport"')),
("05 titulo",has("Painel Estratégico de Inteligência em Saúde Mental do PSOBM")),
("06 versao cientifica",has("V14.5")),
("07 corte",has("30/06/2026")),
("08 fonte AAS",has("AAS")),
("09 fonte DRH",has("DRH")),
("10 cinco calculaveis",has("5/8")),
("11 oito cards",count("article","data-indicator")==8),
("12 oito indices",sorted(int(a["data-indicator"]) for t,a in p.tags if t=="article" and "data-indicator" in a)==list(range(1,9))),
("13 oito fichas",len(re.findall(r"\{n:[1-8],grupo:",H))==8),
("14 tres ND",H.count('<div class="value">N/D</div>')==3),
("15 formula I1",has("7.618/9.307")),
("16 comparabilidade I1",has("5.168/6.182")),
("17 mediana/P90 I2",has("P90 de 79,0")),
("18 fontes I3",has("37.604") and has("8.579")),
("19 continuidade I4",has("desfecho documentado ÷ encaminhamentos elegíveis")),
("20 Q2 nao substitui Q4",has("294 registros classificados como urgentes")),
("21 formula I7",has("241 ÷ 6.041 × 1.000")),
("22 formula I8",has("3.194 ÷ 6.041 × 1.000")),
("23 ano parcial",has("2026 é parcial")),
("24 navegacao",count("nav","aria-label")>=1),
("25 skip link",has('class="skip"')),
("26 teclado",has('e.key==="Enter"') and has('e.key===" "')),
("27 tabs acessiveis",has('role="tabpanel"') and has('aria-selected="true"')),
("28 CSS responsive/print",has("@media(max-width:560px)") and has("@media print")),
("29 sem prompts e rede externa",not re.search(r"(?i)(<script[^>]+src=|<iframe|https?://(?!www\.w3\.org)|api[_-]?key|token[_-]?secret|chatgpt|openai|system.prompt|prompt.impl[ií]cito)",H)),
("30 entrada e ETL seguro",('url=v070.html' in INDEX and 'metric(None, "%", reason="Q3' in ETL and 'ratio(leaves,strength,1000)' in ETL)),
]
fail=[]
for title,ok in checks:
    print(("PASS " if ok else "FAIL ")+title)
    if not ok:fail.append(title)
print("RESULTADO: "+str(len(checks)-len(fail))+"/"+str(len(checks)))
if fail:raise SystemExit("Pendencias: "+", ".join(fail))
