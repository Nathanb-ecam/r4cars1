import { FaRoad, FaGasPump } from 'react-icons/fa';
import { GiGearStickPattern } from 'react-icons/gi';
import { AiOutlineCalendar } from 'react-icons/ai';
import { MdDoorFront, MdSpeed } from 'react-icons/md';
import { Product } from '@/models/Product';
;

const ProductSpecs = ({product}  : {product: Product}) => {
  return (
    <div className="border rounded-lg p-4 grid grid-cols-3 gap-4 text-sm text-gray-700 bg-white">
      
      {/* Kilométrage */}
      <div className="flex items-start gap-2">
        <FaRoad className="mt-1 text-xl" />
        <div>
          <p className="text-gray-500">Kilométrage</p>
          <p className="font-semibold">{product.kms.toLocaleString()} km</p>
        </div>
      </div>

      {/* Transmission */}
      <div className="flex items-start gap-2">
        <GiGearStickPattern className="mt-1 text-xl" />
        <div>
          <p className="text-gray-500">Transmission</p>
          <p className="font-semibold">{product.transmission}</p>
        </div>
      </div>

      {/* Année */}
      <div className="flex items-start gap-2">
        <AiOutlineCalendar className="mt-1 text-xl" />
        <div>
          <p className="text-gray-500">Année</p>
          <p className="font-semibold">{product.year}</p>
        </div>
      </div>

      {/* Carburant */}
      <div className="flex items-start gap-2">
        <FaGasPump className="mt-1 text-xl" />
        <div>
          <p className="text-gray-500">Carburant</p>
          <p className="font-semibold">{product.benzineType}</p>
        </div>
      </div>

      {/* Puissance */}
      <div className="flex items-start gap-2">
        <MdSpeed className="mt-1 text-xl" />
        <div>
          <p className="text-gray-500">Puissance</p>
          <p className="font-semibold">{product.hp}</p>
        </div>
      </div>

      {/* Portes */}
      <div className="flex items-start gap-2">
        <MdDoorFront className="mt-1 text-xl" />
        <div>
          <p className="text-gray-500">Portes</p>
          <p className="font-semibold">{product.doors}</p>
        </div>
      </div>


    </div>
  );
};

export default ProductSpecs;
