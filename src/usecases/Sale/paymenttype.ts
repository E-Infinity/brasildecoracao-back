import { Request, Response } from "express";
import knex from "../../database";

class PaymentType {
  async list(request: Request, response: Response){
    const {idtipopagamento} = request.params
    const req = knex('tipopagamento').select('*')
    if(idtipopagamento){
      req.where({idtipopagamento})
    }
    req.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao} = request.body
    await knex('tipopagamento').insert({descricao}).returning('idtipopagamento')
      .then(data => response.json({message: 'Tipo de pagamento incluido com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao incluir Tipo de pagamento', e}))
  }

  async update(request: Request, response: Response){
    const {idtipopagamento} = request.params
    const {descricao} = request.body
    await knex('tipopagamento').update({descricao}).where({idtipopagamento})
      .then(data => response.json({message: 'Tipo de pagamento alterado com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao alterar Tipo de pagamento'}))
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new PaymentType()