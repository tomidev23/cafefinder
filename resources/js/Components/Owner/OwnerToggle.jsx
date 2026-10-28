export default function OwnerToggle({
    checked,
    onChange,
    label,
    disabled = false,
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={() => onChange?.(!checked)}
            className={`relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                checked ? 'bg-[#8D4B00]' : 'bg-[#D8D5DE]'
            }`}
        >
            <span
                aria-hidden="true"
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    checked ? 'translate-x-[21px]' : 'translate-x-[3px]'
                }`}
            />
        </button>
    );
}
