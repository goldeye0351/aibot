//import Image from "next/image";
import SplineScene from '@/components/hero/SplineScene'
import { Hero } from "@/components/hero/demo";
import { VideoText } from '@/components/hero/video-text';
export default function Home() {
  return (
    <a href="https://www.51xmi.com/blog/aibotnew" className="relative bg-background  ">
      <section className='relative h-screen flex flex-col lg:flex-row  justify-center lg:px-8'>
      <VideoText  src="https://r2.51xmi.com/pichub/ocean-small.webm/1745910238642/ocean-small.webm" >
        51xMI.com
        </VideoText>
        <SplineScene />
        <Hero/>
      </section>
    </a>
  );
}
