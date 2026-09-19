import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

export const adminUserRouter = Router();

adminUserRouter.use(authenticate);

// View list of users
adminUserRouter.get('/', requireRole(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']), listUsers);

// Create new user (Admins and Super Admins only)
adminUserRouter.post('/', requireRole(['ADMIN', 'SUPER_ADMIN']), createUser);

// Update user details or reset password
adminUserRouter.put('/:id', requireRole(['ADMIN', 'SUPER_ADMIN']), updateUser);

// Delete user account
adminUserRouter.delete('/:id', requireRole(['ADMIN', 'SUPER_ADMIN']), deleteUser);

export default adminUserRouter;
