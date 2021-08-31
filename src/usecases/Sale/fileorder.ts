import { Request, Response } from "express";
import knex from "../../database";

class FileOrder {
  async list(request: Request, response: Response){
    const {idpedidovenda} = request.params
    const sql = knex('arquivos').select('*')
    if(idpedidovenda){
      sql.where({idpedidovenda})
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

module.exports = new FileOrder()