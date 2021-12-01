require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token']
    if(!token) return res.status(401).json({auth: false, message: 'Token não informado.'})

    jwt.verify(token as string, process.env.JWT_SECRET || '', (err, decoded) => {
        if(err) return res.status(500).json({auth: false, message: 'Falha na autenticação'})

        next()
    })
}

export default verifyJWT