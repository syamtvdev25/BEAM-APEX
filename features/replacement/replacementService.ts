
import { searchLiteApi } from '../../api/searchApi';
import { ReplacementStep, CachedChain } from './types';

const CHAIN_CACHE: Record<string, CachedChain> = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const normalizeKey = (val: string = "") => val.trim().replace(/\s+/g, '').toUpperCase();

export const getCachedChain = (brand: string, artNr: string): ReplacementStep[] | null => {
  const key = `${brand || 'GENERIC'}:${normalizeKey(artNr)}`;
  const cached = CHAIN_CACHE[key];
  if (cached && (Date.now() - cached.ts < CACHE_TTL)) {
    return cached.chain;
  }
  return null;
};

export const setCachedChain = (brand: string, artNr: string, chain: ReplacementStep[]) => {
  const key = `${brand || 'GENERIC'}:${normalizeKey(artNr)}`;
  CHAIN_CACHE[key] = { chain, ts: Date.now() };
};

/**
 * Resolves replacement chain step-by-step
 */
export async function* resolveReplacementChainGenerator(
  startArtNr: string,
  startItem: ReplacementStep | undefined,
  isEmployee: boolean
): AsyncGenerator<{ step: ReplacementStep; isComplete: boolean; isIncomplete?: boolean }> {
  const visited = new Set<string>();
  let currentChain: ReplacementStep[] = startItem ? [startItem] : [];
  
  if (startItem) {
    visited.add(normalizeKey(startItem.ArtNr));
    yield { step: startItem, isComplete: false };
  }

  let nextToFetch = startItem?.Replaced ? normalizeKey(startItem.Replaced) : (startItem ? null : normalizeKey(startArtNr));
  const MAX_STEPS = 10;
  let stepCount = currentChain.length;

  while (nextToFetch && !visited.has(nextToFetch) && stepCount < MAX_STEPS) {
    visited.add(nextToFetch);
    try {
      const resp = await searchLiteApi(nextToFetch, undefined, undefined, isEmployee ? 'APEX' : 'CUSTOMER');
      if (resp.success && resp.data && resp.data.length > 0) {
        const match = resp.data.find(d => normalizeKey(d.ArtNr) === nextToFetch) || resp.data[0];
        currentChain.push(match);
        
        const nextRef = match.Replaced ? normalizeKey(match.Replaced) : null;
        yield { step: match, isComplete: !nextRef };
        
        if (!nextRef) break;
        nextToFetch = nextRef;
        stepCount++;
      } else {
        yield { step: {} as any, isComplete: true, isIncomplete: true };
        break;
      }
    } catch (err) {
      yield { step: {} as any, isComplete: true, isIncomplete: true };
      break;
    }
  }
}
