import { Request, Response } from "express";
import knex from "../../database";

class Product {
  async list(request: Request, response: Response){
    const {idproduto} = request.params
    const sql = knex('produto').select('*')
    if(idproduto){
      sql.where({idproduto})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {descricao, ncm, altura, largura, profundidade, peso, personalizar } = request.body
    await knex('produto').insert({descricao, ncm, altura, largura, profundidade, peso, personalizar}).returning('idproduto')
      .then(data => response.json({idproduto: data[0], message:"Produto incluída com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao cadastrar produto", e}))
  }

  async update(request: Request, response: Response){
    const {idproduto} = request.params
    const {descricao, ncm, altura, largura, profundidade, peso, personalizar, ativo} = request.body
    await knex('produto').update({descricao, ncm, altura, largura, profundidade, peso, personalizar,ativo})
      .where({idproduto})
      .then(data => response.json({message:"Produto alterada com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao alterar produto", e}))
  }
}

module.exports = new Product()