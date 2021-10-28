import { Request, Response } from "express";
import knex from "../../database";

class SalesOrderItem {
  async list(request: Request, response: Response){
  }

  async register(request: Request, response: Response){
  }

  async update(request: Request, response: Response){
    const {iditempedidovenda} = request.params
    const {montagem,trama,tapearia} = request.body
    await knex('itempedidovenda').update({
      montagem,trama,tapearia
    }).where({iditempedidovenda}).debug(true)
    .then(() => response.json({message: 'Alteração realizada com sucesso!'}))
    .catch((e) => response.status(400).json({message: 'Erro ao realizar alteração!', e}))
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new SalesOrderItem()