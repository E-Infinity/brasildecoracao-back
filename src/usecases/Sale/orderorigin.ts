import { Request, Response } from "express";
import knex from "../../database";

class OrderOrigin {
  async list(request: Request, response: Response){
    const {idorigempedido} = request.params
    const req = knex('origempedido').select('*')
    if(idorigempedido){
      req.where({idorigempedido})
    }
    req.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao} = request.body
    await knex('origempedido').insert({descricao}).returning('idorigempedido')
      .then(data => response.json({message: 'Origem pedido venda incluido com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao incluir origem pedido venda', e}))
  }

  async update(request: Request, response: Response){
    const {idorigempedido} = request.params
    const {descricao} = request.body
    await knex('origempedido').update({descricao}).where({idorigempedido})
      .then(data => response.json({message: 'Origem pedido venda alterado com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao alterar origem pedido venda'}))
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new OrderOrigin()