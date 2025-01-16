import { CalendarCheck, Check, Clock4 } from "lucide-react";
import React from "react";

interface UserInfoProps {
  userType: "admin" | "teacher" | "student";
  name: string;
  editTime?: string;
}

const UserInfo: React.FC<UserInfoProps> = React.memo(
  ({ userType, name, editTime }) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          <Check size={14} className="stroke-2" />
          <span className="font-medium capitalize font-geistMono">
            {userType}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-orange-400">
            <CalendarCheck size={14} className="stroke-2" />
          </span>
          <span className="text-xs md:text-sm text-gray-700 font-medium font-geistMono">
            {name}
          </span>
        </div>

        <div className="hidden md:flex md:items-center md:gap-2">
          <span className="text-orange-400">
            <Clock4 size={14} className="stroke-2" />
          </span>
          <span className="text-gray-500 text-xs md:text-sm font-geistMono">
            {editTime}
          </span>
        </div>
      </div>
    );
  }
);

UserInfo.displayName = "Info";
export { UserInfo };
