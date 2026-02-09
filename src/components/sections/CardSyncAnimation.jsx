import { motion } from "framer-motion";
import { CreditCard, Smartphone, BarChart3 } from "lucide-react";

const CardSyncAnimation = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">

            {/* Debit card */}
            <motion.div
                initial={{ x: -120, opacity: 0 }}
                animate={{ x: -40, opacity: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}
                className="absolute p-4 rounded-xl bg-blue-500/10 border border-blue-400/30 backdrop-blur-md"
            >
                <CreditCard className="w-10 h-10 text-blue-400" />
            </motion.div>

            {/* UPI / phone */}
            <motion.div
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 40, opacity: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}
                className="absolute p-4 rounded-xl bg-green-500/10 border border-green-400/30 backdrop-blur-md"
            >
                <Smartphone className="w-10 h-10 text-green-400" />
            </motion.div>

            {/* Dashboard */}
            <motion.div
                animate={{
                    scale: [1, 1.08, 1],
                    boxShadow: [
                        "0 0 0px rgba(99,102,241,0)",
                        "0 0 30px rgba(99,102,241,0.6)",
                        "0 0 0px rgba(99,102,241,0)"
                    ]
                }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="p-5 rounded-2xl bg-indigo-600/20 border border-indigo-400/30 backdrop-blur-xl"
            >
                <BarChart3 className="w-12 h-12 text-indigo-400" />
            </motion.div>

            {/* Data flow line */}
            <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="absolute w-40 h-[2px] bg-gradient-to-r from-blue-400 via-indigo-400 to-green-400 blur-sm"
            />

        </div>
    );
};

export default CardSyncAnimation;
