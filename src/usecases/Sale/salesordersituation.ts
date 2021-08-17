import { Request, Response } from "express";
import knex from "../../database";

class SalesOrderSituation {
  async list(request: Request, response: Response){
    const {idsituacaopedidovenda} = request.params
    const req = knex('situacaopedidovenda').select('*')
    if(idsituacaopedidovenda){
      req.where({idsituacaopedidovenda})
    }
    req.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao} = request.body
    await knex('situacaopedidovenda').insert({descricao}).returning('idsituacaopedidovenda')
      .then(data => response.json({message: 'Situação pedido venda incluido com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao incluir situação pedido venda', e}))
  }

  async update(request: Request, response: Response){
    const {idsituacaopedidovenda} = request.params
    const {descricao} = request.body
    await knex('situacaopedidovenda').update({descricao}).where({idsituacaopedidovenda})
      .then(data => response.json({message: 'Situação pedido venda alterado com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao alterar situação pedido venda'}))
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new SalesOrderSituation()