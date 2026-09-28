module.exports = (data) => {
    if (Array.isArray(data))
        return data.map(({ password, ...rest }) => rest);

    if (data && typeof data === 'object') {
        const { password, ...rest } = data;
        return rest;
    }

    return data;
};
