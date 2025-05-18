//import Image from "next/image";
import SplineScene from '@/components/hero/SplineScene'
import { Hero } from "@/components/hero/demo";
export default function Home() {
  return (
    <div className="relative bg-background  ">
      <section className='relative h-screen flex flex-col lg:flex-row  justify-center lg:px-8'>
      <SplineScene />
          <Hero/>

      </section>
    </div>
  );
}
