import React, { useState, useEffect } from 'react';
import Typist from 'react-typist';
import './App.css'; 
import Configs from './configurations.json';

// Başlangıç state'lerini hesaplamak için bir yardımcı fonksiyon
const getInitialBackground = () => {
  const backgroundType = Configs.backgroundType || 'plain';
  
  if (backgroundType === 'gradient') {
    const gradientColors = Configs.gradientColors || '#EE7752, #E73C7E, #23A6D5, #23D5AB';
    return {
      appClass: 'gradient',
      bgStyle: {
        background: `linear-gradient(-45deg, ${gradientColors})`,
        backgroundSize: '400% 400%',
      },
    };
  }

  if (backgroundType === 'image') {
    const imageUrl = Configs.backgroundImageUrl || '/images/sample-background.jpg';
    return {
      appClass: 'full-bg-image',
      bgStyle: {
        background: `url("${imageUrl}") no-repeat center center fixed`,
        backgroundSize: 'cover',
      },
    };
  }

  // Varsayılan 'plain' durumu
  return {
    appClass: Configs.plainBackgroundMode || 'daylight',
    bgStyle: {},
  };
};


function App() {
  // Configs'ten gelen başlangıç değerlerini alıyoruz
  const initialBackground = getInitialBackground();
  
  // State'leri useState hook'ları ile tanımlıyoruz
  const [appClass, setAppClass] = useState(initialBackground.appClass);
  const [bgStyle, setBgStyle] = useState(initialBackground.bgStyle);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  // Sabit state'ler
  const [devIntro] = useState(Configs.devIntro || 'Lorem Ipsum');
  const [devDesc] = useState(Configs.devDesc || 'Aute veniam ut deserunt cillum irure pariatur Lorem dolore anim nostrud quis veniam elit culpa.');
  const [icons] = useState(Configs.icons || []);

  const darkBackgroundModes = ['day', 'terminal', 'torquoise', 'alizarin', 'amythyst', 'carrot', 'peterriver'];
  const lightBackgroundModes = ['night', 'lightred', 'lightpurple', 'lightgreen', 'lightblue', 'lightyellow'];
  
  // Bu state, tıklama ile değişen renk sınıfını tutar.
  // Başlangıçta, appClass'a göre ilk modu alır.
  const [backgroundMode, setBackgroundMode] = useState(
    appClass === 'nightlight' ? lightBackgroundModes[0] : darkBackgroundModes[0]
  );

  const backgroundType = Configs.backgroundType || 'plain';

  // Tema modunu (gece/gündüz) değiştiren fonksiyon
  const changeThemeMode = (e) => {
    // Tıklamanın diğer eventi tetiklemesini engelle
    e.stopPropagation(); 
    if (backgroundType !== 'plain') return;

    if (appClass === 'nightlight') {
      setAppClass('daylight');
      setBackgroundIndex(0);
      setBackgroundMode(darkBackgroundModes[0]);
    } else {
      setAppClass('nightlight');
      setBackgroundIndex(0);
      setBackgroundMode(lightBackgroundModes[0]);
    }
  };

  // Arka plan rengini (mod içindeki varyasyonları) değiştiren fonksiyon
  const changeBackgroundBasedonMode = () => {
    if (backgroundType !== 'plain') return;

    if (appClass === 'nightlight') {
      const nextIndex = (backgroundIndex + 1) % lightBackgroundModes.length;
      setBackgroundIndex(nextIndex);
      setBackgroundMode(lightBackgroundModes[nextIndex]);
    } else {
      const nextIndex = (backgroundIndex + 1) % darkBackgroundModes.length;
      setBackgroundIndex(nextIndex);
      setBackgroundMode(darkBackgroundModes[nextIndex]);
    }
  };

  // Ana kapsayıcı için stil objesi (Merkezleme ve Tasarım burada)
  const containerStyle = {
    ...bgStyle,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    textAlign: 'center',
    padding: '20px', // Küçük ekranlarda kenarlardan boşluk
    boxSizing: 'border-box', // padding'in genişliği etkilememesi için
    transition: 'background-color 0.5s ease', // Renk geçişlerini yumuşatır
  };

  // Tema değiştirme butonu için stil
  const themeChangerStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    cursor: 'pointer',
    zIndex: 10
  };

  return (
    // className'ler ve stiller tek bir ana kapsayıcıda birleşti
    <div 
        className={`${appClass} ${backgroundMode}`} 
        style={containerStyle}
        onClick={changeBackgroundBasedonMode}
    >
      {/* Tema değiştirme butonu, artık daha belirgin */}
      {backgroundType === 'plain' && (
        <div 
          className="change-mode" 
          style={themeChangerStyle}
          onClick={changeThemeMode} 
        />
      )}
      
      {/* İçerik, main etiketi içinde ve daha düzenli */}
      <main className="App-main" style={{ maxWidth: '800px', width: '100%' }}>
        <h1 className="intro">{devIntro}</h1>
        <div className="tagline">
          {/* Typist'e bir key vererek tema değiştiğinde animasyonun yeniden başlamasını sağlayabiliriz */}
          <Typist key={devDesc}>{devDesc}</Typist>
        </div>
        
        {/* Sosyal medya ikonları, flexbox ile araları açıldı */}
        <div className="icons-social" style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginTop: '30px' }}>
          {icons.map((icon, index) => (
            <a
              key={index} // React'in listeleri verimli render etmesi için key gerekli
              target="_blank"
              rel="noopener noreferrer"
              href={icon.url}
            >
              <i className={icon.image} />
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
