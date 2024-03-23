'use client'

import { motion } from "framer-motion"
import styles from './layout.module.css'

export default function Template({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <motion.div className={styles.scroll}
        
        initial={{x:"100vw", opacity: 0}}
        animate={{x:0, opacity:1}}
        transition={{ease: "easeOut", duration: "0.5"}}
        
        
    
        
        >
            {children}
        </motion.div>
    )
}