import { Router } from 'express';

import { ContactController } from '../controllers/contact.controller';
import { RequireAuthMiddleware } from '../middlewares';

const contactRouter = Router();
const contactController = new ContactController();

contactRouter.post('/search', contactController.searchInContacts);
contactRouter.post('/create', contactController.createContact);
contactRouter.put('/update', contactController.updateContact);
contactRouter.delete('/delete', contactController.deleteContacts);

export { contactRouter };