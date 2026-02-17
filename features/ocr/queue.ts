import type { OcrQueueJob } from '@/features/ocr/types';

export type OcrQueue = {
  enqueue: <T>(job: OcrQueueJob<T>) => Promise<T>;
  pendingCount: () => number;
};

export function createOcrQueue(concurrency = 1): OcrQueue {
  const queue: Array<{
    job: OcrQueueJob<unknown>;
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];
  let running = 0;

  const runNext = () => {
    if (running >= concurrency || queue.length === 0) {
      return;
    }

    const current = queue.shift();
    if (!current) {
      return;
    }

    running += 1;
    void current.job
      .run()
      .then(current.resolve)
      .catch(current.reject)
      .finally(() => {
        running -= 1;
        runNext();
      });
  };

  return {
    enqueue: <T>(job: OcrQueueJob<T>) =>
      new Promise<T>((resolve, reject) => {
        queue.push({
          job,
          resolve: resolve as (value: unknown) => void,
          reject,
        });
        runNext();
      }),
    pendingCount: () => queue.length + running,
  };
}
