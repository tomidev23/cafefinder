import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border-stone-200 bg-white text-stone-900 shadow-xs transition placeholder:text-stone-400 focus:border-[#8D4B00] focus:ring-2 focus:ring-[#8D4B00]/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-600 dark:focus:border-amber-500 dark:focus:ring-amber-500/20 ' +
                className
            }
            ref={localRef}
        />
    );
});
