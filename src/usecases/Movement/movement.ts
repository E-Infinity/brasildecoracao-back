import { Request, Response } from "express";
import knex from "../../database";

class Movement {
  async list(request: Request, response: Response){
    const {idmovimentacao} = request.params
    const sql = knex('movimentacao as m ').select(knex.raw(`
      m.*,
      u.nome as nome_usuario,
      tm.descricao as tipomovimentacao_desc,
      p.descricao as produto,
      ca.descricao as coraluminio,
      t.descricao as trama,
      cf.descricao as corfibra
    `))
    .leftJoin('usuario as u', 'm.idusuario', 'u.idusuario')
    .leftJoin('tipomovimentacao as tm', 'tm.idtipomovimentacao', 'm.idtipomovimento')
    .leftJoin('produtograde as pg', 'pg.idprodutograde', 'm.idprodutograde')
    .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
    .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
    .leftJoin('corfibra as cf', 'cf.idcorfibra', 'pg.idcorfibra')
    .leftJoin('coraluminio as ca', 'ca.idcoraluminio', 'pg.idcoraluminio')
    if(idmovimentacao){
      sql.where('m.idmovimentacao', idmovimentacao)
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {idfilial, idprodutograde, quantidade, idusuario, idtipomovimento} = request.body
    await knex('movimentacao').insert({idfilial, idprodutograde, quantidade, idusuario, idtipomovimento})
      .returning('idmovimentacao')
      .then(data => response.json({idmovimentacao: data[0],message: 'Inclusão realizada com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao incluir', e}))
  }

  async update(request: Request, response: Response){
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new Movement()