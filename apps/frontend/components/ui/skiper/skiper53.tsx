"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const HoverExpand_002 = ({
    images,
}: {
    images: { src: string; alt: string; code: string }[];
}) => {
    const [activeImage, setActiveImage] = useState<number | null>(0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative w-full max-w-md sm:max-w-xl mx-auto px-2"
        >
            <div className="flex w-full flex-col gap-2">
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        className="relative border border-[#171717] w-full overflow-hidden rounded-2xl cursor-pointer"
                        initial={false}
                        animate={{
                            height:
                                activeImage === index
                                    ? "14rem" // mobile expanded
                                    : "3rem", // collapsed
                        }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        onClick={() => setActiveImage(index)}
                    >
                        {/* Image */}
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        {/* Overlay */}
                        <AnimatePresence>
                            {activeImage === index && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 12 }}
                                        className="absolute bottom-0 left-0 w-full px-4 pb-3"
                                    >
                                        <p className="text-xs text-white/70">
                                            {image.code}
                                        </p>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export { HoverExpand_002 };
