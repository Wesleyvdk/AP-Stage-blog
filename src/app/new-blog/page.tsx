"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api-service";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import linksData from "@/lib/links.json";

export default function NewBlogPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectOptions = Object.keys(linksData.projects || {});
  const [category, setCategory] = useState<string>("");

  // Redirect if not logged in
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const addTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newPost = await api.createPost({
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + "...",
        tags,
        category,
      });

      toast.success("Success!", {
        description: "Your blog post has been created",
      });

      router.push(`/blog/${newPost.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error", {
        description: "Failed to create blog post",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (optional)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of your post"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                If left empty, an excerpt will be generated from your content
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here"
                rows={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional Work</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  {projectOptions.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Select a project or category this blog post belongs to
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((t) => (
                    <Badge key={t} className="flex items-center gap-1">
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="ml-1 rounded-full hover:bg-primary/20"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {t} tag</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
