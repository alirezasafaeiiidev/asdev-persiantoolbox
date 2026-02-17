export type HeavyFileGuardrailCode =
  | 'FILE_MISSING'
  | 'UNSUPPORTED_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'TOO_MANY_FILES';

export type HeavyFileGuardrailResult = {
  ok: boolean;
  code?: HeavyFileGuardrailCode;
  message?: string;
  hint?: string;
};

export type FileGuardrailOptions = {
  acceptedMimeTypes: string[];
  maxFileSizeBytes: number;
  fileLabelFa: string;
};

export type FileCountGuardrailOptions = {
  maxFiles: number;
  fileLabelFa: string;
};

const formatSize = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 MB';
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
};

export function validateHeavyFile(
  file: File | null | undefined,
  options: FileGuardrailOptions,
): HeavyFileGuardrailResult {
  if (!file) {
    return {
      ok: false,
      code: 'FILE_MISSING',
      message: `ابتدا ${options.fileLabelFa} را انتخاب کنید.`,
    };
  }

  if (!options.acceptedMimeTypes.includes(file.type)) {
    return {
      ok: false,
      code: 'UNSUPPORTED_FILE_TYPE',
      message: `${options.fileLabelFa} پشتیبانی نمی‌شود.`,
      hint: 'فرمت فایل را بررسی کنید و دوباره تلاش کنید.',
    };
  }

  if (file.size > options.maxFileSizeBytes) {
    return {
      ok: false,
      code: 'FILE_TOO_LARGE',
      message: `حجم ${options.fileLabelFa} بیش از حد مجاز است (${formatSize(options.maxFileSizeBytes)}).`,
      hint: 'فایل کوچک‌تر انتخاب کنید یا با تنظیمات سبک‌تر (Lite) دوباره تلاش کنید.',
    };
  }

  return { ok: true };
}

export function validateHeavyFileCount(
  count: number,
  options: FileCountGuardrailOptions,
): HeavyFileGuardrailResult {
  if (count > options.maxFiles) {
    return {
      ok: false,
      code: 'TOO_MANY_FILES',
      message: `تعداد ${options.fileLabelFa} بیش از حد مجاز است.`,
      hint: `حداکثر ${options.maxFiles} فایل انتخاب کنید.`,
    };
  }

  return { ok: true };
}

export function getSuggestedCompressionMode(fileSizeBytes: number, liteThresholdBytes: number) {
  if (!Number.isFinite(fileSizeBytes) || fileSizeBytes <= 0) {
    return 'accurate' as const;
  }
  return fileSizeBytes >= liteThresholdBytes ? ('lite' as const) : ('accurate' as const);
}
