import { DropdownMenu } from '@/types/dropdownMenuType';
import { Bell, User } from 'lucide-react';

export const dropdownMenuProfileData: DropdownMenu = [
    {
        name: 'account',
        menu: [
            { title: 'Your account', icon: <User />, iconColor: 'blue', value: 'profile' },
            { title: 'Profile', value: 'profile' },
            { title: 'Change password', value: 'change password' },
        ],
    },
    {
        name: 'notification',
        menu: [
            {
                title: 'Notification',
                icon: <Bell />,
                iconColor: 'orange',
                value: 'main notification',
            },
            { title: 'Main notification', value: 'main notification' },
            { title: 'News', value: 'news' },
        ],
    },
];
