import HomeHero from "./components/homeHero";
import AboutSection from "./aboutMe/aboutSection";
import ProjectsSection from "./projects/projectsSection";
import ContactSection from "./contactMe/contactSection";
import styles from "./home.module.css";

export const runtime = "nodejs";
export const revalidate = 1800;

export default function Home() {
  return (
    <div className={styles.portfolioSections}>
      <HomeHero />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
