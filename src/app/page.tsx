import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-1 items-center justify-center md:min-h-min">
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          href="/payment"
        >
          Pay Now
        </Link>
      </div>
    </div>
  );
}
