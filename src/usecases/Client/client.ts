import { Request, Response } from "express";
import knex from "../../database";

class Client {
  async list(request: Request, response: Response){
    const {idcliente} = request.params
    const sql = knex('cliente').select('*',knex.raw('idcnpj_cpf - 100000000000000 as cnpj_cpf'))
    if(idcliente){
      sql.where({idcliente})
    }
    sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {fornecedor,observacao,ativo,cnpj_cpf, nome, email, endereco, numero,bairro, cidade, estado, cep, telefone, celular, juridico} = request.body
    const idcnpj_cpf = parseInt(cnpj_cpf) + 100000000000000
    await knex('cliente').insert({fornecedor,observacao,ativo,idcnpj_cpf, nome, email, endereco, numero,bairro, cidade, estado, cep, telefone, celular, juridico})
      .returning('idcliente').debug(true)
    .then(data => response.json({idusuario: data[0], message:"Cliente incluído com sucesso!"}))
    .catch(e => response.status(400).json({message: "Erro ao cadastrar cliente", e}))
  }

  async update(request: Request, response: Response){
    const {idcliente} = request.params
    const {fornecedor,observacao,ativo,cnpj_cpf, nome, email, endereco, numero,bairro, cidade, estado, cep, telefone, celular, juridico} = request.body
    const idcnpj_cpf = parseInt(cnpj_cpf) + 100000000000000
    await knex('cliente').update({fornecedor,observacao,ativo,idcnpj_cpf, nome, email, endereco, numero,bairro, cidade, estado, cep, telefone, celular, juridico})
      .where('idcliente', idcliente)
    .then(data => response.json({message:"Cliente alterado com sucesso!"}))
    .catch(e => response.status(400).json({message: "Erro ao alterar cliente", e}))
  }
}

module.exports = new Client()