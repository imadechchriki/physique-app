const getImagePrefix = () => {
    return process.env.NODE_ENV === "production"
        ? "/E-learning/"
        : "";
};

export { getImagePrefix };