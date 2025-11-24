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
            <Popup>
              <div style={{minWidth: '200px'}}>
                <strong style={{fontSize: '16px', color: '#2563eb'}}>{m.nome}</strong><br />
                
                {m.categoriaNome && (
                  <span style={{display: 'inline-block', padding: '2px 8px', backgroundColor: '#dbeafe', borderRadius: '4px', fontSize: '12px', marginTop: '5px', marginBottom: '5px'}}>
                    📁 {m.categoriaNome}
                  </span>
                )}<br />
                
                {m.tipo && (
                  <><strong>Tipo:</strong> {m.tipo}<br /></>
                )}
                
                {m.telefone && (
                  <><strong>📞 Telefone:</strong> <a href={`tel:${m.telefone}`}>{m.telefone}</a><br /></>
                )}
                
                <strong>📍 Endereço:</strong><br />
                {m.enderecoResumo}<br />
                
                <div style={{marginTop: '10px'}}>
                  <a 
                    target="_blank" 
                    rel="noreferrer" 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(m.enderecoResumo + ', Bragança Paulista, SP')}`}
                    style={{display: 'inline-block', padding: '6px 12px', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px'}}
                  >
                    🗺️ Ir até aqui
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
