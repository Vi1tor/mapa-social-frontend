// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// import { useEffect, useRef } from 'react';

// const MapComponent = () => {
//   const mapRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!mapRef.current || !window.google) return;

//     const centerLocation = { lat: -23.541, lng: -46.625 };
    
//     const map = new google.maps.Map(mapRef.current, {
//       zoom: 13,
//       center: centerLocation,
//       styles: [
//         {
//           featureType: "all",
//           elementType: "all",
//           stylers: [
//             { saturation: -20 },
//             { lightness: 15 }
//           ]
//         },
//         {
//           featureType: "water",
//           stylers: [{ color: "#a3c7d6" }]
//         },
//         {
//           featureType: "road",
//           elementType: "geometry",
//           stylers: [
//             { color: "#f0f0f0" },
//             { lightness: 40 }
//           ]
//         },
//         {
//           featureType: "poi",
//           elementType: "geometry.fill",
//           stylers: [{ color: "#cee8d2" }]
//         }
//       ]
//     });

//     new google.maps.Marker({
//       position: centerLocation,
//       map: map,
//       title: "Bragança Paulista"
//     });
//   }, []);

//   return (
//     // <div 
//     //   ref={mapRef} 
//     //   id="map" 
//     //   style={{ width: '100%', height: '400px' }}
//     // />
// };

// export default MapComponent;