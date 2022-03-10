import { Request, Response } from "express";
import knex from "../../database";

class ProductionTrama {
  async list(request: Request, response: Response){
    const {idproducaotrama} = request.params
    const sql = knex('producaotrama').select(knex.raw('idproducaotrama as id'),'*')
      if(idproducaotrama){
        sql.where({idproducaotrama})
      }
      sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {idusuarioinclusao,idusuario,dataproducao,idprodutograde,quantidade,iditempedidovenda,idfilial, estoque} = request.body
    await knex('producaotrama').insert({idusuarioinclusao,idusuario,dataproducao,idprodutograde,quantidade,iditempedidovenda}).returning('idproducaotrama')
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