"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname(); // Get the current path from Next.js router
  const [isActive, setIsActive] = useState(false);

  // Check if the current path matches the link or any submenu link
  useEffect(() => {
    const isLinkActive = (path === item.href || (item.submenu && item.submenu.some(subItem => path === subItem.href))) ?? false;
    setIsActive(isLinkActive); // Ensure isLinkActive is always a boolean
  }, [path, item.href, item.submenu]);

  const handleMouseEnter = () => {
    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/${item.href}`}
        className={`text-lg flex hover:text-black capitalized relative ${isActive
            ? "text-black after:absolute after:w-8 after:h-1 after:bg-primary after:rounded-full after:-bottom-1"
            : "text-grey"
          }`}
      >
        {item.label}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m7 10l5 5l5-5"
            />
          </svg>
        )}
      </Link>

      {submenuOpen && (
        <div
          className={`absolute py-2 left-0 mt-0.5 w-60 bg-white dark:bg-darklight dark:text-white shadow-lg rounded-lg `}
          data-aos="fade-up"
          data-aos-duration="500"
        >
          {item.submenu?.map((subItem, index) => {
            const isSubItemActive = path === subItem.href; // Check if the submenu item is active
            return (
              <Link
                key={index}
                href={subItem.href}
                className={`block px-4 py-2 ${isSubItemActive
                    ? "bg-primary text-white"
                    : "text-black dark:text-white hover:bg-primary"
                  }`}
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
