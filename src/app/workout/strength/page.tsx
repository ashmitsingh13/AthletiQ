"use client"
import ExerciseCard from "@/components/cards/ExerciseCard";
import Header from "@/components/common/Header";

export default function Strength() {
  return (
    <section className="w-full bg-white dark:bg-black transition-colors duration-300 overflow-hidden py-28 px-6 sm:px-10 lg:px-20 flex-wrap">
      <section className="flex justify-between gap-[1.25rem] mb-[3.12rem]">
              <div>
                <Header title="WORKOUTS" description="Types Of Strength Training" />
              </div>
      </section>
      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <ExerciseCard
          title="Bodyweight Training"
          image="/images/BodyweightTraining.jpg"
          link="#"
          description="Bodyweight Training utilizes the individual's weight to provide resistance against gravity. It helps improve strength, balance, flexibility, and coordination without the need for equipment."
        />
        <ExerciseCard
          title="Free Weights Training"
          image="/images/FreeWeightsTraining.jpg"
          link="#"
          description="Free Weights Training involves using dumbbells, barbells, and other equipment to perform exercises that target specific muscle groups. It helps build strength, muscle mass, and overall fitness."
        />
        
        <ExerciseCard
          title="Resistance Band Training"
          image="/images/ResistanceBandTraining.webp"
          link="#"
          description="Resistance Band Training uses elastic bands to provide resistance during exercises. It helps improve strength, flexibility, and muscle tone while being portable and versatile for various workouts."
        />
        
        <ExerciseCard
          title="Powerlifting"
          image="/images/Powerlifting.jpg"
          link="#"
          description="Powerlifting is a strength sport that focuses on three main lifts: squat, bench press, and deadlift. It helps build maximal strength, muscle mass, and overall power."
        />
        
        <ExerciseCard
          title="Olympic Lifting"
          image="/images/OlympicLifting.avif"
          link="#"
          description="Olympic Lifting is a competitive weightlifting sport that includes the snatch and the clean and jerk. It helps develop explosive strength, power, and overall athleticism."
        />
        
        <ExerciseCard
          title="Circuit Training"
          image="/images/CircuitTraining.jpg"
          link="#"
          description="Circuit Training involves a series of exercises performed in rotation with minimal rest, targeting different muscle groups. It helps improve strength, endurance, and overall fitness while keeping workouts varied and engaging."
        />
        
        <ExerciseCard
          title="Isometric Training"
          image="/images/IsometricTraining.avif"
          link="#"
          description="Isometric Training involves static exercises where muscles are engaged without movement. It helps improve strength, stability, and endurance, making it beneficial for rehabilitation and overall fitness."
        />
        <ExerciseCard
          title="Calisthenics"
          image="/images/Calisthenics.jpg"
          link="#"
          description="Calisthenics involves using body weight for resistance training. It helps improve strength, flexibility, and overall fitness without the need for equipment."
        />
        
        <ExerciseCard
          title="Plyometric Strength Training"
          image="/images/PlyometricStrengthTraining.webp"
          link="#"
          description="Plyometric Strength Training focuses on explosive movements to improve power and strength. It helps enhance athletic performance, increase muscle mass, and develop fast-twitch muscle fibers."
        />
        
        <ExerciseCard
          title="Strongman Training"
          image="/images/StrongmanTraining.jpg"
          link="#"
          description="Strongman Training involves a variety of exercises using heavy weights and unconventional implements. It helps build overall strength, power, and functional fitness, making it ideal for those looking to challenge their limits."
        />
        
        <ExerciseCard
          title="Functional Training"
          image="/images/FunctionalTraining.jpg"
          link="#"
          description="Functional Training focuses on exercises that mimic everyday activities, improving overall strength, balance, and flexibility. It helps enhance athletic performance and reduce the risk of injury."
        />
        
        <ExerciseCard
          title="CrossFit Strength Training"
          image="/images/CrossFitStrengthTraining.png"
          link="#"
          description="CrossFit Strength Training combines weightlifting, aerobic exercises, and high-intensity functional movements. It helps improve overall strength, endurance, and fitness levels, making it suitable for all fitness enthusiasts."
        />
        
        <ExerciseCard
          title="Machine-Based Training"
          image="/images/Machine-BasedTraining.png"
          link="#"
          description="Machine-Based Training utilizes various gym machines to target specific muscle groups. It helps improve strength, stability, and muscle growth while providing a controlled environment for exercise."
        />
        
        <ExerciseCard
          title="Explosive Power Training"
          image="/images/ExplosivePowerTraining.webp"
          link="#"
          description="Explosive Power Training focuses on high-intensity, explosive movements to improve overall power and athletic performance. It helps develop fast-twitch muscle fibers, enhance speed, and increase strength."
        />
        
        <ExerciseCard
          title="Endurance Strength Training"
          image="/images/EnduranceStrengthTraining.jpg"
          link="#"
          description="Endurance Strength Training focuses on high-repetition, low-weight exercises to improve muscular endurance and overall fitness. It helps enhance stamina, promote fat loss, and build lean muscle mass."
        />
      </div>
    </section>
  );
}
