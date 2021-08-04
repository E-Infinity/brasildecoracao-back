import { Request, Response } from "express";
import knex from "../../database";

class ColorFibra {
  async list(request: Request, response: Response){
    const {idcorfibra} = request.params
    const sql = knex('corfibra').select(knex.raw('row_number() OVER () as id'),'*')
    if(idcorfibra){
      sql.where({idcorfibra})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao} = request.body
    await knex('corfibra').insert({descricao}).returning('idcorfibra')
      .then(data => response.json({idcorfibra: data[0], message:"corfibra incluída com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao cadastrar corfibra", e}))
  }

  async update(request: Request, response: Response){
    const {idcorfibra} = request.params
    const {descricao} = request.body
    await knex('corfibra').update({descricao})
      .where({idcorfibra})
      .then(data => response.json({message:"corfibra alterada com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao alterar corfibra", e}))
  }
}

module.exports = new ColorFibra()