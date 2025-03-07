import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (differenceInMinutes(now, date) < 1) {
        return "now";
    }

    if (isToday(date)) {
        return format(date, "h:mm a"); // 7:27 PM
    }

    if (isYesterday(date)) {
        return "Yesterday";
    }

    if (differenceInMinutes(now, date) < 7 * 24 * 60) {
        return format(date, "EEEE"); // Monday
    }

    return format(date, "MMM d yyyy"); // Dec 24 2025
};
