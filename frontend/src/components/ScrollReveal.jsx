import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * ScrollReveal - Wrapper component that reveals children with animation on scroll
 * @param {ReactNode} children - Content to reveal
 * @param {string} animation - Animation type (fade-up, slide-left, scale, etc.)
 * @param {number} delay - Delay before animation starts (ms)
 * @param {string} className - Additional CSS classes
 */
export default function ScrollReveal({
    children,
    animation = 'fade-up',
    delay = 0,
    className = ''
}) {
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [delay]);

    const getAnimationClass = () => {
        switch (animation) {
            case 'fade-up':
                return 'scroll-reveal';
            case 'slide-left':
                return 'opacity-0 translate-x-20 transition-all duration-700';
            case 'slide-right':
                return 'opacity-0 -translate-x-20 transition-all duration-700';
            case 'scale':
                return 'opacity-0 scale-90 transition-all duration-700';
            default:
                return 'scroll-reveal';
        }
    };

    return (
        <div ref={elementRef} className={`${getAnimationClass()} ${className}`}>
            {children}
        </div>
    );
}

ScrollReveal.propTypes = {
    children: PropTypes.node.isRequired,
    animation: PropTypes.oneOf(['fade-up', 'slide-left', 'slide-right', 'scale']),
    delay: PropTypes.number,
    className: PropTypes.string,
};
