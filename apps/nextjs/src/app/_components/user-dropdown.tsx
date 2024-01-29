import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import type { Session } from "@acme/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/ui/avatar";
import { Button } from "@acme/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/components/ui/dropdown-menu";

interface Props {
  session: Session;
}

export function UserDropdown({ session }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-12 rounded-full">
          <Avatar>
            {session.user.image && (
              <AvatarImage
                alt={session.user.name ?? session.user.email}
                src={session.user.image}
                className="size-10 rounded-full"
              />
            )}
            <AvatarFallback>
              {session.user.name ?? session.user.email}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" forceMount align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <Link href={AppRoutes.Settings}>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link> */}
          <DropdownMenuItem
            asChild
            onClick={async () => {
              await signOut();
            }}
          >
            <button className="w-full">
              <LogOut className="mr-2 size-4" />
              <span>Log Out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
