import { useState } from "react";
import { useParams } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import Markdown from "react-markdown";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Illustrations } from "~/lib/types";

// Mock data for the story
const mockStory = {
  id: "1",
  title: "The Enchanted Forest",
  author: "Jane Doe",
  content: `
# The Enchanted Forest

![Forest entrance](https://example.com/forest-entrance.jpg)

Once upon a time, in a land far away, there was an enchanted forest. This forest was unlike any other, filled with magical creatures and mysterious happenings.

## The Journey Begins

As our hero stepped into the forest, they could feel the magic in the air. The trees seemed to whisper ancient secrets, and the ground beneath their feet pulsed with an otherworldly energy.

![Magical clearing](https://example.com/magical-clearing.jpg)

In a small clearing, they encountered their first magical being - a wise old owl with eyes that sparkled like stars. The owl spoke in riddles, guiding our hero deeper into the heart of the enchanted forest.

## The Final Challenge

At the center of the forest stood an ancient tree, its branches reaching towards the heavens. This tree held the key to unlocking the forest's greatest secret.

Our hero, armed with courage and the wisdom gained from their journey, faced their final challenge. With a deep breath, they placed their hand on the tree's trunk and...

*To be continued*
  `,
  publishedDate: "2023-05-15",
  likes: 1234,
  comments: 89,
};

// Mock data for community illustrations
const mockIllustrations: Illustrations[] = [
  {
    id: "1",
    url: "/public/04e022c1b7bb81a23966367cbbd9e14e.png",
    artist: "Alice",
    title: "Forest Entrance",
    likes: 42,
  },
  {
    id: "2",
    url: "/public/791e03f1b205f8040a51c81f58bc051d.jpg",
    artist: "Bob",
    title: "Wise Owl",
    likes: 37,
  },
  {
    id: "3",
    url: "/public/solelev.png",
    artist: "Charlie",
    title: "Ancient Tree",
    likes: 51,
  },
];

export default function StoryPage() {
  const { storyId } = useParams();
  const [isSubmitArtworkOpen, setIsSubmitArtworkOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Illustrations>();

  const handleSubmitArtwork = (event: any) => {
    event.preventDefault();
    // TODO: Implement artwork submission logic
    console.log("Artwork submitted");
    setIsSubmitArtworkOpen(false);
  };

  return (
    <>
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{mockStory.title}</h1>
          <p className="text-muted-foreground">
            By {mockStory.author} • Published on {mockStory.publishedDate}
          </p>
        </header>

        <Tabs defaultValue="story" className="w-full">
          <TabsList>
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          <TabsContent value="story" className="prose max-w-none">
            <Markdown
              components={{
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    className="w-full h-auto rounded-lg shadow-md my-4"
                  />
                ),
              }}
            >
              {mockStory.content}
            </Markdown>
          </TabsContent>
          <TabsContent value="gallery">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mockIllustrations.map((illustration) => (
                <div key={illustration.id} className="relative group">
                  <img
                    src={illustration.url}
                    alt={illustration.title}
                    className="w-full h-auto rounded-lg shadow-md cursor-pointer transition-transform transform group-hover:scale-105"
                    onClick={() => setSelectedImage(illustration)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                    <p className="text-sm font-semibold">
                      {illustration.title}
                    </p>
                    <p className="text-xs">by {illustration.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              {mockStory.likes}
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              {mockStory.comments}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          <Dialog
            open={isSubmitArtworkOpen}
            onOpenChange={setIsSubmitArtworkOpen}
          >
            <DialogTrigger asChild>
              <Button>Submit Artwork</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Your Artwork</DialogTitle>
                <DialogDescription>
                  Share your illustration inspired by this story. Please ensure
                  you have the rights to the artwork you're submitting.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitArtwork} className="space-y-4">
                <div>
                  <Label htmlFor="artwork-title">Artwork Title</Label>
                  <Input
                    id="artwork-title"
                    placeholder="Enter a title for your artwork"
                  />
                </div>
                <div>
                  <Label htmlFor="artwork-description">Description</Label>
                  <Textarea
                    id="artwork-description"
                    placeholder="Describe your artwork or the scene it represents"
                  />
                </div>
                <div>
                  <Label htmlFor="artwork-file">Upload Artwork</Label>
                  <Input id="artwork-file" type="file" accept="image/*" />
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Artwork</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </article>

      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(undefined)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedImage.title}</DialogTitle>
              <DialogDescription>by {selectedImage.artist}</DialogDescription>
            </DialogHeader>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
            <DialogFooter>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                {selectedImage.likes}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
