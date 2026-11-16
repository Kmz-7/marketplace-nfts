# Auditoria Lighthouse — 16/11/2026

As auditorias usam o build de produção com `VITE_ENABLE_MOCKS=true`, sem serviços privados. Cada rota foi medida três vezes; os valores abaixo são medianas. Os arquivos `.report.html` e `.report.json` ao lado deste documento são a evidência completa das seis execuções de cada perfil.

## Ambiente reproduzível

- Linux x86_64, Node.js 22.23.5 e npm 10.9.9.
- Lighthouse CI 0.16.1, Lighthouse 13.6.0 e HeadlessChrome 159.0.0.0.
- Desktop: 1350 × 940, escala 1, throttling simulado (CPU ×1, RTT 40 ms).
- Mobile: emulação Moto G Power (2022), Android 11, 412 × 823, escala 1,75, throttling simulado (CPU ×4, RTT 150 ms, throughput 1638,4 Kbps).
- Comandos: `npm run build`, `npm run audit:lighthouse` e `npm run audit:lighthouse:mobile`.
- As configurações mantêm as metas do enunciado: Performance ≥90, Acessibilidade ≥95, Boas práticas ≥95 e SEO ≥90.

## Medianas

| Perfil | Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Desktop | Início | 97 | 100 | 100 | 100 | 1,21 s | 0 | 1 ms |
| Desktop | Detalhes do NFT | 99 | 100 | 100 | 100 | 0,89 s | 0 | 0 ms |
| Mobile | Início | 86 | 98 | 100 | 100 | 4,06 s | 0 | 77 ms |
| Mobile | Detalhes do NFT | 90 | 100 | 100 | 100 | 3,64 s | 0 | 79 ms |

## Resultado abaixo da meta

A Home mobile fica quatro pontos abaixo da meta de Performance. O diagnóstico Lighthouse estima 121 KiB de JavaScript não utilizado na carga inicial, distribuídos entre o bundle da aplicação (aprox. 54 KiB) e o cliente/runtime do MSW (aprox. 67 KiB). Os recursos de imagem do banner são descobertos no documento inicial, têm prioridade alta e carregam rapidamente; o principal custo observado está no JavaScript da aplicação de demonstração com mocks ativos. A auditoria não desativa os mocks, imagens, fontes ou funcionalidades para elevar a pontuação.

O alvo mobile não deve ser considerado atendido até que a mediana da Home chegue a 90. O comando Lighthouse mobile termina com código diferente de zero quando a meta falha, preservando essa validação automática.
