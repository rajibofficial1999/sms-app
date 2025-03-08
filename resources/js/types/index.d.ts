export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    chatLists: Conversation[];
    conversation: Conversation;
    messages: Message[];
    subscription: Subscription;
    periods: Period[];
    paymentMethods: PaymentMethod[];
    package: {
        period: PeriodValue;
        price: number;
    };
};
