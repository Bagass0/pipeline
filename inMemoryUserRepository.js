let registeredUsers = [
    { email: 'admin@admin.com', password: 'admin' },
    { email: 'user1@user1.com', password: 'user' }
];

function getRegisteredUsers() {
    return registeredUsers;
}

module.exports = {
    getRegisteredUsers
};
