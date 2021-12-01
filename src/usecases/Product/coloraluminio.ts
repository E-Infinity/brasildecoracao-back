import { Request, Response } from "express";
import knex from "../../database";

class ColorAluminio {
  async list(request: Request, response: Response){
    const {idcoraluminio} = request.params
    const sql = knex('coraluminio').select(knex.raw('idcoraluminio as id'),'*')
    if(idcoraluminio){
      sql.where({idcoraluminio})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao} = request.body
    await knex('coraluminio').insert({descricao}).returning('idcoraluminio')
      .then(data => response.json({idcoraluminio: data[0], message:"coraluminio incluída com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao cadastrar coraluminio", e}))
  }

  async update(request: Request, response: Response){
    const {idcoraluminio} = request.params
    const {descricao} = request.body
    await knex('coraluminio').update({descricao})
      .where({idcoraluminio})
      .then(data => response.json({message:"coraluminio alterada com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao alterar coraluminio", e}))
  }
}

module.exports = new ColorAluminio()