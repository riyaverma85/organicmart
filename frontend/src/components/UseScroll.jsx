import { useEffect } from "react";

const useScrollAnimations = () => {
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade-in");
    const handleScroll = () => {
      fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if(rect.top < window.innerHeight - 100) {
          el.classList.add("visible");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};

export default useScrollAnimations;
