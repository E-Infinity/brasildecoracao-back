import { Request, Response } from "express";
import knex from "../../database";

class Debts {
  async list(request: Request, response: Response){
    const {idcontaspagar} = request.params
    const {status, idfornecedor, periodo} = request.body
    let contas: any = []
    const sql = knex('contaspagar as c').select('c.*','cl.nome as fornecedor', 't.descricao as tipodocumento', 'tc.descricao as tipocontaspagar',
        knex.raw('(select sum(p2.valor) from contaspagarparcela p2 where p2.idcontaspagar = c.idcontaspagar) as total')
      )
      .leftJoin('cliente as cl', 'cl.idcliente', 'c.idfornecedor')
      .leftJoin('tipodocumento as t', 't.idtipodocumento','c.idtipodocumento')
      .leftJoin('tipocontaspagar as tc', 'tc.idtipocontaspagar','c.idtipocontaspagar')
      .leftJoin('contaspagarparcela as p', 'p.idcontaspagar','c.idcontaspagar')
      .groupBy(1,2,3,4,5,6,7,8,9,10,11,12,13)
    if(idcontaspagar){
      sql.where('c.idcontaspagar',idcontaspagar)
    }if(status === 1 && periodo){
      sql.whereRaw(`c.datainclusao::date BETWEEN '${periodo[0]}' AND '${periodo[1]}'` )
    }if(idfornecedor){
      sql.where({idfornecedor})
    }if(status !== 1){
      if(periodo){
        status === 3 ? sql.whereRaw(`p.datapagamento::date BETWEEN '${periodo[0]}' AND '${periodo[1]}'`) : sql.whereRaw(`p.datavencimento::date BETWEEN '${periodo[0]}' AND '${periodo[1]}'`)
      }
      sql.where('p.pago', status === 3 ? true : false)
    }
    sql.then(async data => {
      for await (const d of data) {
        let where = `idcontaspagar = ${d.idcontaspagar}`
        if(status === 3){
          where += ' AND pago = true '
          periodo ? where += `AND datapagamento::date BETWEEN '${periodo[0]}' AND '${periodo[1]}' ` : ''
        }if(status === 2){
          where += ' AND pago = false '
          periodo ? where += `AND datavencimento::date BETWEEN '${periodo[0]}' AND '${periodo[1]}' ` : ''
        }
        const parcelas = await knex('contaspagarparcela').select('*')
          .whereRaw(where).orderBy('datavencimento')
          
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
    const {numeronota,idtipodocumento,numerodocumento,quantidadeparcelas,idfornecedor,parcelas,observacao,idtipocontaspagar, codigobarra} = request.body
    console.log({})
    try{
      await knex.transaction((t) => {
        knex('contaspagar').transacting(t)
        .insert({numeronota,idtipodocumento,numerodocumento,quantidadeparcelas,idfornecedor,observacao,idtipocontaspagar, codigobarra})
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
    const {pago,datapagamento,idtipocontaspagar, codigobarra} = request.body
    await knex('contaspagarparcela').update({pago, datapagamento,idtipocontaspagar, codigobarra}).where({idcontaspagarparcela})
      .then(d => response.json({message: 'Parcela alterada com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao alterar parcela, tente novamente', err: e}))
  }

  async updateValue(request: Request, response: Response){
    const {idcontaspagar} = request.params
    const {numeronota,idtipodocumento,numerodocumento,quantidadeparcelas,idfornecedor,observacao,idtipocontaspagar, codigobarra,parcelas} = request.body
    const cond = await knex('contaspagarparcela').select('*').where({idcontaspagar}).where('pago',true)
    if(cond.length > 0){
      response.status(400).json({message: 'Não foi possivel realizar a operação, já existem parcelas baixadas!'})
    }else{
      await knex('contaspagar').update({numeronota,idtipodocumento,numerodocumento,quantidadeparcelas,idfornecedor
                                        ,observacao,idtipocontaspagar, codigobarra})
        .where({idcontaspagar})
        .then(async () => {
          await knex('contaspagarparcela').delete().where({idcontaspagar})
            .then(async () => {
              let parcels = []
              for await (const p of parcelas) {
                parcels.push({...p, idcontaspagar})
              }
              await knex('contaspagarparcela').insert({parcels})
                .catch(e => response.status(400).json({message: 'Não foi possível realizar a operação', error: e}))
            })
            .catch(e => response.status(400).json({message: 'Não foi possível realizar a operação', error: e}))
        })
        .catch(e => response.status(400).json({message: 'Não foi possível realizar a operação', error: e}))
      response.json({message: 'Alteração realizada com sucesso!'})
    }
  }

  async delete(request: Request, response: Response){
    const {idcontaspagar} = request.params
    await knex('contaspagarparcela').delete().where({idcontaspagar}).debug(true)
    .then(async d => {
      await knex('contaspagar').delete().where({idcontaspagar}).debug(true)
      .then(d => response.json({message: 'contas a pagar excluida com sucesso!'}))
      .catch(e => response.status(400).json({message: 'Erro ao excluir contas a pagar, tente novamente', err: e}))
    })
  }
}

module.exports = new Debts()