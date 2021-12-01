import { Request, Response } from "express";
import knex from "../../database";

class BranchType {
  async list(request: Request, response: Response){
    const {idtipofilial} = request.params
    const req = knex('tipofilial').select('*').orderBy(2)
    if(idtipofilial){
      req.where({idtipofilial})
    }
    req.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao} = request.body
    await knex('tipofilial').insert({descricao}).returning('idtipofilial')
      .then(data => response.json({idfilial: data[0], message:"Tipo incluído com sucesso!"}))
      .catch(e => response.status(400).json({message: 'Erro ao cadastrar tipo filial', e}))
  }

  async update(request: Request, response: Response){
    const {idtipofilial} = request.params
    const {descricao} = request.body
    await knex('tipofilial').update({descricao}).where({idtipofilial})
      .then(data => response.json({ message:"Tipo alterado com sucesso!"}))
      .catch(e => response.status(400).json({message: 'Erro ao alterar tipo filial', e}))
  }

  async delete(request: Request, response: Response){
    response.status(400).json({message: 'Opção inválida'})    
  }
}

module.exports = new BranchType()