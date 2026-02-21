
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PresaleInterface } from "@/components/token/PresaleInterface";
import { motion } from "framer-motion";

interface PresalePopupProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function PresalePopup({ isOpen, setIsOpen }: PresalePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative rounded-lg overflow-hidden border border-primary/20"
        >
          {/* This div creates the see-through video effect */}
          <div className="absolute inset-0 w-full h-full bg-black/70 backdrop-blur-xl z-0" />
          
          {/* The content is placed in a relative container on top */}
          <div className="relative z-10">
            <PresaleInterface />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
