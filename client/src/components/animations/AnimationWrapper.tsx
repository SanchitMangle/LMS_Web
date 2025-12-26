import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimationProps {
    children: ReactNode
    delay?: number
    className?: string
    duration?: number
}

export const FadeIn = ({ children, delay = 0, className, duration = 0.5 }: AnimationProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
)

export const SlideUp = ({ children, delay = 0, className, duration = 0.5 }: AnimationProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
)

export const StaggerContainer = ({ children, className, delay = 0 }: AnimationProps) => (
    <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
            hidden: {},
            show: {
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: delay
                }
            }
        }}
        className={className}
    >
        {children}
    </motion.div>
)

export const StaggerItem = ({ children, className }: { children: ReactNode, className?: string }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
        }}
        className={className}
    >
        {children}
    </motion.div>
)
