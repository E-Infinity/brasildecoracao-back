import { Request, Response } from "express";
import knex from "../../database";

class Default {
  async list(request: Request, response: Response){
  }

  async register(request: Request, response: Response){
  }

  async update(request: Request, response: Response){
  }

  async delete(request: Request, response: Response){
  }
}

module.exports = new Default()