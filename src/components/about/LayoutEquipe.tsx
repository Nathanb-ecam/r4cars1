import Image from "next/image";
import { Employee } from "@/models/Employee"; // adjust import to your project

type Props = {
  className?: string;
  employees: Employee[];
};

export function LayoutEquipe({ className, employees }: Props) {
  if(!employees || employees === null) return;
  return (
    <div className={`w-full ${className || ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {employees.map((employee) => (
          <div
            key={employee._id}
            className="flex flex-col md:flex-row gap-6 items-start"
          >
            
            <Image
              className="rounded-full  bg-gray-50 flex-shrink-0"
              src={employee.imageUrl || "/brand-images/logo_entier_alt2.svg"}
              alt={employee.fullName}
              width={120}
              height={120}
            />
            
            <div>
              <h3 className="tracking-tight text-lg font-bold">
                {employee.fullName}
              </h3>
              <p className="mb-2 text-gray-700 tracking-wide font-light">
                {employee.role}
              </p>
              <p className="text-gray-700 leading-snug">
                {employee.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
