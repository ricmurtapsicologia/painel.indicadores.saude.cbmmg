# Contrato científico do painel

Referência autoritativa: artigo científico do CGEPP 2026, versão final depositada V14.5. A página pública é uma **representação ilustrativa**, congelada no corte de 30/06/2026, e não sistema institucional implantado.

## Resultados

- Oito indicadores: cinco calculáveis, três N/D.
- I1: registros concluídos válidos / elegíveis × 100; 81,9% global e 83,6% na janela comparável 2023–2025.
- I2: distribuição válida de dias convocação–avaliação; média, mediana e P90, com ressalva histórica e normativa.
- I3: atendimentos válidos / beneficiários distintos no mesmo horizonte; não somar pessoas distintas entre períodos.
- I4: N/D (Q3 sem situação e data de desfecho).
- I5–I6: N/D (Q4 indisponível e ausência de marcos de episódio).
- I7: militares distintos com início de afastamento no ano / efetivo médio ativo do mesmo ano × 1.000.
- I8: dias únicos anuais consolidados, sem sobreposições de mesma chave técnica / efetivo médio ativo × 1.000.

## Engenharia de dados

O script `scripts/dashboard_etl.py` valida **exclusivamente agregados pré-qualificados** (CSV, JSON ou XLSX). Campos pessoais e clínicos são recusados. Nenhuma medida inexistente é imputada; divisões sem denominador válido retornam N/D. Médias não substituem medianas e o programa exige resumos estatísticos da distribuição previamente validados.

O comando `python scripts/dashboard_etl.py self-test` verifica o contrato; `build --source arquivo.csv` produz apenas um **artefato candidato**. Não altera a publicação nem autentica os dados institucionais de origem.

## Validação de release

O workflow `.github/workflows/painel-quality.yml` executa: teste de contrato, auditoria estática 30/30, teste do navegador com Playwright, teclado, responsividade e impressão. Alterações devem passar nesses gates antes da atualização pública.

Não reproduzir no GitHub dados individuais, chaves de identificação, datas de eventos por pessoa, diagnósticos ou credenciais.
