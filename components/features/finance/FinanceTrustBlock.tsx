import { getFinanceDataVersion, type FinanceToolId } from '@/lib/finance-data-version';

type Props = {
  compact?: boolean;
  tool?: FinanceToolId;
};

export default function FinanceTrustBlock({ compact = false, tool }: Props) {
  const dataVersion = tool ? getFinanceDataVersion(tool) : null;

  return (
    <section
      className={`rounded-[var(--radius-lg)] border border-[rgb(var(--color-success-rgb)/0.32)] bg-[rgb(var(--color-success-rgb)/0.1)] ${compact ? 'p-4' : 'p-6'} space-y-3`}
    >
      <h3 className={`${compact ? 'text-base' : 'text-lg'} font-bold text-[var(--text-primary)]`}>
        شفافیت و اعتماد در محاسبات مالی
      </h3>
      <ul className="list-disc space-y-2 pr-5 text-sm leading-6 text-[var(--text-secondary)]">
        <li>تمام محاسبات مالی به‌صورت محلی در مرورگر شما انجام می‌شود.</li>
        <li>هیچ اسکریپت شخص ثالث یا API خارجی برای خروجی مالی استفاده نمی‌شود.</li>
        <li>نمایش تمام مقادیر مالی در رابط کاربری با واحد تومان است.</li>
      </ul>
      {dataVersion ? (
        <div className="rounded-[var(--radius-md)] border border-[rgb(var(--color-success-rgb)/0.25)] bg-[rgb(var(--color-success-rgb)/0.06)] p-3 text-xs text-[var(--text-secondary)]">
          <div className="font-semibold text-[var(--text-primary)]">
            نسخه داده: {dataVersion.label}
          </div>
          <div className="mt-1">
            {dataVersion.version} | {dataVersion.updatedAt} | {dataVersion.source}
          </div>
          <ul className="mt-2 list-disc space-y-1 pr-5">
            {dataVersion.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
