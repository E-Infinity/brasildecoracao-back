import { Request, Response } from "express";
import knex from "../../database";

class User {
  async register(request: Request, response: Response) {
		response.json("Register User")
	}
}

module.exports = new User();
