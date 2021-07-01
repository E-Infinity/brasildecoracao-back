import { Request, Response } from "express";
import knex from "../../database";

class Client {
  async list(request: Request, response: Response){
    const {idcliente} = request.params
    const sql = knex('cliente').select('*','idcnpj_cpf - 100000000000000 as cnpj_cpf')
    if(idcliente){
      sql.where({idcliente})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {cnpj_cpf, nome, email, endereco, numero,bairro, cidade, estado, cep, telefone, celular, juridico} = request.body
    const idcnpj_cpf = cnpj_cpf + 100000000000000
    await knex('cliente').insert({idcnpj_cpf, nome, email, endereco, numero,bairro, cidade, estado, cep, telefone, celular, juridico})
      .returning('idcliente')
    .then(data => response.json({idusuario: data[0], message:"Cliente incluído com sucesso!"}))
    .catch(e => response.status(400).json({message: "Erro ao cadastrar cliente"}))
  }

  async update(request: Request, response: Response){
    const {idcliente} = request.params
    const {cnpj_cpf, nome, email, endereco, numero,bairro, cidade, estado, cep, telefone, celular, juridico} = request.body
    const idcnpj_cpf = cnpj_cpf + 100000000000000
    await knex('cliente').update({idcnpj_cpf, nome, email, endereco, numero,bairro, cidade, estado, cep, telefone, celular, juridico})
      .where(idcliente)
    .then(data => response.json({message:"Cliente alterado com sucesso!"}))
    .catch(e => response.status(400).json({message: "Erro ao alterar cliente"}))
  }
}

module.exports = new Client()