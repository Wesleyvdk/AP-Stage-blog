"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Welke technologieën gebruik je het liefst?",
    answer:
      "Ik werk graag met Vue.js en React voor frontend ontwikkeling, gecombineerd met TailwindCSS voor styling. Voor backend projecten gebruik ik Node.js met Express.",
  },
  {
    question: "Ben je beschikbaar voor freelance werk?",
    answer:
      "Ja, ik ben beschikbaar voor freelance projecten naast mijn studie en stage. Neem contact met me op voor beschikbaarheid en tarieven.",
  },
  {
    question: "Hoe ziet jouw ontwikkelproces eruit?",
    answer:
      "Mijn proces begint met het grondig begrijpen van de vereisten, gevolgd door ontwerp, implementatie, testen en iteratie. Ik hecht veel waarde aan communicatie en feedback gedurende het hele proces.",
  },
  {
    question: "Hoe blijf je op de hoogte van nieuwe technologieën?",
    answer:
      "Ik volg regelmatig online cursussen, lees technische blogs, neem deel aan webinars en experimenteer met nieuwe technologieën in persoonlijke projecten.",
  },
  {
    question: "Kun je samenwerken in een team?",
    answer:
      "Absoluut! Ik heb ervaring met teamwerk tijdens mijn stage en studieprojecten. Ik gebruik tools zoals Git voor versiebeheer en ben gewend aan agile werkwijzen.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Veelgestelde Vragen
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Antwoorden op vragen die je misschien hebt over mijn werk en
            ervaring
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className={`transition-all duration-200 ${openIndex === index ? "ring-1 ring-primary" : ""}`}
            >
              <CardHeader
                className="cursor-pointer p-4 flex flex-row items-center justify-between"
                onClick={() => toggleFAQ(index)}
              >
                <CardTitle className="text-lg">{faq.question}</CardTitle>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
              {openIndex === index && (
                <CardContent className="pt-0 pb-4 px-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
