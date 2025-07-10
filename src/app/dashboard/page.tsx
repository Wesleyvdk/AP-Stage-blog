"use client";

import { useState, useEffect } from "react";
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
import { Trash2, Edit, Eye, Plus, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { api, getAllPostsForAdmin, type Post } from "@/lib/api-service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [publishingPostId, setPublishingPostId] = useState<string | null>(null);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/auth/signin?callbackUrl=/dashboard");
      return;
    }

    if (!session.user.isAdmin) {
      toast.error("Access Denied", {
        description: "You don't have admin privileges to access this page."
      });
      router.push("/");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!session) return;

      try {
        const fetchedPosts = await getAllPostsForAdmin();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [session]);

  const handleDeletePost = async (id: string, title: string) => {
    setDeletingPostId(id);
    try {
      await api.deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setDeletingPostId(null);
    }
  };

  const handlePublishPost = async (id: string) => {
    setPublishingPostId(id);
    try {
      const updatedPost = await api.publishPost(id);
      setPosts(posts.map((post) =>
        post.id === id ? { ...post, published: updatedPost.published } : post
      ));
      toast.success(updatedPost.published ? "Post published!" : "Post unpublished");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post status");
    } finally {
      setPublishingPostId(null);
    }
  };

  // Show loading while checking authentication
  if (status === "loading" || !session || !session.user.isAdmin) {
    return null;
  }

  return (
    <div className="container py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session.user?.name || session.user?.email}! Manage your blog posts below.
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link href="/new-blog">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
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
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                  {post.views !== undefined && (
                    <span className="ml-4">
                      {post.views} {post.views === 1 ? "view" : "views"}
                    </span>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={post.published ? "default" : "outline"}
                    className="bg-green-100 text-green-700"
                  >
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                  {post.category && (
                    <Badge className="bg-indigo-100 text-indigo-600">
                      {post.category}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/blog/${post.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/edit-blog/${post.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                {!post.published && (
                  <Button
                    size="sm"
                    onClick={() => handlePublishPost(post.id)}
                    disabled={publishingPostId === post.id}
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    {publishingPostId === post.id ? "Publishing..." : "Publish"}
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingPostId === post.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingPostId === post.id ? "Deleting..." : "Delete"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        the post "{post.title}" and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePost(post.id, post.title)}
                        disabled={deletingPostId === post.id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {deletingPostId === post.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mb-4">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first blog post
              </p>
            </div>
            <Button
              asChild
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Link href="/new-blog">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
