"use client"
import ExerciseCard from "@/components/cards/ExerciseCard";
import Header from "@/components/common/Header";

export default function MartialArts() {
  return (
    <section className="w-full bg-white dark:bg-black transition-colors duration-300 overflow-hidden py-28 px-6 sm:px-10 lg:px-20 flex-wrap">
      <section className="flex justify-between gap-[1.25rem] mb-[3.12rem]">
              <div>
                <Header title="WORKOUTS" description="Types Of Martial Arts" />
              </div>
      </section>
      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <ExerciseCard
          title="Boxing"
          image="/images/BoxingImg.jpg"
          link="#"
          description="Boxing is the classic and most recognized form of martial arts, focusing on punches, defense, and footwork. It helps build endurance, explosive strength, hand-eye coordination, and strategic thinking in combat."
        />
        <ExerciseCard
          title="Kickboxing"
          image="/images/Kickboxing.jpg"
          link="#"
          description="Kickboxing is a dynamic martial art that combines elements of traditional boxing with kicks and knee strikes. It helps improve cardiovascular fitness, strength, and flexibility while providing an effective self-defense system."
        />
        
        <ExerciseCard
          title="Thai Boxing"
          image="/images/ThaiBoxing.jpg"
          link="#"
          description="Thai Boxing, or Muay Thai, is known as the 'Art of Eight Limbs,' using fists, elbows, knees, and shins. It helps build toughness, striking precision, and powerful full-body conditioning for combat sports."
        />
        
        <ExerciseCard
          title="Karate"
          image="/images/Karate.jpg"
          link="#"
          description="Karate is a striking martial art that emphasizes punches, kicks, and open-hand techniques. It helps develop strength, speed, and agility while promoting discipline and mental focus."
        />
        
        <ExerciseCard
          title="Taekwondo"
          image="/images/Taekwondo.jpg"
          link="#"
          description="Taekwondo is a Korean martial art known for its high, fast kicks and jumping and spinning kicks. It helps improve flexibility, balance, and strength while also promoting a strong sense of discipline and respect."
        />
        
        <ExerciseCard
          title="Savate"
          image="/images/Savate.jpg"
          link="#"
          description="Savate, or French Kickboxing, is a striking martial art that combines elements of traditional boxing with graceful kicking techniques. It helps improve agility, coordination, and overall fitness while providing effective self-defense skills."
        />
        
        <ExerciseCard
          title="Brazilian Jiu Jitsu"
          image="/images/BrazilianJiuJitsu.jpg"
          link="#"
          description="Brazilian Jiu-Jitsu (BJJ) is a ground-based martial art focusing on submissions and grappling techniques. It helps improve flexibility, strength, and problem-solving skills while promoting a deep understanding of body mechanics and leverage."
        />
        
        <ExerciseCard
          title="Wrestling"
          image="/images/Wrestling.jpg"
          link="#"
          description="Wrestling is a grappling-based martial art focusing on throws, takedowns, and ground control. It helps improve strength, flexibility, and endurance while teaching effective self-defense techniques."
        />
        
        <ExerciseCard
          title="Judo"
          image="/images/Judo.jpg"
          link="#"
          description="Judo is a Japanese martial art focusing on throws, joint locks, and pins. It helps improve balance, coordination, and flexibility while promoting discipline and respect for opponents."
        />
        
        <ExerciseCard
          title="Sambo"
          image="/images/Sambo.jpg"
          link="#"
          description="Sambo is a Russian martial art and combat sport that combines judo and wrestling techniques. It helps improve grappling skills, flexibility, and overall fitness while promoting self-defense abilities."
        />
        
        <ExerciseCard
          title="Kendo"
          image="/images/Kendo.jpg"
          link="#"
          description="Kendo is a modern Japanese martial art that uses bamboo swords (shinai) and protective armor. It emphasizes discipline, respect, and the development of a strong mind and body."
        />
        
        <ExerciseCard
          title="Eskrima"
          image="/images/Eskrima.jpg"
          link="#"
          description="Eskrima is a Filipino martial art focusing on weapon-based fighting, particularly with sticks and knives. It helps improve reflexes, coordination, and situational awareness while promoting effective self-defense skills."
        />
        
        <ExerciseCard
          title="Iaido"
          image="/images/Iaido.jpg"
          link="#"
          description="Iaido is a Japanese martial art that focuses on the smooth, controlled movements of drawing and cutting with a sword. It helps improve focus, discipline, and precision while promoting a deep understanding of the sword's mechanics."
        />
        
        <ExerciseCard
          title="Kung Fu"
          image="/images/KungFu.jpg"
          link="#"
          description="Kung Fu is a Chinese martial art that emphasizes fluid movements, agility, and the development of internal energy (Qi). It helps improve balance, coordination, and mental focus while promoting self-discipline and respect."
        />
        
        <ExerciseCard
          title="Wing Chun"
          image="/images/WingChun.jpg"
          link="#"
          description="Wing Chun is a Chinese martial art known for its focus on close-range combat, quick strikes, and efficient movements. It helps improve reflexes, coordination, and self-defense skills while promoting a deep understanding of body mechanics."
        />
        <ExerciseCard
          title="Jeet Kune Do"
          image="/images/JeetKuneDo.jpg"
          link="#"
          description="Jeet Kune Do is a martial art philosophy developed by Bruce Lee that emphasizes practicality, efficiency, and directness. It incorporates elements from various martial arts and focuses on real-world self-defense."
        />
        <ExerciseCard
          title="Mixed Martial Arts"
          image="/images/MixedMartialArts.jpeg"
          link="#"
          description="Mixed Martial Arts (MMA) is a full-contact combat sport that allows a wide variety of fighting techniques and skills from a mixture of other combat sports to be used in competition. It helps improve overall fitness, strength, and self-defense skills."
        />
        <ExerciseCard
          title="Tai Chi"
          image="/images/TaiChi.png"
          link="#"
          description="Tai Chi is a Chinese martial art known for its slow, graceful movements and focus on relaxation and mindfulness. It helps improve balance, flexibility, and mental clarity while promoting overall well-being."
        />
        <ExerciseCard
          title="Aikido"
          image="/images/Aikido.jpg"
          link="#"
          description="Aikido is a Japanese martial art that focuses on using an opponent's energy and movements against them. It helps improve balance, coordination, and self-awareness while promoting a philosophy of non-violence and harmony."
        />
        <ExerciseCard
          title="Hapkido"
          image="/images/Hapkido.jpg"
          link="#"
          description="Hapkido is a Korean martial art that emphasizes joint locks, kicks, and throws. It helps improve flexibility, balance, and self-defense skills while promoting a philosophy of harmony and non-resistance."
        />
        <ExerciseCard
          title="Krav Maga"
          image="/images/KravMaga.jpeg"
          link="#"
          description="Krav Maga is a martial art developed by the Israeli military that focuses on real-world self-defense situations. It helps improve situational awareness, reflexes, and self-defense skills while promoting a philosophy of practicality and efficiency."
        />
        <ExerciseCard
          title="Systema"
          image="/images/Systema.jpg"
          link="#"
          description="Systema is a Russian martial art that focuses on hand-to-hand combat, grappling, and weapon training. It helps improve adaptability, awareness, and self-defense skills while promoting a philosophy of natural movement and breathing."
        />

        <ExerciseCard
          title="Marine Corps Martial Arts Program"
          image="/images/MarineCorps.jpeg"
          link="#"
          description="The Marine Corps Martial Arts Program (MCMAP) is a comprehensive system of combat training developed by the United States Marine Corps. It combines elements of various martial arts and focuses on hand-to-hand combat, weapon training, and mental discipline."
        />
      </div>
    </section>
  );
}
