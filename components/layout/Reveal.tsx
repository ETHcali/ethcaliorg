import { useEffect, useRef, useState } from 'react';

/**
 * Fades and lifts its children in the first time they scroll into view.
 *
 * Visible by default. The server render and a visitor without JavaScript see the
 * content in place; only after mount, and only for something still below the
 * fold, does it hide and wait for the observer. So the hero never flashes, and a
 * failed script never leaves a blank page.
 *
 * Reduced motion keeps the fade (it says "this just arrived") and drops the
 * movement. Transform and opacity only, so it stays off the layout path.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  /** Milliseconds; for staggering siblings, keep steps around 60–100. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState('hidden');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const motion =
    state === 'hidden'
      ? 'opacity-0 translate-y-8 motion-reduce:translate-y-0'
      : 'opacity-100 translate-y-0';

  return (
    <div
      ref={ref}
      style={state === 'shown' ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:duration-300 ${motion} ${className}`}
    >
      {children}
    </div>
  );
}
