"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePublicPosts } from "@/lib/use-posts";
import removeMarkdown from "remove-markdown";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function BlogPage() {
  const { user } = useAuth();
  const { posts, isLoading, error } = usePublicPosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract all unique tags from posts
  const allTags = [...new Set(posts.flatMap((post) => post.tags))];

  // Extract all unique categories from posts
  const allCategories = [
    ...new Set(posts.map((post) => post.category).filter(Boolean)),
  ];

  // Filter posts based on search term and selected tags
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => post.tags.includes(tag));

    const matchesCategory =
      !selectedCategory || post.category === selectedCategory;

    return matchesSearch && matchesTags && matchesCategory;
  });

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const FilterComponent = () => (
    <>
      <div className="space-y-4">
        <h3 className="font-medium">Filter by Category</h3>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setSelectedTags([]);
                setSelectedCategory(null);
                setIsFilterOpen(false);
              }}
            >
              Show All Posts
            </Button>
          </TabsContent>
          <TabsContent value="tags" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  className={`cursor-pointer ${selectedTags.includes(tag)
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                    }`}
                  onClick={() => {
                    toggleTag(tag);
                    if (window.innerWidth < 768) setIsFilterOpen(false);
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="categories" className="mt-4">
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedCategory(null);
                  if (window.innerWidth < 768) setIsFilterOpen(false);
                }}
              >
                All Categories
              </Button>
              {allCategories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className={`w-full justify-start ${selectedCategory === category ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}`}
                  onClick={() => {
                    setSelectedCategory(category ?? null);
                    if (window.innerWidth < 768) setIsFilterOpen(false);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );

  return (
    <div className="container py-8 md:py-12 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Blog Posts
          </h1>
          <p className="text-muted-foreground mt-2">
            Documenting my journey, learnings, and experiences
          </p>
        </div>
        {user && (
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/new-blog">
              <PlusCircle className="mr-2 h-4 w-4" /> New Post
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4 space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search posts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Mobile filter button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
                <div className="py-6">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  <FilterComponent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardDescription>{post.date}</CardDescription>
                    <CardTitle>
                      <Link
                        href={`/blog/${post.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm md:text-base">
                      {removeMarkdown(post.excerpt ?? "")}
                      {post.category && (
                        <Badge className="mt-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200">
                          {post.category}
                        </Badge>
                      )}
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-4">
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
                    <Button
                      variant="outline"
                      asChild
                      className="hover:bg-indigo-50"
                    >
                      <Link href={`/blog/${post.id}`}>Read more</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No posts found matching your criteria
              </p>
            </div>
          )}
        </div>

        {/* Desktop filter sidebar */}
        <div className="hidden md:block w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Filter by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterComponent />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
