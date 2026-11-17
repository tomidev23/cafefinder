import { createContext, useContext, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'cafefinder_theme';

export const ThemeContext = createContext({
    theme: 'system',
    resolvedTheme: 'light',
    setTheme: () => {},
});

function getSystemTheme() {
    if (typeof window === 'undefined') {
        return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function getStoredTheme() {
    if (typeof window === 'undefined') {
        return 'system';
    }
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored;
        }
    } catch (_) {
        // Fallback to system if localStorage is restricted
    }
    return 'system';
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(getStoredTheme);
    const [resolvedTheme, setResolvedTheme] = useState(() => {
        const initial = getStoredTheme();
        return initial === 'system' ? getSystemTheme() : initial;
    });

    // Apply resolved theme to the DOM
    const applyThemeToDOM = (resolved) => {
        if (typeof document === 'undefined') {
            return;
        }
        const root = document.documentElement;
        if (resolved === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        root.setAttribute('data-theme', resolved);
    };

    // Update theme preference
    const setTheme = (newTheme) => {
        if (newTheme !== 'light' && newTheme !== 'dark' && newTheme !== 'system') {
            return;
        }
        setThemeState(newTheme);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (_) {}

        const nextResolved =
            newTheme === 'system' ? getSystemTheme() : newTheme;
        setResolvedTheme(nextResolved);
        applyThemeToDOM(nextResolved);
    };

    // Handle initial mount and reactive system changes
    useEffect(() => {
        const nextResolved =
            theme === 'system' ? getSystemTheme() : theme;
        setResolvedTheme(nextResolved);
        applyThemeToDOM(nextResolved);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleMediaChange = (event) => {
            if (theme === 'system') {
                const sysResolved = event.matches ? 'dark' : 'light';
                setResolvedTheme(sysResolved);
                applyThemeToDOM(sysResolved);
            }
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleMediaChange);
        } else {
            mediaQuery.addListener(handleMediaChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleMediaChange);
            } else {
                mediaQuery.removeListener(handleMediaChange);
            }
        };
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
