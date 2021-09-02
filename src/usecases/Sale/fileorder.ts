import { Request, Response } from "express";
import knex from "../../database";

class FileOrder {
  async list(request: Request, response: Response){
    const {idpedidovenda} = request.params
    const sql = knex('arquivos').select('*')
    if(idpedidovenda){
      sql.where({idpedidovenda})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const { nome, idpedidovenda, arquivo, tipo } = request.body
    await knex('arquivos').insert({nome, idpedidovenda, arquivo, tipo})
      .then(() => response.json({message: 'Arquivo incluido com sucesso.'}))
      .catch(() => response.status(400).json({message: 'Erro ao incluir arquivo.'}))
  }

  async update(request: Request, response: Response){
  }

  async delete(request: Request, response: Response){
    const { idarquivos } = request.params
    await knex('arquivos').delete().where({idarquivos})
      .then(() => response.json({message: 'Arquivo excluido com sucesso.'}))
      .catch(() => response.status(400).json({message: 'Erro ao excluir arquivo.'}))
  }
}

module.exports = new FileOrder()