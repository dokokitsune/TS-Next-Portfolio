'use client'

import { motion } from "framer-motion"
import styles from "../home.module.css"

export default function Transitions({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <motion.div 
        initial={{x:50, opacity: 0}}
        animate={{x:0, opacity:1}}
        transition={{ease: "easeOut", duration: "0.75"}}
        >
            {children}
        </motion.div>
    )
}