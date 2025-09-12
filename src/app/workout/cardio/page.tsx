"use client";
import ExerciseCard from "@/components/cards/ExerciseCard";
import Header from "@/components/common/Header";

export default function Cardio() {
  return (
    <section className="w-full bg-white dark:bg-black transition-colors duration-300 overflow-hidden py-28 px-6 sm:px-10 lg:px-20 flex-wrap">
      <section className="flex justify-between gap-[1.25rem] mb-[3.12rem]">
        <div>
          <Header title="WORKOUT" description="Types Of Cardio" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <ExerciseCard
          title="Running"
          image="/images/Running.jpg"
          link="#"
          description="Running is a high-impact cardiovascular exercise that helps improve endurance, speed, and overall fitness. It can be done outdoors or on a treadmill, making it a versatile workout option."
        />
        <ExerciseCard
          title="Walking"
          image="/images/Walking.avif"
          link="#"
          description="Walking is a low-impact cardiovascular exercise that helps improve overall health and fitness. It can be done anywhere and is suitable for all fitness levels."
        />

        <ExerciseCard
          title="Cycling"
          image="/images/Cycling.jpg"
          link="#"
          description="Cycling is a low-impact cardiovascular exercise that helps improve leg strength, endurance, and overall fitness. It can be done outdoors on a bike or indoors on a stationary bike."
        />

        <ExerciseCard
          title="Swimming"
          image="/images/Swimming.webp"
          link="#"
          description="Swimming is a full-body workout that improves cardiovascular fitness, strength, and flexibility. It is a low-impact exercise that is suitable for all ages and fitness levels."
        />

        <ExerciseCard
          title="Jump Rope"
          image="/images/JumpRope.jpg"
          link="#"
          description="Jump Rope is a high-intensity cardiovascular workout that improves coordination, agility, and endurance. It can be done anywhere and is an effective way to burn calories and improve heart health."
        />

        <ExerciseCard
          title="Rowing"
          image="/images/Rowing.jpg"
          link="#"
          description="Rowing is a full-body workout that improves cardiovascular fitness, strength, and endurance. It can be done on water or using a rowing machine, making it a versatile exercise option."
        />

        <ExerciseCard
          title="Elliptical Trainer"
          image="/images/EllipticalTrainer.jpg"
          link="#"
          description="The Elliptical Trainer is a low-impact cardiovascular machine that simulates walking or running without causing excessive pressure on the joints. It helps improve cardiovascular fitness, leg strength, and endurance."
        />

        <ExerciseCard
          title="Stair Climbing"
          image="/images/StairClimbing.webp"
          link="#"
          description="Stair Climbing is a high-intensity cardiovascular workout that targets the lower body, improving strength and endurance. It can be done on a stair climber machine or by using actual stairs."
        />

        <ExerciseCard
          title="Dancing"
          image="/images/Dancing.jpg"
          link="#"
          description="Dancing is a fun and expressive form of cardiovascular exercise that improves coordination, balance, and endurance. It can be done solo or in groups, making it a social and enjoyable workout option."
        />

        <ExerciseCard
          title="Kickboxing"
          image="/images/Kickboxing.png"
          link="#"
          description="Kickboxing is a high-energy workout that combines martial arts techniques with cardio exercises. It helps improve strength, endurance, and coordination while providing a fun and engaging way to burn calories."
        />

        <ExerciseCard
          title="HIIT"
          image="/images/HIIT.webp"
          link="#"
          description="High-Intensity Interval Training (HIIT) is a form of cardiovascular exercise that alternates between short bursts of intense activity and periods of rest or lower-intensity exercise. It is an efficient way to improve cardiovascular fitness, burn calories, and build endurance in a shorter amount of time."     
        />

        <ExerciseCard
          title="Martial Arts"
          image="/images/MartialArts.jpg"
          link="#"
          description="Martial Arts is a diverse range of combat practices that are performed for self-defense, competition, physical health, and mental well-being. It helps improve strength, flexibility, and coordination while promoting discipline and focus."
        />
        <ExerciseCard
          title="Sports Cardio"
          image="/images/SportsCardio.webp"
          link="#"
          description="Sports Cardio is a high-energy workout that incorporates various sports activities to improve cardiovascular fitness, agility, and coordination. It provides a fun and engaging way to stay active while developing athletic skills."
        />
        <ExerciseCard
          title="Hiking"
          image="/images/Hiking.jpeg"
          link="#"
          description="Hiking is a great way to improve cardiovascular fitness while enjoying nature. It involves walking on trails or paths in natural environments, providing a full-body workout that strengthens the legs and core."
        />
        <ExerciseCard
          title="Rowdy Functional Cardio"
          image="/images/RowdyFunctionalCardio.jpg"
          link="#"
          description="Rowdy Functional Cardio is a high-energy workout that combines functional movements with cardio exercises. It helps improve overall fitness, strength, and endurance while keeping the workout fun and engaging."
        />
      </div>
    </section>
  );
}
