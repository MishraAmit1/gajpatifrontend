// SubcategoryListRow.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const SubcategoryListRow = ({
    title,
    description,
    productCount,
    image,
    link,
    keyFeatures = [],
    applications = [],
    specs,
}) => (
    <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3">
        {/* Image */}
        <Link to={link} className="flex-shrink-0 mr-4">
            <img
                src={image}
                alt={title}
                className="w-20 h-20 object-cover rounded-md border"
            />
        </Link>
        {/* Details */}
        <div className="flex-1 min-w-0">
            <Link to={link}>
                <h3 className="text-lg font-semibold mb-1 hover:text-primary transition-colors">
                    {title}
                </h3>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2 line-clamp-2">
                {description}
            </p>
            <div className="flex flex-wrap gap-2">
                {applications.slice(0, 3).map((feature, idx) => (
                    <span
                        key={idx}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium"
                    >
                        {feature}
                    </span>
                ))}
                {applications.length > 3 && (
                    <span className="text-xs text-zinc-400">+{applications.length - 3} more</span>
                )}
            </div>
        </div>
        {/* Product Count & Action */}
        <div className="flex flex-col items-end ml-4 min-w-[120px]">
            <span className="text-xs text-zinc-400 mb-2">
                {productCount} product{productCount !== 1 ? "s" : ""}
            </span>
            <Link
                to={link}
                className="flex items-center text-primary font-medium text-sm hover:text-primary-dark transition-colors"
            >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </div>
    </div>
);