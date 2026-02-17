import { describe, expect, it } from 'vitest';
import { createOcrQueue } from '@/features/ocr/queue';

describe('ocr queue', () => {
  it('runs queued jobs in order with single concurrency', async () => {
    const queue = createOcrQueue(1);
    const events: string[] = [];

    const p1 = queue.enqueue({
      id: 'a',
      run: async () => {
        events.push('a:start');
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push('a:end');
        return 'A';
      },
    });

    const p2 = queue.enqueue({
      id: 'b',
      run: async () => {
        events.push('b:start');
        events.push('b:end');
        return 'B';
      },
    });

    await expect(Promise.all([p1, p2])).resolves.toEqual(['A', 'B']);
    expect(events).toEqual(['a:start', 'a:end', 'b:start', 'b:end']);
  });
});
