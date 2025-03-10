// src/components/sistema/breadcrumbs/Breadcrumb.tsx
import { useRouter } from "next/navigation";
import React from "react";
import { AppIcons } from "@/utils/icons";

export interface BreadcrumbItem {
    name: string;
    path: string;
    icon?: React.ReactNode;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    className = ""
}) => {
    const router = useRouter();
    const FolderIcon = AppIcons.Document;

    return (
        <div className={`text-sm breadcrumbs self-start max-sm:hidden ${className}`}>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <a
                            onClick={() => router.push(item.path)}
                            className="cursor-pointer hover:underline inline-flex items-center gap-2"
                        >
                            {item.icon || <FolderIcon className="w-4 h-4 stroke-current" />}
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

