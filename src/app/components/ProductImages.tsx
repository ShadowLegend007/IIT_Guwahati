import { motion } from "motion/react";

interface ProductImagesProps {
    images: string[];
    productName?: string;
}

export function ProductImages({ images, productName }: ProductImagesProps) {
    // Filter out empty strings
    const validImages = images.filter(img => img && img.trim() !== "");

    if (validImages.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/40 border-2 border-border/60 rounded-[28px] p-6 shadow-[0_0_30px_rgba(124,58,237,0.1)]"
        >
            <h3 className="text-3xl font-bold text-accent mb-6 cool-font flex items-center gap-3">
                Product Images
            </h3>
            <div className={`grid gap-4 ${validImages.length === 1 ? 'grid-cols-1 h-full' : validImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                {validImages.map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative rounded-[20px] overflow-hidden bg-background/40 border border-border/50 group ${validImages.length === 1 ? 'h-[250px] w-auto mx-auto aspect-square' : 'aspect-square'}`}
                    >
                        <img
                            src={image}
                            alt={`${productName || "Product"} - Image ${index + 1}`}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                                // Hide image if it fails to load
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
