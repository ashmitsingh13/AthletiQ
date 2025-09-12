"use client"
import ExerciseCard from "@/components/cards/ExerciseCard";
import Header from "@/components/common/Header";

export default function Yoga() {
  return (
    <section className="w-full bg-white dark:bg-black transition-colors duration-300 overflow-hidden py-28 px-6 sm:px-10 lg:px-20 flex-wrap">
      <section className="flex justify-between gap-[1.25rem] mb-[3.12rem]">
              <div>
                <Header title="WORKOUT" description="Types Of Yoga" />
              </div>
    </section>

      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <ExerciseCard
          title="Hatha Yoga"
          image="/images/HathaYoga.jpg"
          link="#"
          description="Hatha Yoga is a gentle introduction to the most basic yoga postures. It helps improve flexibility, strength, and balance through slow, deliberate movements and breathing exercises."
        />
        <ExerciseCard
          title="Ashtanga Yoga"
          image="/images/AshtangaYoga.jpg"
          link="#"
          description="Ashtanga Yoga is a dynamic and physically demanding style that follows a specific sequence of postures. It helps build strength, flexibility, and stamina through a rigorous practice."
        />
        
        <ExerciseCard
          title="Vinyasa Yoga"
          image="/images/VinyasaYoga.jpg"
          link="#"
          description="Vinyasa Yoga is a dynamic and flowing style of yoga that synchronizes movement with breath. It helps improve flexibility, strength, and mental focus through a continuous flow of postures."
        />
        
        <ExerciseCard
          title="Kundalini Yoga"
          image="/images/KundaliniYoga.webp"
          link="#"
          description="Kundalini Yoga is a spiritual and physical practice that combines postures, breathing exercises, and meditation to awaken the kundalini energy at the base of the spine. It helps improve flexibility, strength, and mental clarity."
        />
        
        <ExerciseCard
          title="Bikram Yoga"
          image="/images/BikramYoga.jpg"
          link="#"
          description="Bikram Yoga is a style of hot yoga that consists of a sequence of 26 postures practiced in a heated room. It helps improve flexibility, strength, and detoxification through sweating."
        />
        
        <ExerciseCard
          title="Iyengar Yoga"
          image="/images/IyengarYoga.jpg"
          link="#"
          description="Iyengar Yoga is a form of Hatha Yoga that emphasizes precision and alignment in each posture. It uses props like belts, blocks, and blankets to help practitioners achieve the correct alignment, making it accessible for all levels."
        />
        
        <ExerciseCard
          title="Power Yoga"
          image="/images/PowerYoga.webp"
          link="#"
          description="Power Yoga is a vigorous, fitness-based approach to Vinyasa-style yoga. It helps build strength, flexibility, and endurance through dynamic movements and challenging poses."
        />
        
        <ExerciseCard
          title="Yin Yoga"
          image="/images/YinYoga.jpg"
          link="#"
          description="Yin Yoga is a slow-paced style of yoga that involves holding postures for longer periods of time. It helps improve flexibility, joint mobility, and mental calmness through deep stretching and relaxation."
        />
        
        <ExerciseCard
          title="Restorative Yoga"
          image="/images/RestorativeYoga.webp"
          link="#"
          description="Restorative Yoga is a gentle and calming practice that focuses on relaxation and healing. It helps reduce stress, improve sleep, and promote overall well-being through supported postures and deep breathing."
        />
        
        <ExerciseCard
          title="Raja Yoga"
          image="/images/RajaYoga.jpg"
          link="#"
          description="Raja Yoga is a comprehensive and holistic approach to yoga that encompasses various practices, including meditation, ethical disciplines, and physical postures. It helps individuals achieve self-realization and inner peace."
        />
        
        <ExerciseCard
          title="Bhakti Yoga"
          image="/images/BhaktiYoga.jpg"
          link="#"
          description="Bhakti Yoga is the path of devotion and love for a personal god. It emphasizes surrender, faith, and the practice of devotion through prayer, chanting, and rituals."
        />
        
        <ExerciseCard
          title="Karma Yoga"
          image="/images/KarmaYoga.jpg"
          link="#"
          description="Karma Yoga is the path of selfless service and action, emphasizing the importance of performing one's duty without attachment to the results. It helps individuals cultivate a sense of purpose and fulfillment through altruism."
        />
        
        <ExerciseCard
          title="Jnana Yoga"
          image="/images/JnanaYoga.jpg"
          link="#"
          description="Jnana Yoga is the path of knowledge and wisdom, focusing on self-inquiry and the study of sacred texts. It helps practitioners understand the nature of reality and their true selves."
        />
        
        <ExerciseCard
          title="Kriya Yoga"
          image="/images/KriyaYoga.webp"
          link="#"
          description="Kriya Yoga is a practice that combines physical postures, breathing techniques, and meditation to promote spiritual growth and self-awareness."
        />
      </div>
    </section>
  );
}
