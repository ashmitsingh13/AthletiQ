"use client"
import ExerciseCard from "@/components/cards/ExerciseCard";
import Header from "@/components/common/Header";

export default function CrossFit() {
  return (
    <section className="w-full bg-white dark:bg-black transition-colors duration-300 overflow-hidden py-28 px-6 sm:px-10 lg:px-20 flex-wrap">
      <section className="flex justify-between gap-[1.25rem] mb-[3.12rem]">
              <div>
                <Header title="WORKOUTS" description="Types Of CrossFit" />
              </div>
      </section>
      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <ExerciseCard
          title="WOD"
          image="/images/MatPilates.jpg"
          link="#"
          description="Mat Pilates focuses on core strength, flexibility, and overall body awareness using a mat. It helps improve posture, balance, and coordination while promoting relaxation and mindfulness."
        />
        <ExerciseCard
          title="AMRAP"
          image="/images/AMRAP.jpg"
          link="#"
          description="AMRAP (As Many Rounds As Possible) is a high-intensity workout format that involves completing as many rounds of a specific set of exercises as possible within a set time frame. It helps improve endurance, strength, and overall fitness while providing a challenging and engaging workout experience."
        />
        
        <ExerciseCard
          title="EMOM"
          image="/images/EMOM.webp"
          link="#"
          description="EMOM (Every Minute on the Minute) is a high-intensity workout format that involves performing a specific exercise at the start of every minute for a set duration. It helps improve strength, endurance, and overall fitness while providing a unique and challenging workout experience."
        />
        
        <ExerciseCard
          title="Chipper Workout"
          image="/images/ChipperWorkout.webp"
          link="#"
          description="Chipper Workout is a high-intensity training method that combines various exercises into a single, challenging workout. It helps improve endurance, build strength, and enhance overall fitness while providing a unique and engaging workout experience."
        />
        
        <ExerciseCard
          title="Ladder Workout"
          image="/images/LadderWorkout.webp"
          link="#"
          description="Ladder Workout is a high-intensity training method that combines strength and cardio exercises in a progressive format. It helps improve endurance, build strength, and enhance overall fitness while providing a unique and challenging workout experience."
        />
        
        <ExerciseCard
          title="Hero WODs"
          image="/images/HeroWODs.avif"
          link="#"
          description="Hero WODs are high-intensity workouts named after fallen heroes. They typically include a variety of CrossFit exercises performed for time or repetitions, helping athletes honor the memory of these individuals while pushing their limits."
        />
        
        <ExerciseCard
          title="Benchmark WODs"
          image="/images/BenchmarkWODs.webp"
          link="#"
          description="Benchmark WODs are high-intensity workouts designed to test and improve overall fitness. They typically include a variety of CrossFit exercises performed for time or repetitions, helping athletes track their progress and set performance goals."
        />
        
        <ExerciseCard
          title="Tabata CrossFit"
          image="/images/TabataCrossFit.webp"
          link="#"
          description="Tabata CrossFit is a high-intensity interval training (HIIT) workout that combines traditional CrossFit exercises with the Tabata training method. It helps improve cardiovascular fitness, build strength, and enhance overall athletic performance."
        />
        
        <ExerciseCard
          title="Strength Training CrossFit"
          image="/images/StrengthTrainingCrossFit.jpg"
          link="#"
          description="Strength Training CrossFit is a high-intensity workout that combines traditional CrossFit exercises with strength training. It helps build muscle, improve endurance, and enhance overall fitness while providing a unique and challenging workout experience."
        />
        
        <ExerciseCard
          title="Gymnastics CrossFit"
          image="/images/GymnasticsCrossFit.webp"
          link="#"
          description="Gymnastics CrossFit is a high-intensity workout that combines traditional CrossFit exercises with gymnastics movements. It helps improve strength, flexibility, and overall fitness while providing a unique and challenging workout experience."
        />
        
        <ExerciseCard
          title="MetCon"
          image="/images/MetCon.jpg"
          link="#"
          description="MetCon (Metabolic Conditioning) is a high-intensity workout designed to improve overall fitness by combining strength and cardiovascular training. It helps boost metabolism, build endurance, and enhance athletic performance."
        />
        
        <ExerciseCard
          title="Strongman CrossFit"
          image="/images/StrongmanCrossFit.webp"
          link="#"
          description="Strongman CrossFit is a high-intensity workout that combines traditional CrossFit exercises with strongman training. It helps build strength, power, and overall fitness while providing a unique and challenging workout experience."
        />
        
        <ExerciseCard
          title="Partner WODs"
          image="/images/PartnerWODs.webp"
          link="#"
          description="Partner WODs are high-intensity workouts designed for two people, focusing on teamwork and collaboration. They help improve strength, endurance, and overall fitness while making the workout more engaging and fun."
        />
      </div>
    </section>
  );
}
