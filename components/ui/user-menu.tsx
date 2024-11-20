import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { useAuth } from '@/lib/context/AuthContext';
import Avatar from 'boring-avatars';


interface UserMenuProps {
  isMobile?: boolean;
  handleDisconnectWallet: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ handleDisconnectWallet }) => {
  const { principal } = useAuth();
  const avatarProp = principal ?? "Default";
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center mb-6 pt-6 px-2">
        <Avatar name={avatarProp} size={80} />
        <p className="mt-2 font-medium text-sm">{`${principal?.slice(0, 4)}....${principal?.slice(-3)}`}</p>
      </div>
      {/* <Separator className="w-full mb-2" />
      <div className="space-y-2 px-2">
      <Button variant="ghost" className="w-full justify-between py-3.5 px-2 text-lg lg:text-sm" asChild>
          <Link href="/opportunities">
            <span>My opportunities</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-between py-3.5 px-2 text-lg lg:text-sm" asChild>
          <Link href="/help">
            <span>Help center</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div> */}
      <Separator className="w-full my-2" />
      <div className="px-2 pb-2">
        <Button 
          variant="ghost" 
          className="w-full justify-between text-destructive py-3.5 px-2 text-lg lg:text-sm"
          onClick={handleDisconnectWallet}
        >
          <span>Log out</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}