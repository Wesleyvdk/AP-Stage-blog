import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";

interface CertificationCardProps {
  title: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl?: string;
  skills: string[];
  logoSrc: string;
  variant?: "aws" | "azure" | "degree" | "default";
}

export function CertificationCard({
  title,
  issuer,
  date,
  expiryDate,
  credentialId,
  verificationUrl,
  skills,
  logoSrc,
  variant = "default",
}: CertificationCardProps) {
  // Define variant-specific styles
  const variantStyles = {
    aws: {
      badgeBg: "bg-yellow-100",
      badgeText: "text-yellow-800",
      badgeHover: "hover:bg-yellow-200",
      accentBorder: "border-l-4 border-l-yellow-500",
    },
    azure: {
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-800",
      badgeHover: "hover:bg-blue-200",
      accentBorder: "border-l-4 border-l-blue-500",
    },
    degree: {
      badgeBg: "bg-green-100",
      badgeText: "text-green-800",
      badgeHover: "hover:bg-green-200",
      accentBorder: "border-l-4 border-l-green-500",
    },
    default: {
      badgeBg: "bg-indigo-100",
      badgeText: "text-indigo-600",
      badgeHover: "hover:bg-indigo-200",
      accentBorder: "border-l-4 border-l-indigo-500",
    },
  };

  const style = variantStyles[variant];

  return (
    <Card className={`overflow-hidden ${style.accentBorder}`}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2 p-4 sm:p-6">
        <div className="relative h-12 w-12 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-md">
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt={`${issuer} logo`}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <CardTitle className="text-base sm:text-xl">{title}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {issuer}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-2 px-4 sm:px-6">
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-4">
          <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span>
            Issued: {date}
            {expiryDate && ` · Expires: ${expiryDate}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <Badge
              key={skill}
              className={`${style.badgeBg} ${style.badgeText} ${style.badgeHover} text-xs`}
            >
              {skill}
            </Badge>
          ))}
        </div>
        <div className="text-xs sm:text-sm">
          <span className="text-muted-foreground">Credential ID:</span>{" "}
          {credentialId}
        </div>
      </CardContent>
      {verificationUrl && (
        <CardFooter className="px-4 sm:px-6 py-3 sm:py-4">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify Credential
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
