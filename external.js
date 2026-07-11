function startSessionTimeout(userId, type, mess) {
    setTimeout(async () => {
        const s = sessions.get(userId);

        if (
            s &&
            s.type === type &&
            Date.now() - s.createdAt >= TimeOut - 1000
        ) {
            sessions.delete(userId);
            await reply(mess, "⏰ Request timed out.");
        }
    }, TimeOut);
}

module.exports = {startSessionTimeout}