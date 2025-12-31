import React, { useEffect, useState } from 'react';
import './ScrollToTopButton.css';

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scroll-top-btn ${show ? 'visible' : ''}`}
      aria-label="Scroll to top"
      onClick={scrollTop}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;


