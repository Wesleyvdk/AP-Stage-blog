import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/api-service";

export default async function Home() {
  const posts = await getAllPosts(3); // Get 3 most recent posts

  function removeMarkdown(markdownText: string): string {
    // Basic regex to remove common markdown characters (*, _, `, #, [, ], (, ), etc.)
    // This is a basic implementation and might not cover all edge cases.
    return markdownText
      .replace(/([*_`#\[\]()~>+-])/g, "") // Remove common markdown symbols
      .replace(/(\n|\r)/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim();
  }

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Hi, I'm Wesley van der Kraan
          </h1>
          <p className="text-xl text-muted-foreground">
            A passionate developer documenting my journey through work and
            personal projects.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
              asChild
              size="lg"
            >
              <Link href="/about">About Me</Link>
            </Button>
            <Button
              className="bg-indigo-600 text-indigo-100 hover:bg-indigo-700"
              size="lg"
              asChild
            >
              <Link href="/blog">Read My Blog</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary">
            <Image
              src="/confident-professional.png"
              alt="Wesley van der Kraan"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Internship Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">My Internship</h2>
          <Link
            href="/about#internship"
            className="text-primary hover:underline flex items-center gap-1"
          >
            Learn more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3 aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="/taglayer-logo.webp"
                  alt="Taglayer Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <h3 className="text-2xl font-semibold">Taglayer</h3>
                <p className="text-muted-foreground">
                  Currently interning at Taglayer, where I'm working on
                  developing and improving web applications. My main focus is on
                  frontend development using Vue.js and learning about modern
                  web development practices.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-indigo-100 text-indigo-600">
                    Vue.js
                  </Badge>
                  <Badge className="bg-indigo-100 text-indigo-600">
                    TailwindCSS
                  </Badge>
                  <Badge className="bg-indigo-100 text-indigo-600">
                    Express.js
                  </Badge>
                  <Badge className="bg-indigo-100 text-indigo-600">
                    Web Development
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Posts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Recent Posts</h2>
          <Link
            href="/blog"
            className="text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full">
              <CardHeader>
                <CardDescription>{post.date}</CardDescription>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {removeMarkdown(post.excerpt ?? "")}
                </p>
              </CardContent>
              <CardFooter className="mt-auto pt-6 flex flex-col items-start gap-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-indigo-100 text-indigo-600"
                      variant="secondary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/blog/${post.id}`}>Read more</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
