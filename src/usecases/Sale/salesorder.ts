import { Request, Response } from "express";
import { Interface } from "readline";
import knex from "../../database";



class SalesOrder {
  async list(request: Request, response: Response){
    let {idpedidovenda} = request.params 
    let pedidos: any = []
    const sql = knex('pedidovenda as p' ).select('p.*','t.trial','f.descricao as filial', 'f.cidade', 'f.uf', 's.descricao as situacaopedidovenda', 'o.descricao as origempedido')
      .leftJoin('filial as f', 'f.idfilial','p.idfilialorigem')
      .leftJoin('situacaopedidovenda as s', 's.idsituacaopedidovenda', 'p.idsituacaopedidovenda')
      .leftJoin('origempedido as o', 'o.idorigempedido', 'p.idorigempedido')
      .leftJoin('trial as t', 't.idtrial', 'p.idtrial')
    if(idpedidovenda){
      sql.where(idpedidovenda)
    }
    sql.then(async data => {
      for await (const d of data) {
        const cliente  = await knex('cliente').select('*').where('idcliente', d.idcliente)
        const parcelas = await knex('parcela as p').select('p.*', 't.descricao as tipopagamento')
          .leftJoin('tipopagamento as t', 't.idtipopagamento', 'p.idtipopagamento')
          .where('p.idpedidovenda', d.idpedidovenda)
        const usuario  = await knex('usuario as u').select('u.*', 't.descricao as tipousuario')
          .leftJoin('tipousuario as t', 't.idtipousuario', 'u.idtipousuario')
          .where('u.idusuario', d.idusuario)
        const itempedidovenda = await knex('itempedidovenda as i').select('i.*', 'f.cidade', 'f.uf', 'f.descricao as filial',
            'pg.idproduto', 'p.descricao as produto','pg.idtrama', 't.descricao as trama', 'pg.idcorfibra', 'cf.descricao as corfibra',
            'pg.idcoraluminio', 'ca.descricao as coraluminio'
          )
          .leftJoin('filial as f', 'f.idfilial', 'i.idfilialsaldo')
          .leftJoin('produtograde as pg', 'pg.idprodutograde', 'i.idprodutograde')
          .leftJoin('produto as p', 'pg.idproduto', 'p.idproduto')
          .leftJoin('trama as t', 'pg.idtrama', 't.idtrama')
          .leftJoin('corfibra as cf', 'pg.idcorfibra', 'cf.idcorfibra')
          .leftJoin('coraluminio as ca', 'pg.idcoraluminio', 'ca.idcoraluminio')
          .where('i.idpedidovenda', d.idpedidovenda)

        pedidos.push({
          ...d,
          itempedidovenda,
          parcelas,
          cliente,
          usuario
        })
      }
      response.json(pedidos)
    })
  }


  async register(request: Request, response: Response){
    let idpedidovenda: number | null = null
    const {
      idfilialsaida, 
      idfilialorigem,
      observacao,
      valor_total,
      valor_comdesconto,
      idusuario,
      idcliente,
      quantidadeparcela,
      idsituacaopedidovenda,
      producao,
      entrada,
      idorigempedido,
      idtrial,
      parcelas,
      itens
    } = request.body

    try {
      await knex.transaction((t) => {
        knex('pedidovenda')
          .transacting(t)
          .insert({idfilialorigem, observacao, valor_total, valor_comdesconto, idusuario, idcliente,
            quantidadeparcela, idsituacaopedidovenda, producao, entrada, idorigempedido,idtrial
          }).returning('idpedidovenda')
          .then(async d => {
            idpedidovenda = d[0]
            try{
              for await (const i of itens) {
                await t('itempedidovenda').insert([{...i, idpedidovenda}])
              }

              for await (const p of parcelas) {
                await t('parcela').insert([{...p, idpedidovenda}])
              }

              // INTEGRAÇÃO COM Tiny

              t.commit()
              response.json({message: 'Pedido incluido com sucesso!', idpedidovenda})
            }catch(err){
              t.rollback()
              response.status(400).json({message: 'Erro ao gerar pedido de venda, tente novamente.', err})
            }
          })
          .catch((err) => {
            t.rollback()
            response.status(400).json({message: 'Erro ao gerar pedido de venda, tente novamente.', err})
          })
      })
    }catch(e){
      console.log(e)
    }
  }

  async insertTiny(){
    // Axios https://api.tiny.com.br/api2/pedido.incluir.php
  }

  async update(request: Request, response: Response){
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new SalesOrder()