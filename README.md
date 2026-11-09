# 🚀 VagaMatch — JobMatch ATS & Gerador de Currículos Inteligentes

![DIO](https://img.shields.io/badge/Desafio-DIO-blue)
![Lovable](https://img.shields.io/badge/Desenvolvido%20com-Lovable-8B5CF6)
![ATS](https://img.shields.io/badge/ATS-Friendly-22C55E)
![Status](https://img.shields.io/badge/Status-Concluído-success)

> **Projeto desenvolvido para o desafio prático da Digital Innovation One (DIO):**  
> *"Criando um Gerador de Currículos ATS Friendly com Lovable"*, ministrado pelo Expert Bruno.

---

## 🌐 1. Endereço da Aplicação Publicada

- 🔗 **Aplicação no ar (Live App):** [https://dio-teste-jobmatch-v30.lovable.app](https://dio-teste-jobmatch-v30.lovable.app)
- 📁 **Repositório no GitHub:** [https://github.com/matvieira7/dio-teste-jobmatch-v30](https://github.com/matvieira7/dio-teste-jobmatch-v30)

---

## 📌 2. Qual problema a aplicação resolve?

Muitos profissionais qualificados são reprovados silenciosamente na primeira triagem de processos seletivos porque seus currículos não atendem aos critérios técnicos dos sistemas **ATS** (*Applicant Tracking Systems*).

Esses sistemas escaneiam os currículos em busca de termos específicos, estrutura limpa e correspondência direta com as exigências da oportunidade. Quando o candidato não utiliza as palavras-chave adequadas ou usa formatações gráficas que os robôs não conseguem processar, a candidatura é descartada antes mesmo de passar pela avaliação humana.

### A solução VagaMatch:
O **VagaMatch** permite ao candidato comparar seu perfil/currículo com a descrição de qualquer oportunidade, entregando:
- **Indicador de Compatibilidade (Match %):** Cálculo ponderado baseado em 6 dimensões essenciais.
- **Diagnóstico ATS:** Identificação clara de palavras-chave encontradas, lacunas e recomendações de melhoria.
- **Currículo ATS Friendly Sob Medida:** Reestruturação das experiências reais para destacar o alinhamento com a vaga.
- **Acesso Imediato:** Sem fricção de login, com onboarding ágil e persistência local no navegador.

> ⚠️ **Regra Fundamental Inviolável:** A aplicação nunca alucina, inventa informações ou cria experiências falsas. O objetivo é aprimorar a apresentação da trajetória real do candidato.

---

## 🧠 3. Mega Prompt Utilizado no Lovable

Para guiar a IA na geração inicial da aplicação, foi elaborado um prompt estruturado contendo regras de negócio, escopo e identidade visual:

```text
# Projeto: VagaMatch — JobMatch ATS & Gerador de Currículos

Crie um aplicativo completo de Matchmaking de Vagas + Currículo ATS Friendly.

1. Objetivo:
Criar uma plataforma que compare o perfil/currículo do candidato com vagas de emprego, calcule o percentual de compatibilidade e gere versões otimizadas do currículo para sistemas ATS.
REGRA OBRIGATÓRIA: Nunca inventar experiências profissionais, qualificações, cursos ou certificações falsas.

2. Design System & Identidade Visual:
- Baseado em shadcn/ui e Tailwind CSS.
- Paleta profissional: Verde escuro (#003821), Esmeralda (#005D39), Verde suave e Branco.
- Layout SaaS moderno (referência em Linear e Notion), limpo, minimalista e responsivo.

3. Fluxo de Navegação (Sem autenticação inicial):
- Acesso imediato sem exigência de login (persistência em localStorage).
- Onboarding em etapas: Dados Pessoais, Objetivo, Formação, Experiências e Competências.
- Importador de currículo com suporte a PDF, DOCX e texto colado.

4. Funcionalidades Principais:
- Dashboard de oportunidades recomendadas com score de Match.
- Algoritmo de compatibilidade baseado em competências, experiência, formação e palavras-chave.
- Análise diagnóstica ATS (pontos fortes, ausências e sugestões).
- Gerador de currículo personalizado para a vaga alvo.
- Exportação nos formatos PDF, DOCX e TXT.
- Kanban de acompanhamento de candidaturas (pipeline seletivo).
```

### Evolução do Prompt:
O escopo inicial contemplava apenas a comparação textual simples entre dois campos. O prompt foi expandido para um SaaS completo com catálogo de vagas, histórico de versões personalizadas por vaga, normalização de sinônimos técnicos e um quadro Kanban para acompanhamento das candidaturas.

---

## ⚙️ 4. Como a análise funciona (da vaga ao currículo ajustado)

1. **Entrada dos Dados:** O candidato preenche suas informações pelo fluxo de onboarding ou importa um currículo pré-existente (PDF, DOCX ou texto colado).
2. **Normalização Semântica:** A aplicação normaliza variações e sinônimos de tecnologias (exemplo: *React* ↔ *React.js*, *Node* ↔ *Node.js*, *Postgres* ↔ *PostgreSQL*).
3. **Cálculo de Match (6 Pilares):** A plataforma avalia a aderência do candidato à oportunidade analisando:
   - Hard Skills e Ferramentas;
   - Soft Skills;
   - Nível de Senioridade;
   - Formação Acadêmica;
   - Modalidade de Trabalho (Remoto, Híbrido, Presencial);
   - Palavras-chave essenciais da vaga.
4. **Diagnóstico ATS:** Apresenta um relatório visual contendo a compatibilidade estimada, requisitos atendidos e competências faltantes.
5. **Geração do Currículo Otimizado:** O resumo profissional e as experiências existentes são reorganizados para enfatizar as qualificações mais relevantes à oportunidade.
6. **Exportação Multi-formato:** O usuário baixa o currículo ajustado em **PDF** (layout limpo com tipografia ATS-friendly), **DOCX** (editável no Word) ou **TXT** (puro para formulários).

---

## 🛠️ 5. Ajustes e refinamentos realizados após a primeira geração

Durante o processo iterativo com o Lovable, os seguintes refinamentos foram solicitados e implementados:

1. **Correção de Rotas e Persistência Global:**
   - *Motivo:* As rotas internas de detalhes da vaga (`/jobs/$id`), versões de currículo (`/resume/versions`) e candidaturas (`/applications`) precisavam de sincronização no sistema de roteamento do TanStack, e o `StoreProvider` foi ajustado para envolver a raiz da aplicação no `__root.tsx`, assegurando a integridade dos dados no navegador.
2. **Nova Identidade Visual Formal e Favicon:**
   - *Motivo:* A logo inicial genérica foi substituída por um emblema geométrico formal com escudos entrelaçados em verde escuro (`#003821`) e esmeralda (`#005D39`), refletindo autoridade e gerando o favicon oficial da marca.
3. **Otimização do CTA na Landing Page:**
   - *Motivo:* O botão principal de conversão da página inicial recebeu destaque tipográfico com a chamada direta *"entre agora!"*, facilitando o início imediato do fluxo sem fricção.
4. **Múltiplos Formatos de Exportação (PDF, DOCX e TXT):**
   - *Motivo:* Atender aos diferentes cenários de envio dos candidatos, garantindo tanto o PDF pronto para leitura por ATS quanto o DOCX para edições manuais.
5. **Documentação do Design System em PDF:**
   - *Motivo:* Formalização de todos os tokens visuais, componentes do shadcn/ui e paleta semântica em um documento exportável.

---

## 💻 6. Tecnologias e Ferramentas

- **Framework:** [TanStack Start v1](https://tanstack.com/start) (Full-stack React 19)
- **Roteamento:** TanStack Router (File-based routing tipado)
- **Design System & Estilização:** Tailwind CSS v4 + tokens semânticos
- **Componentes UI:** shadcn/ui + Radix UI Primitives
- **Ícones:** Lucide React
- **Gerenciamento de Estado:** React Context + Hooks + TanStack Query
- **Exportação:** Geradores de arquivos PDF, DOCX e TXT no client-side
- **Plataforma de IA & Deploy:** [Lovable](https://lovable.dev/)

---

## 👨‍💻 Autor

**Matheus Vieira**  
Projeto desenvolvido como parte do desafio prático da **Digital Innovation One (DIO)**.
