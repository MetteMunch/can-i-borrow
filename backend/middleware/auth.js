
export function isLoggedIn(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send({ message: "Du er ikke logget ind" });
    }
    next();
}

export function isAdmin(req, res, next) {
    isLoggedIn(req, res, () => {
        if (req.session.user.role !== "ADMIN") {
            return res.status(403).send({ message: "Du skal have admin rettigheder for at tilgå denne side" });
        }
        next();
    });
}