import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground py-4" aria-label="Breadcrumb">
            {items.map((item, index) => (
                <div key={item.label} className="flex items-center">
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground">{item.label}</span>
                    )}
                    {index < items.length - 1 && (
                        <ChevronRight className="w-4 h-4 mx-2" />
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;