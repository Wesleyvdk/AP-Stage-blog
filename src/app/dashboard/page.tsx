"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { usePosts } from "@/lib/use-posts";
import { api } from "@/lib/api-service";
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
import { PlusCircle, Edit, Trash2, Eye, ArrowUpRight, FileDown } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { posts, isLoading, error } = usePosts();
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Redirect if not logged in
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const handlePublish = async (id: string) => {
    setIsPublishing(id);
    try {
      await api.publishPost(id);
      toast.success("Success", {
        description: "Post published successfully",
      });
      // Refresh the posts
      router.refresh();
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Error", {
        description: "Failed to publish post",
      });
    } finally {
      setIsPublishing(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await api.deletePost(id);
      toast.success("Success", {
        description: "Post deleted successfully",
      });
      // Refresh the posts
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error", {
        description: "Failed to delete post",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      toast.info("Export Started", {
        description: "Generating PDFs for all pages. This may take a moment...",
      });

      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseUrl: window.location.origin
        })
      });

      if (!response.ok) {
        throw new Error('Failed to export PDFs');
      }

      const data = await response.json();

      if (data.success && data.files) {
        // Download each PDF file
        for (const fileInfo of data.files) {
          const link = document.createElement('a');
          link.href = `data:application/pdf;base64,${fileInfo.buffer}`;
          link.download = fileInfo.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        toast.success("Export Complete", {
          description: `Successfully exported ${data.files.length} PDF(s)`,
        });

        if (data.errors && data.errors.length > 0) {
          console.warn('Export warnings:', data.errors);
          toast.warning("Export Warnings", {
            description: `Some pages had issues: ${data.errors.length} warnings`,
          });
        }
      } else {
        throw new Error(data.message || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Export Failed", {
        description: "Failed to export PDFs. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your blog posts</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <FileDown className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export All to PDF"}
          </Button>
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/new-blog">
              <PlusCircle className="mr-2 h-4 w-4" /> New Post
            </Link>
          </Button>
        </div>
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
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardDescription>{post.date}</CardDescription>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge
                    variant={post.published ? "default" : "outline"}
                    className="mr-2"
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
                    onClick={() => handlePublish(post.id)}
                    disabled={isPublishing === post.id}
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    {isPublishing === post.id ? "Publishing..." : "Publish"}
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting === post.id}
                      >
                        {isDeleting === post.id ? "Deleting..." : "Delete"}
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
            <p className="text-muted-foreground mb-4">
              You haven't created any posts yet
            </p>
            <Button
              asChild
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Link href="/new-blog">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
