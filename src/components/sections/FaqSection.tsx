import React from "react";
import Header from "../common/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function FaqSection() {
  const faqData = [
    {
      id: "0",
      question: "What is AI Fitness Trainer and how does it work?",
      answer:
        "Our AI Fitness Trainer uses computer vision and machine learning to analyze your posture in real time or from uploaded videos. It provides instant feedback and corrections to help you train safely and effectively.",
    },
    {
      id: "1",
      question: "Do I need any special equipment to use AI Posture Analysis?",
      answer:
        "No special equipment is required. You just need a smartphone, laptop, or webcam to record or stream your workout. The AI processes video directly from your device.",
    },
    {
      id: "2",
      question: "Can AI really improve my workout performance?",
      answer:
        "Yes! By detecting incorrect posture and giving instant corrections, the AI helps prevent injuries and ensures maximum muscle engagement, leading to better results in less time.",
    },
    {
      id: "3",
      question: "Is my data and video footage safe?",
      answer:
        "Absolutely. Your workout videos are processed securely, and we prioritize user privacy. We do not share your personal data with third parties.",
    },
    {
      id: "4",
      question: "Does it support different types of workouts?",
      answer:
        "Yes, our AI system supports multiple exercises like squats, push-ups, deadlifts, yoga poses, and more. New workouts are continuously added to improve your training options.",
    },
    {
      id: "5",
      question: "Can beginners use AI Fitness Trainer?",
      answer:
        "Definitely. The AI is beginner-friendly and helps you learn proper form step by step. It works equally well for advanced athletes who want precise posture tracking.",
    },
    {
      id: "6",
      question: "Do I need an internet connection to use it?",
      answer:
        "Yes, an internet connection is required for real-time analysis and cloud processing. However, we are working on offline support for future updates.",
    },
    {
      id: "7",
      question: "How quickly do I get feedback on my workout?",
      answer:
        "The feedback is instant in real-time camera mode. For uploaded videos, analysis usually takes a few seconds depending on video length and your connection speed.",
    },
  ];

  const validIndexForBorderRight = (index: number) => {
    if (index === 0 || index === 2 || index === 4 || index === 6) {
      return true;
    }
    return false;
  };

  return (
    <section>
      <section className="flex justify-between gap-[1.25rem] mb-[3.12rem]">
        <div>
          <Header title="faqs" description="Frequently Asked Questions" />
        </div>
      </section>
      <div className="flex justify-between gap-[3.12rem] flex-col xl:flex-row">
        <Accordion
          type="single"
          collapsible
          className="w-full grid grid-cols-1 md:grid-cols-2"
        >
          {faqData.map((faq, index) => (
            <AccordionItem
              value={faq.id}
              key={faq.id}
              className={`border-y border-y-lightDark px-[3.12rem] py-[1.88rem] ${
                validIndexForBorderRight(index)
                  ? "md:border-r md:border-r-lightDark"
                  : ""
              }`}
            >
              <AccordionTrigger className="text-customGrayAlt2 font-[600] text-[1rem] md:text-[1.25rem] uppercase">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-customGrayAlt text-[0.875rem] md:text-[1.125rem]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FaqSection;
