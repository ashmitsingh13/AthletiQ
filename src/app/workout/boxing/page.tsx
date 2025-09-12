"use client"
import ExerciseCard from "@/components/cards/ExerciseCard";
import Header from "@/components/common/Header";

export default function Boxing() {
  return (
    <section className="w-full bg-white dark:bg-black transition-colors duration-300 overflow-hidden py-28 px-6 sm:px-10 lg:px-20 flex-wrap">
      <section className="flex justify-between gap-[1.25rem] mb-[3.12rem]">
              <div>
                <Header title="WORKOUTS" description="Types Of Boxing" />
              </div>
      </section>
      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <ExerciseCard
          title="Traditional Boxing"
          image="/images/TraditionalBoxing.jpg"
          link="#"
          description="Traditional Boxing is the classic and most recognized form of boxing, focusing on punches, defense, and footwork. It helps build endurance, explosive strength, hand-eye coordination, and strategic thinking in combat."
        />
        <ExerciseCard
          title="Amateur Boxing"
          image="/images/AmateurBoxing.jpg"
          link="#"
          description="Amateur Boxing emphasizes safety and technical precision, usually with protective gear and point-based scoring. It helps young athletes gain discipline, speed, and competitive experience, preparing them for professional careers."
        />
        
        <ExerciseCard
          title="Professional Boxing"
          image="/images/ProfessionalBoxing.jpg"
          link="#"
          description="Professional Boxing involves longer rounds, higher intensity, and advanced strategies. It helps fighters develop stamina, powerful punches, and mental toughness while competing at elite levels for titles and recognition."
        />
        
        <ExerciseCard
          title="Shadow Boxing"
          image="/images/ShadowBoxing.jpg"
          link="#"
          description="Shadow Boxing is solo training performed without equipment, simulating real fight movements. It helps improve rhythm, footwork, breathing control, and visualizing opponent strategies, making it essential for warm-ups and practice."
        />
        
        <ExerciseCard
          title="Sparring"
          image="/images/Sparring.webp"
          link="#"
          description="Sparring is live practice with a partner under controlled conditions. It helps fighters sharpen timing, reflexes, defensive skills, and adaptability, while building confidence for actual competition."
        />
        
        <ExerciseCard
          title="Kickboxing"
          image="/images/Kickboxing.png"
          link="#"
          description="Kickboxing blends punches, kicks, and knee strikes into a dynamic combat sport. It helps improve cardiovascular endurance, flexibility, explosive strength, and is also an excellent self-defense and fitness workout."
        />
        
        <ExerciseCard
          title="Thai Boxing"
          image="/images/ThaiBoxing.jpeg"
          link="#"
          description="Thai Boxing, or Muay Thai, is known as the 'Art of Eight Limbs,' using fists, elbows, knees, and shins. It helps build toughness, striking precision, and powerful full-body conditioning for combat sports."
        />
        
        <ExerciseCard
          title="Bare Knuckle Boxing"
          image="/images/BareKnuckleBoxing.webp"
          link="#"
          description="Bare Knuckle Boxing is the rawest form of fighting without gloves, demanding accuracy and resilience. It helps fighters develop precise striking, toughness, and mental grit under extreme conditions."
        />
        
        <ExerciseCard
          title="Fitness Boxing"
          image="/images/FitnessBoxing.webp"
          link="#"
          description="Fitness Boxing focuses on workouts inspired by boxing techniques without competitive fighting. It helps burn fat, build lean muscle, reduce stress, and boost energy levels, making it ideal for overall health."
        />
        
        <ExerciseCard
          title="Boxercise"
          image="/images/Boxercise.webp"
          link="#"
          description="Boxercise is a fun, non-contact fitness class using boxing-inspired movements. It helps improve agility, balance, cardiovascular health, and core strength, while also serving as a stress-relieving workout."
        />
        
        <ExerciseCard
          title="Mixed Martial Arts"
          image="/images/MixedMartialArts.jpeg"
          link="#"
          description="Mixed Martial Arts (MMA) combines boxing with wrestling, jiu-jitsu, and kickboxing. It helps in mastering diverse fighting techniques, enhancing overall fitness, and developing versatile self-defense skills."
        />
        
        <ExerciseCard
          title="Southpaw Boxing"
          image="/images/SouthpawBoxing.avif"
          link="#"
          description="Southpaw Boxing is a stance designed for left-handed fighters, with the right hand and foot forward. It helps improve unpredictability, strategic advantage, and adaptability against orthodox opponents."
        />
        
        <ExerciseCard
          title="Orthodox Boxing"
          image="/images/OrthodoxBoxing.jpg"
          link="#"
          description="Orthodox Boxing is the most common stance for right-handed fighters, with the left hand and foot leading. It helps create strong jabs, solid defense, and balanced offensive strategies."
        />
        
        <ExerciseCard
          title="Defensive Boxing"
          image="/images/DefensiveBoxing.jpg"
          link="#"
          description="Defensive Boxing emphasizes avoiding strikes through head movement, blocking, and countering. It helps develop reflexes, awareness, patience, and energy conservation while frustrating opponents."
        />
        
        <ExerciseCard
          title="Pressure Boxing"
          image="/images/PressureFighting.webp"
          link="#"
          description="Pressure Boxing is an aggressive style where fighters keep advancing, forcing opponents into mistakes. It helps build stamina, relentless attacking power, and the ability to dominate matches mentally and physically."
        />
      </div>
    </section>
  );
}
