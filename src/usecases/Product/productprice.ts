import { Request, Response } from "express";
import knex from "../../database";

class ProductPrice {
  async list(request: Request, response: Response){
    const {idproduto} = request.params
    const sql = knex('produtovalor as pg').select('pg.*', knex.raw(`
        p.descricao as produto_desc,
        t.descricao as trama_desc
      `))
      .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
      .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
      if(idproduto){
        sql.where('pg.idproduto', idproduto)
      }
      sql.then(data => response.json(data))
  }

  async listGrade(request: Request, response: Response){
    const {idproduto} = request.params
    await knex('produtograde as pg').select(knex.raw(`
      pg.*,
      p.descricao as produto,
      ca.descricao as coraluminio,
      t.descricao as trama,
      cf.descricao as corfibra,
      pv.custo,
      pv.valor
    `))
    .innerJoin('produtovalor as pv ', knex.raw(`pv.idproduto = pg.idproduto 
      and pv.idtrama = pg.idtrama`))
    .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
    .leftJoin('coraluminio as ca', 'ca.idcoraluminio', 'pg.idcoraluminio')
    .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
    .leftJoin('corfibra as cf', 'cf.idcorfibra', 'pg.idcorfibra')
    .where('pg.idproduto',idproduto)
    .then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {idproduto,idtrama, custo, valor} = request.body
    await knex('produtovalor').insert({idproduto,idtrama, custo, valor})
      .then(data => response.json({message:"Preço incluído com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao cadastrar Preço", e}))
  }

  async update(request: Request, response: Response){
    const {idprodutovalor} = request.params
    const {custo, valor,idtrama} = request.body
    await knex('produtovalor').update({custo,valor,idtrama}).where({idprodutovalor})
      .then(data => response.json({message: 'Valor alterado com suesso'}))
      .catch(e => response.status(400).json({message: "Erro ao alterar Preço", e}))
  }
}

module.exports = new ProductPrice()