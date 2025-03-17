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

    interface AdminPermissions {
        [key: string]: boolean;
    }

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
        phone_number: PhoneNumber;
        avatar: string | null;
        conversations: Conversation[];
        created_at: string;
        updated_at: string;
        status: boolean;
    }

    interface Admin {
        id: number;
        name: string;
        email: string;
        email_verified_at?: string;
        avatar: string | null;
        created_at: string;
        updated_at: string;
        status: boolean;
        roles?: Role[];
        permissions?: Permission[];
        can_only: AdminPermissions;
        is_super_admin: boolean;
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
        user?: User;
        status: boolean;
        created_at: string;
        updated_at: string;
        area_code: number;
    }

    interface BlockList {
        id: number;
        conversation_id: number | null;
        user_id: number;
        blocked_number: string;
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
        is_blocked: boolean;
        messages: Message[];
    }

    interface ChatList extends Conversation {
        unread_messages_count: number;
        last_message_body: string | null;
        last_message_time: string | null;
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
        area_code: Number;
        is_renewal: boolean;
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

    interface MessageChart {
        time: string;
        sent: number;
        received: number;
    }

    interface TrafficChart {
        time: string;
        traffics: number;
    }

    interface TotalMessagesChart {
        name: string;
        messages: number;
        fill?: string;
    }

    interface TotalTrafficsChart {
        name: string;
        traffics: number;
        fill?: string;
    }

    interface AppSetting {
        id: number;
        app_name: string;
        app_logo: string;
        app_description: string;
    }

    interface ServicePrice {
        id: number;
        incoming_sms_price: string;
        outgoing_sms_price: string;
        incoming_mms_price: string;
        outgoing_mms_price: string;
        incoming_call_price: string;
        outgoing_call_price: string;
    }

    /* eslint-disable no-var */
    var route: typeof ziggyRoute;
}

declare module "@inertiajs/core" {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
