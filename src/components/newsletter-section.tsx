"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuleer een API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Inschrijving succesvol!", {
      description: "Bedankt voor je inschrijving op mijn nieuwsbrief.",
    });

    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="py-12 bg-muted">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold tracking-tight">
            Blijf op de hoogte
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Schrijf je in voor mijn nieuwsbrief om updates te ontvangen over
            nieuwe projecten, blogposts en meer.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="jouw@email.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Bezig..." : "Inschrijven"}
          </Button>
        </form>
      </div>
    </section>
  );
}
