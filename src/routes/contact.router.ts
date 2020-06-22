import { Router } from 'express';

import { ContactController } from '../controllers/contact.controller';

const contactRouter = Router();
const contactController = new ContactController();

contactRouter.post('/create', contactController.createContact);

export { contactRouter };