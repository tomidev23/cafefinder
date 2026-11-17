import { useState } from 'react';

export default function Img({ src, alt, className = '', fallbackSrc = null }) {
    const [failed, setFailed] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    if (failed || (!src && !fallbackSrc)) {
        return (
            <div
                role="img"
                aria-label={alt}
                className={`bg-linear-to-br from-amber-200 via-amber-500 to-amber-900 ${className}`}
            />
        );
    }

    return (
        <img
            src={currentSrc || fallbackSrc}
            alt={alt}
            loading="lazy"
            onError={() => {
                if (fallbackSrc && currentSrc !== fallbackSrc) {
                    setCurrentSrc(fallbackSrc);
                    return;
                }

                setFailed(true);
            }}
            className={`object-cover ${className}`}
        />
    );
}
