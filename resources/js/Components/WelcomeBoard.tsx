const WelcomeBoard = () => {
    return (
        <div className="h-screen px-4 flex flex-col justify-center items-center">
            <img src="/images/message.png" alt="message" className="w-32" />
            <h1 className="text-xl font-semibold text-gray-700 text-center">
                Welcome to FriendZone
            </h1>
            <p className="text-gray-500 text-sm text-center mt-2">
                Start messaging by selecting a number.
            </p>
        </div>
    );
};

export default WelcomeBoard;
