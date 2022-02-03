import { Request, response, Response } from "express";
import axios from 'axios'
require("dotenv").config();
import knex from "../../database";

class ProductGrade {
  async listOne(request: Request, response: Response){
    const {idprodutograde} = request.params
    const sql = knex('produtograde as pg').select('pg.*', knex.raw(`
        p.descricao as produto_desc, 
        t.descricao as trama_desc,
        a.descricao as coraluminio_desc,
        cf.descricao as corfibra_desc, 
      `))
      .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
      .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
      .leftJoin('corfibra as cf', 'cf.idcorfibra', 'pg.idcorfibra')
      .leftJoin('coraluminio as a', 'a.idcoraluminio', 'pg.idcoraluminio')
      if(idprodutograde){
        sql.where('pg.idproduto', idprodutograde)
      }
      sql.then(data => response.json(data))
  }

  async list(request: Request, response: Response){
    const {idproduto} = request.params
    const sql = knex('produtograde as pg').select('pg.*', knex.raw(`
        p.descricao as produto_desc,
        c.descricao as corfibra_desc, 
        t.descricao as trama_desc,
        a.descricao as coraluminio_desc
      `))
      .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
      .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
      .leftJoin('corfibra as c', 'c.idcorfibra', 'pg.idcorfibra')
      .leftJoin('coraluminio as a', 'a.idcoraluminio', 'pg.idcoraluminio')
      if(idproduto){
        sql.where('pg.idproduto', idproduto)
      }
      sql.then(data => response.json(data))
  }

  async register(request: Request, response: Response){
    const {idproduto,idcorfibra,idtrama, idcoraluminio} = request.body
    await knex('produtograde').insert({idproduto,idcorfibra,idtrama, idcoraluminio}).returning('idprodutograde')
      .then(async data => {
        response.json({message:"Produto Grade incluída com sucesso!"})
      })
      .catch(e => response.status(400).json({message: "Erro ao cadastrar produto grade", e}))
  }

  async update(request: Request, response: Response){
    const {idprodutograde} = request.params
    const {idproduto,idcorfibra,idtrama, idcoraluminio,ativo} = request.body
    await knex('produtograde').update({idproduto,idcorfibra,idtrama, idcoraluminio, ativo})
        .where({idprodutograde})
      .then(data => {
        response.json({message:"Produto Grade alterado com sucesso!"})
      })
      .catch(e => response.status(400).json({message: "Erro ao alterar produto grade", e}))
  }

  async cadastroTiny(request: Request, response: Response) {
    const {_idprodutograde,update} = request.params
    const url = update ? 'produto.alterar.php' : 'produto.incluir.php'
    const dados = await knex('produtograde').select('idprodutograde').where('ativo', true).orderBy('idprodutograde')
      .where('idprodutograde','>',_idprodutograde)
    let idprodutograde = 0
    for await (const d of dados) {
      idprodutograde = d.idprodutograde
      const tokens = ['884bff6797f9aca61dc0d9cef669508488efb8c9','b44bdb338b7523ce1e7671eaf42fdc7dac0e32ba']
      for await (const token of tokens) {
        await knex('produtograde as pg').select(knex.raw(`
            pg.idprodutograde as sequencia,
            p.descricao||' | Trama: '||t.descricao||' | Aluminio: '||ca.descricao||' | Cor Fibra: '||cf.descricao as nome,
            pg.idprodutograde as codigo,
            'UN' as unidade,
            pv.valor as preco,
            p.ncm,
            0 as  origem,
            'A' as situacao,
            'P' as tipo,
            p.peso as peso_liquido,
            p.peso as peso_bruto
          `))
          .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
          .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
          .leftJoin('coraluminio as ca', 'ca.idcoraluminio', 'pg.idcoraluminio')
          .leftJoin('corfibra as cf', 'cf.idcorfibra', 'pg.idcorfibra')
          .leftJoin('produtovalor as pv',knex.raw('pv.idproduto = pg.idproduto and pv.idtrama = pg.idtrama'))
          .where({idprodutograde})
          .then(async data => {
            await axios.post(`https://api.tiny.com.br/api2/${url}`,null, {params: {
            token,
            formato: 'JSON',
            produto: {
              produtos: [
                {
                  produto: {
                    ...data[0]
                  }
                }
              ]
            }
          }})
          .then(async r => {
            if(r.data.retorno.status_processamento === '3'){
              await knex('produtograde').update('tiny',true).where({idprodutograde})
            }
            console.log((r.data.retorno.status_processamento === '3' ? 'OK' : r.data.retorno.registros[0]!!.registro.erros[0]!!.erro) + ' | ' + token + ' | ' + idprodutograde)
          })
          .catch(e => console.log(e))
        })
      }
      await sleep(15000)
    }
    response.json('Finalizado.')
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = new ProductGrade()