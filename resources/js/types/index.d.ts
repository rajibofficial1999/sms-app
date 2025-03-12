export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
        admin: Admin;
    };
    chatLists: Conversation[];
    conversation: Conversation;
    messages: Message[];
    subscription: Subscription;
    periods: Period[];
    package: {
        period: PeriodValue;
        price: number;
    };
    accountTypes: string[];
    orders: any;
    roles: Role[];
    permissions: Permission[];
    success: {
        message: string;
    };
    paymentMethods: PaymentMethod[];
    paymentMethod: PaymentMethod;
    userPhoneNumber: PhoneNumber | null;
};
