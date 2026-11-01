export default function OwnerPageHeader({
    eyebrow,
    title,
    badge,
    description,
    actions,
    children,
}) {
    return (
        <section className="rounded-2xl border border-[#ECECF3] bg-white p-5 shadow-sm shadow-[#20263A]/3 sm:p-6">
            {eyebrow && (
                <p className="text-[10px] font-medium text-[#8B8694]">
                    {eyebrow}
                </p>
            )}

            <div className="mt-1 flex flex-col gap-4 xl:flex-row xl:flex-nowrap xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1 xl:max-w-[620px]">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-[25px] font-bold leading-[1.16] tracking-[-0.04em] text-[#211D29] sm:text-[27px]">
                            {title}
                        </h1>
                        {badge}
                    </div>
                    {description && (
                        <p className="mt-1.5 max-w-[600px] text-[12px] leading-5 text-[#6F6A78]">
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex flex-wrap items-center gap-2 xl:shrink-0 xl:flex-nowrap xl:justify-end">
                        {actions}
                    </div>
                )}
            </div>

            {children && (
                <div className="mt-4 border-t border-[#F0EFF4]">{children}</div>
            )}
        </section>
    );
}
