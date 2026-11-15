export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-semibold text-stone-700 dark:text-stone-300 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
