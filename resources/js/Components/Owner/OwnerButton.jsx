const variants = {
    primary:
        'bg-[#8D4B00] text-white shadow-sm hover:bg-[#733D00] active:bg-[#623300]',
    secondary:
        'border border-[#E2E5EF] bg-white text-[#4A4552] shadow-sm hover:bg-[#F7F8FD] hover:border-[#D5DAE9]',
    soft: 'border border-[#E4EAF8] bg-[#F2F6FF] text-[#4A4C86] hover:bg-[#E9EFFF]',
    ghost: 'text-[#6F6A78] hover:bg-[#F5F4F8] hover:text-[#231F2B]',
    danger:
        'border border-[#F4D6D2] bg-[#FFF4F2] text-[#B42318] hover:bg-[#FFE9E5]',
};

const sizes = {
    sm: 'h-8 gap-1.5 px-2.5 text-[10.5px]',
    md: 'h-9 gap-1.5 px-3.5 text-[11.5px]',
    lg: 'h-10 gap-2 px-4 text-[12px]',
};

export default function OwnerButton({
    variant = 'secondary',
    size = 'md',
    icon: Icon,
    className = '',
    children,
    type = 'button',
    ...props
}) {
    return (
        <button
            type={type}
            className={`inline-flex shrink-0 items-center justify-center rounded-lg font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {Icon && <Icon aria-hidden="true" className="h-3.5 w-3.5" />}
            {children}
        </button>
    );
}
