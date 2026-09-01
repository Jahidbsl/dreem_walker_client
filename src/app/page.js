import HeroBanner from "@/components/HeroBanner";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroBanner/>
    </div>
  );
}
