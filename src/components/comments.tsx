"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageCircle, Trash2, User, Mail, Clock } from "lucide-react";
import { api, type Comment } from "@/lib/api-service";
import { useSession } from "next-auth/react";

interface CommentsProps {
    postId: string;
}

export function Comments({ postId }: CommentsProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeletingComment, setIsDeletingComment] = useState<string | null>(null);

    // Form state
    const [author, setAuthor] = useState("");
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");

    // Pre-populate form with session data if available
    useEffect(() => {
        if (session?.user) {
            setAuthor(session.user.name || "");
            setEmail(session.user.email || "");
        }
    }, [session]);

    // Load comments on mount
    useEffect(() => {
        const loadComments = async () => {
            try {
                setIsLoading(true);
                const fetchedComments = await api.getComments(postId);
                setComments(fetchedComments);
            } catch (error) {
                console.error("Error loading comments:", error);
                // Silently fail for now - maybe the backend doesn't support comments yet
            } finally {
                setIsLoading(false);
            }
        };

        loadComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!author.trim() || !email.trim() || !content.trim()) {
            toast.error("Missing fields", {
                description: "Please fill in all required fields",
            });
            return;
        }

        if (!email.includes("@")) {
            toast.error("Invalid email", {
                description: "Please enter a valid email address",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const newComment = await api.createComment({
                postId,
                author: author.trim(),
                email: email.trim(),
                content: content.trim(),
            });

            setComments([...comments, newComment]);

            // Clear form
            setAuthor("");
            setEmail("");
            setContent("");

            toast.success("Comment added!", {
                description: "Your comment has been posted successfully",
            });
        } catch (error) {
            console.error("Error creating comment:", error);
            toast.error("Error", {
                description: "Failed to post comment. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!session?.user) {
            toast.error("Unauthorized", {
                description: "You must be logged in to delete comments",
            });
            return;
        }

        setIsDeletingComment(commentId);

        try {
            await api.deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));

            toast.success("Comment deleted", {
                description: "The comment has been removed",
            });
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Error", {
                description: "Failed to delete comment",
            });
        } finally {
            setIsDeletingComment(null);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <h2 className="text-2xl font-bold">Comments</h2>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="animate-pulse space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 w-24 bg-muted rounded"></div>
                                        <div className="h-4 w-32 bg-muted rounded"></div>
                                    </div>
                                    <div className="h-16 bg-muted rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <h2 className="text-2xl font-bold">
                    Comments {comments.length > 0 && `(${comments.length})`}
                </h2>
            </div>

            {/* Add Comment Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Leave a Comment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="author">Name *</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="author"
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Your name"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Comment *</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows={4}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            {isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Comments List */}
            {comments.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                        <p className="text-muted-foreground">
                            Be the first to share your thoughts on this post!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <Card key={comment.id}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-semibold">{comment.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <time dateTime={comment.createdAt}>{comment.date}</time>
                                            </div>
                                        </div>
                                        <p className="text-sm md:text-base whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    </div>
                                    {session?.user && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteComment(comment.id)}
                                            disabled={isDeletingComment === comment.id}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 