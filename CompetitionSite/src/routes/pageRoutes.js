import express from 'express';
import * as pageController from '../controllers/pageControllers.js';

const pageRouter = express.Router();

pageRouter.get('/', pageController.getHomePage);

export {pageRouter};