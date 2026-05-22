import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Camera, Pencil } from "lucide-react"
import { getUserData } from "@/lib/queries/get-user-data"
import { FcGoogle } from "react-icons/fc"

export async function ProfileSection() {
  const user = await getUserData()

  return (
    <Card size="sm">
      <CardHeader className="gap-0">
        <CardTitle>Profil</CardTitle>
        <CardDescription>
          Informasi akun dan identitas yang terhubung.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Item className="p-0">
          <ItemMedia>
            <Avatar className="size-16">
              <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
              <AvatarFallback>{user?.full_name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{user?.full_name}</ItemTitle>
            <ItemDescription>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Badge variant="secondary" className="flex mt-2 items-center gap-1 text-xs text-muted-foreground">
                <FcGoogle size={16} />
                Akun Google
              </Badge>
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline">
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Profil</span>
            </Button>
            <Button variant="outline">
              <Camera className="h-3.5 w-3.5" />
              <span>Ganti Foto</span>
            </Button>
          </ItemActions>
        </Item>
      </CardContent>
    </Card>
  )
}
