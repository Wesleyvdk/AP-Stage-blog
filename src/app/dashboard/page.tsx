"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/use-posts"
import { api } from "@/lib/api-service"
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
} from "@/components/ui/alert-dialog"
import { PlusCircle, Edit, Trash2, Eye, ArrowUpRight } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { posts, isLoading, error } = usePosts()
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Redirect if not logged in
  if (!user) {
    router.push("/auth/login")
    return null
  }

  const handlePublish = async (id: string) => {
    setIsPublishing(id)
    try {
      await api.publishPost(id)
      toast.success("Success", {
        description: "Post published successfully",
      })
      // Refresh the posts
      router.refresh()
    } catch (error) {
      console.error("Error publishing post:", error)
      toast.error("Error", {
        description: "Failed to publish post",
      })
    } finally {
      setIsPublishing(null)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await api.deletePost(id)
      toast.success("Success", {
        description: "Post deleted successfully",
      })
      // Refresh the posts
      router.refresh()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Error", {
        description: "Failed to delete post",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="container py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link href="/new-blog">
            <PlusCircle className="mr-2 h-4 w-4" /> New Post
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
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post: any) => (
            <Card key={post.id}>
              <CardHeader>
                <CardDescription>{post.date}</CardDescription>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag: any) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Badge variant={post.published ? "default" : "outline"} className="mt-4">
                  {post.published ? "Published" : "Draft"}
                </Badge>
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
                  <Button size="sm" onClick={() => handlePublish(post.id)} disabled={isPublishing === post.id}>
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
                        This action cannot be undone. This will permanently delete the post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(post.id)} disabled={isDeleting === post.id}>
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
            <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
            <Button asChild>
              <Link href="/new-blog">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
