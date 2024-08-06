'use client';
import { useState } from 'react';
import { dropdownMenuProfileData } from '@/constants';
import { type SubDropDownMenu } from '@/types/dropdownMenuType';

type DropdownMenuProps = {
    name: string;
    menu: SubDropDownMenu[];
    isFocus: boolean;
    onClick: (name: string) => void;
    onSelect: (menuName: string) => void;
};

function DropdownMenu({ name, menu, isFocus, onClick, onSelect }: DropdownMenuProps) {
    const [activeMenuItem, setActiveMenuItem] = useState(() => menu[0].value);
    const handleChooseMenuItem = (menuName: string) => {
        onSelect(menuName);
        setActiveMenuItem(menuName);
    };
    return (
        <div onClick={() => onClick(name)}>
            <DropdownItem {...menu[0]} onClick={handleChooseMenuItem} />
            {isFocus &&
                menu
                    .slice(1)
                    .map((menuItem, index) => (
                        <DropdownItem
                            key={index}
                            {...menuItem}
                            active={activeMenuItem === menuItem.value}
                            onClick={handleChooseMenuItem}
                        />
                    ))}
        </div>
    );
}

interface DropdownItemProps extends SubDropDownMenu {
    active?: boolean;
    onClick: (name: string) => void;
}

function DropdownItem({ active = false, icon, iconColor, title, value, onClick }: DropdownItemProps) {
    let _iconColor = '';
    switch (iconColor) {
        case 'blue':
            _iconColor = 'text-blue-500';
            break;
        case 'green':
            _iconColor = 'text-green-500';
            break;
        case 'indigo':
            _iconColor = 'text-indigo-500';
            break;
        case 'orange':
            _iconColor = 'text-orange-500';
            break;
        case 'purple':
            _iconColor = 'text-purple-500';
            break;
        case 'red':
            _iconColor = 'text-red-500';
            break;
        case 'yellow':
            _iconColor = 'text-yellow-500';
            break;
    }

    return (
        <div className="mb-3 flex w-72 cursor-pointer items-center" onClick={() => onClick(value)}>
            <div className={`w-1/4 text-3xl ${_iconColor}`}>{icon}</div>
            <p className={`w-3/4 ${active && 'text-primary'}`}>{title}</p>
        </div>
    );
}

export { DropdownMenu, DropdownItem };
