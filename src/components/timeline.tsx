import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  tags?: string[];
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative space-y-6 md:space-y-8 before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-border before:ml-0.5">
      {items.map((item, index) => (
        <div key={index} className="relative pl-10">
          <div className="absolute left-0 flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
            {item.icon || index + 1}
          </div>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <h3 className="text-base md:text-lg font-semibold">
                  {item.title}
                </h3>
                <Badge className="bg-indigo-100 text-indigo-600 text-xs md:text-sm w-fit">
                  {item.date}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">
                {item.description}
              </p>
              {item.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
