import Link from "next/link";
import { IoMdHeart } from "react-icons/io";

export const Footer = () => {
  return (
    <footer className="h-14 w-full flex items-center justify-center bg-gray-950">
      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-gray-400">
        Made with
        <IoMdHeart className="text-purple-500" />
        by
        <strong className="font-medium">
          <Link
            href={"https://www.instagram.com/eduardogazolla/"}
            target="_blank"
          >
            Eduardo Gazolla
          </Link>
        </strong>
      </span>
    </footer>
  );
};
