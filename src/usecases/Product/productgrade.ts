import { Request, Response } from "express";
import knex from "../../database";

class ProductGrade {
  async listOne(request: Request, response: Response){
    const {idprodutograde} = request.params
    await knex('produtograde as pg').select('pg.*', knex.raw(`
        p.descricao as produto_desc, 
        t.descricao as trama_desc,
        a.descricao as coraluminio_desc
      `))
      .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
      .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
      .leftJoin('corfibra as c', 'c.idcorfibra', 'pg.idcorfibra')
      .leftJoin('coraluminio as a', 'a.idcoraluminio', 'pg.idcoraluminio')
      .then(data => response.json(data))
  }

  async list(request: Request, response: Response){
    const {idproduto} = request.params
    const sql = knex('produtograde as pg').select('pg.*', knex.raw(`
        p.descricao as produto_desc,
        c.descricao as corfibra_desc, 
        t.descricao as trama_desc,
        a.descricao as coraluminio_desc
      `))
      .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
      .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
      .leftJoin('corfibra as c', 'c.idcorfibra', 'pg.idcorfibra')
      .leftJoin('coraluminio as a', 'a.idcoraluminio', 'pg.idcoraluminio')
      if(idproduto){
        sql.where('pg.idproduto', idproduto)
      }
      sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {idproduto,idcorfibra,idtrama, idcoraluminio} = request.body
    await knex('produtograde').insert({idproduto,idcorfibra,idtrama, idcoraluminio})
      .then(data => response.json({message:"Produto Grade incluída com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao cadastrar produto grade", e}))
  }
}

module.exports = new ProductGrade()