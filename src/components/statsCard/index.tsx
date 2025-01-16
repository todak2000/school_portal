import { ChevronRight } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  route?:string;
}

const StatsCard: React.FC<StatsCardProps> = React.memo(({ title, value,route=null }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex justify-between items-center">
      <h3 className="text-gray-500 text-sm font-geistMono">{title}</h3>
      {route &&
      <a href={route} className="text-gray-400 hover:text-secondary" >
        <ChevronRight size={20} />
      </a>}
    </div>
    <p className="text-2xl font-bold mt-2 font-geistSans text-green-500">{value}</p>
  </div>
));
StatsCard.displayName = "StatsCard";
export { StatsCard };
