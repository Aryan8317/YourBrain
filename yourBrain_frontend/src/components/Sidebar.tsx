import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";

export function Sidebar({ onFilterTypeChange }: { onFilterTypeChange?: (type: 'all' | 'twitter' | 'youtube') => void }) {
    return <div className="h-screen bg-white border-r w-72 fixed left-0 top-0 pl-6">
        <div className="flex text-2xl pt-8 items-center">
            <div className="pr-2 text-purple-600">
                <Logo />
            </div>
            YourBrain
        </div>
        <div className="pt-8 pl-4">
            <SidebarItem text="All" icon={<div className="w-4 h-4 bg-gray-400 rounded-full" />} onClick={() => onFilterTypeChange && onFilterTypeChange('all')} />
            <SidebarItem text="Twitter" icon={<TwitterIcon />} onClick={() => onFilterTypeChange && onFilterTypeChange('twitter')} />
            <SidebarItem text="Youtube" icon={<YoutubeIcon />} onClick={() => onFilterTypeChange && onFilterTypeChange('youtube')} />
        </div>
    </div>
}