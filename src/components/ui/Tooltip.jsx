import React, { useState, useRef, useEffect } from 'react';

function Tooltip({ children, content, position = 'bottom', delay = 300, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const targetRef = useRef(null);
  const tooltipRef = useRef(null);
  const timerRef = useRef(null);

  const showTooltip = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.bottom + 8;
        break;
      case 'left':
        x = targetRect.left - tooltipRect.width - 8;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = targetRect.right + 8;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
      default:
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.bottom + 8;
    }

    // Ensure tooltip stays within viewport
    const padding = 10;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setCoords({ x, y });
  };

  // Update position on window resize
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isVisible]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      ref={targetRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className="inline-block"
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 border border-gray-700 rounded shadow-lg pointer-events-none animate-fade-in ${className}`}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 border-t border-l border-gray-700 transform rotate-45 ${
              position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' :
              position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2 rotate-[225deg]' :
              position === 'left' ? 'top-1/2 -right-1 -translate-y-1/2 rotate-[135deg]' :
              'top-1/2 -left-1 -translate-y-1/2 rotate-[315deg]'
            }`}
          />
        </div>
      )}
    </div>
  );
}

export default Tooltip;

