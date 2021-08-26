import { Request, Response } from "express";
import { Interface } from "readline";
import knex from "../../database";


class SalesOrder {
  
  async list(request: Request, response: Response){
    await knex('pedidovenda').select('*')
      .then(data => response.json(data))
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