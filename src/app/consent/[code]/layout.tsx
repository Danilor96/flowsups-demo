import Image from 'next/image';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="lg:bg-[#00A78B]">
      <section className="lg:max-w-7xl lg:mx-auto lg:bg-white lg:pt-[1vh] lg:px-[0.5vw] lg:min-h-screen">
        <Image
          className="w-[60vw] h-auto ml-[1.666vw] mt-[1vh] mb-[5vh] md:w-[30vw] lg:w-[16rem] lg:ml-0 lg:mt-0"
          width={219}
          height={52}
          src="/flowsups.png"
          alt="Logo of flowsups app"
        />
        <div className="md:w-[85%] md:mx-auto lg:w-full">{children}</div>
      </section>
    </main>
  );
}
