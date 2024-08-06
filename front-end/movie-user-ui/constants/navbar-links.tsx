import { Bell, CalendarCheck2, House, ShoppingCart, UsersRound } from 'lucide-react';

const props = { className: 'size-6' };

export const navbarLinks = [
    {
        icon: <House {...props} />,
        route: '/',
        label: 'Home',
    },
    {
        icon: <CalendarCheck2 {...props} />,
        route: '/schedule',
        label: 'Schedule',
    },
    {
        icon: <ShoppingCart {...props} />,
        route: '/tickets',
        label: 'Tickets',
    },
    {
        icon: <UsersRound {...props} />,
        route: '/profile',
        label: 'Profile',
    },
    {
        icon: <Bell {...props} />,
        route: '/notifications',
        label: 'Notifications',
    },
];
