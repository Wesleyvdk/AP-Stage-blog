"use client"

import Microlink from "@microlink/react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

interface ProjectPreviewProps {
  url: string
  title: string
  aspectRatio?: "video" | "square" | "auto"
  size?: "normal" | "large" | "small"
  className?: string
}

export function ProjectPreview({
  url,
  title,
  aspectRatio = "video",
  size = "large",
  className = "",
}: ProjectPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Calculate aspect ratio class
  const aspectRatioClass = aspectRatio === "video" ? "aspect-video" : aspectRatio === "square" ? "aspect-square" : ""

  return (
    <div className={`relative overflow-hidden rounded-lg ${aspectRatioClass} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}

      {hasError ? (
        <Card className="h-full w-full">
          <CardContent className="flex h-full items-center justify-center p-6">
            <p className="text-center text-muted-foreground">Unable to load preview for {title}</p>
          </CardContent>
        </Card>
      ) : (
        <Microlink
          url={url}
          size={size}
          contrast={true}
          screenshot={true}
          className="h-full w-full"
          style={{
            borderRadius: "inherit",
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      )}
    </div>
  )
}
