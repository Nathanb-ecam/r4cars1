interface Window {
  goaffpro_order?: {
    number: string;
    total: number;
  };
  goaffproTrackConversion?: (order: { number: string; total: number }) => void;
} 