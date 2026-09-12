# Self-Evolving Agents, RSI, and Continual Learning for Science

[Back to the list](../README.md#self-evolving-agents-and-continual-learning)

Literature checked through **2026-09-12**. This guide connects recent scientific applications with the mechanisms they use to improve. It includes selected earlier foundations. Descriptions summarize the cited papers; the grouping and scope assessments are editorial judgments, not independent reproductions of their results.

## What improves?

**Self-evolving agents** can retain useful changes in memory, skills, tools, code, or research strategies. **Continual learning** concerns learning from successive experience while retaining useful capabilities; evidence may involve external memory or model-parameter updates. **Recursive self-improvement (RSI)** additionally concerns improving the procedure that produces future improvements. These mechanisms overlap, so a useful comparison records both the component that changes and the tasks over which the improvement persists. The [RSI survey and framework](https://self-improving-agent.com/) distinguishes changes to the model, agent infrastructure, data, trainer, and improvement mechanism.

Three useful starting points are [HypoForge](https://arxiv.org/abs/2608.25770) for scientific skill learning without foundation-model fine-tuning, [TTT-Discover](https://arxiv.org/abs/2601.16175) for reinforcement learning during a scientific test problem, and [Hyperagents](https://arxiv.org/abs/2603.19461) for an editable meta-agent that changes its own improvement procedure. They address different questions and should be compared accordingly.

## Scientific workflows, skills, and experience

Dates refer to the original paper/preprint, with the early AlphaEvolve white paper noted below. Domain-specific papers remain in their corresponding README section.

| First publication | Work | What changes or persists | Scientific setting and scope |
| --- | --- | --- | --- |
| 2026-09 | [ADMET-EvO](https://arxiv.org/abs/2609.10121) | Supported, rejected, and inconclusive experimental evidence informs subsequent hypotheses and interventions. | ADMET prediction and toxicity tasks; evaluates sustained research across heterogeneous endpoints. |
| 2026-08 | [HypoForge](https://arxiv.org/abs/2608.25770) | Reusable hypothesis-generation and testing skills learned with stage-specific feedback. | Hypothesis generation/testing benchmarks; foundation models are not fine-tuned. |
| 2026-07 | [SciToolAgent-Evo](https://arxiv.org/abs/2607.28692) | Skills, experience memory, and an ontology-backed tool graph evolve as tools are acquired. | Scientific tool use on OpenSciToolBench; tool acquisition and integration are the focus. |
| 2026-07 | [Lifelong AI partners for materials scientists](https://arxiv.org/abs/2608.11224) | Inspectable facts, executable skills, and failure checks are retained in portable memory. | Materials tools, equations of state, and simulation workflows; no model-parameter updates. |
| 2026-06 | [Evidence-Informed LLM Beliefs for Continual Scientific Discovery](https://arxiv.org/abs/2606.29182) | Retrieved prior discoveries update in-context beliefs and the reward used for subsequent search. | Five discovery domains; studies redundant discoveries and misleading static surprise scores. |
| 2026-06 | [White-box fluid control](https://arxiv.org/abs/2606.08405) | Simulation evidence accumulates as control knowledge and explicit controller-code revisions. | Swimmer navigation in unsteady flows; evaluates changed flow conditions and transfer from 2D to 3D. |
| 2026-06 | [MLEvolve](https://arxiv.org/abs/2606.06473) | Search branches share information and retrieve accumulated implementation experience. | Machine-learning engineering and mathematical algorithm optimization; distinguishes task-specific memory from general lifelong transfer. |
| 2026-05 | [GRAFT-ATHENA](https://arxiv.org/abs/2605.11117) | A shared probabilistic representation of methodological choices transfers experience and gains new actions. | Physics-informed learning and numerical solvers, including inverse problems. |
| 2026-04 | [EvoMaster](https://arxiv.org/abs/2604.17406) | Persistent evidence connects execution, exploration, and evolution across research cycles. | Shared infrastructure evaluated on scientific research, coding, and reasoning tasks. |
| 2026-04 | [CORAL](https://arxiv.org/abs/2604.01658) | Long-running agents reuse shared memory and collaborate during open-ended search. | Mathematical, algorithmic, and systems optimization; shared memory supports discovery across attempts. |
| 2026-03 | [EvoScientist](https://arxiv.org/abs/2603.08127) | An evolution manager distills ideation and experimentation memories for researcher and engineer agents. | Scientific idea generation and experimental code execution. |
| 2026-02 | [S1-NexusAgent](https://arxiv.org/abs/2602.01550) | A critic distills successful scientific trajectories into reusable skills. | Biology, chemistry, and materials tool workflows; evaluated as a multidisciplinary research agent. |
| 2025-12 | [CASCADE](https://arxiv.org/abs/2512.23880), already in the list | Scientific procedures are accumulated as reusable skills. | Materials research; connects the existing Physical Sciences entries to this topic. |
| 2025-07 | [STELLA](https://arxiv.org/abs/2507.02004) | Reasoning templates and a dynamically expanded bioinformatics tool collection. | Biomedical research benchmarks; this row summarizes the original arXiv paper. |
| 2025-05 | [AlphaEvolve](https://arxiv.org/abs/2506.13131) | Candidate programs evolve under executable evaluators. | Mathematical and computational discovery; the discovery loop uses frozen language models. |

## Parameter learning and recursive improvement

The general agent papers below are methodological foundations for scientific-agent design. Their benchmark scope matters when interpreting their relevance to open-ended science.

| First publication | Work | Improvement mechanism | Evidence boundary |
| --- | --- | --- | --- |
| 2026-08 | [Meta^n](https://arxiv.org/abs/2608.24735) | Recursively builds solver layers with strategic preprocessing and helper libraries. | Includes mathematical optimization and symbolic regression; the universal meta-operation remains fixed. |
| 2026-03 | [Hyperagents](https://arxiv.org/abs/2603.19461) | A single editable program contains a task agent and a meta-agent; both can change. | Studies meta-level improvement and transfer across evaluated domains, not unrestricted scientific autonomy. |
| 2026-01 | [Learning to Discover at Test Time / TTT-Discover](https://arxiv.org/abs/2601.16175) | Reinforcement learning updates model parameters using experience from the current test problem. | Mathematics, kernels, algorithms, and single-cell denoising; the objective is one strong solution to that problem, not retention across a lifelong task stream. |
| 2025-05 | [Darwin Godel Machine](https://arxiv.org/abs/2505.22954) | An archive of agents expands through empirically evaluated changes to the agents' own code. | Evaluated on coding benchmarks; a foundation for research-agent self-modification rather than direct evidence of laboratory discovery. |

## Evaluation

[AI4AI-Bench](https://arxiv.org/abs/2608.20318), first released in **2026-08**, isolates training-algorithm design in ten research repositories. Proposed changes are rerun from scratch and scored by fixed evaluators hidden from the agent. This makes it useful for assessing one prerequisite of RSI; it does not by itself demonstrate repeated successor generations or lifelong retention.

For future additions, look for evidence that distinguishes:

- Gains on a repeatedly optimized problem from transfer to unseen scientific tasks.
- Retained memory or skills from changes to model parameters.
- Improvements to candidate solutions from changes to the improvement procedure.
- Measured retention and forgetting from an increasing score over a short sequence of attempts.

The existing [Benchmarks & Evaluation](../README.md#benchmarks--evaluation) section provides broader scientific and machine-learning evaluation suites. OpenSciToolBench is described in the [SciToolAgent-Evo paper](https://arxiv.org/abs/2607.28692).

## Source and release notes

- Titles, authors, and dates were checked against the linked primary papers. Most new works are preprints; CORAL's [official repository](https://github.com/Human-Agent-Society/CORAL) confirms acceptance at COLM 2026.
- The materials-memory paper has arXiv identifier `2608.11224`, but its submission history explicitly records **2026-07-25**. Its entry therefore uses July.
- AlphaEvolve's [official announcement and linked white paper](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) were public on **2025-05-14**, before the June arXiv submission.
- EvoMaster and the fluid-control paper use the titles in their September revisions while retaining their original April and June paper dates. Earlier code releases do not replace the paper dates for paper entries.
- The code URL supplied by ADMET-EvO returned HTTP 404 during verification, so the README links only the paper. Code URLs for other entries are included only where the official implementation was located and accessible; a paper's release claim alone is insufficient.
- STELLA's [official repository](https://github.com/zaixizhang/STELLA) now also links an expanded biomedical world-model manuscript. The README entry cites the original July 2025 arXiv paper, keeping its title and first-author attribution consistent with that source.
