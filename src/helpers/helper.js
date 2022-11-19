export const getMatchedUserInfo = (users, userLoggedIn) => {
    const newUsers = { ...users };
    delete newUsers[userLoggedIn];

    const [id, user] = Object.entries(newUsers).flat();
    return user;
};
