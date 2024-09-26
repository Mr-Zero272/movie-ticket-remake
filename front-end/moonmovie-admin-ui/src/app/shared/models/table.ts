import { TemplateRef } from '@angular/core';

export interface Column {
    label: string;
    key: string;
    template?: TemplateRef<any>;
    templateLoading?: TemplateRef<any>;
}

export interface Sort {
    label: string;
    key: string;
    order: 'desc' | 'asc';
}
