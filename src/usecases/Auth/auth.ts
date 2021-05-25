import { Request, Response } from "express";
import knex from "../../database";
require("dotenv").config();
import jwt from "jsonwebtoken";
import {Encrypt} from '../../utils'

class Auth {
  async login(request: Request, response: Response) {
    const {login, pass}  = request.body
    const senha =  Encrypt('sha1', pass)
    // try {
    //   await knex('usuario').select('idusuario','login',"nome",'idtipousuario','ativo')
    //     .where({login, senha})
    //   .then((data: any) => {
    //     if(data[0].idusuario){
    //       const token = jwt.sign({id: data.idusuario}, process.env.JWT_SECRET || '', {
    //         expiresIn: '24h'
    //       })
    //       response.json({...data[0], auth: true, token});
    //     }else{
    //       response.status(401).json({message: 'Login inválido'})
    //     }
    //   })
    // .catch(e => response.status(400).json({err: e}))
    // } catch (error) {
    //   response.status(400).json({error})
    // }
    knex.raw("SELECT * from usuario").then( (message) => {
      // Success / boot rest of app
      response.json(message.rows)
    }).catch( (err) => {
      // Failure / timeout
      console.log(err)
      throw err
    })
  }
}

module.exports = new Auth();