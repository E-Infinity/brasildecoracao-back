import { Request, Response } from "express";
import knex from "../../database";

class ParcelSituation {
  async list(request: Request, response: Response){
    const {idsituacaoparcela} = request.params
    const req = knex('situacaoparcela').select('*')
    if(idsituacaoparcela){
      req.where({idsituacaoparcela})
    }
    req.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao} = request.body
    await knex('situacaoparcela').insert({descricao}).returning('idsituacaoparcela')
      .then(data => response.json({message: 'Situacao parcela incluido com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao incluir Situacao parcela', e}))
  }

  async update(request: Request, response: Response){
    const {idsituacaoparcela} = request.params
    const {descricao} = request.body
    await knex('situacaoparcela').update({descricao}).where({idsituacaoparcela})
      .then(data => response.json({message: 'Situacao parcela alterado com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao alterar Situacao parcela'}))
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new ParcelSituation()