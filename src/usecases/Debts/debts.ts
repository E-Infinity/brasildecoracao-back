import { Request, Response } from "express";
import knex from "../../database";

class Debts {
  async list(request: Request, response: Response){
    const {idcontaspagar} = request.params
    let contas: any = []
    const sql = knex('contaspagar as c').select('c.*','cl.nome as fornecedor', 't.descricao as tipodocumento')
      .leftJoin('cliente as cl', 'cl.idcliente', 'c.idfornecedor')
      .leftJoin('tipodocumento as t', 't.idtipodocumento','c.idtipodocumento')
    if(idcontaspagar){
      sql.where('c.idcontaspagar',idcontaspagar)
    }
    sql.then(async data => {
      for await (const d of data) {
        const parcelas = await knex('contaspagarparcela').select('*')
          .where('idcontaspagar',d.idcontaspagar)
        
        contas.push({
          ...d,
          parcelas
        })
      }
      response.json(contas)
    })
    sql.catch(e => console.log(e))
  }

  async register(request: Request, response: Response){
    let idcontaspagar: number | null = null
    const {numeronota,idtipodocumento,numerodocumento,quantidadeparcelas,idfornecedor,parcelas} = request.body
    console.log({})
    try{
      await knex.transaction((t) => {
        knex('contaspagar').transacting(t)
        .insert({numeronota,idtipodocumento,numerodocumento,quantidadeparcelas,idfornecedor})
        .returning('idcontaspagar').debug(true)
        .then(async d => {
          idcontaspagar = d[0]
          try{
            for await (const p of parcelas) {
              await t('contaspagarparcela').insert([{...p, idcontaspagar}])
            }

            t.commit()
            response.json({message: 'Contas a pagar incluido com sucesso!', idcontaspagar})
          }catch(err){
            t.rollback()
            response.status(400).json({message: 'Erro ao gerar contas a pagar, tente novamente.', err})
          }
        })
        .catch((err) => {
          t.rollback()
          response.status(400).json({message: 'Erro ao gerar contas a pagar, tente novamente.', err})
        })
      })
    }catch(err){
      response.status(400).json({message: 'Erro ao gerar contas a pagar, tente novamente.', err})
    }
  }

  async update(request: Request, response: Response){
    const {idcontaspagarparcela} = request.params
    const {pago} = request.body
    await knex('contaspagarparcela').update({pago, datapagamento: knex.raw('current_date')}).where({idcontaspagarparcela})
      .then(d => response.json({message: 'Parcela alterada com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao alterar parcela, tente novamente', err: e}))
  }

  async delete(request: Request, response: Response){
    const {idcontaspagar} = request.params
    await knex('contaspagarparcela').delete().where(idcontaspagar)
    .then(async d => {
      await knex('contaspagar').delete().where(idcontaspagar)
      .then(d => response.json({message: 'contas a pagar excluida com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao excluir contas a pagar, tente novamente', err: e}))
    })
  }
}

module.exports = new Debts()