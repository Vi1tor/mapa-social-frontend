import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BRAGANCA_CENTER = [-22.9375, -46.5486];

async function geocodeAddress(address) {
  const cached = sessionStorage.getItem('geo:' + address);
  if (cached) return JSON.parse(cached);

  const q = encodeURIComponent(address + ', Bragança Paulista, SP, Brazil');
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'mapa-social-app' } });
    const data = await res.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      const v = { lat, lon };
      sessionStorage.setItem('geo:' + address, JSON.stringify(v));
      return v;
    }
  } catch (e) {
    console.error('geocode error', e);
  }
  return null;
}

export default function MapPage({ height = '80vh' }) {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await fetch('http://localhost:8080/servicos/mapa');
        if (!resp.ok) throw new Error('fetch failed');
        const data = await resp.json();

        const filled = await Promise.all(data.map(async (s) => {
          let lat = s.latitude;
          let lon = s.longitude;
          if (!lat || !lon) {
            const geo = await geocodeAddress(s.enderecoResumo || s.nome);
            if (geo) {
              lat = geo.lat;
              lon = geo.lon;
            }
          }
          return { ...s, latitude: lat, longitude: lon };
        }));

        setMarkers(filled.filter(m => m.latitude && m.longitude));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ height: height, width: '100%' }}>
      {loading && <p>Carregando mapa...</p>}
      <MapContainer center={BRAGANCA_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map(m => (
          <Marker key={m.id} position={[m.latitude, m.longitude]}>
            <Popup maxWidth={320}>
              <div style={{minWidth: '280px', maxWidth: '320px', padding: '4px'}}>
                <strong style={{fontSize: '19px', color: '#1e293b', display: 'block', marginBottom: '10px', lineHeight: '1.3'}}>{m.nome}</strong>
                
                {m.categoriaNome && (
                  <span style={{
                    display: 'inline-block', 
                    padding: '5px 14px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '20px', 
                    fontSize: '13px', 
                    fontWeight: '600',
                    marginBottom: '12px',
                    boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)'
                  }}>
                    📁 {m.categoriaNome}
                  </span>
                )}
                
                <div style={{marginTop: '10px', marginBottom: '10px', lineHeight: '1.6'}}>
                  {m.tipo && (
                    <div style={{marginBottom: '8px', color: '#475569'}}>
                      <strong>🏢 Tipo:</strong> {m.tipo}
                    </div>
                  )}
                  
                  {m.telefone && (
                    <div style={{marginBottom: '8px'}}>
                      <strong style={{color: '#475569'}}>📞 Telefone:</strong>{' '}
                      <a 
                        href={`tel:${m.telefone}`}
                        style={{color: '#2563eb', textDecoration: 'none', fontWeight: '500'}}
                      >
                        {m.telefone}
                      </a>
                    </div>
                  )}
                  
                  <div style={{color: '#475569'}}>
                    <strong>📍 Endereço:</strong><br />
                    <span style={{fontSize: '14px'}}>{m.enderecoResumo}</span>
                  </div>
                </div>
                
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '2px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <button 
                    onClick={() => {
                      const endereco = m.enderecoResumo + ', Bragança Paulista, SP';
                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                      const encodedAddress = encodeURIComponent(endereco);
                      
                      if (isMobile) {
                        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                        if (isIOS) {
                          window.location.href = `maps://maps.apple.com/?daddr=${encodedAddress}`;
                          setTimeout(() => {
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
                          }, 1500);
                        } else {
                          window.location.href = `geo:0,0?q=${encodedAddress}`;
                          setTimeout(() => {
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
                          }, 1500);
                        }
                      } else {
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
                      }
                    }}
                    style={{
                      textAlign: 'center',
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                      letterSpacing: '0.3px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
                    }}
                  >
                    🧭 COMO CHEGAR (GPS)
                  </button>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <a 
                      href={`/solicitar-servico/${m.id}`}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '10px 12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      📋 Solicitar
                    </a>
                    <a 
                      href={`/servicos`}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '10px 12px',
                        background: '#f1f5f9',
                        color: '#475569',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      ℹ️ Detalhes
                    </a>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
