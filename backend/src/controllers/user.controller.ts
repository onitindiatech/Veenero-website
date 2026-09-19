import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { UserModel, UserRole } from '../models/User';
import { ApiError } from '../middleware/errorHandler';
import { logActivity } from '../services/activityLog.service';

const VALID_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER'];

// ─── GET /api/admin/users ────────────────────────────────────────────────────
export const listUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await UserModel.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: users.map((u: any) => ({
        id: u._id?.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/admin/users ───────────────────────────────────────────────────
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role = 'VIEWER', isActive = true } = req.body;
    const actor = req.user as any;

    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and temporary password are required.');
    }

    if (!VALID_ROLES.includes(role)) {
      throw new ApiError(400, `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
    }

    // Only SUPER_ADMIN can create another SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && actor?.role !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'Only a Super Admin can create users with the Super Admin role.');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await UserModel.findOne({ email: normalizedEmail });
    if (existing) {
      throw new ApiError(409, `A user with email "${normalizedEmail}" already exists.`);
    }

    if (password.length < 8) {
      throw new ApiError(400, 'Password must be at least 8 characters long.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      isActive: Boolean(isActive),
    });

    await logActivity({
      req,
      action: 'CREATE',
      module: 'USERS',
      entity: `User: ${newUser.email}`,
      description: `Created new admin user ${newUser.name} with role ${newUser.role}`,
      metadata: { targetUserId: newUser._id, role: newUser.role },
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: {
        id: newUser._id?.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/admin/users/:id ────────────────────────────────────────────────
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { name, email, role, isActive, password } = req.body;
    const actor = req.user as any;

    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    // RBAC protections
    // 1. Non-super-admins cannot touch SUPER_ADMIN users
    if (user.role === 'SUPER_ADMIN' && actor?.role !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'Only a Super Admin can modify a Super Admin user.');
    }

    // 2. Only SUPER_ADMIN can promote someone to SUPER_ADMIN
    if (role && role === 'SUPER_ADMIN' && actor?.role !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'Only a Super Admin can promote a user to Super Admin.');
    }

    // 3. Self-demotion / self-deactivation guard
    if (actor?._id?.toString() === user._id?.toString()) {
      if (isActive === false) {
        throw new ApiError(400, 'You cannot deactivate your own administrative account.');
      }
      if (role && role !== actor.role && actor.role === 'SUPER_ADMIN') {
        const superAdminCount = await UserModel.countDocuments({ role: 'SUPER_ADMIN', isActive: true });
        if (superAdminCount <= 1) {
          throw new ApiError(400, 'Cannot demote the sole active Super Admin account.');
        }
      }
    }

    if (name) user.name = name.trim();
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail !== user.email) {
        const dup = await UserModel.findOne({ email: normalizedEmail });
        if (dup) throw new ApiError(409, `Email "${normalizedEmail}" is already in use.`);
        user.email = normalizedEmail;
      }
    }
    if (role) {
      if (!VALID_ROLES.includes(role)) {
        throw new ApiError(400, `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
      }
      user.role = role;
    }
    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }
    if (password && password.trim().length > 0) {
      if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters long.');
      }
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();

    await logActivity({
      req,
      action: 'UPDATE',
      module: 'USERS',
      entity: `User: ${user.email}`,
      description: `Updated user ${user.name} (${user.email})`,
      metadata: { targetUserId: user._id, role: user.role, isActive: user.isActive },
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const actor = req.user as any;

    if (actor?._id?.toString() === id) {
      throw new ApiError(400, 'You cannot delete your own administrative account.');
    }

    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    if (user.role === 'SUPER_ADMIN') {
      if (actor?.role !== 'SUPER_ADMIN') {
        throw new ApiError(403, 'Only a Super Admin can delete a Super Admin user.');
      }
      const superAdminCount = await UserModel.countDocuments({ role: 'SUPER_ADMIN', isActive: true });
      if (superAdminCount <= 1) {
        throw new ApiError(400, 'Cannot delete the only Super Admin account on the system.');
      }
    }

    await UserModel.findByIdAndDelete(id);

    await logActivity({
      req,
      action: 'DELETE',
      module: 'USERS',
      entity: `User: ${user.email}`,
      description: `Deleted admin user ${user.name} (${user.email})`,
      metadata: { deletedUserId: id, role: user.role },
    });

    res.status(200).json({
      success: true,
      message: `User ${user.email} has been deleted.`,
    });
  } catch (error) {
    next(error);
  }
};
