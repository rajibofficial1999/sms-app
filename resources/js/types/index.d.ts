export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
        admin: Admin;
    };
    chatLists: ChatList[];
    conversation: Conversation;
    messages: any;
    subscription: Subscription;
    periods: Period[];
    package: {
        period: PeriodValue;
        price: number;
    };
    accountTypes: string[];
    orders: any;
    statuses: Status[];
    roles: Role[];
    permissions: Permission[];
    success: {
        message: string;
    };
    paymentMethods: PaymentMethod[];
    paymentMethod: PaymentMethod;
    userPhoneNumber: PhoneNumber | null;
    phoneNumbers: PhoneNumber[];
    users: User[];
    messageCharts: MessageChart[];
    totalMessagesChart: TotalMessagesChart[];
    trafficCharts: TrafficChart[];
    totalTrafficsChart: TotalTrafficsChart[];
    blockLists: BlockList[];
    admins: any;
    role_names: string[];
    admin: Admin;
};
