import { Request, response, Response } from "express";
import knex from "../../database";
import axios from 'axios'
require("dotenv").config();

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
        const arquivos = await knex('arquivos').select('*')
          .where('idpedidovenda', d.idpedidovenda)
        const comentarios = await knex('comentario').select('*')
          .where('idpedidovenda', d.idpedidovenda)
          
        pedidos.push({
          ...d,
          itempedidovenda,
          parcelas,
          cliente,
          usuario,
          arquivos,
          comentarios
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
      itens,
      arquivos
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

              if(arquivos){
                for await (const a of arquivos) {
                  await t('arquivos').insert([{...a, idpedidovenda}])
                }
              }

              t.commit()
              //const ret = await insertTiny(idpedidovenda)
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

  async syncTiny(request: Request, response: Response){
    const {idpedidovenda} = request.params
    const resp = await insertTiny(idpedidovenda)
    if(resp){
      response.json({message: "Integração realizada."})
    }else{
      response.status(400).json({message: 'Erro ao realizar integração'})
    }
  }

  async update(request: Request, response: Response){
    const {idpedidovenda} = request.params
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
      idtrial
    } = request.body
    await knex('pedidovenda').update({
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
      idtrial
    }).where({idpedidovenda}).debug(true)
    .then(() => response.json({message: 'Alteração realizada com sucesso!'}))
    .catch((e) => response.status(400).json({message: 'Erro ao realizar alteração!', e}))
  }

  async delete(request: Request, response: Response){
  }
}

async function insertTiny(idpedidovenda: any): Promise<boolean>{
  const token = process.env.TOKEN_TINY
  let pedido: any 
  let itens: any = []
  let ret: boolean = false

  await knex('pedidovenda').select('*').where({idpedidovenda})
    .then(async p => {
      const cliente = await knex('cliente').select(knex.raw(`
        nome,
        CASE WHEN juridico THEN 'J' ELSE 'F' END as tipo_pessoa, 
        CASE WHEN juridico THEN lpad((idcnpj_cpf - 100000000000000)::text,14,'0') ELSE lpad((idcnpj_cpf - 100000000000000)::text,11,'0') END cnpj_cpf,
        endereco,
        numero,
        bairro,
        cep,
        cidade,
        estado as uf,
        telefone as fone
      `)).where('idcliente',p[0].idcliente)
      const item = await knex('itempedidovenda as i').select(knex.raw(`
        pg.idprodutograde as codigo,
        p.descricao||' | Trama: '||t.descricao||' | Aluminio: '||ca.descricao||' | Cor Fibra: '||cf.descricao as  descricao,
        i.quantidade as quantidade,
        i.valor as valor_unitario
      `))
      .leftJoin('produtograde as pg', 'pg.idprodutograde', 'i.idprodutograde')
      .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
      .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
      .leftJoin('coraluminio as ca', 'ca.idcoraluminio', 'pg.idcoraluminio')
      .leftJoin('corfibra as cf', 'cf.idcorfibra', 'pg.idcorfibra')
      .where('idpedidovenda',p[0].idpedidovenda)

      for await (const i of item) {
        itens.push({
          item: {...i, unidade: 'UN'}
        })
      }
      pedido = {
        data_pedido: new Date(p[0].data_pedido).toLocaleString('pt-BR'),
        data_prevista: new Date(p[0].data_prevista).toLocaleString('pt-BR'),
        numero_pedido_ecommerce: idpedidovenda,
        ecommerce: "Plataforma E-Infinity",
        cliente: {
          nome: cliente[0].nome,
          tipo_pessoa: cliente[0].tipo_pessoa,
          cpf_cnpj: cliente[0].cnpj_cpf,
          endereco: cliente[0].endereco,
          numero: cliente[0].numero.toString(),
          bairro: cliente[0].bairro,
          cep: cliente[0].cep,
          cidade: cliente[0].cidade,
          uf: cliente[0].uf,
          fone: cliente[0].fone
        },
        itens
      }
    })
    await axios.post(`https://api.tiny.com.br/api2/pedido.incluir.php`,null, {params: {
      token,
      formato: 'JSON',
      pedido: {
        pedido: {
          ...pedido
        }
      }
    }})
    .then(async data => {
      if(data.data.retorno.status == 'OK'){
        const idtiny = data.data.retorno.registros.registro.id
        const sequenciatiny = data.data.retorno.registros.registro.sequencia
        const numerotiny = data.data.retorno.registros.registro.numero
        await knex('pedidovenda').update({idtiny, sequenciatiny, numerotiny}).where({idpedidovenda})
        ret = true
        return true
      }else{
        ret = false
        return false
      }
    })

  return ret
}

module.exports = new SalesOrder()