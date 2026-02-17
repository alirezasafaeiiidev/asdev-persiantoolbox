import { categoryContent } from '@/lib/tools-registry-data/category-content';
import { categories } from '@/lib/tools-registry-data/categories';
import { rawToolsRegistry } from '@/lib/tools-registry-data/raw-tools-registry';
import type {
  CategoryContent,
  ToolCategory,
  ToolEntry,
  ToolTier,
} from '@/lib/tools-registry-data/types';
import { getTierByPathPolicy, resolveToolTier } from '@/lib/tools-registry.policy';

export type {
  CategoryContent,
  RawToolEntry,
  ToolCategory,
  ToolContent,
  ToolEntry,
  ToolFaq,
  ToolTier,
} from '@/lib/tools-registry-data/types';

export const toolsRegistry: ToolEntry[] = rawToolsRegistry.map((entry) => ({
  ...entry,
  tier: resolveToolTier(entry),
}));

const toolsByPath = new Map(toolsRegistry.map((tool) => [tool.path, tool]));

export function getToolByPath(path: string): ToolEntry | undefined {
  return toolsByPath.get(path);
}

export function getToolByPathOrThrow(path: string): ToolEntry {
  const tool = toolsByPath.get(path);
  if (!tool) {
    throw new Error(`Tool registry entry not found for path: ${path}`);
  }
  return tool;
}

export function getIndexableTools(): ToolEntry[] {
  return toolsRegistry.filter((tool) => tool.indexable);
}

export function getCategories(): ToolCategory[] {
  return Object.values(categories);
}

export function getToolsByCategory(categoryId: string): ToolEntry[] {
  return toolsRegistry.filter((tool) => tool.kind === 'tool' && tool.category?.id === categoryId);
}

export function getCategoryContent(categoryId: string): CategoryContent | undefined {
  return categoryContent[categoryId];
}

export function getTierByPath(path: string): ToolTier {
  const policyTier = getTierByPathPolicy(path);
  if (policyTier) {
    return policyTier;
  }
  return toolsByPath.get(path)?.tier ?? 'Offline-Guaranteed';
}
