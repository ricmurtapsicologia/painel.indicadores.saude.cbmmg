#!/usr/bin/env python3
"""Validação reprodutível de agregados para oito indicadores do PSOBM.

Contratos metodológicos: artigo científico final depositado V14.5 (2026).
Não acessa indivíduos nem publica automaticamente resultados no painel.
Falta de dados, denominador zero e métricas sem distribuição válida => N/D.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

VERSION = "2.0-tcc-v14.5"
INDICATORS = {
    "i1": ("Conclusão do fluxo psicológico do monitoramento", "%"),
    "i2": ("Intervalo entre convocação e avaliação psicológica", "dias"),
    "i3": ("Razão de utilização assistencial", "atendimentos/beneficiário"),
    "i4": ("Continuidade assistencial documentada", "%"),
    "i5": ("Demandas psicológicas urgentes", "por 1.000 ativos"),
    "i6": ("Tempo até o primeiro acolhimento institucional", "horas"),
    "i7": ("Militares com início de afastamento em saúde mental", "por 1.000 ativos"),
    "i8": ("Dias únicos de indisponibilidade funcional", "dias por 1.000 ativos"),
}
# Uma linha descreve um único período validado. Beneficiários anuais
# não podem ser somados para reconstituir beneficiários globais únicos.
FIELDS = {
    "period", "period_complete", "monitoring_eligible", "monitoring_completed_valid",
    "cycle_valid_count", "cycle_mean_days", "cycle_median_days", "cycle_p90_days",
    "cycle_dates_semantics_checked", "attendances_valid", "beneficiaries_distinct",
    "military_unique_leave_starts", "unique_lost_days", "active_strength_mean",
}
PERSONAL = re.compile(
    r"(?:^|_)(?:nome|name|cpf|rg|matricula|email|phone|telefone|address|"
    r"endereco|patient|paciente|birth|nascimento|diagnos|cid|person_id|individual)(?:_|$)",
    re.IGNORECASE,
)

def folded(s: str) -> str:
    return "".join(x for x in unicodedata.normalize("NFKD", s.casefold())
                   if not unicodedata.combining(x)).replace("-", "_").replace(" ", "_")

def check_headers(headers: list[str]) -> None:
    norm = [folded(str(h).strip()) for h in headers]
    unsafe = [h for h in norm if PERSONAL.search(h)]
    if unsafe:
        raise ValueError("Colunas pessoais/clinicas proibidas: " + ", ".join(unsafe))
    if len(norm) != len(set(norm)):
        raise ValueError("Colunas duplicadas")
    if "period" not in norm:
        raise ValueError("Coluna 'period' obrigatoria")
    unknown = set(norm) - FIELDS
    if unknown:
        raise ValueError("Colunas fora do contrato agregado: " + ", ".join(sorted(unknown)))

def number(row: dict[str, Any], key: str) -> float | None:
    v = row.get(key)
    if v is None or str(v).strip() == "":
        return None
    try:
        f = float(str(v).replace(",", "."))
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{key}: valor numerico invalido") from exc
    if not math.isfinite(f) or f < 0:
        raise ValueError(f"{key}: esperado numero finito nao negativo")
    return f

def flag(value: Any) -> bool | None:
    if value is None or str(value).strip() == "":
        return None
    v = str(value).strip().casefold()
    if v in {"true", "1", "yes", "sim", "s", "verdadeiro"}:
        return True
    if v in {"false", "0", "no", "nao", "não", "n", "falso"}:
        return False
    raise ValueError("Flag booleana invalida: " + v)

def metric(value: float | None, unit: str, status="calculavel", reason=None, extras=None):
    return {"value": (round(value, 2) if value is not None else None),
            "unit": unit, "status": (status if value is not None else "N/D"),
            "reason": (reason if value is None else None),
            **({"distribution": extras} if extras is not None else {})}

def ratio(a: float | None, b: float | None, factor=1) -> float | None:
    if a is None or b is None or b == 0:
        return None
    return a / b * factor

def evaluate(row: dict[str, Any]) -> dict[str, Any]:
    period = str(row.get("period", "")).strip()
    if not period:
        raise ValueError("Periodo vazio")
    completed = flag(row.get("period_complete"))
    eligible = number(row,"monitoring_eligible")
    done = number(row,"monitoring_completed_valid")
    if done is not None and eligible is not None and done > eligible:
        raise ValueError("Conclusoes excedem elegiveis")
    cycles = number(row,"cycle_valid_count")
    mean = number(row,"cycle_mean_days")
    median = number(row,"cycle_median_days")
    p90 = number(row,"cycle_p90_days")
    date_checked = flag(row.get("cycle_dates_semantics_checked"))
    if (median is not None and p90 is not None) and median > p90:
        raise ValueError("Mediana maior que P90")
    attendance = number(row,"attendances_valid")
    beneficiaries = number(row,"beneficiaries_distinct")
    leaves = number(row,"military_unique_leave_starts")
    days = number(row,"unique_lost_days")
    strength = number(row,"active_strength_mean")
    if attendance is not None and beneficiaries is not None and beneficiaries > attendance:
        raise ValueError("Beneficiarios excedem atendimentos validos")
    if strength is not None and leaves is not None and leaves > strength:
        raise ValueError("Inicios unicos excedem efetivo medio")
    i2ok = bool(cycles and median is not None and p90 is not None and mean is not None)
    data = {
        "i1": metric(ratio(done,eligible,100), "%", reason="numerador/denominador ausente ou zero"),
        "i2": metric(median if i2ok else None,"dias",
             "calculavel_com_ressalva" if date_checked is False or date_checked is None else "calculavel",
             "Mediana, media e P90 exigem distribuicao previamente validada",
             {"mean":mean,"median":median,"p90":p90,"n":cycles} if i2ok else None),
        "i3": metric(ratio(attendance,beneficiaries), "atendimentos/beneficiario",
             reason="volume ou pessoas distintas ausentes/denominador zero"),
        "i4": metric(None, "%", reason="Q3 sem situacao e data de desfecho"),
        "i5": metric(None, "por 1.000 ativos", reason="Q4 especifica indisponivel"),
        "i6": metric(None, "horas", reason="Q4 sem entrada e primeiro acolhimento"),
        "i7": metric(ratio(leaves,strength,1000), "por 1.000 ativos",
             reason="pessoas unicas iniciantes ou efetivo medio ausente/zero"),
        "i8": metric(ratio(days,strength,1000), "dias por 1.000 ativos",
             reason="dias unicos consolidados ou efetivo medio ausente/zero"),
    }
    return {"period":period, "period_complete":completed, "indicators":data,
            "comparability_note": ("Periodo parcial; nao comparar como ano completo"
                                   if completed is False else
                                   "Validar comparabilidade historica de Q1 antes da leitura anual")}

def load(path: Path, sheet: str="") -> list[dict[str, Any]]:
    ext = path.suffix.casefold()
    if ext == ".csv":
        with path.open(encoding="utf-8-sig", newline="") as f:
            r = csv.DictReader(f)
            check_headers(r.fieldnames or [])
            rows = list(r)
    elif ext == ".json":
        rows = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(rows,list) or not rows or any(not isinstance(r,dict) for r in rows):
            raise ValueError("JSON deve ser lista nao vazia de agregados")
        for r in rows:
            check_headers(list(r))
    elif ext in {".xlsx",".xlsm"}:
        try:
            from openpyxl import load_workbook
        except ImportError as exc:
            raise RuntimeError("XLSX necessita openpyxl") from exc
        wb=load_workbook(path,read_only=True,data_only=True)
        ws=wb[sheet] if sheet else wb.active
        it=ws.iter_rows(values_only=True)
        headers=[str(v or "").strip() for v in next(it)]
        check_headers(headers)
        rows=[dict(zip(headers,values)) for values in it if any(v is not None for v in values)]
        wb.close()
    else:
        raise ValueError("Formatos: CSV, JSON, XLSX, XLSM")
    if not rows:
        raise ValueError("Fonte sem periodos")
    seen=set()
    for row in rows:
        p=str(row.get("period","")).strip()
        if p in seen:
            raise ValueError("Periodo duplicado: "+p)
        seen.add(p)
    return rows

def self_test() -> None:
    row={
        "period":"2025", "period_complete":"true", "monitoring_eligible":1586,
        "monitoring_completed_valid":1152,"cycle_valid_count":1100,
        "cycle_mean_days":32.2,"cycle_median_days":15,"cycle_p90_days":88.9,
        "cycle_dates_semantics_checked":"false","attendances_valid":7377,
        "beneficiaries_distinct":2914,"military_unique_leave_starts":241,
        "unique_lost_days":3194,"active_strength_mean":6041,
    }
    got=evaluate(row)["indicators"]
    expected={"i1":72.64,"i2":15.0,"i3":2.53,"i4":None,"i5":None,"i6":None,
              "i7":39.89,"i8":528.72}
    assert {k:v["value"] for k,v in got.items()} == expected
    assert all(got[k]["status"]=="N/D" for k in ("i4","i5","i6"))
    assert evaluate({"period":"test","monitoring_eligible":0})["indicators"]["i1"]["value"] is None
    assert evaluate({"period":"test","active_strength_mean":0})["indicators"]["i7"]["value"] is None
    for bad in ({"period":"t","monitoring_eligible":1,"monitoring_completed_valid":2},
                {"period":"t","cycle_median_days":15,"cycle_p90_days":10}):
        try: evaluate(bad)
        except ValueError: pass
        else: raise AssertionError("Falha de validacao")
    for sensitive in ("cpf","patient_id","full_name","matricula","diagnostico"):
        try: check_headers(["period",sensitive])
        except ValueError: pass
        else: raise AssertionError("Cabecalho sensivel aceito: "+sensitive)
    assert len(got)==8
    print("PASS: 8 contratos, 5 calculaveis, 3 N/D, privacidade, validacao e divisao segura")

def main() -> int:
    p=argparse.ArgumentParser(description="Validador de dados agregados PSOBM V14.5")
    s=p.add_subparsers(dest="command",required=True)
    s.add_parser("self-test")
    b=s.add_parser("build")
    b.add_argument("--source",required=True)
    b.add_argument("--sheet",default="")
    b.add_argument("--output",default="artifacts/dashboard.candidate.json")
    a=p.parse_args()
    if a.command=="self-test":
        self_test()
        return 0
    rows=load(Path(a.source),a.sheet)
    values=[evaluate(row) for row in rows]
    out=Path(a.output)
    out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps({"schemaVersion":2,"source":"agregados_prevalidados",
        "scientificReference":"TCC CGEPP V14.5, 2026","privacyMode":"agregado",
        "automaticallyPublished":False,"periods":values},ensure_ascii=False,indent=2)+"\n",
        encoding="utf-8")
    print("PASS: artefato candidato gravado, sem alterar painel publico")
    return 0

if __name__=="__main__":
    try: sys.exit(main())
    except (ValueError,RuntimeError,AssertionError) as exc:
        print("ERRO: "+str(exc),file=sys.stderr)
        sys.exit(1)
