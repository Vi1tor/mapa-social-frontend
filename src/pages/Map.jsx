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
            <Popup maxWidth={300}>
              <div style={{minWidth: '250px', maxWidth: '300px'}}>
                <strong style={{fontSize: '18px', color: '#1e293b', display: 'block', marginBottom: '8px'}}>{m.nome}</strong>
                
                {m.categoriaNome && (
                  <span style={{
                    display: 'inline-block', 
                    padding: '4px 12px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    marginBottom: '10px'
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
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  gap: '8px'
                }}>
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
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    📋 Ver Detalhes
                  </a>
                  <a 
                    target="_blank" 
                    rel="noreferrer" 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(m.enderecoResumo + ', Bragança Paulista, SP')}`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '10px 12px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    🧭 Como Chegar
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
