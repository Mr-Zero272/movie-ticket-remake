import { CalendarCheck2, Heart, House, ShoppingCart, UsersRound } from 'lucide-react';

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
        icon: <Heart {...props} />,
        route: '/favorite',
        label: 'Favorite',
    },
];
