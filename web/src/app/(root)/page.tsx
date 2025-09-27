import AnimatedGridBackground from "@/common/Effect/animated-grid-background";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import Blogs from "@/components/blogs/Blogs";
import Course from "@/components/course/Course";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Hero1 from "@/components/Hero/Hero1";
import Header from "@/components/Navbar/Header";
import NewsLatter from "@/components/NewsLatter/NewsLatter";
import WorkExperiance from "@/components/work-experiance/WorkExperiance";
import YoutubeSection from "@/components/Youtube/YoutubeSection";

export default async function Home({ searchParams }: { searchParams?: Promise<{ page?: string; per_page?: string }> }) {
  const sp = (await searchParams) ?? {};
  return (
    <MaxWidthWrapper className=" h-screen">
      <div className="flex flex-col h-full">
        <LightBackgroundEffect />
        <Header />
        <main className="flex-1 pt-24">
          <Hero1 />
          <Course  />
          <Blogs />
          <NewsLatter />
          <YoutubeSection />
        </main>
        <Footer />
      </div>
    </MaxWidthWrapper>
  );
}
