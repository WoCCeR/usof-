class User {
    getDto(rows) {
        let users = [];

        rows.forEach((record, index) => {
            users[index] = {
                id: record.id,
                login: record.login,
                fullName: record.fullName,
                profilePicture: record.profilePicture,
                rating: record.rating,
                roles: record.roles,
                email: record.email
            };
        });

        return users;
    }
}

export default new User();