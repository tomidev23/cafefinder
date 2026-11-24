import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollWordReveal
 * Splits text into words and animates each word revealing as the user scrolls into view.
 *
 * @param {string} text The sentence or title to animate
 * @param {string} className Outer heading class names
 * @param {string} as HTML tag, defaults to 'h2'
 * @param {number} delay Optional delay in seconds
 * @param {number} stagger Optional stagger between words (default 0.045)
 */
export default function ScrollWordReveal({
    text = '',
    className = '',
    as: Tag = 'h2',
    delay = 0,
    stagger = 0.045,
    ...props
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }

        const words = el.querySelectorAll('.scroll-word-inner');
        if (!words || words.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                words,
                {
                    opacity: 0,
                    y: '105%',
                    rotateX: -35,
                    filter: 'blur(4px)',
                },
                {
                    opacity: 1,
                    y: '0%',
                    rotateX: 0,
                    filter: 'blur(0px)',
                    duration: 0.75,
                    stagger: stagger,
                    ease: 'power3.out',
                    delay: delay,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                        once: true,
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [text, delay, stagger]);

    // Split text into individual words while preserving whitespace
    const wordsList = String(text).trim().split(/\s+/);

    return (
        <Tag ref={containerRef} className={`${className} perspective-midrange`} {...props}>
            {wordsList.map((word, idx) => (
                <span
                    key={`${word}-${idx}`}
                    className="inline-block overflow-hidden align-top leading-tight mr-[0.26em] last:mr-0 pb-1"
                >
                    <span className="scroll-word-inner inline-block will-change-transform">
                        {word}
                    </span>
                </span>
            ))}
        </Tag>
    );
}
