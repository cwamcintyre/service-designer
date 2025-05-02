import { useEffect, useState } from "react";

export default function ActionOverlay({ show, action }: { show: boolean; action: string }) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        if (show) {
            const interval = setInterval(() => {
                setDots((prev) => (prev.length < 3 ? prev + "." : ""));
            }, 500);
            return () => clearInterval(interval);
        } else {
            setDots("");
        }
    }, [show]);

    return (
        <>
            <div
                className="opacity-70 bg-gray-500 absolute inset-0 flex items-center justify-center z-1000"
                style={{ display: show ? "block" : "none" }}
            >
            </div>
            <div
                className="opacity-100 absolute inset-0 flex items-center justify-center w-full h-full z-1001"
                style={{ display: show ? "block" : "none" }}
            >
                <div
                    id="overlay-container"
                    className="bg-white rounded-lg p-4 shadow-lg z-100"
                    style={{
                        position: "absolute",
                        top: "40vh",
                        left: "50vw",
                        display: "inline-block",
                        minWidth: "100px"
                    }}
                >
                    <p style={{ margin: 0 }}>
                        {action}{dots}
                    </p>
                </div>
            </div>
        </>
    );
}