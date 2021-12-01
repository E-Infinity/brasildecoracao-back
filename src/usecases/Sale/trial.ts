import { Request, Response } from "express";
import knex from "../../database";

class Trial {
  async list(request: Request, response: Response){
    const {trial} = request.params
    await knex('trial').select('*').where({trial}).where('ativo',true)
      .then(async (data: any) => {
        // console.log(data[0].idtrial)
        if(data){
          await knex('trial').update('ativo', false).where('idtrial',data[0].idtrial)
            .then(() => response.json({valid: true, idtrial: data[0].idtrial}))
            .catch(() => response.status(503).json({message: 'Erro ao validar trial, tente novamente'}))
        }else{
          response.status(401).json({message: 'Trial inválida'})
        }
      } )
      .catch(e => response.status(400).json({message: 'Trial não encontrada', e}))
  }

  async register(request: Request, response: Response){
    const {idusuario} = request.body
    const trial = (Math.random()).toString(36).replace(/[^a-z-1-50]+/g,'').substring(0,5)+'-'+Math.random().toString(36).replace(/[^a-z-1-50]+/g,'').substring(0,4)
    await knex('trial').insert({idusuario, trial})
      .then(data => response.json({message: 'Trial criada com sucesso!', trial}))
      .catch(e => response.status(400).json({message: 'Erro ao gerar trial', e}))
  }

}

module.exports = new Trial()