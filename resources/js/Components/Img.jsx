import { useState } from 'react';

export default function Img({ src, alt, className = '' }) {
    const [failed, setFailed] = useState(false);

    if (failed || !src) {
        return (
            <div
                role="img"
                aria-label={alt}
                className={`bg-gradient-to-br from-amber-200 via-amber-500 to-amber-900 ${className}`}
            />
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className={`object-cover ${className}`}
        />
    );
}
