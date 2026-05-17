import { useState } from 'react';
import primaryLogoSrc from '../assets/photoroom-nobackground1995.png';
import fallbackLogoSrc from '../assets/logo.png';

function BrandLogo({ alt, className, style }) {
  const [logoSrc, setLogoSrc] = useState(primaryLogoSrc);

  const handleError = () => {
    if (logoSrc !== fallbackLogoSrc) {
      setLogoSrc(fallbackLogoSrc);
    }
  };

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading="eager"
      decoding="async"
    />
  );
}

export default BrandLogo;