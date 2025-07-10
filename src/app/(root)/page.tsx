import AnimatedGridBackground from "@/common/Effect/animated-grid-background";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import Blogs from "@/components/blogs/Blogs";
import Course from "@/components/course/Course";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Header from "@/components/Navbar/Header";
import NewsLatter from "@/components/NewsLatter/NewsLatter";
import WorkExperiance from "@/components/work-experiance/WorkExperiance";
import YoutubeSection from "@/components/Youtube/YoutubeSection";

export default function Home() {
  return (
    <MaxWidthWrapper className="max-w-[1000px] h-screen">
      <div className="flex flex-col h-full">
        <Header />
        <main className="flex-1 pt-12">
          <Hero />
          <WorkExperiance />
          <Course />
          <Blogs />
          <NewsLatter />
          <YoutubeSection />
        </main>
        <Footer />
      </div>
    </MaxWidthWrapper>
  );
}
