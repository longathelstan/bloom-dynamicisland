"use client";

import { type ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type DynamicIslandState =
  | "idle"
  | "enabled"
  | "disabled"
  | "expanded"
  | "info";

export type DynamicIslandVariant =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "info";

export interface DynamicIslandProps {
  state?: DynamicIslandState;
  variant?: DynamicIslandVariant;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

// Animation variants for different states
const variants = {
  idle: {
    width: 120,
    height: 36,
    borderRadius: 20,
  },
  enabled: {
    width: 320,
    height: 42,
    borderRadius: 20,
  },
  disabled: {
    width: 320,
    height: 42,
    borderRadius: 20,
  },
  expanded: {
    width: 380,
    height: 100,
    borderRadius: 24,
  },
  info: {
    width: 340,
    height: 42,
    borderRadius: 20,
  },
};

// Inner content animation variants
const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.1 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

// Icon animation variants
const iconVariants = {
  idle: { scale: 1 },
  enabled: { scale: [1, 1.2, 1], transition: { duration: 0.4 } },
  disabled: { scale: [1, 0.8, 1], transition: { duration: 0.4 } },
};

const variantColors = {
  default: "bg-zinc-900/95 backdrop-blur-md",
  success: "bg-zinc-900/95 backdrop-blur-md",
  danger: "bg-zinc-900/95 backdrop-blur-md",
  warning: "bg-zinc-900/95 backdrop-blur-md",
  info: "bg-zinc-900/95 backdrop-blur-md",
};

const variantTextColors = {
  default: "text-white",
  success: "text-green-400",
  danger: "text-red-400",
  warning: "text-yellow-400",
  info: "text-blue-400",
};

export default function DynamicIsland({
  state = "idle",
  variant = "default",
  icon,
  title,
  subtitle,
  children,
  duration = 3000,
  onComplete,
  className,
}: DynamicIslandProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (state !== "idle" && duration > 0) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [state, duration]);

  const handleAnimationComplete = () => {
    if (!isVisible && onComplete) {
      onComplete();
    }
  };

  // Fast animation for expansion and contraction
  const transitionProps: MotionProps["transition"] = {
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 1,
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          initial={variants.idle}
          animate={variants[state]}
          exit={variants.idle}
          transition={transitionProps}
          className={cn(
            "relative overflow-hidden shadow-xl border border-white/10",
            variantColors[variant],
            className
          )}
        >
          <div className="h-full w-full flex items-center justify-start p-2 px-3">
            {state === "idle" ? (
              <div className="flex items-center justify-center w-full">
                <motion.div
                  variants={iconVariants}
                  initial="idle"
                  animate="idle"
                >
                  {icon}
                </motion.div>
              </div>
            ) : state === "expanded" ? (
              <motion.div
                className="flex flex-col w-full h-full p-1 space-y-2"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="flex items-center space-x-2">
                  {icon && (
                    <motion.div
                      className="flex-shrink-0"
                      variants={iconVariants}
                      initial="idle"
                      animate={state}
                    >
                      {icon}
                    </motion.div>
                  )}
                  <div className="flex-1">
                    {title && (
                      <h3 className={cn("font-semibold", variantTextColors[variant])}>{title}</h3>
                    )}
                    {subtitle && (
                      <p className="text-sm text-zinc-400">{subtitle}</p>
                    )}
                  </div>
                </div>
                <div className="flex-1">{children}</div>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center space-x-3 w-full"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {icon && (
                  <motion.div
                    className="flex-shrink-0"
                    variants={iconVariants}
                    initial="idle"
                    animate={state}
                  >
                    {icon}
                  </motion.div>
                )}
                <div className="flex-1">
                  {title && (
                    <h3 className={cn("font-semibold", variantTextColors[variant])}>{title}</h3>
                  )}
                  {subtitle && (
                    <p className="text-sm text-zinc-400">{subtitle}</p>
                  )}
                </div>
                {state === "enabled" && (
                  <motion.span
                    className="text-sm font-medium text-green-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    Enabled!
                  </motion.span>
                )}
                {state === "disabled" && (
                  <motion.span
                    className="text-sm font-medium text-red-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    Disabled!
                  </motion.span>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
