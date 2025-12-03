import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * AnimatedCounter - Counts up from 0 to target value when element scrolls into view
 * @param {number} end - The target number to count to
 * @param {number} duration - Duration of animation in milliseconds (default: 2000)
 * @param {string} suffix - Optional suffix like "K+", "%", etc.
 * @param {string} prefix - Optional prefix like "$", etc.
 * @param {string} className - Additional CSS classes
 */
export default function AnimatedCounter({
    end,
    duration = 2000,
    suffix = '',
    prefix = '',
    className = ''
}) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => {
            if (counterRef.current) {
                observer.unobserve(counterRef.current);
            }
        };
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isVisible, end, duration]);

    return (
        <span ref={counterRef} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}

AnimatedCounter.propTypes = {
    end: PropTypes.number.isRequired,
    duration: PropTypes.number,
    suffix: PropTypes.string,
    prefix: PropTypes.string,
    className: PropTypes.string,
};
