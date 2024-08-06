export type DropdownMenu = DropdownMenuItem[];

export type DropdownMenuItem = {
    name: string;
    menu: SubDropDownMenu[];
};

export type SubDropDownMenu = {
    title: string;
    icon?: React.ReactNode;
    iconColor?: 'blue' | 'orange' | 'red' | 'yellow' | 'indigo' | 'purple' | 'green';
    value: string;
};
