import { User } from "lucide-react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { usePathname } from "next/navigation";

export interface DirectoryCardProps {
  data: {
    name: string;
    lga: string;
    description: string;
    avatar?: string | null;
    headerImage?: string;
    studentCount: string;
  };
}

const DirectoryCard = React.memo(({ data }: DirectoryCardProps) => {
  DirectoryCard.displayName = "DirectoryCard"; // Added display name for the component
  const { name, lga, description, avatar, headerImage, studentCount } = data;
  const pathname = usePathname()
  const isDirectory = pathname.includes("directory")

  const generateInitials = (name: string) => {
    return name
      ?.split(" ")
      ?.slice(0, 3)
      ?.map((word) => word[0])
      ?.join("")
      ?.toUpperCase();
  };

  return (
    <motion.div
      className={`card rounded-none ${isDirectory ? "w-[95vw]":"w-[87vw]"} bg-[#fffdfb] shadow-md sm:w-60 md:w-80 overflow-hidden hover:shadow-lg transition-shadow`}
      whileHover={{ scale: 1.05 }}
    >
      {/* Header Image Container */}
      <div className="relative h-12">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#ff7900] to-[#ff9800] opacity-80"
          style={{
            backgroundImage: headerImage ? `url(${headerImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Avatar - Positioned to overlap */}
        <motion.div
          className="absolute -bottom-10 left-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-white bg-secondary overflow-hidden">
            {avatar ? (
              <Image
                src={avatar}
                alt={`${name}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold font-geistMono">
                {generateInitials(name)}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Card Content - Added padding-top to account for avatar overlap */}
      <motion.div
        className="p-4 pt-8 font-geistMono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex-1 mt-2">
          <h3 className="font-semibold text-sm line-clamp-2">{name}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {[lga].map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-primary"
              >
                {tag}
              </span>
            ))}
            <div className="flex items-center gap-1">
              <User size={16} />
              <span className="text-sm">
                <CountUp
                  end={Number(studentCount)}
                  duration={3}
                  separator=","
                />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export { DirectoryCard };
