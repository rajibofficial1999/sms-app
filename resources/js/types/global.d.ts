import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { AxiosInstance } from "axios";
import { route as ziggyRoute } from "ziggy-js";
import { PageProps as AppPageProps } from "./";
import { LucideIcon } from "lucide-react";

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    type PeriodValue = "monthly" | "weekly" | "yearly";
    type Status = "pending" | "completed" | "rejected";

    interface Period {
        value: PeriodValue;
        price: number;
    }

    interface PricingFeature {
        text: string;
        negetive: boolean;
    }

    interface User {
        id: number;
        name: string;
        email: string;
        email_verified_at?: string;
        subscription: Subscription;
        phone_numbers: PhoneNumber;
        avatar: string | null;
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
        local_number: string;
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

    interface PaymentMethod {
        id: number;
        type: string;
        account_number: number;
        account_type: string;
        logo: string;
        status: boolean;
    }

    interface Order {
        id: number;
        user_id: number;
        user?: User;
        payment_method_id: number;
        payment_method?: PaymentMethod;
        account_holder_name: string;
        period: string;
        created_at: Date;
        updated_at: Date;
        payment_screenshot: string;
        status: Status;
        created_at: Date;
        updated_at: Date;
    }

    interface Subscription {
        id: number;
        user_id: number;
        user?: User;
        has_subscription: boolean;
        expired_at: string;
        is_expired: boolean;
        period: string;
        status: Status;
        payment_method_id: number;
        payment_method?: PaymentMethod;
    }

    interface BreadcrumbItem {
        name: string;
        href?: string;
    }

    interface Role {
        id: number;
        name: string;
    }

    interface Permission {
        id: number;
        name: string;
    }

    /* eslint-disable no-var */
    var route: typeof ziggyRoute;
}

declare module "@inertiajs/core" {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
