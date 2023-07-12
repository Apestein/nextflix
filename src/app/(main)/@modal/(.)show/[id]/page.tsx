"use client"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { X } from "lucide-react"

export default function ShowPage() {
  const router = useRouter()
  return (
    <div
      aria-label="backdrop"
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            Card Title
            <X onClick={() => router.back()} className="cursor-pointer" />
          </CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <iframe
            width="420"
            height="315"
            src="https://www.youtube.com/embed/tgbNymZ7vqY"
          />
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  )
}
