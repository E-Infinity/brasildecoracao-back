import { Request, Response } from "express";
import knex from "../../database";
import {Encrypt} from '../../utils'

class User {
  async list(request: Request, response: Response){
    const {idusuario} = request.params
    const sql = knex('usuario').select('idusuario','login',"nome","email",'idtipousuario','ativo')
    if(idusuario){
      sql.where({idusuario})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response) {
    const {login, senha, nome, email, idtipousuario, ativo} = request.body
    await knex('usuario').insert({login, senha: Encrypt('sha1', senha), nome, email, idtipousuario, ativo})
      .returning('idusuario')
    .then(data => response.json({idusuario: data[0], message:"Usuário incluído com sucesso!"}))
    .catch(e => response.status(400).json({message: "Erro ao cadastrar usuário"}))
  }

  async update(request: Request, response: Response){
    const {idusuario} = request.params
    const {login, senha, nome, email, idtipousuario, ativo} = request.body
    await knex('usuario').insert({login, senha: Encrypt('sha1', senha), nome, email, idtipousuario, ativo})
      .returning('idusuario')
      .where({idusuario})
    .then(data => response.json({idusuario: data[0], message:"Usuário incluído com sucesso!"}))
    .catch(e => response.status(400).json({message: "Erro ao cadastrar usuário"}))
  }
}

module.exports = new User();
