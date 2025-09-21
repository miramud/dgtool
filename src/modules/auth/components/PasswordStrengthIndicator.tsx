import { CircleCheck, CircleX } from "lucide-react";
import { passwordStrengthLabels } from "../lib/constants";

export default function PasswordStrengthIndicator({
    requirements,
}: {
    requirements: any;
}) {
    return (
        <div className="space-y-2">
            <h3 className="text-[#0E0F10] font-semibold text-sm">
                Your password must contain:
            </h3>
            <ul className="space-y-2 text-[12px]">
                {passwordStrengthLabels.map(({ label, name }) => {
                    const isTrue = requirements[name];

                    return (
                        <li
                            key={name}
                            className={`flex items-center gap-2 ${
                                isTrue ? "text-green-500" : "text-red-500"
                            }`}
                        >
                            {isTrue ? (
                                <CircleCheck size={12} />
                            ) : (
                                <CircleX size={12} />
                            )}
                            {label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
