"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FC } from "react";

interface SupportCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // ✅ no 'any'
  title: string;
  description: string;
  buttonText: string;
  delay?: number;
}

const SupportCard: FC<SupportCardProps> = ({
  icon: Icon,
  title,
  description,
  buttonText,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <Icon className="w-10 h-10 text-primary" />
          <CardTitle className="mt-2 text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-grow">
          <p className="text-muted-foreground mb-6 text-sm">{description}</p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SupportCard;
