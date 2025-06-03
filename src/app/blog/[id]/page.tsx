import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { getPostById } from "@/lib/api-service";
import { getServerToken } from "@/lib/auth-server";
import { incrementViewCount } from "@/lib/actions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramProps = await params;

  // Get server token for authentication
  const token = await getServerToken();

  // Fetch post with authentication context
  const post = await getPostById(paramProps.id, token);

  if (!post) {
    notFound();
  }

  // Increment view count
  await incrementViewCount(paramProps.id);

  return (
    <div className="container py-8 md:py-12">
      <Button variant="ghost" asChild className="mb-4 md:mb-8">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>
      </Button>

      <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 md:mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-4 md:mb-8">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <time dateTime={post.date}>{post.date}</time>
          {post.views !== undefined && (
            <span className="ml-4">
              {post.views} {post.views === 1 ? "view" : "views"}
            </span>
          )}
          {!post.published && (
            <Badge variant="outline" className="ml-4 text-xs">
              Draft
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-indigo-100 text-indigo-600 text-xs"
              variant="secondary"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <MarkdownRenderer content={post.content} />
      </article>
    </div>
  );
}
