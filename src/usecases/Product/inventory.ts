import { Request, Response } from "express";
import knex from "../../database";

class Inventory {
  async list(request: Request, response: Response){
    const {idprodutograde} = request.params
    const sql = knex('estoque as e').select('e.*',knex.raw(`
      f.descricao as filial_desc,
      f.cidade as  filial_cidade,
      f.uf as filial_uf,
      pg.idproduto,
      pg.idcoraluminio,
      pg.idcorfibra,
      pg.idtrama,
      p.descricao as produto,
      ca.descricao as coraluminio,
      t.descricao as trama,
      cf.descricao as corfibra
    `))
    .leftJoin('filial as f', 'f.idfilial','e.idfilial' )
    .leftJoin('produtograde as pg','pg.idprodutograde','e.idprodutograde')
    .leftJoin('produto as p','p.idproduto','pg.idproduto')
    .leftJoin('coraluminio as ca','ca.idcoraluminio','pg.idcoraluminio')
    .leftJoin('trama as t','t.idtrama','pg.idtrama')
    .leftJoin('corfibra as cf','cf.idcorfibra','pg.idcorfibra')
    if(idprodutograde){
      sql.where('e.idprodutograde',idprodutograde)
    }
    sql.then(data => response.json(data))
  }

  async listGrade(request: Request, response: Response){
    const {idprodutograde} = request.params
    await knex('filial as f').select('f.*', knex.raw(`${idprodutograde} as idprodutograde, coalesce(e.quantidade,0) as quantidade`))
      .leftJoin('estoque as e', knex.raw(`e.idfilial = f.idfilial and e.idprodutograde = ${idprodutograde}`))
      .where('f.idtipofilial','=',2)
      .then(data => response.json(data))
  }
}

module.exports = new Inventory()