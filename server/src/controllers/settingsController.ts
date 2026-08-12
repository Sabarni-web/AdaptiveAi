import { Request, Response } from 'express';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId).select('preferences');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user.preferences || {} });
  } catch (error) {
    logger.error('Error in getSettings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const updates = req.body;
    
    // Construct the $set query dynamically for partial updates
    const setQuery: { [key: string]: any } = {};
    
    // We only allow updating the preferences object
    if (updates.preferences) {
      Object.keys(updates.preferences).forEach(section => {
        Object.keys(updates.preferences[section]).forEach(key => {
          setQuery[`preferences.${section}.${key}`] = updates.preferences[section][key];
        });
      });
    }

    if (Object.keys(setQuery).length === 0) {
      res.status(400).json({ success: false, message: 'No valid preferences to update' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: setQuery },
      { new: true, runValidators: true }
    ).select('preferences');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user.preferences, message: 'Settings updated successfully' });
  } catch (error) {
    logger.error('Error in updateSettings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
