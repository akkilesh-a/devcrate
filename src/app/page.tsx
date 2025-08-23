"use client";

import { AnimateIcon, Button } from "@/components/ui";
import { P, CurvedLoop, H1, H4 } from "@/components/typography";
import { motion } from "framer-motion";
import { MoveRight } from "@/components/animated";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Hero Section */}
      <motion.main
        className="container mx-auto pt-20 flex-1 flex flex-col justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center space-y-4 mb-8"
        >
          <H1 className="text-6xl">DevCrate</H1>
          <P variant="muted" className="!text-2xl">
            UI Libraries ✦ Component Libraries ✦ Tools
          </P>
          <Link href="/tools">
            <Button className="flex items-center justify-center space-x-2 px-12 py-6 cursor-target">
              {" "}
              <H4>Get Started</H4>
              <AnimateIcon animateOnHover>
                <MoveRight />
              </AnimateIcon>
            </Button>
          </Link>
        </motion.div>

        <div className="space-y-4">
          <CurvedLoop
            marqueeText="UI Libraries ✦ Component Libraries ✦ Tools ✦ UI Libraries ✦ Component Libraries ✦ Tools ✦"
            speed={2}
            curveAmount={500}
            direction="right"
            interactive={false}
            className="text-5xl"
          />
          <CurvedLoop
            marqueeText="UI Libraries ✦ Component Libraries ✦ Tools ✦ UI Libraries ✦ Component Libraries ✦ Tools ✦"
            speed={3}
            curveAmount={500}
            direction="left"
            interactive={false}
            className="text-6xl text-black dark:text-white"
          />
        </div>
      </motion.main>
    </div>
  );
};

export default HomePage;
