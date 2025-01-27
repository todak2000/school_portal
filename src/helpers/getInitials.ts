export const getInitials = (name: string): string => {
    const words = name?.split(" ");
    const initials = words
      ?.slice(0, 3)
      ?.map((word) => word?.charAt(0))
      ?.join("");
    return initials?.toUpperCase();
  };
