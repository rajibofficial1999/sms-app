import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { AxiosInstance } from "axios";
import { route as ziggyRoute } from "ziggy-js";
import { PageProps as AppPageProps } from "./";
import { LucideIcon } from "lucide-react";

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    interface User {
        id: number;
        name: string;
        email: string;
        email_verified_at?: string;
        subscription: Subscription;
        phone_numbers: PhoneNumber;
        conversations: Conversation[];
        created_at: string;
        updated_at: string;
    }

    interface SidebarOption {
        id: number;
        name: string;
        href: string;
        Icon: LucideIcon;
    }

    interface PhoneNumber {
        id: number;
        number: string;
        user_id: number;
        created_at: string;
        updated_at: string;
    }

    interface Conversation {
        id: number;
        local_number: number;
        traffic_number: string;
        last_message_id: number;
        last_message: Message;
        avatar_color: string;
        created_at: string;
        updated_at: string;
        messages: Message[];
    }

    interface Message {
        id: number;
        body: string;
        conversation_id: number;
        sender_number: string;
        created_at: string;
        updated_at: string;
        image: Image;
    }

    interface Image {
        id: number;
        image_url: string;
        message_id: number;
        created_at: string;
        updated_at: string;
    }

    interface Subscription {
        id: number;
        user_id: number;
        user: User;
        has_subscription: boolean;
        expired_at: string;
        is_expired: boolean;
    }

    interface BreadcrumbItem {
        name: string;
        href?: string;
    }

    /* eslint-disable no-var */
    var route: typeof ziggyRoute;
}

declare module "@inertiajs/core" {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
