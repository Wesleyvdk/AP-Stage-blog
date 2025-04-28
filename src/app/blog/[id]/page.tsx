import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar } from "lucide-react"
import { getPostById } from "@/lib/api-service"
import { incrementViewCount } from "@/lib/actions"

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default async function BlogPostPage({ params }: {params: Promise<{id: string}>}) {
  const paramProps = await params;
  const post = await getPostById(paramProps.id)

  if (!post) {
    notFound()
  }

  // Increment view count
  await incrementViewCount(paramProps.id)

  return (
    <div className="container py-12">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>
      </Button>

      <article className="prose prose-lg dark:prose-invert mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-2 text-muted-foreground mb-8">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{post.date}</time>
          {post.views !== undefined && (
            <span className="ml-4">
              {post.views} {post.views === 1 ? "view" : "views"}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  )
}
