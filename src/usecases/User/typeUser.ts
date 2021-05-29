import { Request, Response } from "express";
import knex from "../../database";

class TypeUser {
  async list(request: Request, response: Response){
    const {idtipousuario} = request.params
    const sql = knex('tipousuario').select('*')
    if(idtipousuario){
      sql.where({idtipousuario})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response) {
    const {descricao, ativo} = request.body
    await knex('tipousuario').insert({descricao, ativo}).returning('idtipousuario')
      .then(data => response.json({idtipousuario: data[0], message:"Tipo usuário incluído com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao cadastrar tipo usuário"}))
  }

  async update(request: Request, response: Response){
    const {idtipousuario} = request.params
    const {descricao, ativo} = request.body
    await knex('tipousuario').update({descricao, ativo})
      .where({idtipousuario})
    .then(data => response.json({message:"Tipo usuário alterado com sucesso!"}))
    .catch(e => response.status(400).json({message: "Erro ao alterar tipo usuário"}))
  }
}

module.exports = new TypeUser()