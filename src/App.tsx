import React , { useState, useEffect } from 'react';
import { Shield, Phone, MapPin, AlertCircle, Menu, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useReactMediaRecorder } from "react-media-recorder";


function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const {
    
    startRecording,
    stopRecording,
    mediaBlobUrl
  } = useReactMediaRecorder({ video: true, audio: true });
  

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  // const handleSOS = async () => {
  //   setIsSending(true);
    
  //   // Start recording
  //   startRecording();
  
  //   // Wait for some time (e.g., 10 seconds recording)
  //   setTimeout(async () => {
  //     stopRecording();
  //     setIsSending(false);
  //     alert("SOS signal sent to emergency contacts with recording!");
  
  //     // Here you can send mediaBlobUrl to your server or contacts
  //     console.log("Recording URL:", mediaBlobUrl);
  
  //     // Example: Upload mediaBlobUrl to a server OR
  //     // share link with emergency contacts via API
  //   }, 10000); // 10 seconds recording
  // };

  useEffect(() => {
    if (mediaBlobUrl && isSending) {
      console.log("Recording URL:", mediaBlobUrl);
  
      fetch(mediaBlobUrl)
        .then(res => res.blob())
        .then(blob => {
          const formData = new FormData();
          formData.append('recording', blob, 'sos-recording.webm');
  
          fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
          })
          .then(res => res.json())
          .then(data => {
            console.log("Uploaded:", data.url);
            alert("SOS sent with recording!");
          })
          .catch(err => {
            console.error("Upload error:", err);
          });
        });
  
      setIsSending(false);
    }
  }, [mediaBlobUrl]);
  
  const handleSOS = async () => {
    setIsSending(true);
    startRecording();
  
    setTimeout(() => {
      stopRecording();
    }, 10000); // Stop after 10 seconds
  };
  
  
  
 
  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let source: MediaStreamAudioSourceNode;
    let microphone: MediaStream;
    let rafId: number;
  
    const startMic = async () => {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
      source = audioContext.createMediaStreamSource(microphone);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
  
      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  
        // console.log("Volume:", volume);
  
        // Threshold (you can adjust it after testing)
        if (volume > 60 && !isSending) { 
          console.log("Scream detected! Triggering SOS...");
          handleSOS();
        }
  
        rafId = requestAnimationFrame(checkVolume);
      };
  
      checkVolume();
    };
  
    startMic();
  
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (audioContext) audioContext.close();
      if (microphone) microphone.getTracks().forEach((track) => track.stop());
    }
    ;
  }, []);
  

  return (

    
    <div className="min-h-screen">
      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo-container">
              <Shield className="logo-icon" />
              <span className="logo-text">Rakshanam</span>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Desktop menu */}
            <div className="desktop-menu">
              <a href="#features" className="nav-link">Features</a>
              <a href="#emergency" className="nav-link">Emergency</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <a href="#features" className="nav-link">Features</a>
            <a href="#emergency" className="nav-link">Emergency</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="hero-container">
        <h1 className="hero-title">
          Your Safety Is Our Priority
        </h1>
        <p className="hero-subtitle">
          24/7 protection with instant SOS alerts and location tracking
        </p>
        
        {/* SOS Button */}
        <button
          onClick={handleSOS}
          disabled={isSending}
          className="sos-button"
        >
          <AlertCircle />
          {isSending ? 'Witness Activated..' : 'Witness'}
        </button>
      </div>

      {/* Features Section */}
      <div className="features-section" id="features">
        <div className="features-grid">
          <div className="feature-card">
            <Phone className="feature-icon" />
            <h3 className="feature-title">Quick Emergency Call</h3>
            <p className="feature-description">One-tap emergency calls to your trusted contacts and local authorities.</p>
          </div>
          
          <div className="feature-card">
            <MapPin className="feature-icon" />
            <h3 className="feature-title">Location Tracking</h3>
            <p className="feature-description">Real-time location sharing with your emergency contacts.</p>
          </div>
          
          <div className="feature-card">
            <Shield className="feature-icon" />
            <h3 className="feature-title">24/7 Protection</h3>
            <p className="feature-description">Round-the-clock monitoring and instant alert system.</p>
          </div>
        </div>
      </div>

      {/* Location Status */}
      {location && (
        <div className="location-status">
          <div className="location-badge">
            <MapPin />
            <span>
              Location services active: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-grid">
            <div>
              <h4 className="footer-title">Emergency Numbers</h4>
              <ul className="footer-list">
                <li>Shiv: 8340636142</li>
                <li>Women's Helpline: 1091</li>
                <li>Emergency Services: 112</li>
              </ul>
            </div>
            <div>
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Safety Tips</a></li>
                <li><a href="#" className="footer-link">Report Incident</a></li>
                <li><a href="#" className="footer-link">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2024 SafeGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;