import { Request, Response } from "express";
import knex from "../../database";

class Branch {
  async list(request: Request, response: Response){
    const {idfilial} = request.params
    const req = knex('filial as f ').select('f.*','ft.descricao as tipo_desc')
      .leftJoin('tipofilial as ft', 'ft.idtipofilial','f.idtipofilial').where('f.ativo', true)
    if(idfilial){
      req.where('f.idfilial','=',idfilial)
    }
    req.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {cnpj, descricao, cidade, uf, idtipofilial, ativo = true} = request.body
    await knex('filial').insert({cnpj, descricao, cidade, uf, idtipofilial, ativo}).returning('idfilial')
      .then(data => response.json({idfilial: data[0], message:"Filial incluída com sucesso!"}))
      .catch(e => response.status(400).json({message: 'Erro ao cadastrar filial', e}))
  }

  async update(request: Request, response: Response){
    const {cnpj, descricao, cidade, uf, idtipofilial, ativo} = request.body
    const {idfilial} = request.params
    await knex('filial').update({cnpj, descricao, cidade, uf, idtipofilial, ativo}).where({idfilial}).debug(true)
      .then(data => response.json({message:"Filial alterada com sucesso!"}))
      .catch(e => response.status(400).json({message: 'Erro ao alterar filial', e}))
  }

  async delete(request: Request, response: Response){
    const {idfilial} = request.params
    await knex('filial').update({ativo: false}).where({idfilial})
      .then(data => response.json({message: "Filial inativada com sucesso!"}))
      .catch(e => response.status(400).json({message: "Erro ao inativar filial", e}))
  }
}

module.exports = new Branch()