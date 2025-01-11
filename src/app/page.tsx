import Hero from "@/components/hero";
export default function Home() {
  return (
    <div className=" hero-background  min-h-[50vh] 2xl:min-h-[20vh] p-8 pb-20 md:pb-0 sm:px-20 sm:pt-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start w-full">
        <Hero />
      </main>
    </div>
  );
}
