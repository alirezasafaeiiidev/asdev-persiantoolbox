export type ToolFaq = {
  question: string;
  answer: string;
};

export type ToolContent = {
  intro: string;
  sections?: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  steps?: string[];
  tips?: string[];
  faq?: ToolFaq[];
};

export type ToolCategory = {
  id: string;
  name: string;
  path: string;
};

export type CategoryContent = {
  paragraphs: string[];
  faq: ToolFaq[];
  keywords?: string[];
};

export type ToolTier = 'Offline-Guaranteed' | 'Hybrid' | 'Online-Required';

export type ToolEntry = {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  indexable: boolean;
  lastModified?: string;
  kind: 'tool' | 'category' | 'hub';
  category?: ToolCategory;
  content?: ToolContent;
  tier: ToolTier;
};

export type RawToolEntry = Omit<ToolEntry, 'tier'> & {
  tier?: ToolTier;
};
