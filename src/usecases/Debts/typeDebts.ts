import { Request, Response } from "express";
import knex from "../../database";

class TypeDebts {
  async list(request: Request, response: Response){
    const {idtipoconta} = request.params
    const sql = knex('tipocontaspagar').select('*')
    if(idtipoconta){
      sql.where({idtipoconta})
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

module.exports = new TypeDebts()