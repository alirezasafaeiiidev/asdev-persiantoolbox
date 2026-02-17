import { getCategories, getToolByPath, type ToolCategory } from '@/lib/tools-registry';

export type GuidePage = {
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  relatedToolPaths: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
  lastModified: string;
};

const guidePages: GuidePage[] = [
  {
    slug: 'reduce-scanned-pdf-size',
    title: 'کاهش حجم PDF اسکن‌شده بدون افت شدید کیفیت',
    description: 'راهنمای عملی برای کم‌حجم‌سازی PDF اسکن‌شده و انتخاب حالت Lite/Accurate.',
    categoryId: 'pdf-tools',
    sections: [
      {
        heading: 'چرا PDF اسکن‌شده سخت‌تر کم‌حجم می‌شود؟',
        paragraphs: [
          'فایل‌های اسکن‌شده معمولاً شامل تصویرهای بزرگ هستند و متن واقعی کمی دارند. به همین دلیل کاهش حجم، بیشتر به تنظیم کیفیت تصویر وابسته است.',
          'اگر فایل از ابتدا با رزولوشن بالا ذخیره شده باشد، انتظار کاهش حجم بسیار زیاد همیشه واقع‌بینانه نیست.',
        ],
      },
      {
        heading: 'مسیر پیشنهادی اجرا',
        paragraphs: [
          'اول فایل را با حالت متعادل پردازش کنید. اگر کاهش حجم کم بود، حالت Lite را برای خروجی سریع‌تر امتحان کنید.',
          'برای ارسال اداری، خروجی را از نظر خوانایی بررسی کنید و در صورت نیاز نسخه با کیفیت بالاتر را نگه دارید.',
        ],
      },
    ],
    relatedToolPaths: ['/pdf-tools/compress/compress-pdf', '/pdf-tools/merge/merge-pdf'],
    faq: [
      {
        question: 'اگر حجم PDF کم نشد چه کنم؟',
        answer:
          'علت معمول، تصویری بودن کامل فایل است. در این حالت با کیفیت پایین‌تر یا ابعاد کمتر خروجی بگیرید.',
      },
    ],
    lastModified: '2026-02-17',
  },
  {
    slug: 'faster-image-optimization-for-web',
    title: 'بهینه‌سازی سریع تصویر برای وب و شبکه‌های اجتماعی',
    description: 'راهنمای انتخاب preset، فرمت خروجی و پردازش چندفایلی برای تصاویر.',
    categoryId: 'image-tools',
    sections: [
      {
        heading: 'انتخاب preset مناسب',
        paragraphs: [
          'برای مصرف روزانه preset متعادل بهترین نقطه شروع است و معمولاً کیفیت قابل قبول با حجم کمتر می‌دهد.',
          'برای انتشار سریع در پیام‌رسان‌ها از preset حداکثر فشرده استفاده کنید.',
        ],
      },
      {
        heading: 'کنترل افت کیفیت',
        paragraphs: [
          'اگر نوشته یا لوگو در تصویر دارید، کیفیت را خیلی پایین نبرید تا لبه‌ها دچار شکستگی نشوند.',
          'برای کنترل بهتر، خروجی هر فایل را قبل از دانلود نهایی پیش‌نمایش کنید.',
        ],
      },
    ],
    relatedToolPaths: ['/image-tools', '/pdf-tools/convert/image-to-pdf'],
    faq: [
      {
        question: 'بهترین فرمت خروجی چیست؟',
        answer:
          'برای اکثر کاربردهای وب، WebP انتخاب مناسبی است؛ برای سازگاری گسترده JPG هم گزینه خوبی است.',
      },
    ],
    lastModified: '2026-02-17',
  },
  {
    slug: 'date-conversion-with-minimum-errors',
    title: 'تبدیل تاریخ شمسی/میلادی با خطای کمتر',
    description: 'راهنمای عملی برای تبدیل تاریخ و کاهش خطاهای ورودی در محاسبات تقویمی.',
    categoryId: 'date-tools',
    sections: [
      {
        heading: 'استاندارد کردن ورودی',
        paragraphs: [
          'ورودی را با قالب سال/ماه/روز وارد کنید تا خطاهای فرمت کاهش یابد.',
          'اگر تاریخ قمری برای کاربرد رسمی لازم است، خروجی را با مرجع معتبر تطبیق دهید.',
        ],
      },
    ],
    relatedToolPaths: ['/date-tools'],
    faq: [
      {
        question: 'چرا در برخی تاریخ‌های قمری اختلاف می‌بینم؟',
        answer: 'برخی تقویم‌های قمری به رؤیت هلال وابسته‌اند و ممکن است اختلاف جزئی داشته باشند.',
      },
    ],
    lastModified: '2026-02-17',
  },
  {
    slug: 'clean-persian-text-before-publishing',
    title: 'پاک‌سازی متن فارسی قبل از انتشار',
    description: 'چک‌لیست استانداردسازی متن فارسی، شمارش کلمات و آماده‌سازی خروجی.',
    categoryId: 'text-tools',
    sections: [
      {
        heading: 'چرا پاک‌سازی متن مهم است؟',
        paragraphs: [
          'یکدست‌سازی اعداد، فاصله‌ها و نویسه‌ها باعث خوانایی بهتر و کاهش خطا در خروجی‌های رسمی می‌شود.',
          'قبل از انتشار، شمارش کلمات و تبدیل‌های موردنیاز را انجام دهید تا متن نهایی آماده باشد.',
        ],
      },
    ],
    relatedToolPaths: ['/text-tools', '/text-tools/address-fa-to-en'],
    faq: [
      {
        question: 'این ابزارها متن را ذخیره می‌کنند؟',
        answer: 'خیر، پردازش‌ها محلی هستند و متن شما به سرویس ثالث ارسال نمی‌شود.',
      },
    ],
    lastModified: '2026-02-17',
  },
  {
    slug: 'compare-loan-salary-interest-scenarios',
    title: 'مقایسه سناریوهای وام، حقوق و سود بانکی',
    description: 'راهنمای تحلیل ترکیبی سناریوهای مالی برای تصمیم‌گیری واقع‌بینانه.',
    categoryId: 'finance-tools',
    sections: [
      {
        heading: 'ترتیب تحلیل پیشنهادی',
        paragraphs: [
          'اول قسط وام را محاسبه کنید، سپس اثر آن را روی بودجه ماهانه در ابزار حقوق ببینید.',
          'در پایان سود بانکی را برای مقایسه هزینه فرصت اضافه کنید تا تصمیم دقیق‌تری بگیرید.',
        ],
      },
      {
        heading: 'افزایش دقت نتیجه',
        paragraphs: [
          'اعداد را با واحد یکسان وارد کنید و هر بار یک پارامتر را تغییر دهید تا اثر واقعی آن مشخص شود.',
        ],
      },
    ],
    relatedToolPaths: ['/loan', '/salary', '/interest'],
    faq: [
      {
        question: 'خروجی‌ها جایگزین قرارداد رسمی هستند؟',
        answer:
          'خیر، خروجی ابزارها برای تصمیم‌سازی است و باید با شرایط قرارداد واقعی تطبیق داده شود.',
      },
    ],
    lastModified: '2026-02-17',
  },
];

const guideMap = new Map(guidePages.map((guide) => [guide.slug, guide]));

export function getGuidePages(): GuidePage[] {
  return guidePages;
}

export function getGuideBySlug(slug: string): GuidePage | undefined {
  return guideMap.get(slug);
}

export function getGuidesByCategory(categoryId: string): GuidePage[] {
  return guidePages.filter((guide) => guide.categoryId === categoryId);
}

export function getGuideCategory(slug: string): ToolCategory | undefined {
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return undefined;
  }
  return getCategories().find((category) => category.id === guide.categoryId);
}

export function validateGuideLinkPaths(): { valid: boolean; invalidPaths: string[] } {
  const invalidPaths = guidePages
    .flatMap((guide) => guide.relatedToolPaths)
    .filter((path) => !getToolByPath(path));
  return {
    valid: invalidPaths.length === 0,
    invalidPaths,
  };
}
