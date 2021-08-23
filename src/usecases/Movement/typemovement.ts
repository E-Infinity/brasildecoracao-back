import { Request, Response } from "express";
import knex from "../../database";

class TypeMovement {
  async list(request: Request, response: Response){
    const {idtipomovimentacao} = request.params
    const sql = knex('tipomovimentacao').select('*')
    if(idtipomovimentacao){
      sql.where({idtipomovimentacao})
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

module.exports = new TypeMovement()