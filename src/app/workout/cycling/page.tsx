"use client"
import ExerciseCard from "@/components/cards/ExerciseCard";
import Header from "@/components/common/Header";

export default function Cycling() {
  return (
    <section className="w-full bg-white dark:bg-black transition-colors duration-300 overflow-hidden py-28 px-6 sm:px-10 lg:px-20 flex-wrap">
      <section className="flex justify-between gap-[1.25rem] mb-[3.12rem]">
              <div>
                <Header title="WORKOUTS" description="Types Of Cycling" />
              </div>
      </section>
      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <ExerciseCard
          title="Road Cycling"
          image="/images/RoadCycling.jpg"
          link="#"
          description="Road Cycling is a popular form of cycling that takes place on paved roads. It focuses on endurance, speed, and efficiency, making it ideal for long-distance rides and competitive racing."
        />
        <ExerciseCard
          title="Mountain Biking"
          image="/images/MountainBiking.jpg"
          link="#"
          description="Mountain Biking is an exhilarating form of cycling that takes place on off-road trails and rugged terrain. It focuses on technical skills, balance, and endurance, making it ideal for adventure seekers and nature lovers."
        />
        
        <ExerciseCard
          title="Track Cycling"
          image="/images/TrackCycling.jpg"
          link="#"
          description="Track Cycling is a specialized form of cycling that takes place on velodromes or indoor tracks. It focuses on speed, power, and strategy, making it ideal for competitive racing and time trials."
        />
        
        <ExerciseCard
          title="Cyclocross"
          image="/images/Cyclocross.jpg"
          link="#"
          description="Cyclocross is a form of competitive bicycle racing that takes place on a mixed terrain course, including pavement, dirt, and obstacles. It focuses on technical skills, bike handling, and endurance, making it ideal for athletes seeking a challenging and varied racing experience."
        />
        
        <ExerciseCard
          title="BMX Cycling"
          image="/images/BMXCycling.jpg"
          link="#"
          description="BMX Cycling is a high-energy sport that involves racing on specialized bikes designed for dirt tracks and obstacles. It focuses on speed, agility, and technical skills, making it ideal for thrill-seekers and competitive athletes."
        />
        
        <ExerciseCard
          title="Gravel Cycling"
          image="/images/GravelCycling.jpg"
          link="#"
          description="Gravel Cycling is an adventurous form of cycling that takes place on unpaved roads and trails. It focuses on endurance, bike handling, and exploration, making it ideal for cyclists seeking a diverse and challenging riding experience."
        />
        
        <ExerciseCard
          title="Touring Cycling"
          image="/images/TouringCycling.jpg"
          link="#"
          description="Touring Cycling is a long-distance cycling discipline focused on endurance and exploration. It involves riding on various terrains, often with a loaded bike, making it ideal for adventure seekers and those looking to experience the great outdoors."
        />
        
        <ExerciseCard
          title="Commuter Cycling"
          image="/images/CommuterCycling.jpg"
          link="#"
          description="Commuter Cycling is a practical and efficient way to travel short to medium distances by bike. It focuses on convenience, safety, and fitness, making it ideal for daily commuters and urban dwellers."
        />
        
        <ExerciseCard
          title="Fat Biking"
          image="/images/FatBiking.jpg"
          link="#"
          description="Fat Biking is a unique form of cycling that involves riding on bikes with oversized tires, designed for soft and unstable terrain such as snow, sand, and mud. It focuses on balance, control, and endurance, making it ideal for adventure enthusiasts and off-road explorers."
        />
        
        <ExerciseCard
          title="Spin Cycling"
          image="/images/SpinCycling.jpg"
          link="#"
          description="Spin Cycling is a high-energy indoor cycling workout that simulates outdoor riding. It focuses on endurance, strength, and cardiovascular fitness, making it ideal for those looking to improve their cycling performance in a motivating group setting."
        />
        
        <ExerciseCard
          title="Endurance Cycling"
          image="/images/EnduranceCycling.webp"
          link="#"
          description="Endurance Cycling is a discipline focused on long-distance rides, emphasizing stamina, pacing, and mental resilience. It is ideal for cyclists looking to improve their aerobic capacity and tackle challenging routes."
        />
        
        <ExerciseCard
          title="Time Trial Cycling"
          image="/images/TimeTrialCycling.jpg"
          link="#"
          description="Time Trial Cycling is a discipline focused on individual racing against the clock. It emphasizes aerodynamics, pacing, and mental toughness, making it ideal for cyclists looking to improve their speed and performance."
        />
        
        <ExerciseCard
          title="Para Cycling"
          image="/images/ParaCycling.jpg"
          link="#"
          description="Para Cycling is a discipline that enables athletes with disabilities to compete in cycling events. It focuses on adaptive techniques, specialized equipment, and inclusivity, making it ideal for promoting diversity in sports."
        />
        
        <ExerciseCard
          title="Recumbent Cycling"
          image="/images/RecumbentCycling.jpeg"
          link="#"
          description="Recumbent Cycling is a comfortable and efficient cycling style where riders sit in a laid-back position. It focuses on reducing strain on the back and neck, making it ideal for long rides and those with physical limitations."
        />
        <ExerciseCard
          title="Fixed Gear Cycling"
          image="/images/FixedGearCycling.jpg"
          link="#"
          description="Fixed Gear Cycling is a minimalist and efficient cycling style where riders use a single gear and no freewheel mechanism. It focuses on simplicity, control, and a strong connection between the rider and the bike, making it ideal for urban commuting and track racing."
        />
      </div>
    </section>
  );
}
