
export function isLoggedIn(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send({ message: "Not logged in" });
    }
    next();
}

export function isAdmin(req, res, next) {
    isLoggedIn(req, res, () => {
        if (req.session.user.role !== "ADMIN") {
            return res.status(403).send({ message: "Admin required" });
        }
        next();
    });
}