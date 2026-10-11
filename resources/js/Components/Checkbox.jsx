export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-[#8D4B00] shadow-sm focus:ring-[#8D4B00] focus:ring-offset-0 checked:bg-[#8D4B00] checked:border-[#8D4B00] cursor-pointer ' +
                className
            }
        />
    );
}