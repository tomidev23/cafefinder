import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '@/Context/ThemeContext';

const themeOptions = [
    {
        id: 'light',
        label: 'Terang',
        hint: 'Light Mode',
        icon: Sun,
    },
    {
        id: 'dark',
        label: 'Gelap',
        hint: 'Dark Mode',
        icon: Moon,
    },
    {
        id: 'system',
        label: 'Sistem',
        hint: 'Ikuti OS',
        icon: Monitor,
    },
];

export default function ThemeSwitcher({
    variant = 'pill', // 'pill' | 'dropdown' | 'mobile'
    className = '',
    compact = false,
}) {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        if (!dropdownOpen) return;
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [dropdownOpen]);

    // Active option metadata
    const activeOption =
        themeOptions.find((opt) => opt.id === theme) || themeOptions[2];
    const ActiveIcon = activeOption.icon;

    // Mobile full-width variant (e.g. inside mobile drawer)
    if (variant === 'mobile') {
        return (
            <div
                className={`rounded-2xl border border-stone-200 bg-stone-100/90 p-1 dark:border-stone-800 dark:bg-stone-900/90 ${className}`}
                role="radiogroup"
                aria-label="Pilihan Tema Aplikasi"
            >
                <div className="grid grid-cols-3 gap-1">
                    {themeOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = theme === opt.id;
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                aria-label={`Tema ${opt.label} (${opt.hint})`}
                                onClick={() => setTheme(opt.id)}
                                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:focus-visible:ring-amber-500 ${
                                    isSelected
                                        ? 'bg-white text-[#8D4B00] shadow-sm dark:bg-stone-800 dark:text-amber-400 font-semibold'
                                        : 'text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-200'
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="text-[11px] leading-tight">
                                    {opt.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Dropdown / Popover variant (compact single trigger button)
    if (variant === 'dropdown') {
        return (
            <div ref={dropdownRef} className={`relative inline-block ${className}`}>
                <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    aria-label={`Ubah Tema (saat ini: ${activeOption.label})`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-stone-200 bg-white/90 px-3 text-xs font-medium text-stone-700 shadow-xs backdrop-blur-sm transition-all duration-200 hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:border-stone-700 dark:bg-stone-800/90 dark:text-stone-200 dark:hover:bg-stone-700/80 dark:focus-visible:ring-amber-500"
                >
                    <ActiveIcon className="h-3.5 w-3.5 text-[#8D4B00] dark:text-amber-400" />
                    {!compact && (
                        <span className="hidden sm:inline">
                            {activeOption.label}
                        </span>
                    )}
                    <ChevronDown
                        className={`h-3 w-3 text-stone-400 transition-transform duration-200 ${
                            dropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                </button>

                {dropdownOpen && (
                    <div
                        role="menu"
                        aria-orientation="vertical"
                        className="absolute right-0 z-50 mt-1.5 w-40 overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10 backdrop-blur-md transition-all dark:border-stone-700 dark:bg-stone-800 dark:shadow-black/40"
                    >
                        <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                            Pilih Tema
                        </div>
                        {themeOptions.map((opt) => {
                            const Icon = opt.icon;
                            const isSelected = theme === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                        setTheme(opt.id);
                                        setDropdownOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors ${
                                        isSelected
                                            ? 'bg-amber-50 font-semibold text-[#8D4B00] dark:bg-stone-700 dark:text-amber-300'
                                            : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-700/60'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className="h-3.5 w-3.5 text-[#8D4B00] dark:text-amber-400" />
                                        <span>{opt.label}</span>
                                    </span>
                                    {isSelected && (
                                        <Check className="h-3.5 w-3.5 text-[#8D4B00] dark:text-amber-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // Default: Segmented Pill (Light, Dark, System in 3 buttons)
    return (
        <div
            className={`inline-flex items-center rounded-full border border-stone-200/90 bg-stone-100/90 p-0.5 shadow-xs backdrop-blur-xs transition-colors duration-200 dark:border-stone-700/80 dark:bg-stone-800/80 ${className}`}
            role="radiogroup"
            aria-label="Pilihan Tema (Terang, Gelap, Sistem)"
        >
            {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.id;

                return (
                    <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Tema ${opt.label} (${opt.hint})`}
                        title={`Tema ${opt.label} (${opt.hint})`}
                        onClick={() => setTheme(opt.id)}
                        className={`group relative inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] dark:focus-visible:ring-amber-500 ${
                            compact
                                ? 'h-7 w-7'
                                : 'h-7 px-2.5 sm:px-3 text-xs'
                        } ${
                            isSelected
                                ? 'bg-white text-[#8D4B00] shadow-xs font-semibold dark:bg-stone-700 dark:text-amber-400'
                                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                        }`}
                    >
                        <Icon
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                isSelected ? 'scale-110' : 'group-hover:scale-105'
                            } ${!compact && 'sm:mr-1.5'}`}
                        />
                        {!compact && (
                            <span className="hidden sm:inline text-[11.5px] leading-none">
                                {opt.label}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
