import { motion } from "framer-motion";
import { Circle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-primary/[0.08]",
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-primary/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(184,139,106,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(184,139,106,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric() {
    return (
        <section className="relative w-full h-[85vh] flex items-center bg-secondary overflow-hidden">
            {/* Animated Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-primary/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-accent/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-primary/[0.12]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-accent/[0.12]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-primary/[0.1]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            {/* Background Gradient/Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10"></div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {/* Hero Image (Right Side) */}
            <div className="absolute right-0 top-0 w-full md:w-2/3 h-full">
                <img
                    src="https://www.karagiri.com/cdn/shop/files/HDLM-385-PINK-1.jpg?v=1701165334"
                    alt="Luxury Jewellery"
                    className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl"
                >
                    <span className="text-accent tracking-[0.2em] text-sm font-semibold uppercase mb-4 block">New Collection 2024</span>
                    <h1 className="font-serif text-5xl md:text-7xl text-primary leading-tight mb-6">
                        Crafting <br /> <span className="italic font-light">Elegance</span>
                    </h1>
                    <p className="text-text-muted text-lg mb-8 leading-relaxed max-w-md">
                        Discover our exclusive collection of traditional and contemporary jewellery, designed to make every moment special.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                            Shop Now <ArrowRight size={18} />
                        </Link>
                        <Link to="/necklaces" className="border border-primary text-primary px-8 py-3 rounded-full hover:bg-primary/5 transition-all">
                            View Collection
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export { HeroGeometric };
