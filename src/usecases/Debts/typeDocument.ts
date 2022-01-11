import { Request, Response } from "express";
import knex from "../../database";

class TypeDocument {
  async list(request: Request, response: Response){
    const {idtipodocumento} = request.params
    const sql = knex('tipodocumento').select('*')
    if(idtipodocumento){
      sql.where({idtipodocumento})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
  }

  async update(request: Request, response: Response){
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new TypeDocument()