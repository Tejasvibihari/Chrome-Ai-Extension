export const startLoadingMessages = (setLoadingMessage, intervalTime = 3000) => {
    const messages = [
        'Preparing your insights...',
        'Unveiling patterns...',
        'Crafting a thoughtful response...',
        'Almost there, perfection takes time...'
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
        setLoadingMessage(messages[messageIndex]);
        messageIndex = (messageIndex + 1) % messages.length;
    }, intervalTime);

    return interval; // Return the interval ID so it can be cleared if needed
};