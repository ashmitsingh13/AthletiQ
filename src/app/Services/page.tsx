"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface Trainer {
  id: number;
  name: string;
  category: string;
  price: number;
  experience: number;
  rating: number;
  image: string;
  description: string;
}

const trainers: Trainer[] = [
  {
    id: 1,
    name: "John Doe",
    category: "Strength",
    price: 50,
    experience: 8,
    rating: 4.8,
    image: "/images/trainer01.jpg",
    description:
      "Certified trainer specializing in strength training and fat loss.",
  },
  {
    id: 2,
    name: "Emily Smith",
    category: "Yoga",
    price: 40,
    experience: 5,
    rating: 4.6,
    image: "/images/trainer02.jpg",
    description:
      "Yoga and mindfulness coach helping you improve flexibility and balance.",
  },
  {
    id: 3,
    name: "Michael Johnson",
    category: "Endurance",
    price: 60,
    experience: 10,
    rating: 4.9,
    image: "/images/trainer03.jpg",
    description: "Athlete trainer focusing on endurance and performance.",
  },
  {
    id: 4,
    name: "Sophia Lee",
    category: "Nutrition",
    price: 35,
    experience: 4,
    rating: 4.5,
    image: "/images/trainer04.jpg",
    description:
      "Nutrition and wellness expert guiding you towards a healthier lifestyle.",
  },
  {
    id: 5,
    name: "David Kim",
    category: "Strength",
    price: 70,
    experience: 12,
    rating: 5.0,
    image: "/images/trainer05.jpg",
    description:
      "Powerlifting and bodybuilding expert with 10+ years of experience.",
  },
];

// 3️⃣ Page component
const Page: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");
  const [sort, setSort] = useState<string>("");

  // 4️⃣ Filter + Sort trainers
  const filteredTrainers = trainers
    .filter(
      (trainer) =>
        (filter === "All" || trainer.category === filter) &&
        trainer.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low-to-high") return a.price - b.price;
      if (sort === "high-to-low") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "experience") return b.experience - a.experience;
      return 0;
    });

  // 5️⃣ Appointment handler
  const handleAppointment = (trainer: Trainer) => {
    toast.success(`You booked an appointment with ${trainer.name}!`);
  };

  return (
    <div className="bg-background min-h-screen w-full px-4 sm:px-6 lg:px-20 py-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold">Our Trainers</h1>
        <p className="mt-3 text-muted-foreground text-sm sm:text-base">
          Choose from different categories of trainers to achieve your fitness
          goals.
        </p>
      </div>

      {/* Controls: Search, Filter, Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Search trainers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg bg-background text-foreground text-sm sm:text-base"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border rounded-lg bg-background text-foreground text-sm sm:text-base"
        >
          <option value="All">All Categories</option>
          <option value="Strength">Strength</option>
          <option value="Yoga">Yoga</option>
          <option value="Endurance">Endurance</option>
          <option value="Nutrition">Nutrition</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border rounded-lg bg-background text-foreground text-sm sm:text-base"
        >
          <option value="">Sort by</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
          <option value="rating">Rating: High to Low</option>
          <option value="experience">Experience: High to Low</option>
        </select>
      </div>

      {/* Trainer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTrainers.length > 0 ? (
          filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-card border rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition"
            >
              {/* Trainer Image */}
              <div className="relative w-full h-52 sm:h-64">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Trainer Info */}
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg sm:text-xl font-semibold">
                  {trainer.name}
                </h2>
                <p className="mt-1 text-muted-foreground text-sm">
                  {trainer.description}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <p className="text-yellow-500 font-medium text-sm">
                    ⭐ {trainer.rating}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {trainer.experience} yrs exp.
                  </p>
                </div>

                <p className="mt-3 font-bold text-blue-600 text-sm sm:text-base">
                  ${trainer.price} / session
                </p>

                {/* Appointment Button */}
                <button
                  onClick={() => handleAppointment(trainer)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base transition"
                >
                  Appoint Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No trainers found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
