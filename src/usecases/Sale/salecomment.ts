import { Request, Response } from "express";
import knex from "../../database";

class SaleComment {
  async list(request: Request, response: Response){
    const {idpedidovenda} = request.params
    const sql = knex('comentario as c').select('c.*', 'u.nome')
      .leftJoin('usuario as u', 'u.idusuario', 'c.idusuario')
    if(idpedidovenda){
      sql.where({idpedidovenda})
    }
    sql.then(data => response.json(data))      
  }

  async register(request: Request, response: Response){
    const {texto, idusuario, idpedidovenda} = request.body
    await knex('comentario').insert({texto, idusuario, idpedidovenda})
      .then(() => response.json({message: 'Comentário inserido com sucesso'}))
      .catch((err) => response.status(400).json({message: 'Erro ao inserir comentário', err}))
  }

  async update(request: Request, response: Response){
    const {idcomentario} = request.params
    const {texto, idusuario} = request.body
    await knex('comentario').update({texto, idusuario})
      .then(() => response.json({message: 'Comentário alterado com sucesso'}))
      .catch((err) => response.status(400).json({message: 'Erro ao alterar comentário', err}))
  }

  async delete(request: Request, response: Response){
    const {idcomentario} = request.params
    await knex('comentario').delete().where({idcomentario})
      .then(() => response.json({message: 'Comentário excluido com sucesso'}))
      .catch((err) => response.status(400).json({message: 'Erro ao excluir comentário', err}))
  }
}

module.exports = new SaleComment()