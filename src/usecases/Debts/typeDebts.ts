import { Request, Response } from "express";
import knex from "../../database";

class TypeDebts {
  async list(request: Request, response: Response){
    const {idtipoconta} = request.params
    const sql = knex('tipocontaspagar').select('*')
    if(idtipoconta){
      sql.where('idtipocontaspagar', idtipoconta)
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao} = request.body
    await knex('tipocontaspagar').insert({descricao}).returning('idtipocontaspagar')
      .then(data => response.json({message: `Tipo contas a pagar incluida com sucesso!`, idtipocontaspagar: data[0]}))
      .catch(e => response.json({message: 'Erro ao cadastrar!', erro: e}))
  }

  async update(request: Request, response: Response){
    const {idtipocontaspagar} = request.params
    const {descricao} = request.body
    await knex('tipocontaspagar').update({descricao}).returning('idtipocontaspagar')
      .then(data => response.json({message: `Tipo contas a pagar alterado com sucesso!`, idtipocontaspagar: data[0]}))
      .catch(e => response.json({message: 'Erro ao alterar!', erro: e}))
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new TypeDebts()