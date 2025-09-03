import React from 'react';

function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`px-6 py-5 border-b border-white/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className = '', ...props }) {
  return (
    <div
      className={`px-6 py-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`px-6 py-4 bg-black/20 border-t border-white/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;

