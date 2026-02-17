export type ToolTier = 'Offline-Guaranteed' | 'Hybrid' | 'Online-Required';

const ONLINE_REQUIRED_PREFIXES = ['/pro/'] as const;
const ONLINE_REQUIRED_PATHS = new Set(['/pro']);
const HYBRID_PATHS = new Set<string>([]);

export type ToolTierTarget = {
  path: string;
  tier?: ToolTier;
};

export function resolveToolTier(target: ToolTierTarget): ToolTier {
  if (target.tier) {
    return target.tier;
  }
  if (ONLINE_REQUIRED_PATHS.has(target.path)) {
    return 'Online-Required';
  }
  if (ONLINE_REQUIRED_PREFIXES.some((prefix) => target.path.startsWith(prefix))) {
    return 'Online-Required';
  }
  if (HYBRID_PATHS.has(target.path)) {
    return 'Hybrid';
  }
  return 'Offline-Guaranteed';
}

export function getTierByPathPolicy(path: string): ToolTier | null {
  if (ONLINE_REQUIRED_PATHS.has(path)) {
    return 'Online-Required';
  }
  if (ONLINE_REQUIRED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return 'Online-Required';
  }
  if (HYBRID_PATHS.has(path)) {
    return 'Hybrid';
  }
  return null;
}
