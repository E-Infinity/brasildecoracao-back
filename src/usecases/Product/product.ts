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
    const {descricao, codigobarra, altura, largura, profundidade, peso } = request.body
    await knex('produto').insert({descricao, codigobarra, altura, largura, profundidade, peso}).returning('idproduto')
      .then(data => response.json({idproduto: data[0], message:"Produto incluída com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao cadastrar produto", e}))
  }

  async update(request: Request, response: Response){
    const {idproduto} = request.params
    const {descricao, codigobarra, altura, largura, profundidade, peso} = request.body
    await knex('produto').update({descricao, codigobarra, altura, largura, profundidade, peso})
      .where({idproduto})
      .then(data => response.json({message:"Produto alterada com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao alterar produto", e}))
  }
}

module.exports = new Product()