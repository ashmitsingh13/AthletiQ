"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CardProps {
  title: string;
  image: string;
  description: string;
  link: string;
}

export default function ExerciseCard({
  title,
  image,
  description,
  link,
}: CardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <div
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[350px] xl:max-w-[380px] 
                   h-auto overflow-hidden flex flex-col cursor-pointer transition"
        onClick={() => setOpen(true)}
      >
        {/* Top: Image */}
        <div className="relative w-full aspect-square rounded-4xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-t-2xl rounded-4xl"
          />
        </div>

        {/* Bottom: Content */}
        <div className="flex justify-between items-center p-4">
          {/* Left: Title */}
          <h3 className="text-black dark:text-white text-xl font-semibold tracking-tight uppercase">
            {title}
          </h3>

          {/* Right: View Project */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-black dark:text-white hover:text-gray-400 transition text-xl font-semibold tracking-tight"
          >
            VIEW <ArrowUpRight className="ml-1 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-8">
            {/* Left: Image */}
            <Image
              src={image}
              alt={title}
              width={220}
              height={220}
              className="rounded-xl object-cover border border-gray-200 dark:border-gray-700"
            />

            {/* Right: Description */}
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-semibold">Description</h1>
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                {description}
              </p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                View <ArrowUpRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
