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
};
