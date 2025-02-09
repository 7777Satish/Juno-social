import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    if(!req.cookies.jwtToken) return res.redirect('/login');
    jwt.verify(req.cookies.jwtToken, process.env.JWT_SECRET_KEY, (err, user)=>{
        if(err) return res.redirect('/login');
        req.user = user;
        next();
    })
}

export default authMiddleware;