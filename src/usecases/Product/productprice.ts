import { Request, Response } from "express";
import knex from "../../database";

class ProductPrice {
  async list(request: Request, response: Response){
    const {idproduto} = request.params
    const sql = knex('produtovalor as pg').select('pg.*', knex.raw(`
        p.descricao as produto_desc,
        t.descricao as trama_desc,
        a.descricao as coraluminio_desc
      `))
      .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
      .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
      .leftJoin('coraluminio as a', 'a.idcoraluminio', 'pg.idcoraluminio')
      if(idproduto){
        sql.where('pg.idproduto', idproduto)
      }
      sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {idproduto,idtrama, idcoraluminio, custo, valor} = request.body
    await knex('produtovalor').insert({idproduto,idtrama, idcoraluminio, custo, valor})
      .then(data => response.json({message:"Preço incluído com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao cadastrar Preço", e}))
  }

  async update(request: Request, response: Response){
    const {idprodutovalor} = request.params
    const {custo, valor} = request.body
    await knex('produtovalor').update({custo,valor}).where({idprodutovalor})
      .then(data => response.json({message: 'Valor alterado com suesso'}))
      .catch(e => response.status(400).json({message: "Erro ao alterar Preço", e}))
  }
}

module.exports = new ProductPrice()