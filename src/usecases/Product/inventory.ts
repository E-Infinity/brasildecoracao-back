import { Request, Response } from "express";
import knex from "../../database";

class Inventory {
  async list(request: Request, response: Response){
    const {idproduto} = request.params
    const sql = knex('estoque').select('*')
    if(idproduto){
      sql.where({idproduto})
    }
    sql.then(data => response.json(data))
  }

  async listGrade(request: Request, response: Response){
    const {idprodutograde} = request.params
    const sql = knex('estoque as e').select('e.*','f.descricao as filial_desc')
      .leftJoin('filial as f', 'e.idfilial', 'f.idfilial')
    if(idprodutograde){
      sql.where({idprodutograde})
    }
    sql.then(data => response.json(data))
  }
}

module.exports = new Inventory()