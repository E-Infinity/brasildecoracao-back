import { Request, Response } from "express";
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
      .then(data => {
        this.insertTiny(parseInt(data[0]), process.env.TOKEN_TINY )
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

  async insertTiny(idprodutograde: number, token: string | undefined) {
    await knex('produtograde as pg').select(knex.raw(`
        pg.idprodutograde as sequencia,
        p.descricao||' | Trama: '||t.descricao||' | Aluminio: '||ca.descricao||' | Cor Fibra: '||cf.descricao as nome,
        pg.idprodutograde as codigo,
        'UN' as unidade,
        0 as preco,
        p.ncm,
        0 as  origem,
        'A' as situacao,
        'P' as tipo
      `))
      .leftJoin('produto as p', 'p.idproduto', 'pg.idproduto')
      .leftJoin('trama as t', 't.idtrama', 'pg.idtrama')
      .leftJoin('coraluminio as ca', 'ca.idcoraluminio', 'pg.idcoraluminio')
      .leftJoin('corfibra as cf', 'cf.idcorfibra', 'pg.idcorfibra')
      .leftJoin('produtovalor as pv',knex.raw('pv.idproduto = pg.idproduto and pv.idcoraluminio = pg.idcoraluminio and pv.idtrama = pg.idtrama'))
      .where({idprodutograde})
      .then(async data => {
        await axios.post(`https://api.tiny.com.br/api2/pedido.incluir.php`,null, {params: {
        token,
        formato: 'JSON',
        produto: {
          produtos: [
            {
              produto: {
                ...data
              }
            }
          ]
        }
      }})
    })
  }
}

module.exports = new ProductGrade()