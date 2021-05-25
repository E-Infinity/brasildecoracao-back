import { Request, Response } from "express";
import knex from "../../database";
require("dotenv").config();
import jwt from "jsonwebtoken";
import {Encrypt} from '../../utils'

class Auth {
  async login(request: Request, response: Response) {
		const {login, pass}  = request.body
    const senha =  Encrypt('sha1', pass)
		await knex('usuario').select('*')
			.where({login, senha}).debug(true)
    .then((data: any) => {
      console.log(data)
      if(data[0].idusuario){
        const token = jwt.sign({id: data.idusuario}, process.env.JWT_SECRET || '', {
          expiresIn: '24h'
        })
        return response.json({...data[0], auth: true, token});
      }
      return response.status(401).json({message: 'Login inválido'})
    })
    .catch(e => response.status(400).json({err: e}))
  }
}

module.exports = new Auth();