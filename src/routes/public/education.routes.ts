import { Router } from "express";
import educationController from "../../https/controllers/education.controller.js";

const educationRouterPublic = Router();

//Get All Educations
educationRouterPublic.get('/', educationController.getAllEducations);

export default educationRouterPublic;