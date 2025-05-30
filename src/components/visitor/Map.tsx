import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  onLocationSelect: (address: string) => void;
}

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function Map({ onLocationSelect }: MapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [relayPoints, setRelayPoints] = useState<Array<{
    id: string;
    name: string;
    address: string;
    position: [number, number];
  }>>([]);
  const [selectedPoint, setSelectedPoint] = useState<{
    id: string;
    name: string;
    address: string;
    position: [number, number];
  } | null>(null);

  // Mock relay points (replace with actual API call)
  const mockRelayPoints = [
    {
      id: '1',
      name: 'Mondial Relay Point 1',
      address: '123 Main St, Paris',
      position: [48.8566, 2.3522] as [number, number],
    },
    {
      id: '2',
      name: 'Mondial Relay Point 2',
      address: '456 Market St, Paris',
      position: [48.8606, 2.3376] as [number, number],
    },
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          // In a real implementation, you would fetch nearby relay points here
          setRelayPoints(mockRelayPoints);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Paris coordinates if location access is denied
          setUserLocation([48.8566, 2.3522]);
          setRelayPoints(mockRelayPoints);
        }
      );
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would use a geocoding service here
    // For now, we'll just filter the mock points
    const filteredPoints = mockRelayPoints.filter(point =>
      point.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setRelayPoints(filteredPoints);
  };

  const handlePointSelect = (point: typeof selectedPoint) => {
    setSelectedPoint(point);
    if (point) {
      onLocationSelect(`${point.name} - ${point.address}`);
    }
  };

  if (!userLocation) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for an address..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      <div className="h-64 rounded-lg overflow-hidden">
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapUpdater center={userLocation} />
          
          {/* User location marker */}
          <Marker position={userLocation}>
            <Popup>Your location</Popup>
          </Marker>

          {/* Relay points markers */}
          {relayPoints.map((point) => (
            <Marker
              key={point.id}
              position={point.position}
              eventHandlers={{
                click: () => handlePointSelect(point),
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-medium">{point.name}</h3>
                  <p className="text-sm text-gray-600">{point.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Selected point info */}
      {selectedPoint && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium">{selectedPoint.name}</h3>
          <p className="text-sm text-gray-600">{selectedPoint.address}</p>
        </div>
      )}
    </div>
  );
} 