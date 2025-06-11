import React from "react";
import Image from "next/image";

function WhyplaySection() {
  const content = [
    {
      image: "/WhyGraphics/LightBulb.svg",
      title: "Job Search Preparation",
      description:
        "Sharpen your job-hunting skills at your own pace with fun, interactive quizzes designed to boost your confidence and knowledge.",
    },
    {
      image: "/WhyGraphics/Trophy.svg",
      title: "Engaging Features",
      description:
        "From leaderboards to rewards for achievements, the Guhuza’s Brain Boost Game keeps you motivated and engaged as you level up your job search.",
    },
    {
      image: "/WhyGraphics/Aproved.svg",
      title: "Trusted Content",
      description:
        "Powered by expert-curated questions, our game covers essential job search topics, ensuring you're prepared for every step of the hiring process.",
    },
  ];

  
  
  
  return (
    <div className="py-16"> 
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-12 md:mb-16">
          Why Play Guhuza’s Brain Boost?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.map((reason, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center p-6 sm:p-8 rounded-xl bg-slate-50 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 intersect:motion-preset-slide-up-lg motion-delay-${
                index * 100
              }  intersect-once`}
            >
              <Image
                src={reason.image}
                alt={reason.title + " icon"}
                width={72} 
                height={72}
                className="mb-6" 
              />
              <h4 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3">
                {reason.title}
              </h4>
              <p className="text-gray-600 text-center leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WhyplaySection;
