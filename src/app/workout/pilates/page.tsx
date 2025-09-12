"use client"
import ExerciseCard from "@/components/cards/ExerciseCard";
import Header from "@/components/common/Header";

export default function Pilates() {
  return (
    <section className="w-full bg-white dark:bg-black transition-colors duration-300 overflow-hidden py-28 px-6 sm:px-10 lg:px-20 flex-wrap">
      <section className="flex justify-between gap-[1.25rem] mb-[3.12rem]">
              <div>
                <Header title="WORKOUTS" description="Types Of Pilates" />
              </div>
      </section>
      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <ExerciseCard
          title="Mat Pilates"
          image="/images/MatPilates.jpg"
          link="#"
          description="Mat Pilates focuses on core strength, flexibility, and overall body awareness using a mat. It helps improve posture, balance, and coordination while promoting relaxation and mindfulness."
        />
        <ExerciseCard
          title="Reformer Pilates"
          image="/images/ReformerPilates.jpg"
          link="#"
          description="Reformer Pilates utilizes a specialized machine to enhance resistance and support during exercises. It helps improve strength, flexibility, and alignment while providing a low-impact workout."
        />
        
        <ExerciseCard
          title="Classical Pilates"
          image="/images/ClassicalPilates.avif"
          link="#"
          description="Classical Pilates is the original form of Pilates, focusing on precise movements and breath control. It helps improve core strength, flexibility, and overall body awareness while promoting relaxation and mindfulness."
        />
        
        <ExerciseCard
          title="Contemporary Pilates"
          image="/images/ContemporaryPilates.jpg"
          link="#"
          description="Contemporary Pilates is a modern approach to Pilates, incorporating various styles and techniques. It helps improve core strength, flexibility, and overall body awareness while promoting relaxation and mindfulness."
        />
        
        <ExerciseCard
          title="Clinical Pilates"
          image="/images/ClinicalPilates.jpg"
          link="#"
          description="Clinical Pilates is a therapeutic approach to Pilates, often used in rehabilitation settings. It helps individuals recover from injuries, improve posture, and enhance overall body awareness under the guidance of trained professionals."
        />
        
        <ExerciseCard
          title="Stott Pilates"
          image="/images/StottPilates.png"
          link="#"
          description="Stott Pilates is a contemporary approach to Pilates, focusing on core stability, alignment, and functional movement. It helps improve strength, flexibility, and overall body awareness while promoting relaxation and mindfulness."
        />
        
        <ExerciseCard
          title="Winsor Pilates"
          image="/images/WinsorPilates.png"
          link="#"
          description="Winsor Pilates is a dynamic approach to Pilates, focusing on core strength, flexibility, and overall body awareness. It helps improve posture, balance, and coordination while promoting relaxation and mindfulness."
        />
        
        <ExerciseCard
          title="Aerial Pilates"
          image="/images/AerialPilates.webp"
          link="#"
          description="Aerial Pilates combines traditional Pilates exercises with the use of a suspended fabric hammock. It helps improve core strength, flexibility, and body awareness while allowing for a unique, low-impact workout experience."
        />
        
        <ExerciseCard
          title="Cardio Pilates"
          image="/images/CardioPilates.webp"
          link="#"
          description="Cardio Pilates is a high-energy workout that combines traditional Pilates exercises with cardiovascular training. It helps improve endurance, burn calories, and enhance overall fitness while maintaining the core strength benefits of Pilates."
        />
        
        <ExerciseCard
          title="Power Pilates"
          image="/images/PowerPilates.jpg"
          link="#"
          description="Power Pilates is a high-intensity workout that combines traditional Pilates exercises with strength training. It helps build muscle, improve endurance, and enhance overall fitness while maintaining the core strength benefits of Pilates."
        />
        
        <ExerciseCard
          title="Fusion Pilates"
          image="/images/FusionPilates.jpg"
          link="#"
          description="Fusion Pilates is a dynamic workout that blends traditional Pilates with other fitness modalities, such as yoga or dance. It helps improve flexibility, strength, and body awareness while keeping the workout fresh and engaging."
        />
        
        <ExerciseCard
          title="Hot Pilates"
          image="/images/HotPilates.jpg"
          link="#"
          description="Hot Pilates is a high-energy workout performed in a heated room, combining traditional Pilates exercises with a focus on core strength and flexibility. It helps improve endurance, detoxification, and overall fitness while providing a unique and challenging workout experience."
        />
        
        <ExerciseCard
          title="Pregnancy Pilates"
          image="/images/PregnancyPilates.webp"
          link="#"
          description="Pregnancy Pilates is a specialized workout designed for expectant mothers, focusing on core strength, flexibility, and overall body awareness. It helps alleviate pregnancy discomfort, improve posture, and prepare the body for labor and delivery."
        />
        
        <ExerciseCard
          title="Post Natal Pilates"
          image="/images/PostNatalPilates.jpg"
          link="#"
          description="Post Natal Pilates is a specialized workout designed for new mothers, focusing on core strength, pelvic floor recovery, and overall body awareness. It helps alleviate post-pregnancy discomfort, improve posture, and support the body in its recovery journey."
        />
        
        <ExerciseCard
          title="Equipment Based Pilates"
          image="/images/EquipmentBasedPilates.jpg"
          link="#"
          description="Equipment-Based Pilates utilizes specialized equipment, such as reformers and stability balls, to enhance traditional Pilates exercises. It helps improve strength, flexibility, and body awareness while providing a unique and challenging workout experience."
        />
      </div>
    </section>
  );
}
