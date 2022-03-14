import { Request, Response } from "express";
import knex from "../../database";

class ProductionTrama {
  async list(request: Request, response: Response){
    const {idproducaotrama} = request.params
    const {datainicial, datafinal, idusuario} = request.body
    const sql = knex('producaotrama as p').select(knex.raw(`
          p.idproducaotrama as id,
          p.*,
          ui.nome as usuarioinclusao,
          u.nome as usuario,
          pd.descricao||' | Trama: '||t.descricao||' | Aluminio: '||ca.descricao||' | Cor Fibra: '||cf.descricao as produto
          f.descricao as filial
        `))
      .leftJoin('usuario as ui','ui.idusuario','p.idusuarioinclusao')
      .leftJoin('usuario as u','u.idusuario','p.idusuario')
      .leftJoin('produtograde as pg','pg.idprodutograde','p.idprodutograde')
      .leftJoin('produto as pd','pd.idproduto','pg.idproduto')
      .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
      .leftJoin('coraluminio as ca', 'ca.idcoraluminio', 'pg.idcoraluminio')
      .leftJoin('corfibra as cf', 'cf.idcorfibra', 'pg.idcorfibra')
      .leftJoin('filial as f', 'f.idfilial','p.idfilial')
      if(idproducaotrama){
        sql.where('p.idproducaotrama',idproducaotrama)
      }if(idusuario){
        sql.where('p.idusuario',idusuario)
      }if(datainicial && datafinal){
        sql.whereBetween('p.dataproducao',[datainicial,datafinal])
      }
      sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {idusuarioinclusao,idusuario,dataproducao,idprodutograde,quantidade,iditempedidovenda,idfilial, estoque, valor} = request.body
    await knex('producaotrama').insert({idusuarioinclusao,idusuario,dataproducao,idprodutograde,quantidade,iditempedidovenda,idfilial,valor}).returning('idproducaotrama')
      .then(async data => {
        if(estoque === 'true' || estoque == true){
          await knex('movimentacao').insert({idfilial, idprodutograde, quantidade, idusuario: idusuarioinclusao,idtipomovimento: 1})
            .then(() => response.json({idproducaotrama: data[0], message:"Produção de trama incluída com sucesso!"}))
            .catch(async e => {
              await knex('producaotrama').delete().where('idproducaotrama', data[0])
              response.status(400).json({message: "Erro ao cadastrar produção de trama", e})
            })
        }else{
          response.json({idproducaotrama: data[0], message:"Produção de trama incluída com sucesso!"})
        }
      })
      .catch(e => response.status(400).json({message: "Erro ao cadastrar produção de trama", e}))
  }

  async update(request: Request, response: Response){
    const {idproducaotrama} = request.params
    const {idusuarioinclusao,idusuario,dataproducao,idprodutograde,quantidade,iditempedidovenda} = request.body
    await knex('producaotrama').update({idusuario,dataproducao})
      .where({idproducaotrama})
      .then(data => response.json({message:"Produção de trama alterada com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao alterar proução de trama", e}))
  }
}

module.exports = new ProductionTrama()