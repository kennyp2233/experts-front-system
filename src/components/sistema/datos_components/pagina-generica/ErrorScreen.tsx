import React from "react";
import { motion } from "framer-motion";
import { ExclamationIcon, RefreshIcon } from "@heroicons/react/solid";
import { InformationCircleIcon } from "@heroicons/react/outline";

interface ErrorScreenProps {
    title: string;
    message: string;
    type: "error" | "warning";
    onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ title, message, type, onRetry }) => {
    const Icon = type === "error" ? ExclamationIcon : InformationCircleIcon;
    const bgColor = type === "error" ? "bg-error" : "bg-warning";
    const textColor = type === "error" ? "text-error-content" : "text-warning-content";
    const buttonColor = type === "error" ? "btn-error" : "btn-warning";
    const buttonText = type === "error" ? "Recargar" : "Intentar de nuevo";

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
            <div className="card w-full max-w-lg shadow-xl bg-base-100 p-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.02] }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.2,
                    }}
                    className={`mx-auto w-24 h-24 ${bgColor} text-center rounded-full flex items-center justify-center mb-4`}
                >
                    <Icon className={`h-12 w-12 ${textColor}`} aria-hidden="true" />
                </motion.div>
                <div className="card-body text-center">
                    <h1 className={`text-3xl font-bold ${textColor} mb-2`}>{title}</h1>
                    <p className={`text-lg ${textColor} mb-4`}>
                        {message.split("\n").map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>
                    <button
                        onClick={onRetry}
                        className={`btn ${buttonColor} btn-outline flex items-center justify-center`}
                    >
                        <RefreshIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};