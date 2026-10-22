import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Step as FdStep, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import type { MDXComponents } from 'mdx/types';
import { PromptCard } from '@/components/prompt/prompt-card';
import { Lab, Step, Expected, Trouble, Issue } from '@/components/lab/lab';
import { Checklist } from '@/components/lab/checklist';
import { Quiz } from '@/components/quiz/quiz';
import {
  SessionHeader,
  SessionPrompts,
  Assignment,
  Compare,
  Fact,
  RelatedExamples,
  NextSession,
  KeyPoints,
  Analogy,
  SelfStudyHeader,
  DeepDive,
} from '@/components/session/session';
import { Term } from '@/components/ui/term';
import { OSBlock, OSOnly, Kbd } from '@/components/ui/os';
import { Sim } from '@/components/sim';
import { CostCalculator, CostTable } from '@/components/tools/cost';
import { PromptBuilder } from '@/components/tools/prompt-builder';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Steps,
    FdStep,
    Tab,
    Tabs,
    Accordion,
    Accordions,
    PromptCard,
    Lab,
    Step,
    Expected,
    Trouble,
    Issue,
    Checklist,
    Quiz,
    SessionHeader,
    SessionPrompts,
    Assignment,
    Compare,
    Fact,
    RelatedExamples,
    NextSession,
    KeyPoints,
    Analogy,
    SelfStudyHeader,
    DeepDive,
    Term,
    OSBlock,
    OSOnly,
    Kbd,
    Sim,
    CostCalculator,
    CostTable,
    PromptBuilder,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
