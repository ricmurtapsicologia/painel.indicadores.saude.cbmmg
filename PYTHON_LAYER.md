# Camada Python — Painel de Indicadores de Saúde

## Estado de segurança

A ETL foi adicionada em paralelo. `index.html` permanece intacto e continua exibindo o protótipo demonstrativo atual.

Ponto de rollback: `backup/pre-python-20260809`.

## Contrato dos oito indicadores

A camada Python implementa as fórmulas metodológicas já exibidas pelo painel:

1. conclusão do monitoramento;
2. tempo médio do ciclo;
3. recorrência assistencial;
4. continuidade assistencial;
5. demandas urgentes por 1.000 militares;
6. tempo médio até acolhimento;
7. taxa de afastamento psicológico/psiquiátrico;
8. dias perdidos.

O pipeline recebe somente dados agregados. Colunas identificáveis (nome, matrícula, CPF, telefone, paciente etc.) são recusadas.

## Saída segura

`build` gera `artifacts/dashboard.generated.json`. Ele não substitui dados nem altera o frontend automaticamente.

Formatos aceitos: CSV, JSON agregado e XLSX/XLSM.

```bash
python scripts/dashboard_etl.py self-test
python scripts/dashboard_etl.py build --source dados_agregados.csv
```

O workflow `Python dashboard ETL audit` compila o pipeline e executa um teste contratual das oito fórmulas antes de qualquer futura integração.

## Próxima promoção

Somente após uma base institucional agregada estar disponível e os valores produzidos serem conferidos com a baseline do painel deve o frontend passar a consumir `dashboard.json`.
