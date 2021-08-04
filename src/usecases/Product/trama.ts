import { Request, Response } from "express";
import knex from "../../database";

class Trama {
  async list(request: Request, response: Response){
    const {idtrama} = request.params
    const sql = knex('trama').select(knex.raw('row_number as id'),'*')
    if(idtrama){
      sql.where({idtrama})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao} = request.body
    await knex('trama').insert({descricao}).returning('idtrama')
      .then(data => response.json({idtrama: data[0], message:"Trama incluída com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao cadastrar trama", e}))
  }

  async update(request: Request, response: Response){
    const {idtrama} = request.params
    const {descricao} = request.body
    await knex('trama').update({descricao})
      .where({idtrama})
      .then(data => response.json({message:"Trama alterada com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao alterar trama", e}))
  }
}

module.exports = new Trama()