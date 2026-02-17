import type { RawToolEntry } from '@/lib/tools-registry-data/types';
import { coreEntries } from '@/lib/tools-registry-data/entries/core';
import { financeEntries } from '@/lib/tools-registry-data/entries/finance';
import { pdfEntries } from '@/lib/tools-registry-data/entries/pdf';

export const rawToolsRegistry: RawToolEntry[] = [...coreEntries, ...financeEntries, ...pdfEntries];
