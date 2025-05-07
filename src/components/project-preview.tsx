"use client";

import mql from "@microlink/mql";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

interface ProjectPreviewProps {
  url?: string | null;
  title: string;
  aspectRatio?: "video" | "square" | "auto";
  size?: "normal" | "large" | "small";
  className?: string;
  projectType?: string;
}

export function ProjectPreview({
  url,
  title,
  aspectRatio = "video",
  size = "large",
  className = "",
  projectType,
}: ProjectPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState<any>(null);

  // Calculate aspect ratio class
  const aspectRatioClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "square"
        ? "aspect-square"
        : "";

  if (!url) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg ${aspectRatioClass} ${className}`}
      >
        <Card className="h-full w-full">
          <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
            {projectType === "bot" ? (
              <>
                <div className="mb-4 text-4xl">🤖</div>
                <p className="text-lg font-medium">{title}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Chat Bot / No Live Demo
                </p>
              </>
            ) : (
              <>
                <div className="mb-4 text-4xl">🚧</div>
                <p className="text-lg font-medium">{title}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  No Live Demo Available
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await mql(url, {
          screenshot: true,
        });
        if (status === "error") {
          setHasError(true);
        } else {
          setData(data);
        }
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-10">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (hasError) {
    return (
      <Card className="h-full w-full">
        <CardContent className="flex h-full items-center justify-center p-6">
          <p className="text-center text-muted-foreground">
            Unable to load preview for {title}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.screenshot) {
    return <div>No preview available.</div>;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${aspectRatioClass} ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}

      {hasError ? (
        <Card className="h-full w-full">
          <CardContent className="flex h-full items-center justify-center p-6">
            <p className="text-center text-muted-foreground">
              Unable to load preview for {title}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <Image
            src={data.screenshot?.url ?? ""}
            alt={url}
            width={data.screenshot?.width}
            height={data.screenshot?.height}
          />
        </div>
      )}
    </div>
  );
}
