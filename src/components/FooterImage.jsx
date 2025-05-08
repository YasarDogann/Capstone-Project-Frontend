import React from 'react';
import footerImage from '../assets/pode-osi.png'; // Görseli import ettim

const FooterImage = () => {
  return (
    <div>
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 1000,
      }}>
        <img src={footerImage} alt="Footer Image" width="300" height="300" />
      </div>
    </div>
  );
};

export default FooterImage;
