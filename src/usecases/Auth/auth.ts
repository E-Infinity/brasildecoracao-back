import { Request, Response } from "express";
import knex from "../../database";
require("dotenv").config();
import jwt from "jsonwebtoken";
import {Encrypt} from '../../utils'

class Auth {
  async login(request: Request, response: Response) {
    try {
      const {login, pass}  = request.body
      const senha =  Encrypt('sha1', pass)
      await knex('usuario').select('*')
        .where({login, senha})
      .then((data: any) => {
        console.log(data)
        if(data[0].idusuario){
          const token = jwt.sign({id: data.idusuario}, process.env.JWT_SECRET || '', {
            expiresIn: '24h'
          })
          response.json({...data[0], auth: true, token});
        }else{
          response.status(401).json({message: 'Login inválido'})
        }
      })
    .catch(e => response.status(400).json({err: e}))
    } catch (error) {
      response.status(400).json({error})
    }
		
  }
}

module.exports = new Auth();