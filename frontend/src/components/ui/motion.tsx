"use client"
import React from 'react'
import { motion } from 'framer-motion'

export function MotionFadeIn({ children, delay=0 }: React.PropsWithChildren<{ delay?: number }>) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  )
}

export function MotionStagger({ children }: React.PropsWithChildren) {
  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
      {children}
    </motion.div>
  )
}

export function MotionItem({ children }: React.PropsWithChildren) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
      {children}
    </motion.div>
  )
}